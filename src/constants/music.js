// Constantes musicales reutilizables
export const MUSIC_GENRES = [
  { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
  { id: 'rock', name: 'Rock', color: 'bg-red-500' },
  { id: 'ballad', name: 'Baladas', color: 'bg-purple-500' },
  { id: 'electronic', name: 'Electrónica', color: 'bg-cyan-500' },
  { id: 'hip-hop', name: 'Hip Hop', color: 'bg-orange-500' },
  { id: 'reggaeton', name: 'Reggaeton', color: 'bg-green-500' },
  { id: 'jazz', name: 'Jazz', color: 'bg-blue-500' },
  { id: 'classical', name: 'Clásica', color: 'bg-indigo-500' },
  { id: 'country', name: 'Country', color: 'bg-yellow-500' },
  { id: 'latin', name: 'Latina', color: 'bg-emerald-500' }
];

export const CUISINE_TYPES = [
  'Colombiana',
  'Italiana',
  'Mexicana',
  'Argentina',
  'Asiática',
  'Mediterránea',
  'Internacional',
  'Comida Rápida',
  'Mariscos',
  'Vegetariana',
  'Fusión',
  'Gourmet'
];

export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 80000,
    period: 'mes',
    features: [
      'Hasta 50 mesas',
      'Cola musical básica',
      '1,000 peticiones/mes',
      'Soporte por email',
      'Estadísticas básicas'
    ],
    limitations: [
      'Sin personalización avanzada',
      'Sin API access'
    ],
    color: 'blue',
    maxRequests: 1000,
    maxTables: 50,
    hasSpotify: false
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 120000,
    period: 'mes',
    features: [
      'Mesas ilimitadas',
      'Cola musical avanzada',
      '10,000 peticiones/mes',
      'Soporte prioritario 24/7',
      'Analytics completos',
      'Personalización completa',
      'Integración con Spotify',
      'Control de contenido'
    ],
    limitations: [],
    color: 'amber',
    maxRequests: 10000,
    maxTables: null,
    hasSpotify: true
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 300000,
    period: 'mes',
    features: [
      'Todo lo de Professional',
      'Múltiples ubicaciones',
      'Peticiones ilimitadas',
      'Soporte dedicado',
      'API completa',
      'White-label',
      'Integración personalizada',
      'SLA garantizado'
    ],
    limitations: [],
    color: 'purple',
    maxRequests: null,
    maxTables: null,
    hasSpotify: true
  }
};

export const USER_ROLES = {
  GUEST: 'guest',
  REGISTERED: 'registered',
  RESTAURANT: 'restaurant',
  SUPERADMIN: 'superadmin'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  PLAYING: 'playing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const REPEAT_MODES = {
  NONE: 'none',
  ONE: 'one',
  ALL: 'all'
};