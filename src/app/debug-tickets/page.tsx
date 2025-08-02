'use client';

import { useState, useEffect } from 'react';
import { EVENTS_QUERY } from '@/lib/queries';
import { wpClient } from '@/lib/wpClient';
import { parseTicketTypes } from '@/lib/utils';
import type { EventProduct } from '@/lib/types';

export default function DebugTicketsPage() {
  const [events, setEvents] = useState<EventProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await wpClient.query({
          query: EVENTS_QUERY,
        });
        setEvents(response.data.eventProducts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div className="p-8">Loading events...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Ticket Types Debug</h1>
        
        <div className="space-y-8">
          {events.map((event) => {
            const ticketTypes = parseTicketTypes(event);
            return (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-4">{event.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-600">Event ID: {event.id}</p>
                    <p className="text-sm text-neutral-600">Event Price: £{event.eventPrice}</p>
                    <p className="text-sm text-neutral-600">Event Date: {event.eventDate}</p>
                    <p className="text-sm text-neutral-600">Event Venue: {event.eventVenue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Stock Quantity: {event.stockQuantity || 'N/A'}</p>
                    <p className="text-sm text-neutral-600">Stock Status: {event.stockStatus || 'N/A'}</p>
                    <p className="text-sm text-neutral-600">Purchasable: {event.purchasable ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-charcoal mb-2">Ticket Types ({ticketTypes.length})</h3>
                  {ticketTypes.length > 0 ? (
                    <div className="space-y-2">
                      {ticketTypes.map((ticket, index) => (
                        <div key={index} className="bg-neutral-50 p-3 rounded border">
                          <p className="font-medium text-charcoal">{ticket.label}</p>
                          <p className="text-sm text-neutral-600">Price: £{ticket.price}</p>
                          <p className="text-sm text-neutral-600">Type: {ticket.type || 'Standard'}</p>
                          <p className="text-sm text-neutral-600">Available: {ticket.available ? 'Yes' : 'No'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 italic">No ticket types found</p>
                  )}
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-neutral-600 hover:text-charcoal">
                    JVS Test Field (click to expand)
                  </summary>
                  <pre className="mt-2 p-3 bg-neutral-100 rounded text-xs overflow-auto max-h-40">
                    {event.jvsTestField || 'No jvsTestField available'}
                  </pre>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 