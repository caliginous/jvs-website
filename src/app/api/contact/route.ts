import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaMailgun } from '@/lib/email';

export const runtime = 'edge';

async function parseRequestBody(request: NextRequest): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });
    return body;
  }
  
  throw new Error('Unsupported content type');
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request);
    const { name, email, subject, message, turnstileToken } = body;
    const isFormSubmission = (request.headers.get('content-type') || '').includes('application/x-www-form-urlencoded');

    // Validate required fields
    if (!name || !email || !subject || !message) {
      if (isFormSubmission) {
        return NextResponse.redirect(new URL('/contact?error=missing-fields', request.url));
      }
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Turnstile token (skip for plain form submissions as they won't have it)
    if (!turnstileToken && !isFormSubmission) {
      return NextResponse.json(
        { error: 'Please complete the security verification' },
        { status: 400 }
      );
    }

    // Verify Turnstile token with Cloudflare (only if token provided)
    if (turnstileToken) {
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
        if (isFormSubmission) {
          return NextResponse.redirect(new URL('/contact?error=verification-failed', request.url));
        }
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
        );
      }
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
      console.log('CONTACT FORM ENQUIRY (fallback):', emailContent);
    }

    if (isFormSubmission) {
      return NextResponse.redirect(new URL('/contact?success=true', request.url));
    }
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    const isFormSubmission = (request.headers.get('content-type') || '').includes('application/x-www-form-urlencoded');
    if (isFormSubmission) {
      return NextResponse.redirect(new URL('/contact?error=server-error', request.url));
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 