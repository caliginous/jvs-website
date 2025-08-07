import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Create a custom fetch function that tries proxy first, then falls back to direct WordPress
const createFallbackFetch = () => {
  const proxyUrl = 'https://jvs-website.dan-794.workers.dev/api/graphql-v5'; // Cache-busting endpoint v5
  const directUrl = process.env.WP_GRAPHQL_URL || 'https://www.jvs.org.uk/graphql';
  
  console.log('GraphQL Proxy URL:', proxyUrl);
  console.log('GraphQL Direct URL:', directUrl);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const maxRetries = 2;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        // Try proxy first, then direct URL
        const targetUrl = attempt === 1 ? proxyUrl : directUrl;
        console.log(`Attempt ${attempt}: Trying ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
          ...init,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // If we get a 403 from proxy, try direct URL on next attempt
        if (response.status === 403 && attempt === 1) {
          console.warn('Proxy returned 403, will try direct WordPress GraphQL on next attempt');
          continue;
        }
        
        // If we get a successful response, return it
        if (response.ok) {
          console.log(`Success with ${targetUrl}`);
          return response;
        }
        
        // For other errors, throw
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          console.warn(`GraphQL request failed on attempt ${attempt}, will retry...`, error);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  };
};

const httpLink = createHttpLink({
  uri: 'https://jvs-website.dan-794.workers.dev/api/graphql-v5', // Cache-busting endpoint - overridden by custom fetch
  credentials: 'include', // Include cookies for session handling
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'JVS-Website/1.0',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  },
  fetchOptions: {
    mode: 'cors',
  },
  fetch: createFallbackFetch(),
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.error('GraphQL Error Details:', {
    operation: operation.operationName,
    variables: operation.variables,
    graphQLErrors,
    networkError,
  });

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    console.error('Network error details:', {
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack,
    });
    
    // If it's a 500 error, log it specifically
    if (networkError.message.includes('500') || networkError.message.includes('Internal Server Error')) {
      console.error('WordPress GraphQL API is returning 500 errors - this indicates a server-side issue');
    }
    
    // If it's a 403 error, log it specifically
    if (networkError.message.includes('403') || networkError.message.includes('Forbidden')) {
      console.error('WordPress GraphQL API is returning 403 errors - this indicates an authentication or permission issue');
      console.error('This might be due to rate limiting, missing authentication, or CORS issues');
    }
  }
});

// Create Apollo Client with no caching and error logging
export const wpClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
  // Disable cache completely
  cache: new InMemoryCache({
    addTypename: false,
  }),
}); 