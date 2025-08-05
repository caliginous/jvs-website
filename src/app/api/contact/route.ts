import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaMailgun } from '@/lib/email';

export const runtime = 'edge';

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      to: 'info@jvs.org.uk',
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