// Build-time Statsig configuration for determining WordPress backend URL
// This runs during the build process, not at runtime

// Environment variable to control which backend URL to use during build
const BUILD_TIME_BACKEND_URL = process.env.BUILD_TIME_BACKEND_URL || 'https://backend.jvs.org.uk/graphql';

// Function to get the WordPress backend URL for build-time data fetching
export function getBuildTimeWordPressUrl(): string {
  // Check if we should use the new backend URL during build
  if (BUILD_TIME_BACKEND_URL === 'https://backend.jvs.org.uk/graphql') {
    console.log('🔧 Build-time: Using NEW backend URL:', BUILD_TIME_BACKEND_URL);
    return BUILD_TIME_BACKEND_URL;
  }
  
  console.log('🔧 Build-time: Using OLD backend URL:', BUILD_TIME_BACKEND_URL);
  return BUILD_TIME_BACKEND_URL;
}

// Function to get the WordPress base URL (without /graphql) for checkout and canonical URLs
export function getBuildTimeWordPressBaseUrl(): string {
  const graphqlUrl = getBuildTimeWordPressUrl();
  const baseUrl = graphqlUrl.replace('/graphql', '');
  console.log('🔧 Build-time: Using WordPress base URL:', baseUrl);
  return baseUrl;
}

// Client-side function to get the WordPress base URL
// This uses the same environment variable but can be called from client components
export function getClientWordPressBaseUrl(): string {
  const graphqlUrl = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://backend.jvs.org.uk/graphql';
  const baseUrl = graphqlUrl.replace('/graphql', '');
  return baseUrl;
}

// Function to create a fetch wrapper that uses the build-time URL
export function createBuildTimeFetch() {
  const baseUrl = getBuildTimeWordPressUrl();
  
  return async (requestBody: string) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        console.error(`Failed to fetch from ${baseUrl}:`, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error fetching from ${baseUrl}:`, error);
      throw error;
    }
  };
}

// Export the current URL for logging purposes
export const CURRENT_BUILD_URL = getBuildTimeWordPressUrl();
export const CURRENT_BUILD_BASE_URL = getBuildTimeWordPressBaseUrl(); 