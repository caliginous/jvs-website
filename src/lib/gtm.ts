// Google Tag Manager helper functions

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Initialize dataLayer if it doesn't exist
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push event to dataLayer
export const pushToDataLayer = (event: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_location: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  pushToDataLayer({
    event: eventName,
    ...parameters,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, formData?: Record<string, unknown>) => {
  trackEvent('form_submit', {
    form_name: formName,
    ...formData,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, buttonLocation?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
  });
};

// Track article views
export const trackArticleView = (articleTitle: string, articleCategory?: string) => {
  trackEvent('article_view', {
    article_title: articleTitle,
    article_category: articleCategory,
  });
};

// Track event registrations
export const trackEventRegistration = (eventName: string, eventId: string, ticketPrice?: number) => {
  trackEvent('event_registration', {
    event_name: eventName,
    event_id: eventId,
    ticket_price: ticketPrice,
  });
};

// Track recipe views
export const trackRecipeView = (recipeName: string, recipeCategory?: string) => {
  trackEvent('recipe_view', {
    recipe_name: recipeName,
    recipe_category: recipeCategory,
  });
};

// Track newsletter signups
export const trackNewsletterSignup = (source?: string) => {
  trackEvent('newsletter_signup', {
    signup_source: source,
  });
};

// Track donations
export const trackDonation = (amount: number, donationType?: string) => {
  trackEvent('donation', {
    donation_amount: amount,
    donation_type: donationType,
  });
}; 