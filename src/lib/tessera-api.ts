import type { TesseraEvent } from './types';

const TESSERA_API_BASE = 'https://tickets.jvs.org.uk/api';

export async function fetchTesseraEvents(): Promise<TesseraEvent[]> {
  try {
    const response = await fetch(`${TESSERA_API_BASE}/events`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events from Tessera API:', error);
    return [];
  }
}

export async function fetchTesseraEventById(id: number): Promise<TesseraEvent | null> {
  try {
    // Fetch all events and find the one with matching ID
    const allEvents = await fetchTesseraEvents();
    const event = allEvents.find(e => e.id === id);
    return event || null;
  } catch (error) {
    console.error('Error fetching event from Tessera API:', error);
    return null;
  }
}
