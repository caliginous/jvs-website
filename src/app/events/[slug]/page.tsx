import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { TesseraEvent } from '@/lib/types';
import { fetchTesseraEventById, fetchTesseraEvents } from '@/lib/tessera-api';

// Revalidate individual event pages every hour
export const revalidate = 3600;

// Helper function to check if event is upcoming
function isUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate > now;
}

// Helper function to format date (using London timezone for consistency)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Use Intl.DateTimeFormat with London timezone to match tickets website
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London', // Consistent with tickets website
  }).format(date);
}

async function getEvent(id: string): Promise<TesseraEvent | null> {
  try {
    const eventId = parseInt(id);
    if (isNaN(eventId)) {
      return null;
    }
    
    // First try to find by event date ID
    const allEvents = await fetchTesseraEvents();
    let event = allEvents.find(e => e.dates?.some(d => d.id === eventId));
    
    // If not found by date ID, try by main event ID
    if (!event) {
      event = allEvents.find(e => e.id === eventId);
    }
    
    return event || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Generate metadata for social sharing (Open Graph / Twitter Cards)
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    };
  }
  
  const title = event.title;
  const description = event.description || `Join us for ${event.title} - a JVS event`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jvs.org.uk'}/events/${slug}`;
  
  // Use cover image from event, or fall back to a default
  const ogImage = event.coverImage || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jvs.org.uk'}/images/jvs-og-default.jpg`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Jewish Vegan Society',
      images: ogImage ? [{ 
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

// Generate static params for all event date IDs (required for static export)
export async function generateStaticParams() {
  try {
    const events = await fetchTesseraEvents();
    const params: { slug: string }[] = [];
    
    events.forEach((event) => {
      // Add main event ID
      params.push({ slug: event.id.toString() });
      
      // Add event date IDs
      if (event.dates) {
        event.dates.forEach((date) => {
          params.push({ slug: date.id.toString() });
        });
      }
    });
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  // Check if unified events are enabled via environment variable
  // const unifiedEventsEnabled = process.env.NEXT_PUBLIC_UNIFIED_EVENTS === 'true';
  
  // If unified events are enabled, redirect to the unified page
  // if (unifiedEventsEnabled) {
  //   const { redirect } = await import('next/navigation');
  //   redirect(`/events/${slug}/unified`);
  // }
  
  // Temporarily disabled redirect to fix description display
  // TODO: Re-enable when unified events are properly implemented
  
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const eventDate = event.nextDate;
  const isEventUpcoming = eventDate ? isUpcoming(eventDate) : false;

  // Parse ticket types for display
  const ticketTypes = event.categories || [];
  
  // Get price display text
  const getPriceDisplay = () => {
    if (ticketTypes.length === 0) {
      return event.minPrice ? `£${event.minPrice}` : 'Free';
    }
    
    if (ticketTypes.length === 1) {
      return `£${ticketTypes[0].price}`;
    }
    
    // Multiple ticket types - show range
    const prices = ticketTypes.map((t: any) => t.price).sort((a: number, b: number) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    
    if (minPrice === maxPrice) {
      return `£${minPrice}`;
    }
    
    return `£${minPrice} - £${maxPrice}`;
  };

  // Use the event properties directly since they're available
  const displayVenue = event.venue?.name;
  const displayPrice = getPriceDisplay();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-white" style={{ backgroundColor: '#1f4d1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg" style={{ color: 'white' }}>{event.title}</h1>
            {eventDate && (
              <p className="text-xl mb-4 text-white font-medium drop-shadow" style={{ color: 'white' }}>
                {formatDate(eventDate)}
              </p>
            )}
            {isEventUpcoming && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                Upcoming Event
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image Section */}
      {event.coverImage && (
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Event Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">

            
            <div className="p-8">
              {/* Event Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {displayVenue && (
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Venue</h3>
                      <p className="text-gray-600 text-lg">{displayVenue}</p>
                    </div>
                  </div>
                )}
                
                {eventDate && (
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
                      <p className="text-gray-600 text-lg">{formatDate(eventDate)}</p>
                    </div>
                  </div>
                )}
                
                {/* Dynamic Inventory Display */}
                {isEventUpcoming && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Tickets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ticketTypes.map((ticketType, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900 mb-2">{ticketType.name}</h4>
                            <p className="text-2xl font-bold text-primary-600">£{ticketType.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Event Description */}
              {event.description && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">About This Event</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Section - Full Width */}
              {displayPrice && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">Pricing</h3>
                      {ticketTypes.length > 1 ? (
                        <div>
                          <p className="text-2xl font-bold text-primary-600 mb-4">{displayPrice}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {ticketTypes.map((ticketType, index) => (
                              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-center">
                                  <h4 className="font-semibold text-gray-900 mb-2">{ticketType.name}</h4>
                                  <p className="text-2xl font-bold text-primary-600">£{ticketType.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-primary-600">{displayPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-semibold transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                  </Link>
                  
                  {/* Always show Purchase Tickets button for events with tickets */}
                  {event.isSoldOut ? (
                    <span className="inline-flex items-center justify-center px-8 py-4 bg-gray-400 text-gray-600 rounded-lg font-semibold cursor-not-allowed">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Sold Out
                    </span>
                  ) : (
                    <Link
                      href={`/events/${slug}/tickets`}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: '#1f4d1a', color: 'white' }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      Purchase Tickets
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 