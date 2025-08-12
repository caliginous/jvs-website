import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHECKOUT API ROUTE START ===');
    // Resolve WordPress base URL once (avoid process.env in Edge runtime)
    const wpUrl = 'https://backend.jvs.org.uk';
    const checkoutUrl = `${wpUrl}/checkout`;
    const ajaxCheckoutUrl = `${wpUrl}/?wc-ajax=checkout`;
    
    // 1) Get the form data from the request
    const formData = await request.formData();
    
    // Extract first product and quantity to ensure a WooCommerce cart exists
    const productIdEntry = Array.from(formData.entries()).find(([key]) => /cart_item\[\d+\]\[product_id\]/.test(key));
    const quantityEntry = Array.from(formData.entries()).find(([key]) => /cart_item\[\d+\]\[quantity\]/.test(key));
    const productId = productIdEntry ? productIdEntry[1].toString() : null;
    const quantity = quantityEntry ? quantityEntry[1].toString() : '1';
    
    // Start with a fresh cookie jar
    let accumulatedCookies: string[] = [];
    const mergeSetCookies = (response: Response) => {
      const cookies: string[] = [];
      // @ts-ignore
      if (typeof (response.headers as any).getSetCookie === 'function') {
        // @ts-ignore
        const sc = (response.headers as any).getSetCookie();
        if (Array.isArray(sc)) cookies.push(...sc);
      }
      const single = response.headers.get('set-cookie');
      if (single) cookies.push(single);
      if (cookies.length) accumulatedCookies.push(...cookies);
    };
    const buildCookieHeader = () => accumulatedCookies
      .flatMap((sc) => sc.split(/,(?=[^;]+?=)/))
      .map((sc) => sc.split(';')[0]?.trim())
      .filter(Boolean)
      .join('; ');
    
    // 2) Ensure item is in cart (guest checkout works with session cookies)
    if (productId) {
      const addToCartUrl = `${wpUrl}/?add-to-cart=${encodeURIComponent(productId)}&quantity=${encodeURIComponent(quantity)}`;
      console.log('Adding to cart:', addToCartUrl);
      const addResp = await fetch(addToCartUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'JVS-Website/1.0',
        },
        redirect: 'follow',
      });
      mergeSetCookies(addResp);
      console.log('Add-to-cart status:', addResp.status);
    } else {
      console.warn('No productId found in formData; proceeding without add-to-cart');
    }
    
    // 3) Prefetch checkout to obtain nonces after cart exists
    console.log('Prefetching WordPress checkout page to obtain cookies and nonces:', checkoutUrl);
    const prefetchResponse = await fetch(checkoutUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'JVS-Website/1.0',
        ...(accumulatedCookies.length ? { 'Cookie': buildCookieHeader() } : {}),
      },
      redirect: 'follow',
    });
    mergeSetCookies(prefetchResponse);
    const prefetchHtml = await prefetchResponse.text();
    
    // Extract dynamic nonces from the checkout form
    const wpNonceMatch = prefetchHtml.match(/name="_wpnonce"\s+value="([^"]+)"/i);
    const wcCheckoutNonceMatch = prefetchHtml.match(/name="woocommerce-process-checkout-nonce"\s+value="([^"]+)"/i);
    const wpNonce = wpNonceMatch ? wpNonceMatch[1] : null;
    const wcCheckoutNonce = wcCheckoutNonceMatch ? wcCheckoutNonceMatch[1] : null;
    console.log('Extracted nonces from WP checkout:', { hasWpNonce: !!wpNonce, hasWcCheckoutNonce: !!wcCheckoutNonce });
    
    console.log('Proxying checkout request to:', checkoutUrl);
    console.log('Form data keys:', Array.from(formData.keys()));
    // Avoid accessing process.env in Edge runtime
    
    // 4) Convert FormData to URLSearchParams and inject dynamic nonces when available
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
    // Terms acceptance, if required by store settings
    if (!urlParams.has('terms')) {
      urlParams.set('terms', 'on');
    }

    // Normalize billing fields that some stores require
    if (!urlParams.has('billing_state')) {
      urlParams.set('billing_state', '');
    }
    if (!urlParams.has('billing_address_2')) {
      urlParams.set('billing_address_2', '');
    }

    // If a Stripe PaymentMethod was created on the client, map it for WooPayments as well
    const pmId = urlParams.get('stripe_payment_method') || urlParams.get('stripe_payment_method_id') || urlParams.get('wc-stripe-payment-method');
    if (pmId) {
      // Prefer WooPayments gateway since many sites enable it instead of classic Stripe
      urlParams.set('payment_method', 'woocommerce_payments');
      urlParams.set('wcpay_payment_method', pmId);
      urlParams.set('wcpay_selected_upe_payment_type', 'card');
      // Some themes check this flag to store new method
      if (!urlParams.has('wcpay_save_payment_method')) {
        urlParams.set('wcpay_save_payment_method', 'no');
      }
    }
    
    console.log('URLSearchParams keys:', Array.from(urlParams.keys()));
    
    // 5) Forward the request to WooCommerce AJAX checkout endpoint, including cookies and referer
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
        ...(accumulatedCookies.length ? { 'Cookie': buildCookieHeader() } : {}),
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

    // TEMP DIAGNOSTIC: If Woo returns an error status, surface first ~800 chars for inspection
    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = JSON.parse(responseText);
          const raw = typeof json.messages === 'string' ? json.messages : JSON.stringify(json);
          const preview = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 800);
          return NextResponse.json({ error: 'Woo checkout failure', status: response.status, preview }, { status: 502 });
        }
      } catch (_) {
        // fall through
      }
      const preview = responseText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 800);
      return NextResponse.json({ error: 'Woo checkout failure', status: response.status, preview }, { status: 502 });
    }
    
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
      const preview = responseText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 800);
      return NextResponse.json({ error: 'Woo checkout failure', status: 400, preview }, { status: 502 });
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