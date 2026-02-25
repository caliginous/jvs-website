// Enhanced Google Tag Manager / Google Analytics helper functions for main JVS website

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize dataLayer if it doesn't exist
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Generic GTM event push
export const pushToDataLayer = (event: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

// Helper for gtag calls
const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
};

// Content Engagement Events
export const trackArticleView = (articleData: {
  title: string;
  slug: string;
  category: string;
  publishDate?: string;
  readingTime?: number;
}) => {
  gtag('event', 'article_view', {
    article_title: articleData.title,
    article_category: articleData.category,
    content_id: articleData.slug,
    publish_date: articleData.publishDate,
    reading_time: articleData.readingTime,
    page_location: window.location.href
  });
};

export const trackRecipeEngagement = (recipeData: {
  name: string;
  slug: string;
  category?: string;
  engagementType: 'view' | 'save' | 'share' | 'print';
}) => {
  gtag('event', 'recipe_engagement', {
    recipe_name: recipeData.name,
    recipe_category: recipeData.category || 'uncategorized',
    engagement_type: recipeData.engagementType,
    content_id: recipeData.slug
  });
};

export const trackMagazineDownload = (magazineData: {
  issue: string;
  fileName: string;
  downloadSource?: string;
}) => {
  gtag('event', 'magazine_download', {
    magazine_issue: magazineData.issue,
    file_name: magazineData.fileName,
    download_source: magazineData.downloadSource || 'magazine_page'
  });
};

// Event Discovery (from main website to tickets)
export const trackEventView = (eventData: {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  price?: number;
  source?: string;
}) => {
  gtag('event', 'event_view', {
    event_id: eventData.eventId,
    event_title: eventData.eventTitle,
    event_date: eventData.eventDate,
    venue: eventData.venue,
    ticket_price: eventData.price,
    view_source: eventData.source || 'event_listing',
    page_location: window.location.href
  });
};

export const trackEventClick = (eventData: {
  eventId: string;
  eventTitle: string;
  source: string;
  destination: 'tickets_page' | 'event_details';
}) => {
  gtag('event', 'event_click', {
    event_id: eventData.eventId,
    event_title: eventData.eventTitle,
    click_source: eventData.source,
    click_destination: eventData.destination,
    outbound: eventData.destination === 'tickets_page'
  });
};

// Lead Generation
export const trackContactFormSubmit = (formData: {
  formType: 'general_contact' | 'venue_hire';
  userType?: 'new' | 'returning';
  inquiryType?: string;
}) => {
  gtag('event', 'contact_form_submit', {
    form_type: formData.formType,
    user_type: formData.userType || 'unknown',
    inquiry_type: formData.inquiryType
  });
};

export const trackNewsletterSignup = (source: string = 'footer') => {
  gtag('event', 'newsletter_signup', {
    signup_source: source,
    user_type: 'newsletter_subscriber'
  });
};

// Social and Sharing
export const trackSocialShare = (contentData: {
  contentType: 'article' | 'recipe' | 'event';
  contentTitle: string;
  platform: string;
}) => {
  gtag('event', 'share', {
    method: contentData.platform,
    content_type: contentData.contentType,
    content_id: contentData.contentTitle
  });
};

// Search and Navigation
export const trackSiteSearch = (searchData: {
  searchTerm: string;
  searchCategory?: string;
  resultsCount?: number;
}) => {
  gtag('event', 'search', {
    search_term: searchData.searchTerm,
    search_category: searchData.searchCategory || 'all',
    results_count: searchData.resultsCount
  });
};

// Error Tracking
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  gtag('event', 'exception', {
    description: `${errorType}: ${errorMessage}`,
    fatal: false,
    context: context
  });
};

// Custom Conversions
export const trackConversion = (conversionData: {
  conversionType: string;
  value?: number;
  currency?: string;
  conversionId?: string;
}) => {
  gtag('event', 'conversion', {
    conversion_type: conversionData.conversionType,
    value: conversionData.value,
    currency: conversionData.currency || 'GBP',
    conversion_id: conversionData.conversionId
  });
};








