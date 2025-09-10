// src/services/apiService.js - VERSION COMPLETAMENTE CORREGIDA
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configuración por defecto
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('admin_token') || 
                  localStorage.getItem('user_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Convertir body a JSON si es objeto
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Manejar respuestas no JSON (ej: texto plano, HTML de error)
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = {
          success: false,
          message: 'Server returned non-JSON response',
          status: response.status,
          statusText: response.statusText
        };
      }
      
      if (!response.ok) {
        const error = responseData || { message: 'Request failed' };
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return responseData;
      
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, {
        message: error.message,
        url,
        options: {
          ...options,
          body: options.body ? '[BODY PRESENT]' : undefined
        }
      });
      
      // Re-throw con mensaje más específico según el tipo de error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      
      if (error.message.includes('JSON')) {
        throw new Error('Server error: Invalid response format');
      }
      
      throw error;
    }
  }

  // ===== AUTHENTICATION =====
  
  async registerRestaurant(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: data
    });
    
    if (response.data?.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.data?.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  }

  async createUserSession(restaurantSlug, tableNumber = null) {
    const response = await this.request(`/auth/session/${restaurantSlug}`, {
      method: 'POST',
      body: { tableNumber }
    });
    
    if (response.data?.token) {
      localStorage.setItem('user_token', response.data.token);
      localStorage.setItem('current_session', JSON.stringify(response.data));
    }
    
    return response.data;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async updateProfile(data) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: data
    });
  }

  // ===== SONGS =====
  
  async getSongs(restaurantSlug, params = {}) {
    // Limpiar parámetros undefined
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/songs/${restaurantSlug}?${queryString}` : `/songs/${restaurantSlug}`;
    
    return await this.request(endpoint);
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }
    
    const params = new URLSearchParams({ q: query.trim(), ...options });
    return await this.request(`/songs/${restaurantSlug}/search?${params}`);
  }

  async getPopularSongs(restaurantSlug, limit = 10) {
    return await this.request(`/songs/${restaurantSlug}/popular?limit=${limit}`);
  }

  async getSongsByGenre(restaurantSlug, genre, limit = 20) {
    return await this.request(`/songs/${restaurantSlug}/genre/${genre}?limit=${limit}`);
  }

  async getSongDetails(restaurantSlug, songId) {
    return await this.request(`/songs/${restaurantSlug}/song/${songId}`);
  }

  async getGenres(restaurantSlug) {
    return await this.request(`/songs/${restaurantSlug}/genres`);
  }

  // ===== REQUESTS =====
  
  async createRequest(restaurantSlug, songId, tableNumber) {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    
    return await this.request(`/requests/${restaurantSlug}`, {
      method: 'POST',
      body: { songId, tableNumber }
    });
  }

  async getUserRequests(restaurantSlug, tableNumber = null) {
    const params = tableNumber ? new URLSearchParams({ tableNumber }) : '';
    const endpoint = params ? `/requests/${restaurantSlug}/user?${params}` : `/requests/${restaurantSlug}/user`;
    return await this.request(endpoint);
  }

  async getRestaurantQueue(restaurantSlug, params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/requests/${restaurantSlug}/queue?${queryString}` : `/requests/${restaurantSlug}/queue`;
    return await this.request(endpoint);
  }

  async cancelRequest(requestId, tableNumber) {
    if (!requestId) {
      throw new Error('Request ID is required');
    }
    
    return await this.request(`/requests/${requestId}`, {
      method: 'DELETE',
      body: { tableNumber }
    });
  }

  async updateRequestStatus(requestId, status) {
    const validStatuses = ['pending', 'playing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid request status');
    }
    
    return await this.request(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }

  async getRequestStats(restaurantSlug, period = '24h') {
    return await this.request(`/requests/${restaurantSlug}/stats?period=${period}`);
  }

  // ===== FAVORITES =====
  
  async getFavorites(userId) {
    return await this.request(`/favorites/user/${userId}`);
  }

  async toggleFavorite(userId, songId) {
    return await this.request('/favorites', {
      method: 'POST',
      body: { userId, songId }
    });
  }

  // ===== RESTAURANTS =====
  
  async getRestaurantBySlug(slug) {
    return await this.request(`/restaurants/${slug}`);
  }

  async getRestaurantStats(slug, period = '24h') {
    return await this.request(`/restaurants/${slug}/stats?period=${period}`);
  }

  // ===== UTILITY METHODS =====
  
  getCurrentSession() {
    try {
      const session = localStorage.getItem('current_session');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session from localStorage:', error);
      return null;
    }
  }

  clearSession() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('current_session');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_token');
  }

  isAuthenticated() {
    return !!(
      localStorage.getItem('admin_token') || 
      localStorage.getItem('user_token') ||
      localStorage.getItem('auth_token')
    );
  }

  getAuthToken() {
    return localStorage.getItem('admin_token') || 
           localStorage.getItem('user_token') ||
           localStorage.getItem('auth_token');
  }

  // Método para verificar la conectividad con el servidor
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Método para retry automático en caso de fallos de red
  async requestWithRetry(endpoint, options = {}, maxRetries = 2) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        lastError = error;
        
        // No reintentar en errores de cliente (4xx)
        if (error.message.includes('400') || 
            error.message.includes('401') || 
            error.message.includes('403') || 
            error.message.includes('404')) {
          throw error;
        }
        
        // Esperar antes del siguiente intento (backoff exponencial)
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  }
}

export default new ApiService();