// Custom Cloudflare Worker for JVS Website
// Handles tickets routes with full TicketSelector functionality
// Uses external GraphQL endpoint directly for reliability
// Also handles Stripe config API to bypass Edge function issues

async function sendEmailViaMailgun(emailData, apiKey) {
  try {
    console.log('Email service called with:', { emailData, apiKey: apiKey ? 'Present' : 'Missing' });
    
    if (!apiKey) {
      console.error('No API key provided');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    console.log('Creating direct HTTP request to Mailgun API. Using EU region.');
    const mailgunApiBaseUrl = 'https://api.eu.mailgun.net/v3'; // Explicitly set to EU region
    const domain = 'jvs.org.uk'; // Your Mailgun domain
    const auth = `api:${apiKey}`;
    const authHeader = `Basic ${btoa(auth)}`;

    const formData = new FormData();
    formData.append('from', emailData.from);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('html', emailData.html);

    const response = await fetch(`${mailgunApiBaseUrl}/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun API error:', response.status, response.statusText, errorText);
      return {
        success: false,
        error: `Mailgun API error: ${response.status} ${response.statusText} - ${errorText}`
      };
    }

    console.log('Email sent successfully via Mailgun');
    return { success: true };

  } catch (error) {
    console.error('Error sending email via Mailgun:', error);
    return {
      success: false,
      error: `Failed to send email: ${error.message}`
    };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    console.log(`🚀 [CUSTOM WORKER] Request URL: ${url.pathname}`);
    
    // Global CORS handler for OPTIONS requests
    if (request.method === 'OPTIONS') {
      console.log('🔄 [CORS] Handling OPTIONS preflight request');
      const origin = request.headers.get('Origin');
      const allowedOrigin = origin || env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
      
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // Handle API and custom routes
    if (
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/events/') ||
      url.pathname.startsWith('/magazine/')
    ) {
      console.log(`🚀 [CUSTOM WORKER] Request URL: ${url.pathname}`);
      
      // Handle Stripe config API
      if (url.pathname === '/api/stripe-config' || url.pathname === '/api/stripe-config/') {
        console.log('💳 [CUSTOM WORKER] Handling Stripe config API');
        return await handleStripeConfig(request, env);
      }
      
          // Handle GraphQL API
    if (url.pathname === '/api/graphql' || url.pathname === '/api/graphql/') {
      console.log('🔍 [CUSTOM WORKER] Handling GraphQL API');
      return await handleGraphQLAPI(request, env);
    }
    
    // Handle Contact API
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      console.log('📧 [CUSTOM WORKER] Handling Contact API');
      return await handleContactAPI(request, env);
    }
    
    // Handle Venue Hire API
    if (url.pathname === '/api/venue-hire' || url.pathname === '/api/venue-hire/') {
      console.log('🏛️ [CUSTOM WORKER] Handling Venue Hire API');
      return await handleVenueHireAPI(request, env);
    }
      
      // Handle Newsletter Subscription API
      if (url.pathname === '/api/subscribe' || url.pathname === '/api/subscribe/') {
        console.log('📧 [CUSTOM WORKER] Handling newsletter subscription API');
        return await handleNewsletterSubscription(request, env);
      }
      
      // Handle Contact Form API
      if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
        console.log('✉️ [CUSTOM WORKER] Handling contact form API');
        return await handleContactForm(request, env);
      }

      // Handle Venue Hire Form API
      if (url.pathname === '/api/venue-hire' || url.pathname === '/api/venue-hire/') {
        console.log('🏢 [CUSTOM WORKER] Handling venue hire form API');
        return await handleVenueHireForm(request, env);
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
    }

    // For all other routes, let Cloudflare handle them automatically (including 404s)
    console.log('📄 [CUSTOM WORKER] Letting Cloudflare handle unhandled routes automatically');
    // Let the request pass through to Cloudflare's built-in handling
    if (env.ASSETS && env.ASSETS.fetch) {
      return env.ASSETS.fetch(request);
    } else {
      // Fallback if ASSETS is not available
      console.log('⚠️ [CUSTOM WORKER] ASSETS binding not available, returning 404');
      return new Response('Page Not Found', { status: 404 });
    }
  }
};

// Stripe Configuration Handler
async function handleStripeConfig(request, env) {
  try {
    const stripePublishableKey = env.STRIPE_PUBLISHABLE_KEY || 'pk_live_tUaoofuGHYYKl2YZprc5oEBs';
    
    return new Response(JSON.stringify({
      publishableKey: stripePublishableKey
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Error in handleStripeConfig:', error);
    return new Response(JSON.stringify({ error: 'Failed to get Stripe configuration' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// GraphQL API Handler
async function handleGraphQLAPI(request, env) {
  console.log('🔍 [GRAPHQL API] Handling request, method:', request.method);
  
  // Handle OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    console.log('🔍 [GRAPHQL API] Handling OPTIONS preflight request');
    const origin = request.headers.get('Origin');
    const allowedOrigin = origin || env.ALLOWED_ORIGIN || 'https://backend.jvs.org.uk';
    
    return new Response(null, {
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
  
  try {
    console.log('🔍 [GRAPHQL API] Forwarding request to WordPress GraphQL');
    const body = await request.json();
    const wpGraphQLUrl = env.WP_GRAPHQL_URL || 'https://backend.jvs.org.uk/graphql';
    
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
    const allowedOrigin = origin || env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  } catch (error) {
    console.error('Error in handleGraphQLAPI:', error);
    
    // Get CORS headers for error response
    const origin = request.headers.get('Origin');
    const allowedOrigin = origin || env.ALLOWED_ORIGIN || 'https://jvs.org.uk';
    
    return new Response(JSON.stringify({ error: 'GraphQL request failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollographql-client-name, apollographql-client-version',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }
}

// Newsletter Subscription Handler
async function handleNewsletterSubscription(request, env) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const mailchimpApiKey = env.MAILCHIMP_API_KEY;
    const mailchimpServer = env.MAILCHIMP_API_SERVER;
    const mailchimpAudienceId = env.MAILCHIMP_AUDIENCE_ID;

    if (!mailchimpApiKey || !mailchimpServer || !mailchimpAudienceId) {
      console.error('Missing Mailchimp environment variables');
      return new Response(JSON.stringify({ error: 'Newsletter service not configured' }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const url = `https://${mailchimpServer}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${mailchimpApiKey}`)}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mailchimp API error:', errorData);
      return new Response(JSON.stringify({ error: errorData.detail || 'Failed to subscribe' }), { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({ message: 'Subscribed successfully!' }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Contact Form Handler
async function handleContactForm(request, env) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get Mailgun API key from KV store
    const mailgunApiKey = await env.JVS_SECRETS.get('MAILGUN_API_KEY');

    const emailData = {
      from: 'JVS Website <noreply@jvs.org.uk>',
      to: 'info@jvs.org.uk',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    const result = await sendEmailViaMailgun(emailData, mailgunApiKey);

    if (result.success) {
      return new Response(JSON.stringify({ message: 'Message sent successfully!' }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      console.error('Failed to send email:', result.error);
      return new Response(JSON.stringify({ error: 'Failed to send message. Please try again.' }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Error in handleContactForm:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Venue Hire Form Handler
async function handleVenueHireForm(request, env) {
  try {
    const { name, email, phone, date, time, attendees, message } = await request.json();

    if (!name || !email || !date || !time || !attendees) {
      return new Response(JSON.stringify({ error: 'Name, email, date, time, and number of attendees are required' }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get Mailgun API key from KV store
    const mailgunApiKey = await env.JVS_SECRETS.get('MAILGUN_API_KEY');

    const emailData = {
      from: 'JVS Website <noreply@jvs.org.uk>',
      to: 'info@jvs.org.uk',
      subject: `New Venue Hire Request from ${name}`,
      html: `
        <h2>New Venue Hire Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Number of Attendees:</strong> ${attendees}</p>
        <p><strong>Additional Message:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br>') : 'No additional message'}</p>
      `
    };

    const result = await sendEmailViaMailgun(emailData, mailgunApiKey);

    if (result.success) {
      return new Response(JSON.stringify({ message: 'Venue hire request sent successfully!' }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      console.error('Failed to send email:', result.error);
      return new Response(JSON.stringify({ error: 'Failed to send venue hire request. Please try again.' }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Error in handleVenueHireForm:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Magazine API Handlers
async function handleListMagazinesAPI(request, env) {
  try {
    const magazines = await env.DB.prepare(`
      SELECT id, title, issue_number, publication_date, image_url, pdf_url
      FROM magazines 
      ORDER BY publication_date DESC
    `).all();

    return new Response(JSON.stringify(magazines.results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in handleListMagazinesAPI:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch magazines' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleSearchMagazinesAPI(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const id = searchParams.get('id');

    let sql = 'SELECT id, title, issue_number, publication_date, image_url, pdf_url FROM magazines';
    let params = [];

    if (id) {
      sql += ' WHERE id = ?';
      params.push(id);
    } else if (query) {
      sql += ' WHERE title LIKE ? OR issue_number LIKE ?';
      params.push(`%${query}%`, `%${query}%`);
    }

    sql += ' ORDER BY publication_date DESC';

    const magazines = await env.DB.prepare(sql).bind(...params).all();

    return new Response(JSON.stringify(magazines.results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in handleSearchMagazinesAPI:', error);
    return new Response(JSON.stringify({ error: 'Failed to search magazines' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleMagazineAPI(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Magazine ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const magazine = await env.DB.prepare(`
      SELECT id, title, issue_number, publication_date, image_url, pdf_url, content
      FROM magazines 
      WHERE id = ?
    `).bind(id).first();

    if (!magazine) {
      return new Response(JSON.stringify({ error: 'Magazine not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify(magazine), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in handleMagazineAPI:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch magazine' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Event Route Handlers
async function handleTicketsRoute(request, env) {
  try {
    const url = new URL(request.url);
    const eventSlug = url.pathname.replace('/events/', '').replace('/tickets', '').replace('/', '');
    
    console.log('🎫 [TICKETS ROUTE] Event slug:', eventSlug);
    
    // Fetch event data from WordPress GraphQL
    const wpGraphQLUrl = env.WP_GRAPHQL_URL || 'https://backend.jvs.org.uk/graphql';
    
    const query = `
      query GetEvent($slug: ID!) {
        event(id: $slug, idType: SLUG) {
          id
          title
          slug
          date
          startDate
          endDate
          content
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          event {
            location
            ticketPrice
            ticketUrl
            eventType
          }
        }
      }
    `;
    
    const response = await fetch(wpGraphQLUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { slug: eventSlug }
      })
    });
    
    const data = await response.json();
    
    if (data.errors || !data.data?.event) {
      console.error('🎫 [TICKETS ROUTE] GraphQL error:', data.errors);
      return new Response('Event not found', { status: 404 });
    }
    
    const event = data.data.event;
    
    // Generate the ticket page HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${event.title} - Tickets | JVS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen">
          <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="/jvs-logo.png" alt="JVS Logo" class="h-8 w-8 mr-3">
                  <span class="text-xl font-bold text-gray-900">JVS</span>
                </div>
                <a href="/events" class="text-green-600 hover:text-green-700 font-medium">← Back to Events</a>
              </div>
            </div>
          </header>
          
          <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              ${event.featuredImage?.node?.sourceUrl ? `
                <img src="${event.featuredImage.node.sourceUrl}" alt="${event.featuredImage.node.altText || event.title}" class="w-full h-64 object-cover">
              ` : ''}
              
              <div class="p-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">${event.title}</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
                    <div class="space-y-2 text-gray-600">
                      <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
                      ${event.event?.location ? `<p><strong>Location:</strong> ${event.event.location}</p>` : ''}
                      ${event.event?.eventType ? `<p><strong>Type:</strong> ${event.event.eventType}</p>` : ''}
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Tickets</h3>
                    <div class="space-y-2 text-gray-600">
                      ${event.event?.ticketPrice ? `<p><strong>Price:</strong> ${event.event.ticketPrice}</p>` : ''}
                      ${event.event?.ticketUrl ? `
                        <a href="${event.event.ticketUrl}" target="_blank" rel="noopener noreferrer" 
                           class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                          Get Tickets
                        </a>
                      ` : `
                        <p class="text-gray-500">Tickets available at the door</p>
                      `}
                    </div>
                  </div>
                </div>
                
                ${event.excerpt ? `
                  <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                    <div class="text-gray-600 prose max-w-none">
                      ${event.excerpt}
                    </div>
                  </div>
                ` : ''}
                
                ${event.content ? `
                  <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Full Description</h3>
                    <div class="text-gray-600 prose max-w-none">
                      ${event.content}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </main>
        </div>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('🎫 [TICKETS ROUTE] Error:', error);
    return new Response('Error loading event', { status: 500 });
  }
}

async function handleUnifiedEventRoute(request, env) {
  try {
    const url = new URL(request.url);
    const eventSlug = url.pathname.replace('/events/', '').replace('/unified', '').replace('/', '');
    
    console.log('🔄 [UNIFIED EVENT ROUTE] Event slug:', eventSlug);
    
    // Redirect to the main event page
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `/events/${eventSlug}`,
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('🔄 [UNIFIED EVENT ROUTE] Error:', error);
    return new Response('Error redirecting to event', { status: 500 });
  }
}

async function handleMagazineDetailPage(request, env) {
  try {
    const url = new URL(request.url);
    const magazineId = url.pathname.replace('/magazine/', '').replace('/', '');
    
    console.log('📖 [MAGAZINE DETAIL] Handling magazine detail page request');
    console.log('📖 [MAGAZINE DETAIL] Fetching magazine with ID:', magazineId);
    
    // Fetch magazine from database
    const magazine = await env.DB.prepare(`
      SELECT id, title, issue_number, publication_date, image_url, pdf_url, content
      FROM magazines 
      WHERE id = ?
    `).bind(magazineId).first();
    
    if (!magazine) {
      console.log('📖 [MAGAZINE DETAIL] Magazine not found:', magazineId);
      return new Response('Magazine not found', { status: 404 });
    }
    
    console.log('✅ [MAGAZINE DETAIL] Found magazine:', magazine.title);
    
    // Generate the magazine detail page HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${magazine.title} | JVS Magazine</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen">
          <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="/jvs-logo.png" alt="JVS Logo" class="h-8 w-8 mr-3">
                  <span class="text-xl font-bold text-gray-900">JVS</span>
                </div>
                <a href="/magazine" class="text-green-600 hover:text-green-700 font-medium">← Back to Magazine</a>
              </div>
            </div>
          </header>
          
          <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              ${magazine.image_url ? `
                <img src="${magazine.image_url}" alt="${magazine.title}" class="w-full h-64 object-cover">
              ` : ''}
              
              <div class="p-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">${magazine.title}</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Issue Details</h3>
                    <div class="space-y-2 text-gray-600">
                      ${magazine.issue_number ? `<p><strong>Issue:</strong> ${magazine.issue_number}</p>` : ''}
                      ${magazine.publication_date ? `<p><strong>Published:</strong> ${new Date(magazine.publication_date).toLocaleDateString()}</p>` : ''}
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Download</h3>
                    ${magazine.pdf_url ? `
                      <a href="${magazine.pdf_url}" target="_blank" rel="noopener noreferrer" 
                         class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                        Download PDF
                      </a>
                    ` : `
                      <p class="text-gray-500">PDF not available</p>
                    `}
                  </div>
                </div>
                
                ${magazine.content ? `
                  <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Contents</h3>
                    <div class="text-gray-600 prose max-w-none">
                      ${magazine.content}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </main>
        </div>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('📖 [MAGAZINE DETAIL] Error:', error);
    return new Response('Error loading magazine', { status: 500 });
  }
}

