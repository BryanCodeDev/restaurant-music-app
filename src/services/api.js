// src/services/apiService.js - SOLO API REAL, SIN SIMULACIONES
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token si existe
    const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Convertir body a JSON si es objeto
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
      
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error.message);
      throw error;
    }
  }

  // ===== RESTAURANTS =====
  async getRestaurants() {
    return await this.request('/restaurants');
  }

  async getRestaurantBySlug(slug) {
    return await this.request(`/restaurants/${slug}`);
  }

  // ===== AUTHENTICATION =====
  async registerRestaurant(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: data
    });
    
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
    }
    
    return response;
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
    }
    
    return response;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  // ===== USER SESSIONS =====
  async createUserSession(restaurantSlug, tableNumber = null) {
    const response = await this.request(`/auth/session`, {
      method: 'POST',
      body: { 
        restaurantSlug,
        tableNumber: tableNumber || `Mesa #${Math.floor(Math.random() * 20) + 1}`
      }
    });
    
    if (response.token) {
      localStorage.setItem('user_token', response.token);
      localStorage.setItem('current_session', JSON.stringify(response));
    }
    
    return response;
  }

  // ===== SONGS =====
  async getSongs(restaurantSlug, params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/songs/${restaurantSlug}${queryString ? `?${queryString}` : ''}`;
    
    return await this.request(endpoint);
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    const params = new URLSearchParams({ 
      q: query.trim(), 
      ...options 
    }).toString();
    
    return await this.request(`/songs/${restaurantSlug}/search?${params}`);
  }

  async getPopularSongs(restaurantSlug, limit = 10) {
    return await this.request(`/songs/${restaurantSlug}/popular?limit=${limit}`);
  }

  async getSongsByGenre(restaurantSlug, genre, limit = 20) {
    return await this.request(`/songs/${restaurantSlug}/genre/${genre}?limit=${limit}`);
  }

  // ===== REQUESTS =====
  async createRequest(restaurantSlug, songId, tableNumber) {
    return await this.request(`/requests`, {
      method: 'POST',
      body: { 
        restaurantSlug,
        songId, 
        tableNumber 
      }
    });
  }

  async getUserRequests(restaurantSlug, tableNumber) {
    const params = new URLSearchParams({ 
      restaurantSlug,
      tableNumber 
    }).toString();
    
    return await this.request(`/requests/user?${params}`);
  }

  async getRestaurantQueue(restaurantSlug) {
    return await this.request(`/requests/${restaurantSlug}/queue`);
  }

  async cancelRequest(requestId) {
    return await this.request(`/requests/${requestId}`, {
      method: 'DELETE'
    });
  }

  async updateRequestStatus(requestId, status) {
    return await this.request(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }

  async updateRequestPosition(requestId, position) {
    return await this.request(`/requests/${requestId}/position`, {
      method: 'PATCH',
      body: { position }
    });
  }

  // ===== FAVORITES =====
  async getFavorites(userId) {
    return await this.request(`/favorites/${userId}`);
  }

  async toggleFavorite(userId, songId) {
    return await this.request(`/favorites`, {
      method: 'POST',
      body: { userId, songId }
    });
  }

  // ===== UTILITIES =====
  getCurrentSession() {
    try {
      const session = localStorage.getItem('current_session');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session:', error);
      return null;
    }
  }

  clearSession() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('current_session');
    localStorage.removeItem('admin_token');
  }

  isAuthenticated() {
    return !!(localStorage.getItem('admin_token') || localStorage.getItem('user_token'));
  }

  // Verificar conectividad
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new ApiService();