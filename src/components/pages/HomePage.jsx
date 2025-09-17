import React from 'react';
import { 
  Music, 
  Clock, 
  Heart, 
  TrendingUp,
  Users,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

const HomePage = ({ onViewChange, restaurant, userSession, stats = {} }) => {
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