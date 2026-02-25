import { redirect } from 'next/navigation';
import { fetchTesseraEventById } from '@/lib/tessera-api';

async function getEvent(id: string) {
  try {
    const eventId = parseInt(id);
    if (isNaN(eventId)) {
      return null;
    }
    
    return await fetchTesseraEventById(eventId);
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
    // If event not found, redirect to events page
    redirect('/events');
  }

  // Redirect to the tickets.jvs.org.uk subdomain for ticket purchase
  redirect(`https://tickets.jvs.org.uk/booking/${event.id}`);
} 