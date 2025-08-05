import FormData from "form-data";
import Mailgun from "mailgun.js";

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
      mailgunApiKey = process.env.MAILGUN_API_KEY;
      console.log('Using Mailgun API key from environment variable');
    }
    
    if (!mailgunApiKey) {
      console.error('MAILGUN_API_KEY not found in KV store or environment');
      return {
        success: false,
        error: 'Email service not configured - MAILGUN_API_KEY not found'
      };
    }

    console.log('Initializing Mailgun client with EU region...');
    
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: mailgunApiKey,
      // EU domain endpoint for GDPR compliance
      url: "https://api.eu.mailgun.net"
    });

    console.log('Sending email via Mailgun EU region...');
    
    const data = await mg.messages.create("jvs.org.uk", {
      from: `${emailData.from} <${emailData.fromEmail}>`,
      to: [emailData.to],
      subject: emailData.subject,
      text: emailData.text,
      "h:Reply-To": emailData.fromEmail,
    });

    console.log('Email sent successfully via Mailgun EU region:', data);
    
    return {
      success: true,
      message: 'Email sent successfully via EU Mailgun region'
    };

  } catch (error) {
    console.error('Mailgun email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 