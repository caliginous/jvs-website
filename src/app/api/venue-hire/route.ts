import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaMailgun } from '@/lib/email';

export const runtime = 'edge';

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    const body = await request.json();
    const { name, organization, mobile, email, spaces, dates, times, message } = body;

    // Validate required fields
    if (!name || !email || !mobile || !spaces || !dates || !times || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Venue Hire Quote Request

Name: ${name}
Organization: ${organization || 'Not specified'}
Email: ${email}
Mobile: ${mobile}

Requested Spaces: ${spaces}
Preferred Dates: ${dates}
Preferred Times: ${times}

Event Details:
${message}

---
This enquiry was submitted via the JVS website venue hire form.
Please respond within 2 working days.
    `;

    // Get environment from request context (Cloudflare Workers)
    const env = (request as any).cf?.env || (globalThis as any).env;

    // Send email via Mailgun
    const emailResult = await sendEmailViaMailgun({
      from: name,
      fromEmail: email,
      to: 'info@jvs.org.uk',
      subject: 'New Venue Hire Quote Request',
      text: emailContent,
    }, env);

    if (!emailResult.success) {
      console.error('Failed to send venue hire email:', emailResult.error);
      // Fallback: log the email content for manual sending
      console.log('VENUE HIRE ENQUIRY (fallback):', emailContent);
    }

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing venue hire request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 