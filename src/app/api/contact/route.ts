import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaMailgun } from '@/lib/email';

export const runtime = 'edge';

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    const body = await request.json();
    const { name, email, subject, message, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Get environment from request context (Cloudflare Workers)
    const env = (request as any).cf?.env || (globalThis as any).env;

    // Send email via Mailgun
    const emailResult = await sendEmailViaMailgun({
      from: name,
      fromEmail: email,
              to: process.env.CONTACT_EMAIL || 'info@jvs.org.uk',
      subject: `JVS Contact Form: ${subject}`,
      text: emailContent,
    }, env);

    if (!emailResult.success) {
      console.error('Failed to send contact form email:', emailResult.error);
      // Fallback: log the email content for manual sending
      console.log('CONTACT FORM ENQUIRY (fallback):', emailContent);
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 