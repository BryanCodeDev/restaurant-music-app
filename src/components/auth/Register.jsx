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

const Register = ({ onRegister, onSwitchToLogin, onSwitchToCustomer, isLoading, error }) => {
  const [isRestaurant, setIsRestaurant] = useState(false); // false = Usuario registrado, true = Restaurante
  const [formData, setFormData] = useState({
    // Campos comunes
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Campos específicos para usuarios registrados
    dateOfBirth: '',
    preferredGenres: [],
    acceptTerms: false,
    acceptMarketing: false,
    
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

  const musicGenres = [
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
  ];

  const cuisineTypes = [
    'Colombiana', 'Italiana', 'Mexicana', 'Argentina', 'Asiática', 
    'Mediterránea', 'Internacional', 'Comida Rápida', 'Mariscos', 
    'Vegetariana', 'Fusión', 'Gourmet'
  ];

  const validateUserForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos de servicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRestaurantForm = () => {
    const newErrors = {};

    if (!formData.restaurantName) {
      newErrors.restaurantName = 'El nombre del restaurante es requerido';
    }

    if (!formData.ownerName) {
      newErrors.ownerName = 'El nombre del propietario es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.address) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos de servicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = isRestaurant ? validateRestaurantForm() : validateUserForm();
    if (!isValid) return;

    setErrors({});

    try {
      let response;
      if (isRestaurant) {
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
          acceptMarketing: formData.acceptMarketing
        };
        response = await apiService.registerUser(userData);
        localStorage.setItem('user_type', 'registered');
      }

      if (response.success || response.access_token) {
        if (response.needs_verification) {
          setNeedsVerification(true);
          return { needsVerification: true };
        }
        await onRegister(response);
      } else {
        throw new Error(response.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear la cuenta' });
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
    setIsRestaurant(!isRestaurant);
    setErrors({});
    setNeedsVerification(false);
    // Limpiar algunos campos específicos al cambiar
    setFormData(prev => ({
      ...prev,
      preferredGenres: [],
      restaurantName: '',
      address: '',
      ownerName: '',
      cuisineType: '',
      description: ''
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, businessDocument: file }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                isRestaurant
                  ? 'from-orange-500 to-yellow-600'
                  : 'from-emerald-500 to-teal-600'
              } rounded-full opacity-20 blur-lg animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                {isRestaurant ? (
                  <Building2 className="h-12 w-12 text-orange-400" />
                ) : (
                  <UserPlus className="h-12 w-12 text-emerald-400" />
                )}
              </div>
            </div>
          </div>
          
          <h1 className={`text-3xl font-black bg-gradient-to-r ${
            isRestaurant
              ? 'from-orange-400 to-yellow-400'
              : 'from-emerald-400 to-teal-400'
          } bg-clip-text text-transparent mb-2`}>
            {isRestaurant ? 'Registra tu Restaurante' : 'Crear Cuenta'}
          </h1>
          <p className="text-slate-300">
            {isRestaurant
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
                  isRestaurant
                    ? 'from-orange-500/20 to-yellow-500/20 translate-x-full border-orange-500/30'
                    : 'from-emerald-500/20 to-teal-500/20 translate-x-0 border-emerald-500/30'
                } border rounded-xl transition-all duration-300 ease-in-out`}
              />
              
              {/* Usuario Option */}
              <button
                type="button"
                onClick={() => !isRestaurant || handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isRestaurant
                    ? 'text-emerald-300'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Usuario</span>
              </button>
              
              {/* Restaurante Option */}
              <button
                type="button"
                onClick={() => isRestaurant || handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isRestaurant
                    ? 'text-orange-300'
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
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campos específicos para Admin */}
            {isAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del restaurante *
                  </label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
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
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
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
            {!isAdmin && (
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
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 ${
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
                {isAdmin ? 'Email corporativo *' : 'Email *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isRestaurant ? 'focus:ring-orange-500' : 'focus:ring-emerald-500'
                  } transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={isRestaurant ? 'admin@turestaurante.com' : 'tu@email.com'}
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
                      isRestaurant ? 'focus:ring-orange-500' : 'focus:ring-emerald-500'
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
                  {isAdmin ? 'Mínimo 8 caracteres' : 'Mínimo 6 caracteres'}
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
                      isRestaurant ? 'focus:ring-orange-500' : 'focus:ring-emerald-500'
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
                Teléfono {isAdmin && '*'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isRestaurant ? 'focus:ring-orange-500' : 'focus:ring-emerald-500'
                  } transition-all duration-200`}
                  placeholder="+57 300 123 4567"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campos adicionales para Admin */}
            {isAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
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
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      {cuisineTypes.map(type => (
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
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-none"
                    placeholder="Cuéntanos sobre tu restaurante, ambiente y especialidades..."
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Campos adicionales para Usuario normal */}
            {!isAdmin && (
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
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Géneros musicales favoritos */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Géneros musicales favoritos
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {musicGenres.map(genre => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => handleGenreToggle(genre.id)}
                        className={`flex items-center space-x-2 p-3 rounded-xl border transition-all duration-200 ${
                          formData.preferredGenres.includes(genre.id)
                            ? `${genre.color} bg-opacity-20 border-current text-white`
                            : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
                        }`}
                        disabled={isLoading}
                      >
                        <div className={`w-3 h-3 rounded-full ${genre.color} ${
                          formData.preferredGenres.includes(genre.id) ? 'opacity-100' : 'opacity-50'
                        }`}></div>
                        <span className="text-sm font-medium">{genre.name}</span>
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
                    isRestaurant ? 'text-orange-500 focus:ring-orange-500' : 'text-emerald-500 focus:ring-emerald-500'
                  } border-slate-600 rounded bg-slate-800 ${
                    errors.acceptTerms ? 'ring-1 ring-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <div className="text-sm">
                  <span className="text-slate-300">
                    Acepto los{' '}
                    <button type="button" className={`${
                      isAdmin ? 'text-yellow-400 hover:text-yellow-300' : 'text-emerald-400 hover:text-emerald-300'
                    } underline transition-colors`}>
                      términos de servicio
                    </button>{' '}
                    y la{' '}
                    <button type="button" className={`${
                      isAdmin ? 'text-yellow-400 hover:text-yellow-300' : 'text-emerald-400 hover:text-emerald-300'
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
                    isRestaurant ? 'text-orange-500 focus:ring-orange-500' : 'text-emerald-500 focus:ring-emerald-500'
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
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-2 w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reenviar email de verificación
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
                isRestaurant
                  ? 'from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 shadow-orange-500/25'
                  : 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
              } text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  {isRestaurant ? <Building2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  <span>{isRestaurant ? 'Registrar Restaurante' : 'Crear Cuenta'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Features Info */}
            <div className={`mt-6 p-4 ${
              isRestaurant
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            } border rounded-xl`}>
              <div className="flex items-start space-x-3">
                {isRestaurant ? (
                  <Building2 className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Heart className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`font-semibold ${
                    isRestaurant ? 'text-orange-400' : 'text-emerald-400'
                  } mb-2`}>
                    {isRestaurant ? 'Tu restaurante tendrá' : 'Con tu cuenta puedes'}
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {isRestaurant ? (
                      <>
                        <li>• Gestión completa de cola musical</li>
                        <li>• Control de reproducción en tiempo real</li>
                        <li>• Estadísticas detalladas de uso</li>
                        <li>• Panel administrativo completo</li>
                        <li>• Configuración personalizada</li>
                      </>
                    ) : (
                      <>
                        <li>• Guardar tus canciones favoritas</li>
                        <li>• Crear listas de reproducción personalizadas</li>
                        <li>• Ver tu historial de peticiones</li>
                        <li>• Recibir recomendaciones musicales</li>
                        <li>• Conectar con otros amantes de la música</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">
                    <span className="font-medium text-blue-400">Seguridad garantizada:</span> 
                    Todos tus datos están protegidos con encriptación de última generación.
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-slate-500">
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
                isAdmin ? 'text-yellow-400 hover:text-yellow-300' : 'text-emerald-400 hover:text-emerald-300'
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
                {isRestaurant ? <Headphones className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                <span>{isRestaurant ? 'Acceso como Usuario' : 'Continuar como Invitado'}</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Al crear tu cuenta, aceptas nuestros términos de servicio y política de privacidad.
              <br />
              {isAdmin 
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