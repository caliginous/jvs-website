// Custom Cloudflare Worker for JVS Website
// Handles tickets routes with full TicketSelector functionality
// Uses external GraphQL endpoint directly for reliability
// Also handles Stripe config API to bypass Edge function issues

// Helper function to generate CORS headers
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowOrigin = origin || 'https://staging.jvs.org.uk';
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    console.log(`🚀 [CUSTOM WORKER] Request URL: ${url.pathname}`);
    
    // Global CORS preflight handler for all API routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      console.log('🌐 [CUSTOM WORKER] Handling global CORS preflight');
      return new Response(null, {
        status: 204,
        headers: {
          ...getCorsHeaders(request),
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // Handle Stripe config API
    if (url.pathname === '/api/stripe-config' || url.pathname === '/api/stripe-config/') {
      console.log('💳 [CUSTOM WORKER] Handling Stripe config API');
      return await handleStripeConfig(request, env);
    }
    
    // Handle create payment intent API
    if (url.pathname === '/api/create-payment-intent' || url.pathname === '/api/create-payment-intent/') {
      console.log('💳 [CUSTOM WORKER] Handling create payment intent API');
      return await handleCreatePaymentIntent(request, env);
    }
    
    // Handle GraphQL API
    if (url.pathname === '/api/graphql' || url.pathname === '/api/graphql/') {
      console.log('🔍 [CUSTOM WORKER] Handling GraphQL API');
      return await handleGraphQLAPI(request, env);
    }
    
    // Handle Contact API
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      console.log('📧 [CUSTOM WORKER] Handling contact API');
      return await handleContactAPI(request, env);
    }
    
    // Handle Venue Hire API
    if (url.pathname === '/api/venue-hire' || url.pathname === '/api/venue-hire/') {
      console.log('🏢 [CUSTOM WORKER] Handling venue hire API');
      return await handleVenueHireAPI(request, env);
    }
    
    // Handle Magazine API routes
    if (url.pathname === '/api/list-magazines' || url.pathname === '/api/list-magazines/') {
      console.log('📚 [CUSTOM WORKER] Handling list-magazines API');
      return await handleListMagazinesAPI(request, env);
    }
    
    if (url.pathname === '/api/magazine' || url.pathname === '/api/magazine/') {
      console.log('📖 [CUSTOM WORKER] Handling magazine API');
      return await handleMagazineAPI(request, env);
    }
    
    if (url.pathname === '/api/search-magazines' || url.pathname === '/api/search-magazines/') {
      console.log('🔍 [CUSTOM WORKER] Handling search-magazines API');
      return await handleSearchMagazinesAPI(request, env);
    }
    
    // Handle tickets routes specifically
    if (url.pathname.startsWith('/events/') && url.pathname.endsWith('/tickets')) {
      console.log('🎫 [CUSTOM WORKER] Handling tickets route directly');
      return await handleTicketsRoute(request, env);
    }
    
    // Handle tickets routes with trailing slash
    if (url.pathname.startsWith('/events/') && url.pathname.endsWith('/tickets/')) {
      console.log('🎫 [CUSTOM WORKER] Handling tickets route with trailing slash');
      return await handleTicketsRoute(request, env);
    }
    
    // Handle unified event routes
    if (url.pathname.startsWith('/events/') && url.pathname.endsWith('/unified')) {
      console.log('🔄 [CUSTOM WORKER] Handling unified event route');
      return await handleUnifiedEventRoute(request, env);
    }
    
    // Handle unified event routes with trailing slash
    if (url.pathname.startsWith('/events/') && url.pathname.endsWith('/unified/')) {
      console.log('🔄 [CUSTOM WORKER] Handling unified event route with trailing slash');
      return await handleUnifiedEventRoute(request, env);
    }
    
    // Handle magazine detail pages
    if (url.pathname.startsWith('/magazine/') && url.pathname !== '/magazine/' && url.pathname !== '/magazine/search' && !url.pathname.startsWith('/magazine/search/')) {
      console.log('📖 [CUSTOM WORKER] Handling magazine detail page');
      return await handleMagazineDetailPage(request, env);
    }
    
    // For all other routes, return a 404 for now
    console.log('📄 [CUSTOM WORKER] Route not handled, returning 404');
    return new Response('Not Found', { status: 404 });
  }
};

async function handleStripeConfig(request, env) {
  try {
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Get Stripe publishable key from KV store (Cloudflare Workers) or environment variable (development)
    let publishableKey = null;
    
    // Try to get from KV store first
    if (env.JVS_SECRETS) {
      try {
        publishableKey = await env.JVS_SECRETS.get('STRIPE_PUBLISHABLE_KEY');
        console.log('✅ [STRIPE CONFIG] Retrieved publishable key from KV store');
      } catch (error) {
        console.log('⚠️ [STRIPE CONFIG] Could not retrieve from KV store:', error);
      }
    }
    
    // Fallback to environment variables (for development)
    if (!publishableKey) {
      // Try to find the STRIPE_PUBLISHABLE_KEY in the environment bindings
      for (let i = 0; i < 10; i++) {
        const envVar = env[i];
        if (envVar && typeof envVar === 'object' && envVar.STRIPE_PUBLISHABLE_KEY) {
          publishableKey = envVar.STRIPE_PUBLISHABLE_KEY;
          console.log('✅ [STRIPE CONFIG] Retrieved publishable key from environment');
          break;
        }
      }
    }
    
    if (!publishableKey) {
      console.error('❌ [STRIPE CONFIG] STRIPE_PUBLISHABLE_KEY not found in KV store or environment');
      return new Response(
        JSON.stringify({ error: 'Stripe configuration not available' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }
    
    console.log('✅ [STRIPE CONFIG] Returning publishable key');
    
    return new Response(
      JSON.stringify({ publishableKey: publishableKey }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('❌ [STRIPE CONFIG] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load Stripe configuration' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

async function handleCreatePaymentIntent(request, env) {
  try {
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    console.log('=== CREATE PAYMENT INTENT API START ===');
    
    // Get Stripe secret key from KV store
    let secretKey = null;
    if (env.JVS_SECRETS) {
      try {
        secretKey = await env.JVS_SECRETS.get('STRIPE_SECRET_KEY');
        console.log('✅ [PAYMENT INTENT] Retrieved secret key from KV store');
      } catch (error) {
        console.log('⚠️ [PAYMENT INTENT] Could not retrieve secret key from KV store:', error);
      }
    }
    
    if (!secretKey) {
      console.error('❌ [PAYMENT INTENT] No secret key found in KV store');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { 
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { amount, currency = 'gbp', metadata, description } = body;
    
    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('❌ [PAYMENT INTENT] Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Invalid amount provided' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    if (!currency || typeof currency !== 'string') {
      console.error('❌ [PAYMENT INTENT] Invalid currency:', currency);
      return new Response(
        JSON.stringify({ error: 'Invalid currency provided' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    console.log('✅ [PAYMENT INTENT] Creating payment intent:', {
      amount,
      currency,
      metadata,
      description
    });
    
    // Create payment intent using Stripe API
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-12-18.acacia'
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency: currency.toLowerCase(),
        description: description || 'JVS Event Ticket Purchase',
        automatic_payment_methods: 'true',
        ...(metadata && Object.keys(metadata).length > 0 && {
          metadata: JSON.stringify(metadata)
        })
      })
    });
    
    const paymentIntentData = await stripeResponse.json();
    
    if (!stripeResponse.ok) {
      console.error('❌ [PAYMENT INTENT] Stripe API error:', paymentIntentData);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment intent' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    console.log('✅ [PAYMENT INTENT] Payment intent created successfully:', paymentIntentData.id);
    
    // Return client secret (safe to send to frontend)
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntentData.client_secret,
        paymentIntentId: paymentIntentData.id,
        amount: paymentIntentData.amount,
        currency: paymentIntentData.currency,
        status: paymentIntentData.status
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
    
  } catch (error) {
    console.error('❌ [PAYMENT INTENT] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment intent' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

async function handleGraphQLAPI(request, env) {
  try {
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request)
      });
    }

    // Only handle POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Forward the request to the WordPress GraphQL endpoint
    const wpGraphQLUrl = 'https://backend.jvs.org.uk/graphql';
    
    console.log('🔍 [GRAPHQL API] Forwarding request to WordPress GraphQL');
    
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
    
    console.log('✅ [GRAPHQL API] Successfully forwarded request');
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request)
      }
    });
  } catch (error) {
    console.error('❌ [GRAPHQL API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'GraphQL request failed' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}

async function handleContactAPI(request, env) {
  try {
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Only handle POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Create email content
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was submitted via the JVS website contact form.
    `;

    // Send email via Mailgun
    const mailgunApiKey = await env.JVS_SECRETS.get('MAILGUN_API_KEY');
    if (!mailgunApiKey) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const formData = new FormData();
    formData.append('from', `${name} <${email}>`);
    formData.append('to', 'contact@jvs.org.uk');
    formData.append('subject', `JVS Website Contact Form: ${subject}`);
    formData.append('text', emailContent);

    const mailgunResponse = await fetch('https://api.eu.mailgun.net/v3/jvs.org.uk/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`
      },
      body: formData
    });

    if (!mailgunResponse.ok) {
      console.error('❌ [CONTACT API] Mailgun error:', await mailgunResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    console.log('✅ [CONTACT API] Email sent successfully');

    return new Response(
      JSON.stringify({ message: 'Contact form submitted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );

  } catch (error) {
    console.error('❌ [CONTACT API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process contact form submission' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

async function handleVenueHireAPI(request, env) {
  try {
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Only handle POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, phone, eventDate, eventType, guestCount, message } = body;

    // Validate required fields
    if (!name || !email || !eventDate || !eventType || !guestCount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    // Create email content
    const emailContent = `
New Venue Hire Request

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Event Date: ${eventDate}
Event Type: ${eventType}
Guest Count: ${guestCount}

Message:
${message || 'No additional message provided'}

---
This request was submitted via the JVS website venue hire form.
    `;

    // Send email via Mailgun
    const mailgunApiKey = await env.JVS_SECRETS.get('MAILGUN_API_KEY');
    if (!mailgunApiKey) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    const formData = new FormData();
    formData.append('from', `${name} <${email}>`);
    formData.append('to', 'venue@jvs.org.uk');
    formData.append('subject', `JVS Venue Hire Request: ${eventType} on ${eventDate}`);
    formData.append('text', emailContent);

    const mailgunResponse = await fetch('https://api.eu.mailgun.net/v3/jvs.org.uk/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`
      },
      body: formData
    });

    if (!mailgunResponse.ok) {
      console.error('❌ [VENUE HIRE API] Mailgun error:', await mailgunResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    console.log('✅ [VENUE HIRE API] Email sent successfully');

    return new Response(
      JSON.stringify({ message: 'Venue hire request submitted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );

  } catch (error) {
    console.error('❌ [VENUE HIRE API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process venue hire request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

async function handleTicketsRoute(request, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const slug = pathParts[2]; // /events/[slug]/tickets -> slug is at index 2
  
  console.log(`🎫 [TICKETS] Processing event slug: ${slug}`);
  
  try {
    // Fetch event data from external GraphQL endpoint directly
    // This matches the documented GraphQL integration approach
    const graphqlQuery = `
      query Events {
        eventProducts {
          id
          name
          price
          eventDate
          eventEndDate
          eventVenue
          eventPrice
          stockQuantity
          stockStatus
          purchasable
          shortDescription
          featuredImageUrl
          jvsTestField
          ticketTypes {
            label
            type
            price
            available
          }
        }
      }
    `;
    
    const graphqlResponse = await fetch('https://backend.jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query: graphqlQuery
      })
    });
    
    if (!graphqlResponse.ok) {
      console.error(`❌ [TICKETS] GraphQL request failed: ${graphqlResponse.status}`);
      return new Response('Event not found', { status: 404 });
    }
    
    const graphqlData = await graphqlResponse.json();
    
    if (!graphqlData.data?.eventProducts) {
      console.error(`❌ [TICKETS] No event products found`);
      return new Response('Event not found', { status: 404 });
    }
    
    // Find the event by slug (which is the ID in this case)
    const event = graphqlData.data.eventProducts.find(e => e.id === slug);
    
    if (!event) {
      console.error(`❌ [TICKETS] Event not found for slug: ${slug}`);
      return new Response('Event not found', { status: 404 });
    }
    
    console.log(`✅ [TICKETS] Found event: ${event.name}`);
    
    // Generate HTML response with full TicketSelector functionality
    const html = generateTicketsHTML(event, slug);
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
    
  } catch (error) {
    console.error(`❌ [TICKETS] Error processing tickets for ${slug}:`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function generateTicketsHTML(event, slug) {
  const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'TBD';
  
  const displayVenue = event.eventVenue || 'TBD';
  const displayPrice = event.eventPrice || 'Free';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${event.name} - Tickets | JVS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-green': '#8BC34A',
                        'deep-green': '#558B2F',
                        'charcoal': '#263238',
                        'off-white': '#FAFAFA',
                        'warm-grey': '#B0BEC5',
                        'stone-beige': '#F5F5F0'
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Quantity Controls */
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .quantity-btn {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            border: 2px solid #8BC34A;
            background-color: white;
            color: #8BC34A;
            font-weight: 600;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quantity-btn:hover {
            background-color: #8BC34A;
            color: white;
            transform: scale(1.05);
        }
        
        .quantity-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .quantity-display {
            min-width: 3rem;
            text-align: center;
            font-weight: 600;
            font-size: 1.125rem;
            color: #263238;
        }
        
        /* Card Styles */
        .ticket-card {
            border: 2px solid #F5F5F0;
            border-radius: 0.5rem;
            padding: 1.5rem;
            transition: all 0.2s ease;
        }
        
        .ticket-card:hover {
            border-color: #8BC34A;
            box-shadow: 0 4px 6px -1px rgba(139, 195, 74, 0.1);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="bg-[#263238] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="flex-shrink-0 flex items-center">
                        <img src="/transparent_logo.png" alt="JVS Logo" class="h-12 w-auto">
                        <span class="ml-3 text-lg font-medium text-white">Jewish, Vegan, Sustainable</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/articles" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Articles
                    </a>
                    <a href="/events" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Events
                    </a>
                    <a href="/recipes" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Recipes
                    </a>
                    <a href="/resources" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Resources
                    </a>
                    <a href="/about" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        About
                    </a>
                    <a href="/membership" class="bg-[#8BC34A] hover:bg-[#558B2F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Join Us
                    </a>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden flex items-center">
                    <button class="inline-flex items-center justify-center p-2 rounded-md text-neutral-200 hover:text-[#8BC34A] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8BC34A]">
                        <span class="sr-only">Open main menu</span>
                        <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="bg-white border-b border-neutral-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a href="/events/${slug}" class="text-[#8BC34A] hover:text-[#558B2F] font-medium transition-colors">
                ← Back to Event
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Event Details -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h1 class="text-3xl font-bold text-[#263238] mb-6">
                    ${event.name}
                </h1>
                
                <div class="space-y-4 mb-8">
                    <div class="flex items-center text-[#263238]">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="font-medium">${eventDate}</span>
                    </div>
                    
                    <div class="flex items-center text-[#263238]">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="font-medium">${displayVenue}</span>
                    </div>
                    
                    <div class="flex items-center text-[#263238]">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <span class="font-medium">${displayPrice}</span>
                    </div>
                </div>

                ${event.shortDescription ? `
                <div class="bg-[#F5F5F0] rounded-lg p-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-[#8BC34A] mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div class="flex-1">
                            <h3 class="font-semibold text-[#263238] mb-3">Description</h3>
                            <div class="text-[#263238] leading-relaxed">${event.shortDescription}</div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Ticket Purchase -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-[#263238] mb-6">
                    Purchase Tickets
                </h2>

                <div id="ticket-selector">
                    ${event.ticketTypes && event.ticketTypes.length > 0 ? `
                    <div class="space-y-6">
                        ${event.ticketTypes.map((ticket, index) => `
                        <div class="ticket-card">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-semibold text-[#263238] text-lg mb-1">${ticket.label || ticket.type}</h3>
                                    <p class="text-[#B0BEC5]">£${ticket.price || '0'}</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8BC34A] text-white">
                                        Available
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div class="quantity-controls">
                                    <button onclick="updateQuantity(${index}, -1)" class="quantity-btn" id="decrease-${index}">−</button>
                                    <span id="quantity-${index}" class="quantity-display">0</span>
                                    <button onclick="updateQuantity(${index}, 1)" class="quantity-btn" id="increase-${index}">+</button>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-[#B0BEC5]">Total: <span class="font-semibold text-[#263238]">£<span id="total-${index}">0.00</span></span></p>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    
                    <div class="bg-[#F5F5F0] rounded-lg p-6 mt-8">
                        <div class="flex justify-between items-center mb-6">
                            <span class="text-lg font-semibold text-[#263238]">Total Tickets: <span id="total-tickets" class="text-[#8BC34A]">0</span></span>
                            <span class="text-lg font-semibold text-[#263238]">Total Price: <span id="total-price" class="text-[#8BC34A]">£0.00</span></span>
                        </div>
                        
                        <button onclick="handlePurchase()" id="purchase-btn" class="w-full bg-[#8BC34A] hover:bg-[#558B2F] text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Purchase Tickets
                        </button>
                    </div>
                    ` : `
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-[#B0BEC5] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="text-xl font-semibold text-[#263238] mb-3">
                            Tickets Not Available
                        </h3>
                        <p class="text-[#B0BEC5] mb-6 max-w-md mx-auto">
                            Ticket sales for this event are not yet available or have ended.
                        </p>
                        <a href="/events/${slug}" class="inline-flex items-center justify-center px-4 py-2 bg-[#F5F5F0] text-[#263238] border border-[#B0BEC5] rounded-md text-sm font-medium hover:bg-[#B0BEC5] transition-colors">
                            ← Back to Event Details
                        </a>
                    </div>
                    `}
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#263238] text-white mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- JVS Info -->
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center mb-4">
                        <img src="/transparent_logo.png" alt="JVS Logo" class="h-10 w-auto">
                        <span class="ml-3 text-lg font-medium">Jewish, Vegan, Sustainable</span>
                    </div>
                    <p class="text-neutral-300 mb-4 max-w-md">
                        Promoting Jewish values through veganism and sustainability, 
                        building community through education and advocacy.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://twitter.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Twitter</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="https://facebook.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Facebook</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://instagram.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Instagram</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="/articles" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                Articles
                            </a>
                        </li>
                        <li>
                            <a href="/events" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                Events
                            </a>
                        </li>
                        <li>
                            <a href="/recipes" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                Recipes
                            </a>
                        </li>
                        <li>
                            <a href="/about" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/venue-hire" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                Venue Hire
                            </a>
                        </li>
                        <li>
                            <a href="/membership" class="text-neutral-300 hover:text-[#4FC3F7] transition-colors">
                                Membership
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter Signup -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Stay Updated</h3>
                    <p class="text-neutral-300 mb-4">Subscribe to our newsletter for the latest news and events.</p>
                    <form class="space-y-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            class="w-full bg-[#8BC34A] hover:bg-[#558B2F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-neutral-400 text-sm">
                    © 2025 JVS. All rights reserved.
                </p>
                <div class="flex space-x-6 mt-4 md:mt-0">
                    <a href="/privacy" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Privacy Policy
                    </a>
                    <a href="/terms" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Terms of Service
                    </a>
                    <a href="/contact" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Contact
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        const ticketTypes = ${JSON.stringify(event.ticketTypes || [])};
        const quantities = new Array(ticketTypes.length).fill(0);
        
        function updateQuantity(index, change) {
            const newQuantity = Math.max(0, quantities[index] + change);
            quantities[index] = newQuantity;
            
            // Update quantity display
            document.getElementById(\`quantity-\${index}\`).textContent = newQuantity;
            
            // Update individual ticket total
            const ticketPrice = parseFloat(ticketTypes[index].price || 0);
            const ticketTotal = (newQuantity * ticketPrice).toFixed(2);
            document.getElementById(\`total-\${index}\`).textContent = ticketTotal;
            
            // Update button states
            const decreaseBtn = document.getElementById(\`decrease-\${index}\`);
            const increaseBtn = document.getElementById(\`increase-\${index}\`);
            
            decreaseBtn.disabled = newQuantity === 0;
            decreaseBtn.style.opacity = newQuantity === 0 ? '0.5' : '1';
            
            updateTotals();
        }
        
        function updateTotals() {
            const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);
            const totalPrice = quantities.reduce((sum, qty, index) => sum + (qty * parseFloat(ticketTypes[index].price || 0)), 0);
            
            document.getElementById('total-tickets').textContent = totalTickets;
            document.getElementById('total-price').textContent = totalPrice.toFixed(2);
            
            const purchaseBtn = document.getElementById('purchase-btn');
            if (totalTickets > 0) {
                purchaseBtn.disabled = false;
                purchaseBtn.textContent = \`Purchase \${totalTickets} Ticket\${totalTickets > 1 ? 's' : ''} - £\${totalPrice.toFixed(2)}\`;
            } else {
                purchaseBtn.disabled = true;
                purchaseBtn.textContent = 'Purchase Tickets';
            }
        }
        
        function handlePurchase() {
            const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);
            if (totalTickets === 0) return;
            
            // Redirect to checkout with the event ID and total quantity
            const checkoutUrl = \`/checkout?eventId=${event.id}&quantity=\${totalTickets}\`;
            window.location.href = checkoutUrl;
        }
        
        // Initialize totals and button states
        updateTotals();
        
        // Initialize all quantity buttons as disabled
        quantities.forEach((_, index) => {
            const decreaseBtn = document.getElementById(\`decrease-\${index}\`);
            if (decreaseBtn) {
                decreaseBtn.disabled = true;
                decreaseBtn.style.opacity = '0.5';
            }
        });
    </script>
</body>
</html>`;
}

async function handleUnifiedEventRoute(request, env) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const slug = pathParts[2]; // /events/[slug]/unified
    
    console.log(`🔄 [UNIFIED EVENT] Fetching event data for slug: ${slug}`);
    
    // Fetch event data from GraphQL with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const graphqlResponse = await fetch('https://backend.jvs.org.uk/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'JVS-Website/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Events {
              eventProducts {
                id
                name
                price
                eventDate
                eventEndDate
                eventVenue
                eventPrice
                stockQuantity
                stockStatus
                purchasable
                shortDescription
                featuredImageUrl
                jvsTestField
                ticketTypes {
                  label
                  type
                  price
                  available
                }
              }
            }
          `
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

    if (!graphqlResponse.ok) {
      console.error('❌ [UNIFIED EVENT] GraphQL request failed:', graphqlResponse.statusText);
      return new Response(`Failed to fetch event data: ${graphqlResponse.statusText}`, { status: 500 });
    }

    const result = await graphqlResponse.json();
    if (!result.data?.eventProducts) {
      console.error('❌ [UNIFIED EVENT] No event products found in GraphQL response');
      return new Response('Event not found', { status: 404 });
    }

    const event = result.data.eventProducts.find((e) => e.id === slug);
    if (!event) {
      console.error(`❌ [UNIFIED EVENT] Event with slug ${slug} not found`);
      return new Response('Event not found', { status: 404 });
    }

    console.log(`✅ [UNIFIED EVENT] Found event: ${event.name}`);
    
    // Generate unified HTML with both event details and ticket purchasing
    const html = generateUnifiedEventHTML(event, slug);
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
      } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ [UNIFIED EVENT] Fetch error:', fetchError);
      return new Response(`Failed to fetch event data: ${fetchError.message}`, { status: 500 });
    }
  } catch (error) {
    console.error('❌ [UNIFIED EVENT] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function generateUnifiedEventHTML(event, slug) {
  // Helper function to format date
  function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Helper function to check if event is upcoming
  function isUpcoming(dateString) {
    if (!dateString) return false;
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  }

  const eventDate = event.eventDate;
  const isEventUpcoming = isUpcoming(eventDate);
  const displayVenue = event.eventVenue;
  const displayPrice = event.eventPrice || 'Free';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${event.name} - Unified Event | JVS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-green': '#8BC34A',
                        'deep-green': '#558B2F',
                        'charcoal': '#263238',
                        'off-white': '#FAFAFA',
                        'warm-grey': '#B0BEC5',
                        'stone-beige': '#F5F5F0'
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Quantity Controls */
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .quantity-btn {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            border: 2px solid #8BC34A;
            background-color: white;
            color: #8BC34A;
            font-weight: 600;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quantity-btn:hover {
            background-color: #8BC34A;
            color: white;
            transform: scale(1.05);
        }
        
        .quantity-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .quantity-display {
            min-width: 3rem;
            text-align: center;
            font-weight: 600;
            font-size: 1.125rem;
            color: #263238;
        }
        
        /* Card Styles */
        .ticket-card {
            border: 2px solid #F5F5F0;
            border-radius: 0.5rem;
            padding: 1.5rem;
            transition: all 0.2s ease;
        }
        
        .ticket-card:hover {
            border-color: #8BC34A;
            box-shadow: 0 4px 6px -1px rgba(139, 195, 74, 0.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-[#263238] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="flex-shrink-0 flex items-center">
                        <img src="/transparent_logo.png" alt="JVS Logo" class="h-12 w-auto">
                        <span class="ml-3 text-lg font-medium text-white">Jewish, Vegan, Sustainable</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/articles" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Articles
                    </a>
                    <a href="/events" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Events
                    </a>
                    <a href="/recipes" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Recipes
                    </a>
                    <a href="/resources" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Resources
                    </a>
                    <a href="/about" class="text-neutral-200 hover:text-[#8BC34A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        About
                    </a>
                    <a href="/membership" class="bg-[#8BC34A] hover:bg-[#558B2F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Join Us
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="text-white" style="background-color: #1f4d1a;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">${event.name}</h1>
                ${eventDate ? `<p class="text-xl mb-4 text-white font-medium drop-shadow">${formatDate(eventDate)}</p>` : ''}
                ${isEventUpcoming ? '<span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">Upcoming Event</span>' : ''}
            </div>
        </div>
    </section>

    <!-- Featured Image Section -->
    ${event.featuredImageUrl ? `
    <section class="py-8 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative">
                <img src="${event.featuredImageUrl}" alt="${event.name}" class="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg" style="max-height: 400px;">
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Event Content with Ticket Purchasing -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Left Column - Event Details -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="p-8">
                        <!-- Event Details -->
                        <div class="grid grid-cols-1 gap-8 mb-8">
                            ${displayVenue ? `
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-2">Venue</h3>
                                    <p class="text-gray-600 text-lg">${displayVenue}</p>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${eventDate ? `
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-2">Date & Time</h3>
                                    <p class="text-gray-600 text-lg">${formatDate(eventDate)}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>

                        <!-- Description Section -->
                        ${event.shortDescription ? `
                        <div class="mb-8 p-6 bg-gray-50 rounded-lg">
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
                                    <div class="prose prose-sm text-gray-700">${event.shortDescription}</div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Price Section -->
                        ${displayPrice ? `
                        <div class="mb-8 p-6 bg-gray-50 rounded-lg">
                            <div class="flex items-start">
                                <svg class="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 mb-3 text-lg">Pricing</h3>
                                    <p class="text-2xl font-bold text-primary-600">${displayPrice}</p>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Back to Events Button -->
                        <div class="pt-8 border-t border-gray-200">
                            <a href="/events" class="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-semibold transition-colors duration-200">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Back to Events
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Ticket Purchasing -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Purchase Tickets</h2>
                        
                        ${event.ticketTypes && event.ticketTypes.length > 0 ? `
                        <div class="space-y-6">
                            ${event.ticketTypes.map((ticketType, index) => `
                            <div class="ticket-card">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 class="font-semibold text-[#263238] text-lg mb-1">${ticketType.label || ticketType.type}</h3>
                                        <p class="text-[#B0BEC5]">£${ticketType.price || '0'}</p>
                                    </div>
                                    <div class="text-right">
                                        ${event.stockQuantity > 0 ? `
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8BC34A] text-white">
                                            ${event.stockQuantity} left
                                        </span>
                                        ` : `
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                            Sold Out
                                        </span>
                                        `}
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="quantity-controls">
                                        <button onclick="updateQuantity(${index}, -1)" class="quantity-btn" id="decrease-${index}">−</button>
                                        <span id="quantity-${index}" class="quantity-display">0</span>
                                        <button onclick="updateQuantity(${index}, 1)" class="quantity-btn" id="increase-${index}">+</button>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm text-[#B0BEC5]">Total: <span class="font-semibold text-[#263238]">£<span id="total-${index}">0.00</span></span></p>
                                    </div>
                                </div>
                            </div>
                            `).join('')}
                            
                            <div class="bg-[#F5F5F0] rounded-lg p-6 mt-8">
                                <div class="flex justify-between items-center mb-6">
                                    <span class="text-lg font-semibold text-[#263238]">Total Tickets: <span id="total-tickets" class="text-[#8BC34A]">0</span></span>
                                    <span class="text-lg font-semibold text-[#263238]">Total Price: <span id="total-price" class="text-[#8BC34A]">£0.00</span></span>
                                </div>
                                
                                <button onclick="handlePurchase()" id="purchase-btn" class="w-full bg-[#8BC34A] hover:bg-[#558B2F] text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    Purchase Tickets
                                </button>
                            </div>
                        </div>
                        ` : `
                        <div class="text-center py-8">
                            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tickets Not Available</h3>
                            <p class="text-gray-600 mb-4">Ticket sales for this event are not yet available or have ended.</p>
                        </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#263238] text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- JVS Info -->
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center mb-4">
                        <img src="/transparent_logo.png" alt="JVS Logo" class="h-10 w-auto">
                        <span class="ml-3 text-lg font-medium">Jewish, Vegan, Sustainable</span>
                    </div>
                    <p class="text-neutral-300 mb-4 max-w-md">
                        Promoting Jewish values through veganism and sustainability, 
                        building community through education and advocacy.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://twitter.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Twitter</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a href="https://facebook.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Facebook</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                        <a href="https://instagram.com/jvsuk" class="text-neutral-400 hover:text-[#4FC3F7]">
                            <span class="sr-only">Instagram</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="/articles" class="text-neutral-300 hover:text-[#8BC34A] transition-colors">Articles</a></li>
                        <li><a href="/events" class="text-neutral-300 hover:text-[#8BC34A] transition-colors">Events</a></li>
                        <li><a href="/recipes" class="text-neutral-300 hover:text-[#8BC34A] transition-colors">Recipes</a></li>
                        <li><a href="/resources" class="text-neutral-300 hover:text-[#8BC34A] transition-colors">Resources</a></li>
                        <li><a href="/about" class="text-neutral-300 hover:text-[#8BC34A] transition-colors">About</a></li>
                    </ul>
                </div>

                <!-- Newsletter Signup -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Stay Updated</h3>
                    <p class="text-neutral-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
                    <form class="space-y-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            class="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            class="w-full bg-[#8BC34A] hover:bg-[#558B2F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-neutral-400 text-sm">
                    © 2025 JVS. All rights reserved.
                </p>
                <div class="flex space-x-6 mt-4 md:mt-0">
                    <a href="/privacy" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Privacy Policy
                    </a>
                    <a href="/terms" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Terms of Service
                    </a>
                    <a href="/contact" class="text-neutral-400 hover:text-[#4FC3F7] text-sm">
                        Contact
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        const ticketTypes = ${JSON.stringify(event.ticketTypes || [])};
        const quantities = new Array(ticketTypes.length).fill(0);
        
        function updateQuantity(index, change) {
            const newQuantity = Math.max(0, quantities[index] + change);
            quantities[index] = newQuantity;
            
            // Update quantity display
            document.getElementById(\`quantity-\${index}\`).textContent = newQuantity;
            
            // Update individual ticket total
            const ticketPrice = parseFloat(ticketTypes[index].price || 0);
            const ticketTotal = (newQuantity * ticketPrice).toFixed(2);
            document.getElementById(\`total-\${index}\`).textContent = ticketTotal;
            
            // Update button states
            const decreaseBtn = document.getElementById(\`decrease-\${index}\`);
            const increaseBtn = document.getElementById(\`increase-\${index}\`);
            
            decreaseBtn.disabled = newQuantity === 0;
            decreaseBtn.style.opacity = newQuantity === 0 ? '0.5' : '1';
            
            updateTotals();
        }
        
        function updateTotals() {
            const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);
            const totalPrice = quantities.reduce((sum, qty, index) => sum + (qty * parseFloat(ticketTypes[index].price || 0)), 0);
            
            document.getElementById('total-tickets').textContent = totalTickets;
            document.getElementById('total-price').textContent = totalPrice.toFixed(2);
            
            const purchaseBtn = document.getElementById('purchase-btn');
            if (totalTickets > 0) {
                purchaseBtn.disabled = false;
                purchaseBtn.textContent = \`Purchase \${totalTickets} Ticket\${totalTickets > 1 ? 's' : ''} - £\${totalPrice.toFixed(2)}\`;
            } else {
                purchaseBtn.disabled = true;
                purchaseBtn.textContent = 'Purchase Tickets';
            }
        }
        
        function handlePurchase() {
            const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);
            if (totalTickets === 0) return;
            
            // Redirect to checkout with the event ID and total quantity
            const checkoutUrl = \`/checkout?eventId=${event.id}&quantity=\${totalTickets}\`;
            window.location.href = checkoutUrl;
        }
        
        // Initialize totals and button states
        updateTotals();
        
        // Initialize all quantity buttons as disabled
        quantities.forEach((_, index) => {
            const decreaseBtn = document.getElementById(\`decrease-\${index}\`);
            if (decreaseBtn) {
                decreaseBtn.disabled = true;
                decreaseBtn.style.opacity = '0.5';
            }
        });
    </script>
</body>
</html>`;
} 

// Magazine API Handlers
async function handleListMagazinesAPI(request, env) {
  try {
    console.log('📚 [MAGAZINE API] Handling list-magazines request');
    
    // Get all magazine issues ordered by date
    const sql = `
      SELECT id, title, date, r2_key, cover_image, ocr_text, summary
      FROM magazine_issues
      ORDER BY date DESC
    `;
    
    const results = await env.DB.prepare(sql).all();
    
    const magazines = results.results.map(m => ({
      ...m,
      pdf_url: `https://storage.jvs.org.uk/${m.r2_key.replace('jvs-magazines/', '')}`
    }));

    return new Response(JSON.stringify(magazines), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('❌ [MAGAZINE API] Error in list-magazines:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch magazines' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

async function handleMagazineAPI(request, env) {
  try {
    console.log('📖 [MAGAZINE API] Handling magazine request');
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Magazine ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    // Get specific magazine issue
    const sql = `
      SELECT id, title, date, r2_key, cover_image, ocr_text, summary
      FROM magazine_issues
      WHERE id = ?
    `;
    
    const result = await env.DB.prepare(sql).bind(id).first();

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Magazine not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }

    const magazine = {
      ...result,
      pdf_url: `https://storage.jvs.org.uk/${result.r2_key.replace('jvs-magazines/', '')}`
    };

    return new Response(JSON.stringify(magazine), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('❌ [MAGAZINE API] Error in magazine:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch magazine' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

async function handleSearchMagazinesAPI(request, env) {
  try {
    console.log('🔍 [MAGAZINE API] Handling search-magazines request');
    
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Search magazines using FTS5
    const sql = `
      SELECT m.id, m.title, m.date, m.r2_key, m.ocr_text, m.summary
      FROM magazine_issues m
      JOIN magazine_fts ON magazine_fts.rowid = m.rowid
      WHERE magazine_fts MATCH ?
      ORDER BY m.date DESC
      LIMIT 10;
    `;
    
    const results = await env.DB.prepare(sql).bind(query).all();
    
    const formattedResults = results.results.map(r => ({
      ...r,
      pdf_url: `https://storage.jvs.org.uk/${r.r2_key.replace('jvs-magazines/', '')}`
    }));

    return new Response(JSON.stringify(formattedResults), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('❌ [MAGAZINE API] Error in search-magazines:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search magazines' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}

async function handleMagazineDetailPage(request, env) {
  try {
    console.log('📖 [MAGAZINE DETAIL] Handling magazine detail page request');
    
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const magazineId = pathParts[2]; // /magazine/[id] -> [id] is at index 2
    
    if (!magazineId) {
      console.error('❌ [MAGAZINE DETAIL] No magazine ID found in URL');
      return new Response('Magazine not found', { status: 404 });
    }
    
    console.log(`📖 [MAGAZINE DETAIL] Fetching magazine with ID: ${magazineId}`);
    
    // Fetch magazine data from database
    const sql = `
      SELECT id, title, date, r2_key, ocr_text, summary
      FROM magazine_issues
      WHERE id = ?
      LIMIT 1;
    `;
    
    const result = await env.DB.prepare(sql).bind(magazineId).first();
    
    if (!result) {
      console.error(`❌ [MAGAZINE DETAIL] Magazine not found: ${magazineId}`);
      return new Response('Magazine not found', { status: 404 });
    }
    
    const magazine = {
      ...result,
      pdf_url: `https://storage.jvs.org.uk/${result.r2_key.replace('jvs-magazines/', '')}`
    };
    
    console.log(`✅ [MAGAZINE DETAIL] Found magazine: ${magazine.title}`);
    
    // Generate HTML for the magazine detail page
    const html = generateMagazineDetailHTML(magazine);
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
  } catch (error) {
    console.error('❌ [MAGAZINE DETAIL] Error handling magazine detail page:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function generateMagazineDetailHTML(magazine) {
  const formattedDate = new Date(magazine.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${magazine.title} - Jewish Vegetarian Society</title>
    <meta name="description" content="${magazine.summary || magazine.title}">
    <link rel="stylesheet" href="/_next/static/css/app/layout.css">
    <link rel="stylesheet" href="/_next/static/css/app/globals.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4CAF50;
        }
        .title {
            color: #2E7D32;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .date {
            color: #666;
            font-size: 1.2em;
            font-style: italic;
        }
        .summary {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .pdf-link {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .pdf-link:hover {
            background-color: #45a049;
        }
        .back-link {
            display: inline-block;
            color: #4CAF50;
            text-decoration: none;
            margin-top: 20px;
            font-weight: bold;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .ocr-text {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            font-family: monospace;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">${magazine.title}</h1>
            <p class="date">${formattedDate}</p>
        </div>
        
        ${magazine.summary ? `
        <div class="summary">
            <h3>Summary</h3>
            <p>${magazine.summary}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center;">
            <a href="${magazine.pdf_url}" class="pdf-link" target="_blank">
                📄 View PDF
            </a>
        </div>
        
        ${magazine.ocr_text ? `
        <div class="ocr-text">
            <h3>Text Content</h3>
            <div>${magazine.ocr_text.substring(0, 1000)}${magazine.ocr_text.length > 1000 ? '...' : ''}</div>
        </div>
        ` : ''}
        
        <a href="/magazine" class="back-link">← Back to Magazine Archive</a>
    </div>
</body>
</html>`;
}