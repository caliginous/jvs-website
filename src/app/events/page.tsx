import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TesseraEventCard from '@/components/TesseraEventCard';
import { fetchTesseraEvents } from '@/lib/tessera-api';
import type { TesseraEvent } from '@/lib/types';

// Revalidate events page every hour
export const revalidate = 3600;

// Helper function to check if event is upcoming
function isUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate > now;
}

// Fetch events from Tessera API at build time
async function getEvents(): Promise<TesseraEvent[]> {
  try {
    return await fetchTesseraEvents();
  } catch (error) {
    console.error('Error fetching events from Tessera API:', error);
    return [];
  }
}

export default async function EventsPage() {
  const allEvents = await getEvents();

  // Separate upcoming and past events
  const upcomingEvents = allEvents.filter((event: TesseraEvent) => 
    event.nextDate && isUpcoming(event.nextDate)
  );
  
  const pastEvents = allEvents.filter((event: TesseraEvent) => 
    !event.nextDate || !isUpcoming(event.nextDate)
  ).sort((a, b) => {
    // Get the actual date for comparison (use nextDate or first date from dates array)
    const getEventDate = (event: TesseraEvent) => {
      if (event.nextDate) return new Date(event.nextDate);
      if (event.dates && event.dates.length > 0) return new Date(event.dates[0].date);
      return new Date(0); // Fallback for events with no date
    };
    
    const dateA = getEventDate(a);
    const dateB = getEventDate(b);
    
    // Sort by date (latest first)
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary-50 text-neutral-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
            <p className="text-xl max-w-3xl mx-auto text-neutral-700">
              Join us for exciting events, workshops, and gatherings celebrating Jewish veganism and sustainability.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: TesseraEvent) => (
                <TesseraEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 text-center py-8">No upcoming events at the moment. Check back soon!</p>
          )}
        </section>

        {/* Past Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event: TesseraEvent) => (
                <TesseraEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 text-center py-8">No past events to display.</p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
} 