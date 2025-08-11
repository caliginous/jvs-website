import FormData from "form-data";
import Mailgun from "mailgun.js";

interface EmailData {
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  text: string;
}

export async function sendEmailViaMailgun(emailData: EmailData): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get Mailgun API key from environment variable
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    
    if (!mailgunApiKey) {
      console.error('MAILGUN_API_KEY environment variable not set');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: mailgunApiKey,
      // EU domain endpoint
      url: "https://api.eu.mailgun.net"
    });

    const data = await mg.messages.create("jvs.org.uk", {
      from: `${emailData.from} <${emailData.fromEmail}>`,
      to: [emailData.to],
      subject: emailData.subject,
      text: emailData.text,
      "h:Reply-To": emailData.fromEmail,
    });

    console.log('Email sent successfully via Mailgun:', data);
    
    return {
      success: true,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('Mailgun email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 