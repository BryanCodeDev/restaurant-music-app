// src/services/apiService.js - VERSIÓN COMPLETAMENTE CORREGIDA
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

    // CORREGIDO: Usar un solo sistema de tokens
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Convertir body a JSON si es objeto
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Manejar respuestas no JSON
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

  // ===== AUTHENTICATION - CORREGIDO =====
  
  async registerRestaurant(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: data
    });
    
    // CORREGIDO: Manejar estructura correcta { success, data: { restaurant, token } }
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    }
    
    return response;
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    }
    
    return response;
  }

  // CORREGIDO: Endpoint correcto para sesión de usuario
  async createUserSession(restaurantSlug, tableNumber = null) {
    const response = await this.request(`/auth/session/${restaurantSlug}`, {
      method: 'POST',
      body: { tableNumber }
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_session', JSON.stringify(response.data));
      return response.data;
    }
    
    return response;
  }

  async getProfile() {
    const response = await this.request('/auth/profile');
    return response.success ? response.data : response;
  }

  async updateProfile(data) {
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  // ===== SONGS - CORREGIDO =====
  
  async getSongs(restaurantSlug, params = {}) {
    // Limpiar parámetros undefined
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/songs/${restaurantSlug}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }
    
    const params = new URLSearchParams({ q: query.trim(), ...options });
    const response = await this.request(`/songs/${restaurantSlug}/search?${params}`);
    return response.success ? response.data : response;
  }

  async getPopularSongs(restaurantSlug, limit = 10) {
    const response = await this.request(`/songs/${restaurantSlug}/popular?limit=${limit}`);
    return response.success ? response.data : response;
  }

  async getSongsByGenre(restaurantSlug, genre, limit = 20) {
    const response = await this.request(`/songs/${restaurantSlug}/genre/${genre}?limit=${limit}`);
    return response.success ? response.data : response;
  }

  async getSongDetails(restaurantSlug, songId) {
    const response = await this.request(`/songs/${restaurantSlug}/song/${songId}`);
    return response.success ? response.data : response;
  }

  async getGenres(restaurantSlug) {
    const response = await this.request(`/songs/${restaurantSlug}/genres`);
    return response.success ? response.data : response;
  }

  // ===== REQUESTS - CORREGIDO =====
  
  async createRequest(restaurantSlug, songId, tableNumber) {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    
    // CORREGIDO: Usar endpoint correcto que coincide con requestController.js
    const response = await this.request(`/requests/${restaurantSlug}`, {
      method: 'POST',
      body: { songId, tableNumber }
    });
    
    return response.success ? response.data : response;
  }

  async getUserRequests(restaurantSlug, tableNumber = null) {
    const params = tableNumber ? `?tableNumber=${encodeURIComponent(tableNumber)}` : '';
    const response = await this.request(`/requests/${restaurantSlug}/user${params}`);
    return response.success ? response.data : response;
  }

  async getRestaurantQueue(restaurantSlug, params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/requests/${restaurantSlug}/queue${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async cancelRequest(requestId, tableNumber) {
    if (!requestId) {
      throw new Error('Request ID is required');
    }
    
    const response = await this.request(`/requests/${requestId}`, {
      method: 'DELETE',
      body: { tableNumber }
    });
    return response.success ? response.data : response;
  }

  async updateRequestStatus(requestId, status) {
    const validStatuses = ['pending', 'playing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid request status');
    }
    
    const response = await this.request(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: { status }
    });
    return response.success ? response.data : response;
  }

  async getRequestStats(restaurantSlug, period = '24h') {
    const response = await this.request(`/requests/${restaurantSlug}/stats?period=${period}`);
    return response.success ? response.data : response;
  }

  // ===== FAVORITES =====
  
  async getFavorites(userId) {
    const response = await this.request(`/favorites/user/${userId}`);
    return response.success ? response.data : response;
  }

  async toggleFavorite(userId, songId) {
    const response = await this.request('/favorites', {
      method: 'POST',
      body: { userId, songId }
    });
    return response.success ? response.data : response;
  }

  // ===== RESTAURANTS =====
  
  async getRestaurantBySlug(slug) {
    const response = await this.request(`/restaurants/${slug}`);
    return response.success ? response.data : response;
  }

  async getRestaurantStats(slug, period = '24h') {
    const response = await this.request(`/restaurants/${slug}/stats?period=${period}`);
    return response.success ? response.data : response;
  }

  // ===== UTILITY METHODS - CORREGIDO =====
  
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
    // CORREGIDO: Limpiar todos los tipos de tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_session');
    // Limpiar tokens antiguos también
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
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