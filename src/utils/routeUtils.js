// src/utils/routeUtils.js - Sistema de rutas unificado
import { USER_TYPES, APP_MODES } from '../constants/app';

// Definir rutas de la aplicación
export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  RESTAURANT_SELECTION: '/restaurant-selection',

  // Rutas de autenticación
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_AUTH: '/admin/auth',

  // Rutas de cliente
  MUSIC_APP: '/music',
  BROWSE_MUSIC: '/music/browse',
  FAVORITES: '/music/favorites',
  REQUESTS: '/music/requests',
  PLAYLISTS: '/music/playlists',
  HISTORY: '/music/history',
  REVIEWS: '/music/reviews',
  EDIT_PROFILE: '/music/profile',

  // Rutas de admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  RESTAURANT_PANEL: '/admin/restaurant',
  SUPERADMIN_PANEL: '/admin/superadmin',
  QUEUE_MANAGER: '/admin/queue',

  // Rutas especiales
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404'
};

// Configuración de navegación por tipo de usuario
export const NAVIGATION_CONFIG = {
  [USER_TYPES.GUEST]: {
    allowedRoutes: [
      ROUTES.HOME,
      ROUTES.RESTAURANT_SELECTION,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.ADMIN_AUTH
    ],
    defaultRoute: ROUTES.RESTAURANT_SELECTION,
    showAuthButtons: true,
    showAdminButton: true
  },

  [USER_TYPES.REGISTERED]: {
    allowedRoutes: [
      ROUTES.HOME,
      ROUTES.RESTAURANT_SELECTION,
      ROUTES.MUSIC_APP,
      ROUTES.BROWSE_MUSIC,
      ROUTES.FAVORITES,
      ROUTES.REQUESTS,
      ROUTES.PLAYLISTS,
      ROUTES.HISTORY,
      ROUTES.REVIEWS,
      ROUTES.EDIT_PROFILE,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.ADMIN_AUTH
    ],
    defaultRoute: ROUTES.RESTAURANT_SELECTION,
    showAuthButtons: false,
    showAdminButton: true
  },

  [USER_TYPES.RESTAURANT]: {
    allowedRoutes: [
      ROUTES.ADMIN_DASHBOARD,
      ROUTES.RESTAURANT_PANEL,
      ROUTES.QUEUE_MANAGER,
      ROUTES.ADMIN_AUTH
    ],
    defaultRoute: ROUTES.RESTAURANT_PANEL,
    showAuthButtons: false,
    showAdminButton: false
  },

  [USER_TYPES.SUPERADMIN]: {
    allowedRoutes: [
      ROUTES.SUPERADMIN_PANEL,
      ROUTES.ADMIN_DASHBOARD,
      ROUTES.ADMIN_AUTH
    ],
    defaultRoute: ROUTES.SUPERADMIN_PANEL,
    showAuthButtons: false,
    showAdminButton: false
  }
};

// Configuración de navegación por modo de aplicación
export const APP_MODE_CONFIG = {
  [APP_MODES.CUSTOMER]: {
    allowedRoutes: [
      ROUTES.HOME,
      ROUTES.RESTAURANT_SELECTION,
      ROUTES.MUSIC_APP,
      ROUTES.BROWSE_MUSIC,
      ROUTES.FAVORITES,
      ROUTES.REQUESTS,
      ROUTES.PLAYLISTS,
      ROUTES.HISTORY,
      ROUTES.REVIEWS,
      ROUTES.EDIT_PROFILE,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.ADMIN_AUTH
    ],
    navbarItems: [
      { id: 'home', label: 'Inicio', icon: 'Home' },
      { id: 'browse', label: 'Música', icon: 'Music' },
      { id: 'requests', label: 'Mis Pedidos', icon: 'Clock' },
      { id: 'favorites', label: 'Favoritos', icon: 'Heart' }
    ]
  },

  [APP_MODES.ADMIN]: {
    allowedRoutes: [
      ROUTES.ADMIN_DASHBOARD,
      ROUTES.RESTAURANT_PANEL,
      ROUTES.SUPERADMIN_PANEL,
      ROUTES.QUEUE_MANAGER,
      ROUTES.ADMIN_AUTH
    ],
    navbarItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
      { id: 'queue', label: 'Cola', icon: 'List' },
      { id: 'settings', label: 'Configuración', icon: 'Settings' }
    ]
  }
};

// Utilidades para navegación
export const routeUtils = {
  // Verificar si una ruta está permitida para un usuario
  isRouteAllowed: (route, userType, appMode) => {
    const userConfig = NAVIGATION_CONFIG[userType];
    const modeConfig = APP_MODE_CONFIG[appMode];

    if (!userConfig || !modeConfig) {
      return false;
    }

    return userConfig.allowedRoutes.includes(route) ||
           modeConfig.allowedRoutes.includes(route);
  },

  // Obtener ruta por defecto para un tipo de usuario
  getDefaultRoute: (userType) => {
    return NAVIGATION_CONFIG[userType]?.defaultRoute || ROUTES.RESTAURANT_SELECTION;
  },

  // Obtener items de navegación para un modo de aplicación
  getNavbarItems: (appMode) => {
    return APP_MODE_CONFIG[appMode]?.navbarItems || [];
  },

  // Verificar si mostrar botones de autenticación
  shouldShowAuthButtons: (userType) => {
    console.log('routeUtils - shouldShowAuthButtons called with userType:', userType);
    const result = NAVIGATION_CONFIG[userType]?.showAuthButtons || false;
    console.log('routeUtils - shouldShowAuthButtons result:', result);
    return result;
  },

  // Verificar si mostrar botón de admin
  shouldShowAdminButton: (userType) => {
    return NAVIGATION_CONFIG[userType]?.showAdminButton || false;
  },

  // Obtener configuración de navegación para un usuario
  getNavigationConfig: (userType, appMode) => {
    const userConfig = NAVIGATION_CONFIG[userType];
    const modeConfig = APP_MODE_CONFIG[appMode];

    return {
      ...userConfig,
      ...modeConfig,
      userType,
      appMode
    };
  },

  // Mapear rutas a pasos de la aplicación
  routeToStep: (route) => {
    const routeMap = {
      [ROUTES.RESTAURANT_SELECTION]: 'restaurant-selection',
      [ROUTES.MUSIC_APP]: 'music-app',
      [ROUTES.ADMIN_AUTH]: 'admin-auth',
      [ROUTES.RESTAURANT_PANEL]: 'restaurant-panel',
      [ROUTES.SUPERADMIN_PANEL]: 'superadmin-panel',
      [ROUTES.LOGIN]: 'login',
      [ROUTES.REGISTER]: 'register',
      [ROUTES.EDIT_PROFILE]: 'edit-profile'
    };

    return routeMap[route] || 'home';
  },

  // Mapear pasos a rutas
  stepToRoute: (step) => {
    const stepMap = {
      'restaurant-selection': ROUTES.RESTAURANT_SELECTION,
      'music-app': ROUTES.MUSIC_APP,
      'admin-auth': ROUTES.ADMIN_AUTH,
      'restaurant-panel': ROUTES.RESTAURANT_PANEL,
      'superadmin-panel': ROUTES.SUPERADMIN_PANEL,
      'login': ROUTES.LOGIN,
      'register': ROUTES.REGISTER,
      'edit-profile': ROUTES.EDIT_PROFILE
    };

    return stepMap[step] || ROUTES.HOME;
  }
};

export default routeUtils;