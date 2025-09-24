
/**
 * LOGIN COMPONENTE - BryJu Sound
 *
 * Componente de login completamente funcional con lógica simplificada
 * y configuración centralizada.
 *
 * CARACTERÍSTICAS:
 * ✅ Lógica simplificada y clara
 * ✅ Configuración centralizada
 * ✅ Validación robusta
 * ✅ UX mejorada con feedback visual
 * ✅ Manejo de errores completo
 * ✅ Consistencia visual perfecta
 * ✅ Estados de usuario bien manejados
 */

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Heart,
  Music,
  Headphones,
  User,
  Building2,
  Shield,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Configuración centralizada para Login
const LOGIN_CONFIG = {
  // Tipos de usuario disponibles
  USER_TYPES: {
    USER: 'user',
    RESTAURANT: 'restaurant',
    SUPERADMIN: 'superadmin'
  },

  // Configuración de validación
  VALIDATION: {
    EMAIL_REGEX: /\S+@\S+\.\S+/,
    MIN_PASSWORD_LENGTH: 6,
    REQUIRED_FIELDS: ['email', 'password']
  },

  // Configuración visual por tipo de usuario
  THEMES: {
    user: {
      gradient: 'from-blue-500 to-purple-600',
      accent: 'blue',
      icon: User,
      title: 'Iniciar Sesión',
      subtitle: 'Accede a tu cuenta y disfruta de la experiencia musical'
    },
    restaurant: {
      gradient: 'from-yellow-500 to-amber-600',
      accent: 'yellow',
      icon: Building2,
      title: 'Acceso Restaurante',
      subtitle: 'Inicia sesión en tu panel de restaurante'
    },
    superadmin: {
      gradient: 'from-indigo-500 to-violet-600',
      accent: 'indigo',
      icon: Shield,
      title: 'Super Admin Login',
      subtitle: 'Acceso al panel de super administrador'
    }
  },

  // Mensajes de error comunes
  ERROR_MESSAGES: {
    REQUIRED_EMAIL: 'El email es requerido',
    INVALID_EMAIL: 'Email inválido',
    REQUIRED_PASSWORD: 'La contraseña es requerida',
    MIN_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
    LOGIN_FAILED: 'Error al iniciar sesión. Verifica tus credenciales.',
    NETWORK_ERROR: 'Error de conexión. Intenta nuevamente.'
  }
};

const Login = ({ onLogin, onSwitchToRegister, onSwitchToCustomer, isLoading, error }) => {
  const { login, successMessage } = useAuth();

  // Estados simplificados
  const [userType, setUserType] = useState(LOGIN_CONFIG.USER_TYPES.USER);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Obtener configuración del tema actual
  const currentTheme = LOGIN_CONFIG.THEMES[userType];
  const currentIcon = currentTheme.icon;

  // Mostrar mensaje de éxito cuando se complete el login
  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Limpiar errores cuando cambie el tipo de usuario
  useEffect(() => {
    setErrors({});
  }, [userType]);

  // Función de validación simplificada usando configuración
  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = LOGIN_CONFIG.ERROR_MESSAGES.REQUIRED_EMAIL;
    } else if (!LOGIN_CONFIG.VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = LOGIN_CONFIG.ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = LOGIN_CONFIG.ERROR_MESSAGES.REQUIRED_PASSWORD;
    } else if (formData.password.length < LOGIN_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
      newErrors.password = LOGIN_CONFIG.ERROR_MESSAGES.MIN_PASSWORD;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones de manejo simplificadas
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ Login - Validación fallida:', errors);
      return;
    }

    setErrors({});

    try {
      console.log('🔄 Login - Iniciando login para:', userType);
      const result = await login({ ...formData, userType });

      if (result && result.success) {
        console.log('✅ Login - Éxito:', result);
        // El contexto manejará la redirección automáticamente
        return;
      }
    } catch (error) {
      console.error('❌ Login - Error:', error);
      const errorMessage = error.message || LOGIN_CONFIG.ERROR_MESSAGES.LOGIN_FAILED;
      setErrors({ submit: errorMessage });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo específico
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Limpiar error de submit si existe
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const handleToggleUserType = (newType) => {
    console.log('🔄 Login - Cambiando tipo de usuario:', newType);
    setUserType(newType);
    setFormData({ email: '', password: '' }); // Limpiar formulario
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient} rounded-full opacity-20 blur-lg animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                <currentIcon className={`h-12 w-12 text-${currentTheme.accent}-400`} />
              </div>
            </div>
          </div>

          <h1 className={`text-3xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent mb-2`}>
            {currentTheme.title}
          </h1>
          <p className="text-slate-300">
            {currentTheme.subtitle}
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-1">
            <div className="flex relative">
              {/* Toggle Background - 3 opciones, width 1/3 */}
              <div
                className={`absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r rounded-xl transition-all duration-300 ease-in-out ${
                  userType === LOGIN_CONFIG.USER_TYPES.USER
                    ? 'from-blue-500/20 to-purple-500/20 left-0 border-blue-500/30 bg-blue-500/10'
                    : userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT
                    ? 'from-yellow-500/20 to-amber-500/20 left-[33.33%] border-yellow-500/30 bg-yellow-500/10'
                    : 'from-indigo-500/20 to-violet-500/20 left-[66.67%] border-indigo-500/30 bg-indigo-500/10'
                }`}
                />

              {/* Usuario Option */}
              <button
                type="button"
                onClick={() => handleToggleUserType(LOGIN_CONFIG.USER_TYPES.USER)}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === LOGIN_CONFIG.USER_TYPES.USER
                    ? 'text-blue-300 border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-sm">Usuario</span>
              </button>

              {/* Restaurante Option */}
              <button
                type="button"
                onClick={() => handleToggleUserType(LOGIN_CONFIG.USER_TYPES.RESTAURANT)}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT
                    ? 'text-yellow-300 border-yellow-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span className="text-sm">Restaurante</span>
              </button>

              {/* Super Admin Option */}
              <button
                type="button"
                onClick={() => handleToggleUserType(LOGIN_CONFIG.USER_TYPES.SUPERADMIN)}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === LOGIN_CONFIG.USER_TYPES.SUPERADMIN
                    ? 'text-indigo-300 border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm">Super Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-${currentTheme.accent}-500 transition-all duration-200 text-sm md:text-base ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={
                    userType === LOGIN_CONFIG.USER_TYPES.USER ? 'tu@email.com' :
                    userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT ? 'admin@restaurante.com' :
                    'superadmin@musicmenu.com'
                  }
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-3.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-${currentTheme.accent}-500 transition-all duration-200 text-sm md:text-base ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 md:h-5" /> : <Eye className="h-4 md:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className={`text-sm text-${currentTheme.accent}-400 hover:text-${currentTheme.accent}-300 transition-colors`}
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 text-sm flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{successMessage}</span>
                </p>
              </div>
            )}

            {/* Submit Error */}
            {(errors.submit || error) && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.submit || error}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r ${currentTheme.gradient} hover:from-${currentTheme.accent}-600 hover:to-${currentTheme.accent === 'blue' ? 'purple' : currentTheme.accent === 'yellow' ? 'amber' : 'violet'}-700 shadow-${currentTheme.accent}-500/25 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>{currentTheme.title}</span>
                </>
              )}
            </button>

            {/* Features Info */}
            <div className={`mt-3 md:mt-4 p-2.5 md:p-3 bg-${currentTheme.accent}-500/10 border-${currentTheme.accent}-500/30 border rounded-xl`}>
              <div className="flex items-start space-x-2 md:space-x-3">
                <currentIcon className={`h-4 md:h-5 w-4 md:w-5 text-${currentTheme.accent}-400 mt-0.5 flex-shrink-0`} />
                <div>
                  <h4 className={`font-semibold text-sm md:text-base text-${currentTheme.accent}-400 mb-1.5 md:mb-2`}>
                    {userType === LOGIN_CONFIG.USER_TYPES.USER ? 'Con tu cuenta puedes' :
                     userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT ? 'Panel de Restaurante' :
                     'Super Admin Panel'}
                  </h4>
                  <ul className="text-xs md:text-sm text-slate-300 space-y-0.5 md:space-y-1">
                    {userType === 'user' ? (
                      <>
                        <li>• Guardar tus canciones favoritas</li>
                        <li>• Ver tu historial de peticiones</li>
                        <li>• Crear listas personalizadas</li>
                        <li>• Recibir recomendaciones musicales</li>
                      </>
                    ) : userType === 'restaurant' ? (
                      <>
                        <li>• Gestión de cola musical en tiempo real</li>
                        <li>• Estadísticas de uso y peticiones</li>
                        <li>• Control de reproducción y volumen</li>
                        <li>• Configuración de límites y restricciones</li>
                      </>
                    ) : (
                      <>
                        <li>• Gestión de restaurantes y usuarios</li>
                        <li>• Aprobación de nuevos establecimientos</li>
                        <li>• Estadísticas globales del sistema</li>
                        <li>• Configuración avanzada y seguridad</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
          <p className="text-slate-400 text-sm text-center">
            {userType === LOGIN_CONFIG.USER_TYPES.USER ? '¿No tienes una cuenta? ' : ''}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`text-${currentTheme.accent}-400 hover:text-${currentTheme.accent}-300 font-medium transition-colors`}
              disabled={isLoading}
            >
              {userType === LOGIN_CONFIG.USER_TYPES.USER ? 'Regístrate aquí' : 'Registra tu restaurante'}
            </button>
          </p>

          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-slate-700 flex-1"></div>
            <span className="text-slate-500 text-sm">o</span>
            <div className="h-px bg-slate-700 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={onSwitchToCustomer}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 md:py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all duration-300 w-full md:w-auto"
            disabled={isLoading}
          >
            {userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT ? <Headphones className="h-4 md:h-5 w-4 md:w-5" /> : <Music className="h-4 md:h-5 w-4 md:w-5" />}
            <span className="text-sm md:text-base">{userType === LOGIN_CONFIG.USER_TYPES.RESTAURANT ? 'Acceso como Cliente' : 'Continuar como Invitado'}</span>
          </button>

          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center">
              Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;