// src/constants/app.js - Constantes de la aplicación
export const USER_TYPES = {
  GUEST: 'guest',
  REGISTERED: 'registered',
  RESTAURANT: 'restaurant',
  SUPERADMIN: 'superadmin'
};

export const APP_MODES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

export const PLAN_TYPES = {
  BASIC: 'basic',
  PRO: 'pro'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  PLAYING: 'playing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  FUNCTIONAL: 'functional',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing'
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  COOKIE_CONSENT: 'cookie_consent',
  CURRENT_VIEW: 'current_view',
  VOLUME: 'volume',
  USER_TYPE: 'user_type',
  REGISTERED_USER_ID: 'registered_user_id'
};

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  AUTH: '/auth',
  RESTAURANTS: '/restaurants',
  REQUESTS: '/requests',
  MUSIC: '/music',
  USERS: '/users'
};

export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin + '/spotify/callback',
  SCOPES: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'ugc-image-upload'
  ]
};

export const LEGAL_PAGES = {
  TERMS: '/terminos',
  PRIVACY: '/politica-privacidad',
  COOKIES: '/politica-cookies'
};

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/bryjusound',
  INSTAGRAM: 'https://instagram.com/bryjusound',
  TWITTER: 'https://twitter.com/bryjusound',
  LINKEDIN: 'https://linkedin.com/company/bryjusound'
};

export const CONTACT_INFO = {
  EMAIL: 'contacto@bryjusound.com',
  PHONE: '+57 300 123 4567',
  ADDRESS: 'Bogotá, Colombia'
};

export const BRAND_INFO = {
  NAME: 'BryJu Sound',
  TAGLINE: 'La música perfecta para tu restaurante',
  DESCRIPTION: 'Sistema SaaS para gestión musical en restaurantes con integración Spotify'
};