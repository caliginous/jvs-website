import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHECKOUT API ROUTE START ===');
    
    // Resolve WordPress base URL once
    const wpUrl = process.env.WP_GRAPHQL_URL?.replace('/graphql', '') || 'https://backend.jvs.org.uk';
    const checkoutUrl = `${wpUrl}/checkout`;
    const ajaxCheckoutUrl = `${wpUrl}/?wc-ajax=checkout`;
    
    // 1) Prefetch checkout page to obtain cookies and dynamic nonces from WordPress
    console.log('Prefetching WordPress checkout page to obtain cookies and nonces:', checkoutUrl);
    const prefetchResponse = await fetch(checkoutUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'JVS-Website/1.0',
      },
      // Let redirects resolve normally to land on the live checkout form
      redirect: 'follow',
    });
    
    const prefetchHtml = await prefetchResponse.text();
    // Collect Set-Cookie headers into a Cookie header string (best effort)
    const setCookieHeaders: string[] = [];
    // Some runtimes expose getSetCookie()
    // @ts-ignore
    if (typeof (prefetchResponse.headers as any).getSetCookie === 'function') {
      // @ts-ignore
      const cookies = (prefetchResponse.headers as any).getSetCookie();
      if (Array.isArray(cookies)) {
        setCookieHeaders.push(...cookies);
      }
    }
    // Fallback if multiple Set-Cookie are collapsed
    const collapsedSetCookie = prefetchResponse.headers.get('set-cookie');
    if (collapsedSetCookie) {
      setCookieHeaders.push(collapsedSetCookie);
    }
    // Build Cookie header to send back to WP (strip attributes)
    const cookieHeader = setCookieHeaders
      .flatMap((sc) => sc.split(/,(?=[^;]+?=)/)) // split on commas that precede another cookie pair
      .map((sc) => sc.split(';')[0]?.trim())
      .filter(Boolean)
      .join('; ');
    
    // Extract dynamic nonces from the checkout form
    const wpNonceMatch = prefetchHtml.match(/name="_wpnonce"\s+value="([^"]+)"/i);
    const wcCheckoutNonceMatch = prefetchHtml.match(/name="woocommerce-process-checkout-nonce"\s+value="([^"]+)"/i);
    const wpNonce = wpNonceMatch ? wpNonceMatch[1] : null;
    const wcCheckoutNonce = wcCheckoutNonceMatch ? wcCheckoutNonceMatch[1] : null;
    console.log('Extracted nonces from WP checkout:', { hasWpNonce: !!wpNonce, hasWcCheckoutNonce: !!wcCheckoutNonce });
    
    // 2) Get the form data from the request
    const formData = await request.formData();
    
    console.log('Proxying checkout request to:', checkoutUrl);
    console.log('Form data keys:', Array.from(formData.keys()));
    console.log('Environment WP_GRAPHQL_URL:', process.env.WP_GRAPHQL_URL);
    
    // 3) Convert FormData to URLSearchParams and inject dynamic nonces when available
    const urlParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      urlParams.append(key, value.toString());
    }
    if (wpNonce) {
      urlParams.set('_wpnonce', wpNonce);
    }
    if (wcCheckoutNonce) {
      urlParams.set('woocommerce-process-checkout-nonce', wcCheckoutNonce);
    }
    
    console.log('URLSearchParams keys:', Array.from(urlParams.keys()));
    
    // 4) Forward the request to WooCommerce AJAX checkout endpoint, including cookies and referer
    const response = await fetch(ajaxCheckoutUrl, {
      method: 'POST',
      body: urlParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'JVS-Website/1.0',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
        'Referer': checkoutUrl,
        'Origin': wpUrl,
        'X-Requested-With': 'XMLHttpRequest',
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