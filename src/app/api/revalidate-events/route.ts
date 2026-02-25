import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://tickets.jvs.org.uk',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request (you can add authentication here)
    const body = await request.json();
    const { secret, eventId, action } = body;

    // Verify the secret (you should set this in your environment variables)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Revalidate specific paths based on the action
    switch (action) {
      case 'event_created':
      case 'event_updated':
      case 'event_deleted':
        // Revalidate the main page (shows upcoming events)
        revalidatePath('/');
        
        // Revalidate the events listing page
        revalidatePath('/events');
        
        // If we have a specific event ID, revalidate that page too
        if (eventId) {
          revalidatePath(`/events/${eventId}`);
        }
        
        // Revalidate the events API route
        revalidatePath('/api/public/events');
        break;
        
      default:
        // Revalidate all event-related pages
        revalidatePath('/');
        revalidatePath('/events');
        revalidatePath('/api/public/events');
    }

    return NextResponse.json({ 
      message: 'Events revalidated successfully',
      revalidated: true,
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error revalidating events:', error);
    return NextResponse.json(
      { message: 'Error revalidating events' }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// Also support GET requests for manual revalidation (useful for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const eventId = searchParams.get('eventId');

    // Verify the secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Revalidate all event-related pages
    revalidatePath('/');
    revalidatePath('/events');
    
    if (eventId) {
      revalidatePath(`/events/${eventId}`);
    }

    return NextResponse.json({ 
      message: 'Events revalidated successfully',
      revalidated: true,
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error revalidating events:', error);
    return NextResponse.json(
      { message: 'Error revalidating events' }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
