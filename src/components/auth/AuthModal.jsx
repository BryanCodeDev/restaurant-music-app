import React, { useState } from 'react';
import { X, Heart, User, Mail, Lock } from 'lucide-react';

import apiService from '../../services/apiService';

const AuthModal = ({ isOpen, onClose, onSuccess, restaurantName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      let response;
      if (isLogin) {
        response = await apiService.loginUser(formData.email, formData.password);
        localStorage.setItem('user_type', 'registered');
      } else {
        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        response = await apiService.registerUser(registerData);
        localStorage.setItem('user_type', 'registered');
      }

      if (response.access_token || (response.success && response.data?.access_token)) {
        // Token ya guardado en apiService
        onSuccess(response);
        onClose();
      } else {
        throw new Error(response.message || (isLogin ? 'Error al iniciar sesión' : 'Error al crear la cuenta'));
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-md relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin 
                ? 'Accede a tus favoritos y personaliza tu experiencia'
                : 'Guarda tus canciones favoritas y crea listas personalizadas'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="h-4 w-4 inline mr-2" />
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
              </div>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="ml-2 text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div className="px-6 pb-6">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Con tu cuenta puedes:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Guardar tus canciones favoritas</li>
              <li>• Crear listas personalizadas</li>
              <li>• Ver tu historial de pedidos</li>
              <li>• Recibir recomendaciones personalizadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;