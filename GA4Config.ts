export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Custom events for your use case
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
  }
};

// Track anonymous message submission
export const trackAnonMessage = (messageId: string) => {
  trackEvent('anon_message_submitted', {
    message_id: messageId,
    page_location: window.location.href
  });
};

// Track page performance
export const trackPagePerformance = (pageName: string, loadTime: number) => {
  trackEvent('page_performance', {
    page_name: pageName,
    load_time: loadTime,
    user_agent: navigator.userAgent
  });
};