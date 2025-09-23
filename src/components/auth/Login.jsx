
import React, { useState } from 'react';
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
  Shield
} from 'lucide-react';

import FormField from '../common/FormField';
import UserTypeToggle from '../common/UserTypeToggle';
import ActionButton from '../common/ActionButton';
import ErrorMessage from '../common/ErrorMessage';
import FeatureCard from '../common/FeatureCard';

const Login = ({ onLogin, onSwitchToRegister, onSwitchToCustomer, isLoading, error }) => {
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
      // Llamar al handler del padre en lugar de apiService directamente
      switch (userType) {
        case 'restaurant':
          await onLogin({ ...formData, userType: 'restaurant' });
          break;
        case 'superadmin':
          await onLogin({ ...formData, userType: 'superadmin' });
          break;
        default: // 'user'
          await onLogin({ ...formData, userType: 'user' });
          break;
      }
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

  const handleToggleUserType = (newType) => {
    setUserType(newType);
    // Limpiar errores al cambiar tipo
    setErrors({});
    // Opcional: limpiar formulario al cambiar tipo
    // setFormData({ email: '', password: '' });
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
        <UserTypeToggle
          userType={userType}
          onToggle={handleToggleUserType}
          showSuperAdmin={true}
          disabled={isLoading}
        />

        {/* Form */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 md:p-6 lg:p-8">
          <div className="space-y-3 md:space-y-4">
            
            {/* Email Field */}
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={
                userType === 'user' ? 'tu@email.com' :
                userType === 'restaurant' ? 'admin@restaurante.com' :
                'superadmin@musicmenu.com'
              }
              error={errors.email}
              required
              disabled={isLoading}
              icon={Mail}
              autoComplete="email"
            />

            {/* Password Field */}
            <FormField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
              disabled={isLoading}
              icon={Lock}
              autoComplete="current-password"
              className="pr-12"
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </FormField>

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
            <ErrorMessage error={errors.submit || error} />

            {/* Submit Button */}
            <ActionButton
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              variant={
                userType === 'user' ? 'primary' :
                userType === 'restaurant' ? 'secondary' :
                'primary'
              }
              size="lg"
              fullWidth
              icon={LogIn}
            >
              {userType === 'user' ? 'Iniciar Sesión' :
               userType === 'restaurant' ? 'Acceso Restaurante' :
               'Super Admin Login'}
            </ActionButton>

            {/* Features Info */}
            <FeatureCard
              icon={userType === 'user' ? Heart : userType === 'restaurant' ? Building2 : Shield}
              title={
                userType === 'user' ? 'Con tu cuenta puedes' :
                userType === 'restaurant' ? 'Panel de Restaurante' :
                'Super Admin Panel'
              }
              features={
                userType === 'user' ? [
                  'Guardar tus canciones favoritas',
                  'Ver tu historial de peticiones',
                  'Crear listas personalizadas',
                  'Recibir recomendaciones musicales'
                ] : userType === 'restaurant' ? [
                  'Gestión de cola musical en tiempo real',
                  'Estadísticas de uso y peticiones',
                  'Control de reproducción y volumen',
                  'Configuración de límites y restricciones'
                ] : [
                  'Gestión de restaurantes y usuarios',
                  'Aprobación de nuevos establecimientos',
                  'Estadísticas globales del sistema',
                  'Configuración avanzada y seguridad'
                ]
              }
              variant={userType === 'user' ? 'primary' : userType === 'restaurant' ? 'secondary' : 'primary'}
            />

          </div>
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

export default Login;