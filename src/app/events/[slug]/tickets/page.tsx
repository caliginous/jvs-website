import { notFound } from 'next/navigation';

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

// Dynamic configuration for Cloudflare Pages
export const dynamic = 'force-dynamic';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import TicketSelector from '@/components/TicketSelector';
import type { EventProduct } from '@/lib/types';

async function getEvent(slug: string): Promise<EventProduct | null> {
  try {
    const response = await fetch('https://backend.jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Events {
            eventProducts {
              id
              name
              price
              eventDate
              eventEndDate
              eventVenue
              eventPrice
              stockQuantity
              stockStatus
              purchasable
              shortDescription
              featuredImageUrl
              jvsTestField
              ticketTypes {
                label
                type
                price
                available
              }
            }
          }
        `
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch event:', response.statusText);
      return null;
    }

    const result = await response.json();
    if (!result.data?.eventProducts) {
      return null;
    }

    const event = result.data.eventProducts.find((e: EventProduct) => e.id === slug);
    return event || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

interface TicketPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  // Parse event date
  const eventDate = event.eventDate;
  const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'TBD';

  // Use the event properties directly since they're available
  const displayVenue = event.eventVenue;
  const displayPrice = event.eventPrice || 'Free';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/events/${slug}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
            style={{ color: '#1f4d1a' }}
          >
            ← Back to Event
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.name}
            </h1>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDate}</span>
              </div>
              
              {displayVenue && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{displayVenue}</span>
                </div>
              )}
              
              {displayPrice && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>{displayPrice}</span>
                </div>
              )}
            </div>

            {/* Description Section */}
            {event.shortDescription && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <div className="prose prose-sm text-gray-700" 
                         dangerouslySetInnerHTML={{ __html: event.shortDescription }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Purchase */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Purchase Tickets
            </h2>

            <TicketSelector
              product={{
                ...event,
                stockQuantity: 100, // Default stock for events
                available: true
              }}
              eventDate={eventDate}
              eventVenue={displayVenue || undefined}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 