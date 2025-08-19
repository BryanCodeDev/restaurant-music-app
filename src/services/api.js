// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions' 
  : 'http://localhost:8888/.netlify/functions';

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ===== SONGS API =====
export const songsAPI = {
  // Obtener todas las canciones
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/songs', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching songs: ${error.message}`);
    }
  },

  // Obtener canción por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/songs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching song: ${error.message}`);
    }
  },

  // Buscar canciones
  search: async (query, filters = {}) => {
    try {
      const params = { search: query, ...filters };
      const response = await apiClient.get('/songs', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error searching songs: ${error.message}`);
    }
  },

  // Filtrar por género
  getByGenre: async (genre, limit = 50) => {
    try {
      const params = { genre, limit };
      const response = await apiClient.get('/songs', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching songs by genre: ${error.message}`);
    }
  },

  // Obtener canciones populares
  getPopular: async (limit = 10) => {
    try {
      const params = { limit, sort: 'popularity' };
      const response = await apiClient.get('/songs', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching popular songs: ${error.message}`);
    }
  }
};

// ===== REQUESTS API =====
export const requestsAPI = {
  // Crear nueva petición
  create: async (requestData) => {
    try {
      const response = await apiClient.post('/requests', requestData);
      return response.data;
    } catch (error) {
      throw new Error(`Error creating request: ${error.message}`);
    }
  },

  // Obtener cola actual
  getQueue: async (restaurantId) => {
    try {
      const params = { restaurant_id: restaurantId, status: 'pending' };
      const response = await apiClient.get('/requests', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching queue: ${error.message}`);
    }
  },

  // Obtener peticiones de un usuario
  getByUser: async (userId) => {
    try {
      const params = { user_id: userId };
      const response = await apiClient.get('/requests', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching user requests: ${error.message}`);
    }
  },

  // Actualizar estado de petición
  updateStatus: async (requestId, status) => {
    try {
      const response = await apiClient.put(`/requests/${requestId}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating request: ${error.message}`);
    }
  },

  // Cancelar petición
  cancel: async (requestId) => {
    try {
      const response = await apiClient.delete(`/requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error cancelling request: ${error.message}`);
    }
  },

  // Mover petición al inicio de la cola
  moveToTop: async (requestId) => {
    try {
      const response = await apiClient.put(`/requests/${requestId}/move-top`);
      return response.data;
    } catch (error) {
      throw new Error(`Error moving request to top: ${error.message}`);
    }
  }
};

// ===== FAVORITES API =====
export const favoritesAPI = {
  // Obtener favoritos de usuario
  getByUser: async (userId) => {
    try {
      const params = { user_id: userId };
      const response = await apiClient.get('/favorites', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching favorites: ${error.message}`);
    }
  },

  // Agregar a favoritos
  add: async (userId, songId) => {
    try {
      const response = await apiClient.post('/favorites', { user_id: userId, song_id: songId });
      return response.data;
    } catch (error) {
      throw new Error(`Error adding favorite: ${error.message}`);
    }
  },

  // Remover de favoritos
  remove: async (userId, songId) => {
    try {
      const response = await apiClient.delete('/favorites', { 
        data: { user_id: userId, song_id: songId } 
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error removing favorite: ${error.message}`);
    }
  },

  // Toggle favorito
  toggle: async (userId, songId) => {
    try {
      const response = await apiClient.post('/favorites/toggle', { 
        user_id: userId, 
        song_id: songId 
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error toggling favorite: ${error.message}`);
    }
  }
};

// ===== RESTAURANTS API =====
export const restaurantsAPI = {
  // Obtener restaurante actual
  getCurrent: async (slug = 'la-terraza-musical') => {
    try {
      const response = await apiClient.get(`/restaurants/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching restaurant: ${error.message}`);
    }
  },

  // Obtener estadísticas
  getStats: async (restaurantId) => {
    try {
      const response = await apiClient.get(`/restaurants/${restaurantId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching restaurant stats: ${error.message}`);
    }
  }
};

// ===== USERS API =====
export const usersAPI = {
  // Crear sesión de usuario/mesa
  createSession: async (tableNumber, restaurantId) => {
    try {
      const response = await apiClient.post('/users', { 
        table_number: tableNumber,
        restaurant_id: restaurantId
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error creating user session: ${error.message}`);
    }
  },

  // Obtener usuario actual
  getCurrent: async (sessionId) => {
    try {
      const response = await apiClient.get(`/users/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching current user: ${error.message}`);
    }
  }
};

// ===== UTILITY FUNCTIONS =====
export const apiUtils = {
  // Función para manejar errores de API de manera consistente
  handleError: (error) => {
    if (error.response) {
      // Error del servidor
      return {
        message: error.response.data?.message || 'Error del servidor',
        status: error.response.status,
        type: 'server_error'
      };
    } else if (error.request) {
      // Error de red
      return {
        message: 'Error de conexión. Verifica tu internet.',
        type: 'network_error'
      };
    } else {
      // Otro error
      return {
        message: error.message || 'Error desconocido',
        type: 'unknown_error'
      };
    }
  },

  // Función para formatear tiempo
  formatDuration: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // Función para debounce en búsquedas
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Configuración global
export const API_CONFIG = {
  RESTAURANT_ID: 'rest-001',
  MAX_REQUESTS_PER_USER: 2,
  SEARCH_DEBOUNCE_MS: 300,
  REQUEST_TIMEOUT_MS: 10000
};

export default {
  songs: songsAPI,
  requests: requestsAPI,
  favorites: favoritesAPI,
  restaurants: restaurantsAPI,
  users: usersAPI,
  utils: apiUtils,
  config: API_CONFIG
};