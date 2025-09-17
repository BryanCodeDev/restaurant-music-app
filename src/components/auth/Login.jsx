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
  Music
} from 'lucide-react';

import apiService from '../../services/apiService';

const Login = ({ onLogin, onSwitchToRegister, onSwitchToCustomer, isLoading, error }) => {
  const [isAdmin, setIsAdmin] = useState(false); // false = Usuario, true = Administrador
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
      // Agregar tipo de usuario a los datos del form
      const loginData = {
        ...formData,
        userType: isAdmin ? 'admin' : 'user'
      };
      await onLogin(loginData);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al iniciar sesión' });
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

  const handleToggleUserType = () => {
    setIsAdmin(!isAdmin);
    // Limpiar errores al cambiar tipo
    setErrors({});
    // Opcional: limpiar formulario al cambiar tipo
    // setFormData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                isAdmin 
                  ? 'from-yellow-500 to-amber-600' 
                  : 'from-blue-500 to-purple-600'
              } rounded-full opacity-20 blur-lg animate-pulse`}></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-full border border-slate-700/50">
                {isAdmin ? (
                  <Crown className="h-12 w-12 text-yellow-400" />
                ) : (
                  <User className="h-12 w-12 text-blue-400" />
                )}
              </div>
            </div>
          </div>
          
          <h1 className={`text-3xl font-black bg-gradient-to-r ${
            isAdmin 
              ? 'from-yellow-400 to-amber-400' 
              : 'from-blue-400 to-purple-400'
          } bg-clip-text text-transparent mb-2`}>
            {isAdmin ? 'Acceso Administrativo' : 'Iniciar Sesión'}
          </h1>
          <p className="text-slate-300">
            {isAdmin 
              ? 'Inicia sesión en tu panel de control'
              : 'Accede a tu cuenta y disfruta de la experiencia musical'
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
                  isAdmin 
                    ? 'from-yellow-500/20 to-amber-500/20 translate-x-full border-yellow-500/30' 
                    : 'from-blue-500/20 to-purple-500/20 translate-x-0 border-blue-500/30'
                } border rounded-xl transition-all duration-300 ease-in-out`}
              />
              
              {/* Usuario Option */}
              <button
                type="button"
                onClick={() => !isAdmin || handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isAdmin 
                    ? 'text-blue-300' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Usuario</span>
              </button>
              
              {/* Administrador Option */}
              <button
                type="button"
                onClick={() => isAdmin || handleToggleUserType()}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isAdmin 
                    ? 'text-yellow-300' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Crown className="h-5 w-5" />
                <span>Administrador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
          <div className="space-y-6">
            
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
                  className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isAdmin ? 'focus:ring-yellow-500' : 'focus:ring-blue-500'
                  } transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder={isAdmin ? 'admin@restaurante.com' : 'tu@email.com'}
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    isAdmin ? 'focus:ring-yellow-500' : 'focus:ring-blue-500'
                  } transition-all duration-200 ${
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className={`text-sm ${
                  isAdmin ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-400 hover:text-blue-300'
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
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r ${
                isAdmin 
                  ? 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-yellow-500/25' 
                  : 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25'
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
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Features Info */}
            <div className={`mt-6 p-4 ${
              isAdmin 
                ? 'bg-yellow-500/10 border-yellow-500/30' 
                : 'bg-blue-500/10 border-blue-500/30'
            } border rounded-xl`}>
              <div className="flex items-start space-x-3">
                {isAdmin ? (
                  <Building2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Heart className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`font-semibold ${
                    isAdmin ? 'text-yellow-400' : 'text-blue-400'
                  } mb-2`}>
                    {isAdmin ? 'Panel de Administración' : 'Con tu cuenta puedes'}
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {isAdmin ? (
                      <>
                        <li>• Gestión de cola musical en tiempo real</li>
                        <li>• Estadísticas de uso y peticiones</li>
                        <li>• Control de reproducción y volumen</li>
                        <li>• Configuración de límites y restricciones</li>
                      </>
                    ) : (
                      <>
                        <li>• Guardar tus canciones favoritas</li>
                        <li>• Ver tu historial de peticiones</li>
                        <li>• Crear listas personalizadas</li>
                        <li>• Recibir recomendaciones musicales</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-2 font-medium">Credenciales de prueba:</p>
              <div className="text-xs text-slate-400 space-y-1">
                {isAdmin ? (
                  <>
                    <p>Email: <span className="text-yellow-400">admin@laterraza.com</span></p>
                    <p>Password: <span className="text-yellow-400">demo123</span></p>
                  </>
                ) : (
                  <>
                    <p>Email: <span className="text-blue-400">usuario@demo.com</span></p>
                    <p>Password: <span className="text-blue-400">demo123</span></p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-slate-400 text-sm">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`${
                isAdmin ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-400 hover:text-blue-300'
              } font-medium transition-colors`}
              disabled={isLoading}
            >
              {isAdmin ? 'Registra tu restaurante' : 'Regístrate aquí'}
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
            disabled={isLoading}
          >
            {isAdmin ? <Headphones className="h-5 w-5" /> : <Music className="h-5 w-5" />}
            <span>{isAdmin ? 'Acceso como Cliente' : 'Continuar como Invitado'}</span>
          </button>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;