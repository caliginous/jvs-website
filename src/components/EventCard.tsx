import Link from 'next/link';
import type { EventProduct } from '@/lib/types';

interface EventCardProps {
  event: EventProduct;
}

export default function EventCard({ event }: EventCardProps) {
  // Format the event date for display
  const formatEventDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  // Check if event is upcoming
  const isUpcoming = (dateString: string): boolean => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  };

  const displayDate = formatEventDate(event.eventDate);
  const isEventUpcoming = isUpcoming(event.eventDate);
  
  // Use the event properties directly since they're available
  const displayVenue = event.eventVenue;
  const displayPrice = event.eventPrice || 'Free';
  
  // Determine event status for better UX
  const isSoldOut = (event.stockQuantity ?? 0) === 0;
  const hasTickets = (event.stockQuantity ?? 0) > 0;
  const isFreeEvent = !displayPrice || displayPrice === 'Free';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col ${!isEventUpcoming ? 'opacity-75' : ''}`}>
      <div className="p-6 flex flex-col h-full">
        {/* Event Status Badge - Always reserve space for consistent alignment */}
        <div className="mb-3 min-h-[32px] flex items-start">
          {isEventUpcoming && event.stockQuantity !== undefined ? (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              isSoldOut 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {isSoldOut ? '🔴 Sold Out' : `🟢 ${event.stockQuantity} tickets available`}
            </span>
          ) : (
            <div className="h-8"></div>
          )}
        </div>

        {/* Event Title - Fixed height for consistency */}
        <div className="mb-4 min-h-[80px]">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
            {event.name}
          </h3>
          
          {displayDate && (
            <p className={`text-sm font-medium ${isEventUpcoming ? 'text-primary-400' : 'text-neutral-500'}`}>
              📅 {displayDate}
            </p>
          )}
        </div>

        {/* Event Details - Fixed height for consistency */}
        <div className="mb-4 min-h-[24px]">
          {displayVenue ? (
            <p className={`text-sm ${isEventUpcoming ? 'text-neutral-700' : 'text-neutral-600'}`}>
              📍 {displayVenue}
            </p>
          ) : (
            <div className="h-5"></div>
          )}
        </div>

        {/* Price and Action Section - Push to bottom for consistent alignment */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${isEventUpcoming ? 'text-primary-400' : 'text-neutral-500'}`}>
                {displayPrice}
              </span>
              {isFreeEvent && (
                <span className={`text-xs px-2 py-1 rounded-full ${isEventUpcoming ? 'bg-accent-coral text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                  Free Event
                </span>
              )}
            </div>
            
            {/* Action Buttons - Only show actionable buttons */}
            <div className="flex space-x-2">
              <Link
                href={`/events/${event.id}`}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Details
              </Link>
              
              {/* Only show ticket/RSVP button if event is upcoming and has tickets */}
              {isEventUpcoming && hasTickets && (
                <Link
                  href={`/events/${event.id}/tickets`}
                  className="bg-primary-400 hover:bg-primary-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isFreeEvent ? 'RSVP' : 'Buy Tickets'}
                </Link>
              )}
              
              {/* Show "Event Ended" for past events */}
              {!isEventUpcoming && (
                <span className="bg-neutral-200 text-neutral-500 px-3 py-2 rounded-lg text-sm font-medium">
                  Event Ended
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 