interface EmailData {
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  text: string;
}

export async function sendEmailViaMailgun(emailData: EmailData, env?: any): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get Mailgun API key from KV store (Cloudflare Workers) or environment variable (development)
    let mailgunApiKey: string | null = null;
    
    if (env?.JVS_SECRETS) {
      // In Cloudflare Workers, get from KV store
      try {
        mailgunApiKey = await env.JVS_SECRETS.get('MAILGUN_API_KEY');
        console.log('Retrieved Mailgun API key from KV store');
      } catch (error) {
        console.error('Failed to retrieve Mailgun API key from KV store:', error);
      }
    } else {
      // Fallback to environment variable for development
      mailgunApiKey = process.env.MAILGUN_API_KEY || null;
      console.log('Using Mailgun API key from environment variable');
    }
    
    if (!mailgunApiKey) {
      console.error('MAILGUN_API_KEY not found in KV store or environment');
      return {
        success: false,
        error: 'Email service not configured - MAILGUN_API_KEY not found'
      };
    }

    console.log('Sending email via Mailgun EU region using direct HTTP...');
    
    // Create form data using Web API FormData (works in Edge Runtime)
    const formData = new FormData();
    formData.append('from', `${emailData.from} <${emailData.fromEmail}>`);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('text', emailData.text);
    formData.append('h:Reply-To', emailData.fromEmail);

    // Make direct HTTP request to Mailgun API
    const response = await fetch('https://api.eu.mailgun.net/v3/jvs.org.uk/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`
      },
      body: formData
    });

    console.log('Mailgun API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun API request failed:', response.status, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      };
    }

    const responseData = await response.json();
    console.log('Email sent successfully via Mailgun EU region:', responseData);
    
    return {
      success: true,
      message: 'Email sent successfully via EU Mailgun region',
      messageId: responseData.id
    };

  } catch (error) {
    console.error('Mailgun email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}