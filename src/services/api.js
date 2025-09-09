// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
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

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  }

  // Métodos de autenticación
  async createUserSession(restaurantSlug, tableNumber) {
    const response = await this.request(`/auth/session/${restaurantSlug}`, {
      method: 'POST',
      body: { tableNumber }
    });
    
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.token);
      this.token = response.data.token;
    }
    
    return response.data;
  }

  // Métodos de canciones
  async getSongs(restaurantSlug, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/songs/${restaurantSlug}?${queryString}`);
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    return this.request(`/songs/${restaurantSlug}/search?${params}`);
  }

  async getPopularSongs(restaurantSlug, limit = 10) {
    return this.request(`/songs/${restaurantSlug}/popular?limit=${limit}`);
  }

  // Métodos de peticiones
  async createRequest(restaurantSlug, songId, tableNumber) {
    return this.request(`/requests/${restaurantSlug}`, {
      method: 'POST',
      body: { songId, tableNumber }
    });
  }

  async getUserRequests(restaurantSlug, tableNumber) {
    const params = new URLSearchParams({ tableNumber });
    return this.request(`/requests/${restaurantSlug}/user?${params}`);
  }

  async cancelRequest(requestId, tableNumber) {
    return this.request(`/requests/${requestId}`, {
      method: 'DELETE',
      body: { tableNumber }
    });
  }
}

export default new ApiService();