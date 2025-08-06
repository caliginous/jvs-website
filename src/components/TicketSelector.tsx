'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parseTicketTypes, getEventPrice } from '@/lib/utils';
import type { EventProduct, TicketType } from '@/lib/types';

interface TicketSelectorProps {
  product: EventProduct;
  eventDate: string;
  eventVenue?: string;
}

interface TicketSelection {
  ticketType: TicketType;
  quantity: number;
}

export default function TicketSelector({ 
  product, 
  eventDate, 
  eventVenue
}: TicketSelectorProps) {
  const router = useRouter();
  
  // Parse ticket types from the event
  const ticketTypes = parseTicketTypes(product);
  const hasMultipleTicketTypes = ticketTypes.length > 1;

  // Initialize ticket selections properly
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>(() => 
    ticketTypes.map(ticketType => ({
      ticketType,
      quantity: 0
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateTicketQuantity = (ticketType: TicketType, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setTicketSelections(prev => 
      prev.map(selection => 
        selection.ticketType.label === ticketType.label 
          ? { ...selection, quantity: newQuantity }
          : selection
      )
    );
  };

  const getTotalPrice = () => {
    return ticketSelections.reduce((total, selection) => {
      const price = parseFloat(selection.ticketType.price);
      return total + (price * selection.quantity);
    }, 0);
  };

  const getTotalTickets = () => {
    return ticketSelections.reduce((total, selection) => total + selection.quantity, 0);
  };

  const handlePurchase = () => {
    const totalTickets = getTotalTickets();
    if (totalTickets === 0) return;
    
    setIsLoading(true);
    
    // For now, redirect to checkout with the main product
    // In the future, we can implement a more sophisticated checkout for multiple ticket types
    const checkoutUrl = `/checkout?eventId=${product.id}&quantity=${totalTickets}`;
    router.push(checkoutUrl);
    
    setIsLoading(false);
  };

  const isAvailable = product.available !== false;

  if (!isAvailable) {
    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Tickets Not Available
        </h3>
        <p className="text-neutral-600 mb-4">
          Ticket sales for this event are not yet available or have ended.
        </p>
        <Link
          href={`/events/${product.id}`}
          className="text-accent-sky hover:text-primary-500 font-medium"
        >
          ← Back to Event Details
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Event Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
        <div className="text-gray-600 space-y-1">
          <p>{eventDate}</p>
          {eventVenue && <p>{eventVenue}</p>}
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
        {hasMultipleTicketTypes ? (
          // Multiple ticket types
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-3">Select Tickets</h4>
            {ticketSelections.map((selection) => (
              <div key={selection.ticketType.label} className="border border-gray-200 rounded-lg p-3 bg-white mb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold">{selection.ticketType.label}</h5>
                    <p className="text-sm text-neutral-600">
                      {eventVenue ? `Event at ${eventVenue}` : 'Event ticket'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600">£{selection.ticketType.price}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateTicketQuantity(selection.ticketType, selection.quantity - 1)}
                      disabled={selection.quantity <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {selection.quantity}
                    </span>
                    <button
                      onClick={() => updateTicketQuantity(selection.ticketType, selection.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="font-semibold text-gray-900">
                      £{(parseFloat(selection.ticketType.price) * selection.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Single ticket type (fallback to original behavior)
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="text-sm text-neutral-600 mt-1">
                  {eventVenue ? `Event at ${eventVenue}` : 'Event ticket'}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-green-600">{getEventPrice(product)}</div>
                {product.stockQuantity !== undefined && (
                  <div className="text-sm text-neutral-600">
                    {product.stockQuantity} available
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateTicketQuantity(ticketTypes[0], Math.max(0, (ticketSelections[0]?.quantity || 0) - 1))}
                  disabled={(ticketSelections[0]?.quantity || 0) <= 0}
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">
                  {ticketSelections[0]?.quantity || 0}
                </span>
                <button
                  onClick={() => updateTicketQuantity(ticketTypes[0], (ticketSelections[0]?.quantity || 0) + 1)}
                  disabled={product.stockQuantity !== undefined && (ticketSelections[0]?.quantity || 0) >= product.stockQuantity}
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Subtotal</div>
                <div className="font-semibold">
                  £{getTotalPrice().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Button */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-neutral-600">Total Tickets</div>
            <div className="font-semibold">{getTotalTickets()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600">Total Price</div>
                            <div className="text-2xl font-bold text-green-600">£{getTotalPrice().toFixed(2)}</div>
          </div>
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={isLoading || getTotalTickets() === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
        >
          {isLoading ? 'Processing...' : 'Purchase Tickets'}
        </button>
        
        <p className="text-sm text-gray-600 text-center mt-2">
          Secure checkout powered by our payment processor
        </p>
      </div>
    </div>
  );
} 