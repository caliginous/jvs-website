import FormData from "form-data";
import Mailgun from "mailgun.js";

export async function sendEmailViaMailgun(emailData, apiKey) {
  try {
    console.log('Email service called with:', { emailData, apiKey: apiKey ? 'Present' : 'Missing' });
    
    if (!apiKey) {
      console.error('No API key provided');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    console.log('Creating direct HTTP request to Mailgun API...');

    // Create form data for the request
    const formData = new FormData();
    formData.append('from', `${emailData.from} <${emailData.fromEmail}>`);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('text', emailData.text);
    formData.append('h:Reply-To', emailData.fromEmail);

    console.log('Form data created, sending request...');

    // Make direct HTTP request to Mailgun API
    const response = await fetch('https://api.eu.mailgun.net/v3/jvs.org.uk/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
      },
      body: formData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      console.error('Mailgun API request failed:', response.status, responseText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${responseText}`,
        details: responseText
      };
    }

    const data = JSON.parse(responseText);
    console.log('Email sent successfully via Mailgun:', data);
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: data.id
    };

  } catch (error) {
    console.error('Mailgun email sending failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error.message
    };
  }
} 