// src/services/apiService.js - VERSIÓN UNIFICADA
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

    // Sistema unificado de tokens
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
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error.message);
      
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
  
  // Restaurant Auth
  async registerRestaurant(data) {
    const response = await this.request('/auth/register-restaurant', {
      method: 'POST',
      body: data
    });
    
    if (response.success && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } else if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login-restaurant', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.success && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } else if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  }

  // User Auth (Registered Users)
  async registerUser(data) {
    const response = await this.request('/auth/register-user', {
      method: 'POST',
      body: data
    });
    
    if (response.success && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_type', 'registered');
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } else if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_type', 'registered');
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  }

  async loginUser(email, password) {
    const response = await this.request('/auth/login-user', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.success && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_type', 'registered');
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } else if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_type', 'registered');
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  }

  async getUserProfile() {
    const userType = localStorage.getItem('user_type');
    if (!userType || userType !== 'registered') {
      throw new Error('User profile only available for registered users');
    }
    const response = await this.request('/auth/profile-user');
    return response.success ? response.data : response;
  }

  async updateUserProfile(data) {
    const userType = localStorage.getItem('user_type');
    if (!userType || userType !== 'registered') {
      throw new Error('User profile update only for registered users');
    }
    const response = await this.request('/auth/profile-user', {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  async createUserSession(restaurantSlug, tableNumber = null) {
    const response = await this.request(`/auth/session/${restaurantSlug}`, {
      method: 'POST',
      body: { 
        tableNumber: tableNumber || `Mesa #${Math.floor(Math.random() * 20) + 1}`
      }
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_session', JSON.stringify(response.data));
      return response.data;
    } else if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('current_session', JSON.stringify(response));
    }
    
    return response;
  }

  async getProfile() {
    const userType = localStorage.getItem('user_type');
    if (userType === 'registered') {
      return await this.getUserProfile();
    }
    // Default to restaurant or session profile
    const response = await this.request('/auth/profile');
    return response.success ? response.data : response;
  }

  async updateProfile(data) {
    const userType = localStorage.getItem('user_type');
    if (userType === 'registered') {
      return await this.updateUserProfile(data);
    }
    // Default to restaurant or session profile
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  // ===== RESTAURANTS =====
  
  async getPublicRestaurants(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/restaurants${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async getRestaurantBySlug(slug) {
    const response = await this.request(`/restaurants/${slug}`);
    return response.success ? response.data : response;
  }

  async getRestaurantStats(slug, period = '24h') {
    const response = await this.request(`/restaurants/${slug}/stats?period=${period}`);
    return response.success ? response.data : response;
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

  // ===== REQUESTS =====
  
  async createRequest(restaurantSlug, songId, tableNumber) {
    if (!songId) {
      throw new Error('Song ID is required');
    }
    
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

  async updateRequestPosition(requestId, position) {
    const response = await this.request(`/requests/${requestId}/position`, {
      method: 'PATCH',
      body: { position }
    });
    return response.success ? response.data : response;
  }

  async getRequestStats(restaurantSlug, period = '24h') {
    const response = await this.request(`/requests/${restaurantSlug}/stats?period=${period}`);
    return response.success ? response.data : response;
  }

  // ===== FAVORITES =====
  
  async getFavorites(userId, userType = 'guest') {
    const params = new URLSearchParams({ userType });
    const response = await this.request(`/favorites/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  async toggleFavorite(userId, songId, userType = 'guest', restaurantId) {
    const body = {
      userId,
      songId,
      userType,
      restaurantId
    };
    const response = await this.request('/favorites/toggle', {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  // ===== PLAYLISTS =====
  
  async createPlaylist(userId, name, description = '', isPublic = false) {
    const body = { name, description, isPublic };
    const response = await this.request(`/playlists/user/${userId}`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getUserPlaylists(userId, limit = 10, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    const response = await this.request(`/playlists/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  async addSongToPlaylist(playlistId, songId, position = null) {
    const body = { songId, position };
    const response = await this.request(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getPlaylistSongs(playlistId) {
    const response = await this.request(`/playlists/${playlistId}/songs`);
    return response.success ? response.data : response;
  }

  // ===== LISTENING HISTORY =====
  
  async getListeningHistory(userId, limit = 50, fromDate = null) {
    const params = new URLSearchParams({ limit });
    if (fromDate) {
      params.append('fromDate', fromDate);
    }
    const response = await this.request(`/history/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  // ===== RESTAURANT REVIEWS =====
  
  async createReview(restaurantId, rating, title = '', comment = '', musicRating = null, serviceRating = null, ambianceRating = null) {
    const body = {
      rating,
      title,
      comment,
      musicRating,
      serviceRating,
      ambianceRating
    };
    const response = await this.request(`/reviews/restaurants/${restaurantId}`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getRestaurantReviews(restaurantId, limit = 10, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    const response = await this.request(`/reviews/restaurants/${restaurantId}?${params}`);
    return response.success ? response.data : response;
  }

  async updateReview(reviewId, data) {
    const response = await this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  // ===== UTILITIES =====
  
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_session');
    localStorage.removeItem('user_type');
    localStorage.removeItem('admin_token'); // Legacy
    localStorage.removeItem('user_token');  // Legacy
  }

  async refreshAuthToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.request('/auth/refresh', {
        method: 'POST',
        body: { refresh_token: refreshToken }
      });

      if (response.success && response.data?.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response.data.access_token;
      }
      return null;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

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
        
        // Esperar antes del siguiente intento
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  }
}

export default new ApiService();