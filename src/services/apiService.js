// src/services/apiService.js
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
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== AUTHENTICATION =====
  
  async registerRestaurant(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: data
    });
    
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    
    return response.data;
  }

  async createUserSession(restaurantSlug, tableNumber = null) {
    const response = await this.request(`/auth/session/${restaurantSlug}`, {
      method: 'POST',
      body: { tableNumber }
    });
    
    if (response.data.token) {
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
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/songs/${restaurantSlug}?${queryString}` : `/songs/${restaurantSlug}`;
    return await this.request(endpoint);
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
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
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/requests/${restaurantSlug}/queue?${queryString}` : `/requests/${restaurantSlug}/queue`;
    return await this.request(endpoint);
  }

  async cancelRequest(requestId, tableNumber) {
    return await this.request(`/requests/${requestId}`, {
      method: 'DELETE',
      body: { tableNumber }
    });
  }

  async updateRequestStatus(requestId, status) {
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

  // ===== UTILITY METHODS =====
  
  getCurrentSession() {
    try {
      return JSON.parse(localStorage.getItem('current_session') || 'null');
    } catch {
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

  getAuthToken() {
    return localStorage.getItem('admin_token') || localStorage.getItem('user_token');
  }
}

export default new ApiService();