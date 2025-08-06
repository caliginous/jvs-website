import { wpClient } from './wpClient';
import { EVENTS_QUERY } from './queries';
import type { EventProduct } from './types';

export interface CheckoutItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  eventDate: string;
  eventVenue: string;
}

export async function getEventForCheckout(eventId: string): Promise<EventProduct | null> {
  try {
    console.log(`🔍 [CHECKOUT] Fetching event with ID: ${eventId}`);
    console.log(`🚀 [DEPLOYMENT] Version: 20250802-CLEAN-BUILD-1`);
    
    const { data } = await wpClient.query({
      query: EVENTS_QUERY,
      fetchPolicy: 'cache-first',
    });

    console.log(`🔍 [CHECKOUT] GraphQL response:`, data);

    if (!data?.eventProducts) {
      console.log('❌ [CHECKOUT] No eventProducts data returned');
      return null;
    }

    console.log(`🔍 [CHECKOUT] Found ${data.eventProducts.length} events`);
    console.log(`🔍 [CHECKOUT] Event IDs:`, data.eventProducts.map((e: EventProduct) => e.id));

    // Find the specific event by ID
    const event = data.eventProducts.find((e: EventProduct) => e.id === eventId);

    if (!event) {
      console.log(`❌ [CHECKOUT] Event with ID ${eventId} not found for checkout.`);
      console.log(`🔍 [CHECKOUT] Available event IDs:`, data.eventProducts.map((e: EventProduct) => e.id));
      return null;
    }

    console.log('✅ [CHECKOUT] Found event for checkout:', event.name);
    return event;
  } catch (error) {
    console.error(`❌ [CHECKOUT] Error fetching event with ID ${eventId} for checkout:`, error);
    return null;
  }
}

export function convertEventToCheckoutItem(event: EventProduct, quantity: number): CheckoutItem {
  return {
    id: event.id,
    name: event.name,
    price: event.price,
    quantity,
    eventDate: event.eventDate,
    eventVenue: event.eventVenue,
  };
} 