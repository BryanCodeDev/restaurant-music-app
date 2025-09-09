import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  MapPin,
  Phone,
  Globe,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Crown,
  Headphones,
  UserPlus,
  Star
} from 'lucide-react';

const Register = ({ onRegister, onSwitchToLogin, onSwitchToCustomer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'El nombre del restaurante es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas y números';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'La dirección es requerida';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await onRegister(formData);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al registrar restaurante' });
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
      setLogoFile(file);
      // En una implementación completa, subirías el archivo aquí
      console.log('Logo selected:', file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                <Building2 className="h-12 w-12 text-blue-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Registra tu Restaurante
          </h1>
          <p className="text-slate-300">
            Únete a la revolución musical gastronómica
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Restaurant Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                <span>Información del Restaurante</span>
              </h2>

              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del Restaurante *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.name ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Ej: Café Bohemia"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
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
                    placeholder="Dirección completa del restaurante"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* City and Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Bogotá"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Colombia"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Teléfono (Opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.phone ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="+57 300 123 4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Account Info Section */}
            <div className="space-y-4 pt-4 border-t border-slate-700/30">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-emerald-400" />
                <span>Información de la Cuenta</span>
              </h2>

              {/* Email */}
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
                    placeholder="admin@turestaurante.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
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
                    autoComplete="new-password"
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
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1">
                      <div className={`h-1 flex-1 rounded ${formData.password.length >= 8 ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${/(?=.*\d)/.test(formData.password) ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Debe contener: 8+ caracteres, mayúsculas, minúsculas y números
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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
                
                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1 flex items-center space-x-1 ${
                    formData.password === formData.confirmPassword ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>
                      {formData.password === formData.confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-4 pt-4 border-t border-slate-700/30">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Logo del Restaurante (Opcional)</span>
              </h2>

              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-semibold">Click para subir</span> o arrastra tu logo
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG (MAX. 2MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                  />
                </label>
                {logoFile && (
                  <p className="mt-2 text-sm text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Logo seleccionado: {logoFile.name}</span>
                  </p>
                )}
              </div>
            </div>

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
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Registrar Restaurante</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Features Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Crown className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">¿Qué incluye el registro?</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Panel de administración completo</li>
                    <li>• Gestión de cola musical en tiempo real</li>
                    <li>• QR personalizado para tu restaurante</li>
                    <li>• Estadísticas detalladas de uso</li>
                    <li>• Control de reproducción y volumen</li>
                    <li>• Soporte técnico incluido</li>
                  </ul>
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
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Inicia sesión aquí
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
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all duration-300"
          >
            <Headphones className="h-5 w-5" />
            <span>Acceso como Cliente</span>
          </button>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad.<br/>
              Tu información está protegida y nunca será compartida con terceros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;