// Utility functions for date extraction and formatting

import type { EventProduct, TicketType } from './types';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function extractEventDateFromTitle(title: string): Date | null {
  // Handle multiple formats: "27th July 2025", "27 July 2025", "27th July", "27 July"
  let titleDateMatch = title.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
  
  if (titleDateMatch) {
    // Format: "27th July 2025" or "27 July 2025"
    const day = parseInt(titleDateMatch[1]);
    const month = titleDateMatch[2].toLowerCase();
    const year = parseInt(titleDateMatch[3]);
    
    const monthMap: { [key: string]: number } = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    
    if (monthMap[month] !== undefined) {
      return new Date(year, monthMap[month], day);
    }
  } else {
    // Try format without year: "27th July" or "27 July"
    titleDateMatch = title.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    
    if (titleDateMatch) {
      const day = parseInt(titleDateMatch[1]);
      const month = titleDateMatch[2].toLowerCase();
      const currentYear = new Date().getFullYear();
      
      const monthMap: { [key: string]: number } = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      };
      
      if (monthMap[month] !== undefined) {
        return new Date(currentYear, monthMap[month], day);
      }
    }
  }
  
  return null;
}

export function getEventDate(event: { title: string; eventDate?: string; date?: string }): Date | null {
  // First try to extract date from title (this is the actual event date)
  const titleDate = extractEventDateFromTitle(event.title);
  if (titleDate) {
    return titleDate;
  }
  
  // Fall back to eventDate field if available
  if (event.eventDate) {
    return new Date(event.eventDate);
  }
  
  // Finally fall back to publication date
  if (event.date) {
    return new Date(event.date);
  }
  
  return null;
}

export function formatDate(date: Date) {
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Europe/London' }),
    year: date.getFullYear(),
    time: date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/London'  // Consistent London timezone
    }),
    fullDate: date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/London'  // Consistent London timezone
    }),
  };
} 

interface TicketData {
  label: string;
  type: string | null;
  price: string;
}

/**
 * Parse PHP serialized array string
 * This is a simplified parser for the specific format we need
 */
function parsePHPSerializedArray(serialized: string): TicketData[] | null {
  // Extract the ticket types data section - use non-greedy match to get the full array
  const ticketTypesMatch = serialized.match(/wps_etmfw_field_user_type_price_data";a:\d+:\{(.*?)\}s:/);
  if (!ticketTypesMatch) {
    return null;
  }
  
  const ticketData = ticketTypesMatch[1];
  const tickets: TicketData[] = [];
  
  // Parse individual ticket entries with a more flexible regex
  const ticketMatches = ticketData.matchAll(/i:\d+;a:\d+:\{s:\d+:"label";s:\d+:"([^"]+)";s:\d+:"type";N;s:\d+:"price";s:\d+:"([^"]+)";\}/g);
  
  for (const match of ticketMatches) {
    tickets.push({
      label: match[1],
      type: null,
      price: match[2]
    });
  }
  
  return tickets;
}

/**
 * Parse ticket types from the event data
 */
export function parseTicketTypes(event: EventProduct): TicketType[] {
  // Priority 1: Use ticketTypes field from GraphQL response
  if (event.ticketTypes && event.ticketTypes.length > 0) {
    return event.ticketTypes;
  }
  
  // Priority 2: Create a standard ticket from eventPrice if available
  if (event.eventPrice && event.eventPrice !== 'Free') {
    return [{
      label: 'Standard Ticket',
      type: 'standard',
      price: event.eventPrice.replace('£', ''), // Remove £ symbol if present
      available: event.purchasable || false
    }];
  }
  
  // Priority 3: Create a free ticket if no price is set
  if (!event.eventPrice || event.eventPrice === 'Free') {
    return [{
      label: 'Free Ticket',
      type: 'free',
      price: '0',
      available: event.purchasable !== false
    }];
  }
  
  // Fallback: empty array
  return [];
}

/**
 * Get the main event price (fallback to the first ticket type price)
 */
export function getEventPrice(event: EventProduct): string {
  if (event.eventPrice && event.eventPrice !== 'Free') {
    return event.eventPrice;
  }
  
  const ticketTypes = parseTicketTypes(event);
  if (ticketTypes.length > 0) {
    return `£${ticketTypes[0].price}`;
  }
  
  return event.price ? `£${event.price}` : 'Free';
} 

// Function to decode HTML entities
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

// Function to clean text by removing HTML tags and decoding entities
export function cleanText(text: string): string {
  if (!text) return '';
  return decodeHtmlEntities(text.replace(/<[^>]*>/g, ''));
} 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 