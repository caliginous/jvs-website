import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHECKOUT API ROUTE START ===');
    
    // Get the form data from the request
    const formData = await request.formData();
    
    // Get WordPress site URL from environment
    const wpUrl = process.env.WP_GRAPHQL_URL?.replace('/graphql', '') || 'https://backend.jvs.org.uk';
    const checkoutUrl = `${wpUrl}/checkout`;
    
    console.log('Proxying checkout request to:', checkoutUrl);
    console.log('Form data keys:', Array.from(formData.keys()));
    console.log('Environment WP_GRAPHQL_URL:', process.env.WP_GRAPHQL_URL);
    
    // Convert FormData to URLSearchParams for better compatibility
    const urlParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      urlParams.append(key, value.toString());
    }
    
    console.log('URLSearchParams keys:', Array.from(urlParams.keys()));
    
    // Forward the request to WordPress WooCommerce checkout
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      body: urlParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'JVS-Website/1.0',
      },
      redirect: 'manual', // Don't follow redirects automatically
    });
    
    console.log('WordPress checkout response status:', response.status);
    console.log('WordPress checkout response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get the response text
    const responseText = await response.text();
    console.log('WordPress response text (first 500 chars):', responseText.substring(0, 500));
    
    // Check if we got a redirect to order received page
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log('Redirect location:', location);
      
      if (location && location.includes('order-received')) {
        // Success - redirect to our success page
        console.log('Redirecting to success page');
        return NextResponse.redirect(new URL('/checkout/success', request.url));
      } else if (location) {
        // Other redirect - follow it
        console.log('Following redirect to:', location);
        return NextResponse.redirect(new URL(location, request.url));
      }
    }
    
    // If we got HTML response, check if it contains success or error
    if (responseText.includes('order-received')) {
      // Success - redirect to our success page
      console.log('Found order-received in response, redirecting to success');
      return NextResponse.redirect(new URL('/checkout/success', request.url));
    } else if (responseText.includes('woocommerce-error')) {
      // Error - return error response
      console.log('Found woocommerce-error in response');
      return new NextResponse(responseText, {
        status: 400,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else {
      // Unknown response - return as-is
      console.log('Unknown response, returning as-is with status:', response.status);
      return new NextResponse(responseText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
  } catch (error) {
    console.error('Checkout proxy error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new NextResponse(`Checkout processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 