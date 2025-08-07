import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the WordPress GraphQL endpoint
    const wpGraphQLUrl = 'https://backend.jvs.org.uk/graphql';
    
    const response = await fetch(wpGraphQLUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    // Get CORS headers
    const origin = request.headers.get('Origin');
    const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
    
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('GraphQL error:', error);
    
    // Get CORS headers for error response
    const origin = request.headers.get('Origin');
    const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
    
    return NextResponse.json(
      { error: 'GraphQL request failed' }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  // Get CORS headers
  const origin = request.headers.get('Origin');
  const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
}
