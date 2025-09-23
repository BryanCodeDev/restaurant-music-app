// Base API Service - Funcionalidades compartidas por todos los módulos
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class BaseApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
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
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
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
        let errorMessage = responseData?.message || 'Request failed';

        // Manejo específico de errores de auth
        if (response.status === 409) {
          errorMessage = 'El email ya está registrado. ¿Iniciar sesión?';
        }

        throw new Error(errorMessage);
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

  // Helper para formatear duración Spotify (ms a mm:ss)
  formatDuration(ms) {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Helper para formatear parámetros de consulta
  buildQueryString(params = {}) {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    return new URLSearchParams(cleanParams).toString();
  }

  // Helper para manejar respuestas de autenticación
  handleAuthResponse(response, userType = null) {
    if (response.success && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      if (userType) {
        localStorage.setItem('user_type', userType);
      }
      return response.data;
    } else if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      if (userType) {
        localStorage.setItem('user_type', userType);
      }
    }
    return response;
  }

  // Utilidades de localStorage
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

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // Health check
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

  // Request with retry logic
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

export default BaseApiService;