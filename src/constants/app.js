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
  WHATSAPP: 'https://wa.me/+573212209943',
  INSTAGRAM: 'https://www.instagram.com/mastercodecompany/',
  TIKTOK: 'https://www.tiktok.com/@mastercodecompany_',
  TWITTER: 'https://x.com/mastercodee',
  LINKEDIN: 'https://linkedin.com/company/mastercodecompany'
};

export const CONTACT_INFO = {
  EMAIL: 'mastercodecompany@gmail.com',
  PHONE: '+57 321 220 9943',
  ADDRESS: 'Bogotá, Colombia'
};

export const BRAND_INFO = {
  NAME: 'BryJu Sound',
  TAGLINE: 'La música perfecta para tu restaurante',
  DESCRIPTION: 'Sistema SaaS para gestión musical en restaurantes con integración Spotify'
};

// Constantes para suscripciones
export const SUBSCRIPTION_TYPES = {
  NEW: 'new',
  RENEWAL: 'renewal',
  PENDING: 'pending'
};

export const SUBSCRIPTION_URLS = {
  NEW: '/subscription?plan=new',
  RENEWAL: '/subscription?plan=renewal',
  PENDING: '/subscription?plan=pending',
  PRICING: '/pricing',
  PAYMENT_APPROVAL: '/admin/payment-approval'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  QR: 'qr',
  TRANSFER: 'transfer'
};

export const SUBSCRIPTION_STEPS = {
  PLAN_SELECTION: 1,
  AUTHENTICATION: 2,
  USER_INFO: 3,
  PAYMENT: 4,
  CONFIRMATION: 5
};