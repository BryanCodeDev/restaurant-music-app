import React, { useState } from 'react';
import {
  User,
  Crown,
  Building2,
  Headphones,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LogIn,
  Heart,
  Music,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EnhancedLogin = ({ onLogin, onSwitchToRegister, onSwitchToCustomer, isLoading, error }) => {
  const { login } = useAuth();
  const [userType, setUserType] = useState('user'); // 'user' | 'restaurant' | 'superadmin'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});

    try {
      await login({ ...formData, userType });
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleToggleUserType = (newType) => {
    setUserType(newType);
    setErrors({});
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                userType === 'user' ? 'from-blue-500 to-purple-600' :
                userType === 'restaurant' ? 'from-yellow-500 to-amber-600' :
                'from-indigo-500 to-violet-600'
              } rounded-full opacity-20 blur-lg animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                {userType === 'user' ? (
                  <User className="h-12 w-12 text-blue-400" />
                ) : userType === 'restaurant' ? (
                  <Building2 className="h-12 w-12 text-yellow-400" />
                ) : (
                  <Shield className="h-12 w-12 text-indigo-400" />
                )}
              </div>
            </div>
          </div>

          <h1 className={`text-3xl font-black bg-gradient-to-r ${
            userType === 'user' ? 'from-blue-400 to-purple-400' :
            userType === 'restaurant' ? 'from-yellow-400 to-amber-400' :
            'from-indigo-400 to-violet-400'
          } bg-clip-text text-transparent mb-2`}>
            {userType === 'user' ? 'Iniciar Sesión' :
             userType === 'restaurant' ? 'Acceso Restaurante' :
             'Super Admin Login'}
          </h1>
          <p className="text-slate-300">
            {userType === 'user'
              ? 'Accede a tu cuenta y disfruta de la experiencia musical'
              : userType === 'restaurant'
              ? 'Inicia sesión en tu panel de restaurante'
              : 'Acceso al panel de super administrador'}
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-1">
            <div className="flex relative">
              {/* Toggle Background - 3 opciones, width 1/3 */}
              <div
                className={`absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r rounded-xl transition-all duration-300 ease-in-out ${
                  userType === 'user' ? 'from-blue-500/20 to-purple-500/20 left-0 border-blue-500/30 bg-blue-500/10' :
                  userType === 'restaurant' ? 'from-yellow-500/20 to-amber-500/20 left-[33.33%] border-yellow-500/30 bg-yellow-500/10' :
                  'from-indigo-500/20 to-violet-500/20 left-[66.67%] border-indigo-500/30 bg-indigo-500/10'
                }`}
                />

              {/* Usuario Option */}
              <button
                type="button"
                onClick={() => handleToggleUserType('user')}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === 'user'
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
                onClick={() => handleToggleUserType('restaurant')}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === 'restaurant'
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
                onClick={() => handleToggleUserType('superadmin')}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  userType === 'superadmin'
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
                  className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    userType === 'user' ? 'focus:ring-blue-500' :
                    userType === 'restaurant' ? 'focus:ring-yellow-500' :
                    'focus:ring-indigo-500'
                  } transition-all duration-200 text-sm md:text-base ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={
                    userType === 'user' ? 'tu@email.com' :
                    userType === 'restaurant' ? 'admin@restaurante.com' :
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
                  className={`w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-3.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    userType === 'user' ? 'focus:ring-blue-500' :
                    userType === 'restaurant' ? 'focus:ring-yellow-500' :
                    'focus:ring-indigo-500'
                  } transition-all duration-200 text-sm md:text-base ${
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
                className={`text-sm ${
                  userType === 'user' ? 'text-blue-400 hover:text-blue-300' :
                  userType === 'restaurant' ? 'text-yellow-400 hover:text-yellow-300' :
                  'text-indigo-400 hover:text-indigo-300'
                } transition-colors`}
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

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
              className={`w-full flex items-center justify-center space-x-2 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r ${
                userType === 'user' ? 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25' :
                userType === 'restaurant' ? 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-yellow-500/25' :
                'from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/25'
              } text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>{userType === 'user' ? 'Iniciar Sesión' : userType === 'restaurant' ? 'Acceso Restaurante' : 'Super Admin Login'}</span>
                </>
              )}
            </button>

            {/* Features Info */}
            <div className={`mt-3 md:mt-4 p-2.5 md:p-3 ${
              userType === 'user' ? 'bg-blue-500/10 border-blue-500/30' :
              userType === 'restaurant' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-indigo-500/10 border-indigo-500/30'
            } border rounded-xl`}>
              <div className="flex items-start space-x-2 md:space-x-3">
                {userType === 'user' ? (
                  <Heart className="h-4 md:h-5 w-4 md:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                ) : userType === 'restaurant' ? (
                  <Building2 className="h-4 md:h-5 w-4 md:w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Shield className="h-4 md:h-5 w-4 md:w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`font-semibold text-sm md:text-base ${
                    userType === 'user' ? 'text-blue-400' :
                    userType === 'restaurant' ? 'text-yellow-400' :
                    'text-indigo-400'
                  } mb-1.5 md:mb-2`}>
                    {userType === 'user' ? 'Con tu cuenta puedes' :
                     userType === 'restaurant' ? 'Panel de Restaurante' :
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
            {userType === 'user' ? '¿No tienes una cuenta? ' : ''}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`${
                userType === 'user' ? 'text-blue-400 hover:text-blue-300' :
                userType === 'restaurant' ? 'text-yellow-400 hover:text-yellow-300' :
                'text-indigo-400 hover:text-indigo-300'
              } font-medium transition-colors`}
              disabled={isLoading}
            >
              {userType === 'user' ? 'Regístrate aquí' : 'Registra tu restaurante'}
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
            {userType === 'restaurant' ? <Headphones className="h-4 md:h-5 w-4 md:w-5" /> : <Music className="h-4 md:h-5 w-4 md:w-5" />}
            <span className="text-sm md:text-base">{userType === 'restaurant' ? 'Acceso como Cliente' : 'Continuar como Invitado'}</span>
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

export default EnhancedLogin;