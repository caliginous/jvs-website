import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { EventProduct } from '@/lib/types';
import DynamicEventCard from '@/components/DynamicEventCard';

// Helper function to check if event is upcoming
function isUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate > now;
}

// Fetch events at build time
async function getEvents(): Promise<EventProduct[]> {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
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
      console.error('Failed to fetch events:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data?.eventProducts || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const allEvents = await getEvents();

  // Separate upcoming and past events
  const upcomingEvents = allEvents.filter((event: EventProduct) => 
    event.eventDate && isUpcoming(event.eventDate)
  );
  
  const pastEvents = allEvents.filter((event: EventProduct) => 
    event.eventDate && !isUpcoming(event.eventDate)
  );

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Join us for exciting events, workshops, and gatherings celebrating Jewish vegetarianism and sustainability.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: EventProduct) => (
                <DynamicEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events scheduled at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon for new events!</p>
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 6).map((event: EventProduct) => (
                <DynamicEventCard key={event.id} event={event} />
              ))}
            </div>
            {pastEvents.length > 6 && (
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Showing 6 of {pastEvents.length} past events
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
} 