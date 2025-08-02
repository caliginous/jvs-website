import Link from 'next/link';
import { parseTicketTypes } from '@/lib/utils';
import type { EventProduct } from '@/lib/types';

interface DynamicEventCardProps {
  event: EventProduct;
}

export default function DynamicEventCard({ event }: DynamicEventCardProps) {
  // Parse ticket types for display
  const ticketTypes = parseTicketTypes(event);
  
  // Get price display text
  const getPriceDisplay = () => {
    if (ticketTypes.length === 0) {
      return event.eventPrice ? `£${event.eventPrice}` : 'Price TBC';
    }
    
    if (ticketTypes.length === 1) {
      return `£${ticketTypes[0].price}`;
    }
    
    // Multiple ticket types - show range
    const prices = ticketTypes.map(t => parseFloat(t.price)).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    
    if (minPrice === maxPrice) {
      return `£${minPrice}`;
    }
    
    return `£${minPrice} - £${maxPrice}`;
  };

  const getInventoryText = () => {
    if (event.stockQuantity !== null && event.stockQuantity !== undefined) {
      if (event.stockQuantity > 0) {
        return `${event.stockQuantity} tickets left`;
      } else {
        return 'Sold out';
      }
    }
    return 'Check availability';
  };

  const isSoldOut = event.stockQuantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="p-6 flex flex-col h-full">
        {/* Event Status Badge - Always reserve space for consistent alignment */}
        <div className="mb-3 min-h-[32px] flex items-start">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            isSoldOut 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            🎫 {getInventoryText()}
          </span>
        </div>

        {/* Event Title - Fixed height for consistency */}
        <div className="mb-4 min-h-[80px]">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
            {event.name}
          </h3>
          <p className="text-sm text-primary-400 font-medium">
            📅 {event.eventDate}
          </p>
        </div>

        {/* Event Details - Fixed height for consistency */}
        <div className="mb-4 min-h-[24px]">
          <p className="text-sm text-neutral-700">
            📍 {event.eventVenue}
          </p>
        </div>
        
        {/* Price Display - Fixed height for consistency */}
        <div className="mb-4 min-h-[60px]">
          {ticketTypes.length > 1 ? (
            <div>
              <p className="text-sm text-neutral-600 mb-2">Multiple ticket types available:</p>
              <div className="space-y-1">
                {ticketTypes.map((ticketType, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-neutral-700">{ticketType.label}:</span>
                    <span className="font-semibold text-primary-400">£{ticketType.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-lg font-bold text-primary-400">
              {getPriceDisplay()}
            </p>
          )}
        </div>
      
        {/* Last Updated - Fixed height for consistency */}
        <div className="mb-4 min-h-[20px]">
          <p className="text-xs text-neutral-400">
            Last updated at build time
          </p>
        </div>

        {/* Action Buttons - Push to bottom for consistent alignment */}
        <div className="mt-auto">
          <div className="flex space-x-2">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              View Details
            </Link>
            <Link
              href={`/events/${event.id}/tickets`}
              className={`flex-1 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSoldOut || !event.purchasable
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-primary-400 hover:bg-primary-500 text-white'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Get Tickets'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 