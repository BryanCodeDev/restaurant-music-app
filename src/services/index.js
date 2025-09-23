// API Services - Export centralizado
export { default as authApi } from './authApiService';
export { default as adminApi } from './adminApiService';
export { default as restaurantApi } from './restaurantApiService';
export { default as musicApi } from './musicApiService';
export { default as reviewApi } from './reviewApiService';

// Base service (para funcionalidades compartidas)
export { default as BaseApiService } from './baseApiService';

// Legacy - mantener compatibilidad
export { default as apiService } from './apiService';

// Re-export del servicio principal para compatibilidad
export { default } from './apiService';