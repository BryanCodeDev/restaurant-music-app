import React from 'react';
import {
  Music,
  Clock,
  Heart,
  Star,
  TrendingUp,
  Users,
  PlayCircle,
  ArrowRight,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react';
import { SUBSCRIPTION_URLS, SUBSCRIPTION_STATUS } from '../../constants/app';

const HomePage = ({
  onViewChange,
  restaurant,
  userSession,
  stats = {},
  user,
  subscriptionStatus = null,
  onShowSubscriptionFlow
}) => {
  const quickStats = [
    {
      icon: Music,
      label: 'Canciones Disponibles',
      value: stats.totalSongs || '500+',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Clock,
      label: 'En Cola',
      value: stats.pendingRequests || 0,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Heart,
      label: 'Mis Favoritos',
      value: stats.totalFavorites || 0,
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Users,
      label: 'Mis Peticiones',
      value: stats.totalRequests || 0,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const quickActions = [
    {
      id: 'browse',
      title: 'Explorar Música',
      description: 'Descubre nuevas canciones y géneros',
      icon: Music,
      color: 'from-blue-500 to-purple-600',
      buttonText: 'Explorar'
    },
    {
      id: 'requests',
      title: 'Mis Peticiones',
      description: 'Ve el estado de tus canciones solicitadas',
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      buttonText: 'Ver Cola'
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      description: 'Accede rápidamente a tu música favorita',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      buttonText: 'Ver Favoritos'
    }
  ];


  const getSubscriptionStatusDisplay = () => {
    if (!subscriptionStatus) return null;

    const { status, plan, expiresAt } = subscriptionStatus;

    switch (status) {
      case 'active':
        return (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400">Plan Activo</h3>
                <p className="text-slate-300">
                  Tienes el plan <span className="font-semibold text-white">{plan?.name}</span> activo
                  {expiresAt && (
                    <span className="text-slate-400"> • Expira: {new Date(expiresAt).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{plan?.price}</div>
                <div className="text-sm text-slate-400">{plan?.period}</div>
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400">Suscripción Pendiente</h3>
                <p className="text-slate-300">
                  Tu plan <span className="font-semibold text-white">{plan?.name}</span> está siendo revisado
                </p>
              </div>
              <button
                onClick={() => window.location.href = SUBSCRIPTION_URLS.PENDING}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400">Suscripción Expirada</h3>
                <p className="text-slate-300">
                  Tu plan anterior ha expirado. Renueva para continuar disfrutando del servicio.
                </p>
              </div>
              <button
                onClick={() => window.location.href = SUBSCRIPTION_URLS.RENEWAL}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300"
              >
                Renovar Plan
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Section */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ¡Bienvenido!
            </span>
          </h1>
        </div>
        
        <div className="space-y-2 mb-8">
          <div className="space-y-2 mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {restaurant?.name || 'Restaurante'}
            </h2>
            {restaurant?.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="w-16 h-16 rounded-full mx-auto border-2 border-white/20"
              />
            )}
            {restaurant?.description && (
              <p className="text-sm text-slate-400 italic max-w-md mx-auto">
                {restaurant.description}
              </p>
            )}
            {restaurant?.rating > 0 && (
              <div className="flex items-center justify-center space-x-1 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-bold">{restaurant.rating}</span>
                <span className="text-sm text-slate-400">({restaurant.totalReviews || 0})</span>
              </div>
            )}
          </div>
          <p className="text-lg text-slate-300">
            {userSession?.tableNumber && `${userSession.tableNumber} • `}
            Tu música, tu ambiente
          </p>
        </div>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explora nuestro catálogo musical, haz peticiones y crea el ambiente perfecto para tu experiencia gastronómica
        </p>
      </div>

      {/* Subscription Status */}
      {getSubscriptionStatusDisplay()}

      {/* Subscription CTA for users without subscription */}
      {!subscriptionStatus && user && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">¡Mejora tu experiencia!</h3>
                <p className="text-slate-300">Suscríbete a un plan y desbloquea todas las funciones premium</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = SUBSCRIPTION_URLS.NEW}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Ver Planes</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
        {quickStats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center animate-scale-in hover:bg-slate-800/60 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
          ¿Qué quieres hacer hoy?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => onViewChange(action.id)}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="h-8 w-8 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {action.title}
              </h4>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                {action.description}
              </p>
              
              <button className={`w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r ${action.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                <span>{action.buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <PlayCircle className="h-8 w-8 text-blue-400" />
          <span>Estado Actual</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-300">Mesa:</span>
              <span className="font-semibold text-white">{userSession?.tableNumber || 'No asignada'}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-300">Peticiones realizadas:</span>
              <span className="font-semibold text-white">{stats.totalRequests || 0}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-300">En cola:</span>
              <span className="font-semibold text-green-400">{stats.pendingRequests || 0} canciones</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <span className="text-slate-300">Favoritos guardados:</span>
              <span className="font-semibold text-pink-400">{stats.totalFavorites || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
        <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-4">
          ¡Consejo del día!
        </h3>
        <p className="text-slate-300 leading-relaxed">
          Agrega canciones a favoritos para encontrarlas más rápido. También puedes explorar diferentes géneros para descubrir nueva música que se ajuste al ambiente del restaurante.
        </p>
      </div>

    </div>
  );
};

export default HomePage;