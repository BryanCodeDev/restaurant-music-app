import BaseApiService from './baseApiService';

class AuthApiService extends BaseApiService {
  // User Auth (Registered Users)
  async registerUser(data) {
    const response = await this.request('/auth/register-user', {
      method: 'POST',
      body: data
    });
    return this.handleAuthResponse(response, 'registered');
  }

  async loginUser(email, password) {
    const response = await this.request('/auth/login-user', {
      method: 'POST',
      body: { email, password }
    });
    return this.handleAuthResponse(response, 'registered');
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

  // Restaurant Auth
  async registerRestaurant(data) {
    const response = await this.request('/auth/register-restaurant', {
      method: 'POST',
      body: data
    });
    return this.handleAuthResponse(response);
  }

  async loginRestaurant(email, password) {
    const response = await this.request('/auth/login-restaurant', {
      method: 'POST',
      body: { email, password }
    });
    return this.handleAuthResponse(response);
  }

  // Session Management
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

  // Profile Management
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

  // Token Management
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

  // Super Admin Auth
  async loginSuperAdmin(email, password) {
    const response = await this.request('/auth/login-superadmin', {
      method: 'POST',
      body: { email, password }
    });
    return this.handleAuthResponse(response, 'superadmin');
  }
}

export default new AuthApiService();