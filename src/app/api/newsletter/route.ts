import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Mailchimp Audience IDs
const NEWSLETTER_AUDIENCE_ID = '77ab04b46d';
const EVENTS_AUDIENCE_ID = '425c97ec23';

async function subscribeToList(
  email: string, 
  listId: string, 
  listName: string,
  mailchimpApiKey: string,
  mailchimpServerPrefix: string
): Promise<{ success: boolean; alreadySubscribed: boolean; error?: string }> {
  const mailchimpUrl = `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
  
  console.log(`Mailchimp ${listName} URL:`, mailchimpUrl);
  
  const mailchimpData = {
    email_address: email,
    status: 'pending', // Double opt-in - Mailchimp sends confirmation email
    tags: ['website', 'footer-signup'],
    merge_fields: {
      SOURCE: 'Website Footer'
    }
  };

  try {
    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${mailchimpApiKey}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    const responseData = await response.json();
    console.log(`Mailchimp ${listName} response:`, response.status, responseData);

    if (response.ok) {
      return { success: true, alreadySubscribed: false };
    } else if (response.status === 400 && responseData.title === 'Member Exists') {
      return { success: true, alreadySubscribed: true };
    } else {
      console.error(`Mailchimp ${listName} subscription failed:`, responseData);
      return { success: false, alreadySubscribed: false, error: responseData.detail || 'Unknown error' };
    }
  } catch (error) {
    console.error(`Error subscribing to ${listName}:`, error);
    return { success: false, alreadySubscribed: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, turnstileToken, subscribeNewsletter = true, subscribeEvents = true } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Validate at least one subscription option is selected
    if (!subscribeNewsletter && !subscribeEvents) {
      return NextResponse.json(
        { error: 'Please select at least one subscription option' },
        { status: 400 }
      );
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Please complete the security verification' },
        { status: 400 }
      );
    }

    // Verify Turnstile token with Cloudflare
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: '0x4AAAAAAB3p-S0Gd9y1hLUorQrFu9pDVEw',
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult);
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Get Mailchimp configuration from environment variables
    // Trim all env vars to remove any trailing whitespace/newlines
    const mailchimpApiKey = (process.env.MAILCHIMP_API_KEY || '').trim();
    // Hardcoded to us4 - the datacenter for JVS Mailchimp account
    const mailchimpServerPrefix = (process.env.MAILCHIMP_SERVER_PREFIX || 'us4').trim();

    // Debug logging
    console.log('Mailchimp config:', { 
      serverPrefix: mailchimpServerPrefix,
      apiKeyLength: mailchimpApiKey.length,
      apiKeyEndsWithNewline: mailchimpApiKey.endsWith('\n'),
      apiKeyLast10Chars: mailchimpApiKey.slice(-10)
    });

    if (!mailchimpApiKey) {
      console.error('Mailchimp API key missing');
      
      // Fallback: Log the subscription for manual processing
      console.log('NEWSLETTER SUBSCRIPTION (fallback):', {
        email,
        subscribeNewsletter,
        subscribeEvents,
        timestamp: new Date().toISOString(),
        source: 'website_footer'
      });
      
      return NextResponse.json(
        { message: 'Subscription request received' },
        { status: 200 }
      );
    }

    // Track results for each list
    const results: { list: string; success: boolean; alreadySubscribed: boolean }[] = [];

    // Subscribe to Newsletter list if selected
    if (subscribeNewsletter) {
      console.log('Subscribing to Newsletter:', { email, listId: NEWSLETTER_AUDIENCE_ID });
      const newsletterResult = await subscribeToList(
        email,
        NEWSLETTER_AUDIENCE_ID,
        'Newsletter',
        mailchimpApiKey,
        mailchimpServerPrefix
      );
      results.push({ list: 'Newsletter', ...newsletterResult });
    }

    // Subscribe to Events list if selected
    if (subscribeEvents) {
      console.log('Subscribing to Events:', { email, listId: EVENTS_AUDIENCE_ID });
      const eventsResult = await subscribeToList(
        email,
        EVENTS_AUDIENCE_ID,
        'Events',
        mailchimpApiKey,
        mailchimpServerPrefix
      );
      results.push({ list: 'Event Updates', ...eventsResult });
    }

    // Determine response message
    const allSuccessful = results.every(r => r.success);
    const allAlreadySubscribed = results.every(r => r.alreadySubscribed);
    const someAlreadySubscribed = results.some(r => r.alreadySubscribed);

    if (allAlreadySubscribed) {
      return NextResponse.json(
        { message: 'You are already subscribed to our mailing lists!' },
        { status: 200 }
      );
    } else if (allSuccessful) {
      const lists = results.map(r => r.list).join(' and ');
      if (someAlreadySubscribed) {
        return NextResponse.json(
          { message: `Please check your email to confirm your subscription.` },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: `Please check your email to confirm your subscription to ${lists}.` },
        { status: 200 }
      );
    } else {
      // Some subscriptions failed
      console.error('Some subscriptions failed:', results);
      
      // Fallback: Log for manual processing
      console.log('NEWSLETTER SUBSCRIPTION (partial failure):', {
        email,
        subscribeNewsletter,
        subscribeEvents,
        results,
        timestamp: new Date().toISOString(),
        source: 'website_footer'
      });
      
      return NextResponse.json(
        { message: 'Subscription request received' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { message: 'Subscription request received' },
      { status: 200 }
    );
  }
}
