import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  // Check if running on production domain (GitHub Pages)
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'www.chabakapro.com' || 
     window.location.hostname === 'chabakapro.com');
  
  // Production: Use Cloudflare Tunnel
  if (isProduction) {
    return 'https://marijuana-suffered-favorites-heritage.trycloudflare.com/api';
  }
  
  // If explicitly set via env var, use that
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Docker with nginx proxy
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // Local development fallback
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
});

// Request interceptor with logging
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`);
    }
    return response.data;
  },
  (error) => {
    let message = 'Une erreur est survenue';
    
    if (error.code === 'ECONNABORTED') {
      message = 'La requête a expiré. Veuillez réessayer.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Erreur de connexion. Vérifiez votre connexion internet.';
    } else if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 400:
          message = error.response.data?.message || 'Données invalides';
          break;
        case 401:
          message = 'Non autorisé';
          break;
        case 404:
          message = 'Ressource non trouvée';
          break;
        case 500:
          message = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          message = error.response.data?.message || message;
      }
    }
    
    return Promise.reject({ message, error, status: error.response?.status });
  }
);

// Retry function for failed requests
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
};

export default api;
