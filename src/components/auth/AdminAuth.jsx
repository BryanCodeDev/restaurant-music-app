import React, { useState } from 'react';
import { 
  Crown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2,
  MapPin,
  Upload,
  User,
  Phone,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Headphones
} from 'lucide-react';

const AdminAuth = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    ownerName: '',
    address: '',
    phone: '',
    website: '',
    logo: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Registration specific validations
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.restaurantName) {
        newErrors.restaurantName = 'El nombre del restaurante es requerido';
      }

      if (!formData.ownerName) {
        newErrors.ownerName = 'El nombre del propietario es requerido';
      }

      if (!formData.address) {
        newErrors.address = 'La dirección es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (isLogin) {
        onLogin({
          email: formData.email,
          name: 'Admin User',
          restaurant: 'Demo Restaurant'
        });
      } else {
        onRegister({
          email: formData.email,
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          address: formData.address,
          phone: formData.phone,
          website: formData.website
        });
      }
    } catch (error) {
      setErrors({ submit: 'Error en el servidor. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                <Crown className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            MusicMenu Admin
          </h1>
          <p className="text-slate-300">
            {isLogin ? 'Accede a tu panel de control' : 'Registra tu restaurante'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Login/Register Toggle */}
            <div className="flex bg-slate-700/50 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Registration Fields */}
            {!isLogin && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del Restaurante *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.restaurantName}
                      onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.restaurantName ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Ej: Café Central"
                    />
                  </div>
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.restaurantName}</span>
                    </p>
                  )}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del Propietario *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.ownerName ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {errors.ownerName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.ownerName}</span>
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.address ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Dirección completa"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sitio Web
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="https://mirestaurante.com"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Logo del Restaurante
                  </label>
                  <div className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-400">
                          <span className="font-semibold">Click para subir</span> o arrastra tu logo
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG (MAX. 2MB)</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </label>
                  </div>
                  {formData.logo && (
                    <p className="mt-2 text-sm text-emerald-400 flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Logo seleccionado: {formData.logo.name}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="tu@email.com"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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
            </div>

            {/* Confirm Password Field (Registration only) */}
            {!isLogin && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Iniciar Sesión' : 'Registrar Restaurante'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Additional Info for Registration */}
            {!isLogin && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Headphones className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">¿Qué incluye el registro?</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Panel de administración completo</li>
                      <li>• Gestión de playlist y géneros musicales</li>
                      <li>• Estadísticas de uso en tiempo real</li>
                      <li>• Soporte técnico 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? 'Registra tu restaurante' : 'Inicia sesión'}
            </button>
          </p>
          
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;