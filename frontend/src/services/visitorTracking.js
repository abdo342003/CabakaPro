import api from './api';

// Cookie helpers
const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Get UTM parameters from URL
const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    term: params.get('utm_term'),
    content: params.get('utm_content')
  };
};

// Track page visit
export const trackPageVisit = async (title) => {
  try {
    const sessionId = getCookie('chabaka_session');
    
    const data = {
      sessionId,
      path: window.location.pathname,
      title: title || document.title,
      referrer: document.referrer || 'direct',
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      language: navigator.language || 'unknown',
      utm: getUTMParams()
    };
    
    const response = await api.post('/visitors/track', data);
    
    // Store session ID in cookie if new
    if (response?.sessionId && response.sessionId !== sessionId) {
      setCookie('chabaka_session', response.sessionId);
    }
    
    return response;
  } catch (error) {
    console.error('Tracking error:', error);
    return null;
  }
};

// Send heartbeat to update activity
let heartbeatInterval = null;
let startTime = Date.now();

export const startHeartbeat = () => {
  if (heartbeatInterval) return;
  
  startTime = Date.now();
  
  heartbeatInterval = setInterval(async () => {
    try {
      const sessionId = getCookie('chabaka_session');
      if (!sessionId) return;
      
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      await api.post('/visitors/heartbeat', {
        sessionId,
        path: window.location.pathname,
        duration
      });
    } catch (error) {
      // Silent fail for heartbeat
    }
  }, 30000); // Every 30 seconds
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Get visitor statistics (for admin)
export const getVisitorStats = async (days = 30) => {
  return await api.get('/visitors/stats', { params: { days } });
};

// Get visitors list (for admin)
export const getVisitors = async (params = {}) => {
  return await api.get('/visitors', { params });
};

// Get visitor details (for admin)
export const getVisitorDetails = async (id) => {
  return await api.get(`/visitors/${id}`);
};

// Initialize tracking on page load
export const initTracking = () => {
  // Track initial page
  trackPageVisit();
  
  // Start heartbeat
  startHeartbeat();
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopHeartbeat();
    } else {
      startHeartbeat();
    }
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopHeartbeat();
  });
};

const visitorTrackingService = {
  trackPageVisit,
  startHeartbeat,
  stopHeartbeat,
  getVisitorStats,
  getVisitors,
  getVisitorDetails,
  initTracking
};

export default visitorTrackingService;
