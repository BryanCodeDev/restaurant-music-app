import React, { useState } from 'react';
import {
  User,
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Headphones,
  UserPlus,
  Heart,
  Music,
  Building2,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Shield
} from 'lucide-react';

import apiService from '../../services/apiService';

// Configuración centralizada para Register
const REGISTER_CONFIG = {
  userTypes: {
    user: {
      key: 'user',
      label: 'Usuario',
      icon: User,
      theme: {
        primary: 'emerald',
        secondary: 'teal',
        gradient: 'from-emerald-500 to-teal-600',
        hoverGradient: 'from-emerald-600 to-teal-700',
        shadowColor: 'shadow-emerald-500/25',
        textColor: 'text-emerald-300',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
      },
      validation: {
        passwordMinLength: 6,
        requiredFields: ['name', 'email', 'password', 'confirmPassword', 'acceptTerms']
      },
      features: [
        'Guardar tus canciones favoritas',
        'Crear listas de reproducción personalizadas',
        'Ver tu historial de peticiones',
        'Recibir recomendaciones musicales',
        'Conectar con otros amantes de la música'
      ]
    },
    restaurant: {
      key: 'restaurant',
      label: 'Restaurante',
      icon: Building2,
      theme: {
        primary: 'orange',
        secondary: 'yellow',
        gradient: 'from-orange-500 to-yellow-600',
        hoverGradient: 'from-orange-600 to-yellow-700',
        shadowColor: 'shadow-orange-500/25',
        textColor: 'text-orange-300',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30'
      },
      validation: {
        passwordMinLength: 8,
        requiredFields: ['restaurantName', 'ownerName', 'email', 'password', 'confirmPassword', 'address', 'acceptTerms']
      },
      features: [
        'Gestión completa de cola musical',
        'Control de reproducción en tiempo real',
        'Estadísticas detalladas de uso',
        'Panel administrativo completo',
        'Configuración personalizada'
      ]
    }
  },

  musicGenres: [
    { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
    { id: 'rock', name: 'Rock', color: 'bg-red-500' },
    { id: 'ballad', name: 'Baladas', color: 'bg-purple-500' },
    { id: 'electronic', name: 'Electrónica', color: 'bg-cyan-500' },
    { id: 'hip-hop', name: 'Hip Hop', color: 'bg-orange-500' },
    { id: 'reggaeton', name: 'Reggaeton', color: 'bg-green-500' },
    { id: 'jazz', name: 'Jazz', color: 'bg-blue-500' },
    { id: 'classical', name: 'Clásica', color: 'bg-indigo-500' },
    { id: 'country', name: 'Country', color: 'bg-yellow-500' },
    { id: 'latin', name: 'Latina', color: 'bg-emerald-500' }
  ],

  cuisineTypes: [
    'Colombiana', 'Italiana', 'Mexicana', 'Argentina', 'Asiática',
    'Mediterránea', 'Internacional', 'Comida Rápida', 'Mariscos',
    'Vegetariana', 'Fusión', 'Gourmet'
  ],

  validationRules: {
    email: {
      required: 'El email es requerido',
      invalid: 'Email inválido',
      pattern: /\S+@\S+\.\S+/
    },
    password: {
      required: 'La contraseña es requerida',
      tooShort: (minLength) => `La contraseña debe tener al menos ${minLength} caracteres`
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      mismatch: 'Las contraseñas no coinciden'
    },
    name: {
      required: 'El nombre es requerido'
    },
    restaurantName: {
      required: 'El nombre del restaurante es requerido'
    },
    ownerName: {
      required: 'El nombre del propietario es requerido'
    },
    address: {
      required: 'La dirección es requerida'
    },
    acceptTerms: {
      required: 'Debes aceptar los términos de servicio'
    }
  }
};

const Register = ({ onRegister, onSwitchToLogin, onSwitchToCustomer, isLoading, error }) => {
  const [userType, setUserType] = useState('user'); // 'user' o 'restaurant'
  const [formData, setFormData] = useState({
    // Campos comunes
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
    acceptMarketing: false,

    // Campos específicos para usuarios
    dateOfBirth: '',
    preferredGenres: [],

    // Campos específicos para restaurante
    restaurantName: '',
    address: '',
    city: '',
    country: 'Colombia',
    ownerName: '',
    businessDocument: null,
    cuisineType: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  // Obtener configuración actual del tipo de usuario
  const currentConfig = REGISTER_CONFIG.userTypes[userType];

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos
    currentConfig.validation.requiredFields.forEach(field => {
      if (!formData[field]) {
        const rule = REGISTER_CONFIG.validationRules[field];
        if (rule && rule.required) {
          newErrors[field] = rule.required;
        }
      }
    });

    // Validar email
    if (formData.email && !REGISTER_CONFIG.validationRules.email.pattern.test(formData.email)) {
      newErrors.email = REGISTER_CONFIG.validationRules.email.invalid;
    }

    // Validar contraseña
    if (formData.password) {
      const minLength = currentConfig.validation.passwordMinLength;
      if (formData.password.length < minLength) {
        newErrors.password = REGISTER_CONFIG.validationRules.password.tooShort(minLength);
      }
    }

    // Validar confirmación de contraseña
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = REGISTER_CONFIG.validationRules.confirmPassword.mismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setErrors({});

    try {
      let response;
      if (userType === 'restaurant') {
        const restaurantData = {
          name: formData.restaurantName,
          ownerName: formData.ownerName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          cuisineType: formData.cuisineType,
          description: formData.description
        };
        response = await apiService.registerRestaurant(restaurantData);
        localStorage.setItem('user_type', 'restaurant');
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          preferredGenres: formData.preferredGenres,
          preferredLanguages: ['es']
        };
        response = await apiService.registerUser(userData);
        localStorage.setItem('user_type', 'registered');
      }

      if (response.success || response.access_token) {
        if (response.needs_verification) {
          setNeedsVerification(true);
          return { needsVerification: true };
        }
        const result = await onRegister(response);
        if (result && result.success) {
          console.log('Registro exitoso desde componente Register');
          // El contexto manejará la redirección automáticamente
        }
      } else {
        throw new Error(response.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.message || 'Error al crear la cuenta';
      setErrors({ submit: errorMessage });
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setErrors({ submit: 'Email es requerido para reenviar' });
      return;
    }

    try {
      const response = await apiService.resendVerification(formData.email);
      if (response.success) {
        // Mostrar mensaje de éxito temporal
        setErrors({ submit: 'Email de verificación reenviado exitosamente. Revisa tu bandeja.' });
        setTimeout(() => setErrors({}), 5000);
      } else {
        throw new Error(response.message || 'Error al reenviar');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Error al reenviar el email de verificación' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const handleGenreToggle = (genreId) => {
    setFormData(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genreId)
        ? prev.preferredGenres.filter(g => g !== genreId)
        : [...prev.preferredGenres, genreId]
    }));
  };

  const handleToggleUserType = () => {
    const newUserType = userType === 'user' ? 'restaurant' : 'user';
    setUserType(newUserType);
    setErrors({});
    setNeedsVerification(false);

    // Limpiar campos específicos al cambiar de tipo
    setFormData(prev => ({
      ...prev,
      preferredGenres: [],
      restaurantName: '',
      address: '',
      ownerName: '',
      cuisineType: '',
      description: '',
      name: newUserType === 'user' ? prev.name : '',
      dateOfBirth: newUserType === 'user' ? prev.dateOfBirth : ''
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, businessDocument: file }));
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                currentConfig.theme.gradient
              } rounded-full opacity-20 blur-lg animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-3 md:p-4 rounded-full border border-slate-700/50">
                <currentConfig.icon className={`h-10 md:h-12 w-10 md:w-12 ${currentConfig.theme.primary}-400`} />
              </div>
            </div>
          </div>

          <h1 className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${
            currentConfig.theme.gradient.replace('500', '400').replace('600', '400')
          } bg-clip-text text-transparent mb-1 md:mb-2`}>
            {userType === 'restaurant' ? 'Registra tu Restaurante' : 'Crear Cuenta'}
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            {userType === 'restaurant'
              ? 'Únete como establecimiento y gestiona la experiencia musical'
              : 'Únete y personaliza tu experiencia musical'
            }
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-1">
            <div className="flex relative">
              {/* Toggle Background */}
              <div
                className={`absolute inset-y-1 w-1/2 bg-gradient-to-r ${
                  userType === 'restaurant'
                    ? `${REGISTER_CONFIG.userTypes.restaurant.theme.gradient.replace('500', '500/20').replace('600', '500/20')} translate-x-full ${REGISTER_CONFIG.userTypes.restaurant.theme.borderColor}`
                    : `${REGISTER_CONFIG.userTypes.user.theme.gradient.replace('500', '500/20').replace('600', '500/20')} translate-x-0 ${REGISTER_CONFIG.userTypes.user.theme.borderColor}`
                } border rounded-xl transition-all duration-300 ease-in-out`}
              />

              {/* Usuario Option */}
              <button
                type="button"
                onClick={() => userType !== 'user' && handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === 'user'
                    ? REGISTER_CONFIG.userTypes.user.theme.textColor
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Usuario</span>
              </button>

              {/* Restaurante Option */}
              <button
                type="button"
                onClick={() => userType !== 'restaurant' && handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === 'restaurant'
                    ? REGISTER_CONFIG.userTypes.restaurant.theme.textColor
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Restaurante</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
            
            {/* Campos específicos para Restaurante */}
            {userType === 'restaurant' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del restaurante *
                  </label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.restaurantName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Ej: Restaurante La Terraza"
                    disabled={isLoading}
                  />
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.restaurantName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del propietario *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.ownerName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Tu nombre completo"
                    disabled={isLoading}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.ownerName}</span>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Campo de nombre (para usuarios normales) */}
            {userType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      REGISTER_CONFIG.userTypes.user.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.name ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Tu nombre completo"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {userType === 'restaurant' ? 'Email corporativo *' : 'Email *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                  } transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={userType === 'restaurant' ? 'admin@turestaurante.com' : 'tu@email.com'}
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

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Mínimo {currentConfig.validation.passwordMinLength} caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Teléfono {userType === 'restaurant' && '*'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                  } transition-all duration-200`}
                  placeholder="+57 300 123 4567"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campos adicionales para Restaurante */}
            {userType === 'restaurant' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      REGISTER_CONFIG.userTypes.restaurant.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 ${
                      errors.address ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Dirección completa del restaurante"
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2.5 md:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        REGISTER_CONFIG.userTypes.restaurant.theme.gradient.replace('500', '500').replace('600', '500')
                      } transition-all duration-200`}
                      placeholder="Bogotá"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de cocina
                    </label>
                    <select
                      value={formData.cuisineType}
                      onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                      className={`w-full px-4 py-2.5 md:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 ${
                        REGISTER_CONFIG.userTypes.restaurant.theme.gradient.replace('500', '500').replace('600', '500')
                      } transition-all duration-200`}
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      {REGISTER_CONFIG.cuisineTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción del restaurante
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={2}
                    className={`w-full px-4 py-2.5 md:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      REGISTER_CONFIG.userTypes.restaurant.theme.gradient.replace('500', '500').replace('600', '500')
                    } transition-all duration-200 resize-none`}
                    placeholder="Cuéntanos sobre tu restaurante, ambiente y especialidades..."
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Campos adicionales para Usuario normal */}
            {userType === 'user' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha de nacimiento
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full pl-12 pr-4 py-2.5 md:py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 ${
                        REGISTER_CONFIG.userTypes.user.theme.gradient.replace('500', '500').replace('600', '500')
                      } transition-all duration-200`}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Géneros musicales favoritos */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Géneros musicales favoritos
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {REGISTER_CONFIG.musicGenres.map(genre => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => handleGenreToggle(genre.id)}
                        className={`flex items-center space-x-2 p-2.5 md:p-3 rounded-xl border transition-all duration-200 ${
                          formData.preferredGenres.includes(genre.id)
                            ? `${genre.color} bg-opacity-20 border-current text-white`
                            : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
                        }`}
                        disabled={isLoading}
                      >
                        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${genre.color} ${
                          formData.preferredGenres.includes(genre.id) ? 'opacity-100' : 'opacity-50'
                        }`}></div>
                        <span className="text-xs md:text-sm font-medium">{genre.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Selecciona tus géneros favoritos para recibir mejores recomendaciones
                  </p>
                </div>
              </>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className={`mt-1 h-4 w-4 ${
                    currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                  } border-slate-600 rounded bg-slate-800 ${
                    errors.acceptTerms ? 'ring-1 ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <div className="text-sm">
                  <span className="text-slate-300">
                    Acepto los{' '}
                    <button type="button" className={`${
                      currentConfig.theme.gradient.replace('500', '400').replace('600', '400')
                    } underline transition-colors`}>
                      términos de servicio
                    </button>{' '}
                    y la{' '}
                    <button type="button" className={`${
                      currentConfig.theme.gradient.replace('500', '400').replace('600', '400')
                    } underline transition-colors`}>
                      política de privacidad
                    </button>
                  </span>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{errors.acceptTerms}</span>
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptMarketing}
                  onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                  className={`mt-1 h-4 w-4 ${
                    currentConfig.theme.gradient.replace('500', '500').replace('600', '500')
                  } border-slate-600 rounded bg-slate-800`}
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-300">
                  Quiero recibir noticias sobre nuevas funcionalidades y ofertas especiales
                </span>
              </label>
            </div>

            {/* Submit Error */}
            {needsVerification && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Verifica tu email para completar el registro. Te enviamos un enlace.</span>
                </p>
                {isRestaurant && (
                  <p className="text-yellow-300 text-xs mt-1">
                    Después de verificar, selecciona tu plan y sube el comprobante de pago para aprobación.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="mt-2 w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reenviar verificación
                </button>
              </div>
            )}

            {(errors.submit || error) && !needsVerification && (
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
              disabled={isLoading || needsVerification}
              className={`w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r ${
                currentConfig.theme.gradient
              } hover:${currentConfig.theme.hoverGradient} ${currentConfig.theme.shadowColor} text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <currentConfig.icon className="h-5 w-5" />
                  <span>{userType === 'restaurant' ? 'Registrar Restaurante' : 'Crear Cuenta'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Features Info */}
            <div className={`mt-4 md:mt-6 p-3 md:p-4 ${
              currentConfig.theme.bgColor
            } ${currentConfig.theme.borderColor} border rounded-xl`}>
              <div className="flex items-start space-x-2 md:space-x-3">
                <Heart className={`h-4 md:h-5 w-4 md:w-5 text-red-400 mt-0.5 flex-shrink-0`} />
                <div>
                  <h4 className={`font-semibold text-sm md:text-base ${
                    currentConfig.theme.gradient.replace('500', '400').replace('600', '400')
                  } mb-1.5 md:mb-2`}>
                    {userType === 'restaurant' ? 'Tu restaurante tendrá' : 'Con tu cuenta puedes'}
                  </h4>
                  <ul className="text-xs md:text-sm text-slate-300 space-y-0.5 md:space-y-1">
                    {currentConfig.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">
                    <span className="font-medium text-blue-400">Seguridad garantizada:</span>
                    Todos tus datos están protegidos con encriptación de última generación.
                  </p>
                  {isRestaurant && (
                    <p className="text-xs text-slate-500 mt-1">
                      Tu restaurante será verificado en 24-48 horas para garantizar la calidad del servicio.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={`${
                currentConfig.theme.gradient.replace('500', '400').replace('600', '400')
              } font-medium transition-colors`}
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </p>

          {onSwitchToCustomer && (
            <>
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-slate-500 text-sm">o</span>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>

              <button
                type="button"
                onClick={onSwitchToCustomer}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all duration-300"
                disabled={isLoading}
              >
                {userType === 'restaurant' ? <Headphones className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                <span>{userType === 'restaurant' ? 'Acceso como Usuario' : 'Continuar como Invitado'}</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Al crear tu cuenta, aceptas nuestros términos de servicio y política de privacidad.
              <br />
              {userType === 'restaurant'
                ? 'Procesamos tu información de forma segura para verificar tu establecimiento.'
                : 'Tus preferencias musicales nos ayudan a personalizar tu experiencia.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
