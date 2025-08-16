import React from 'react';
import { 
  Music, 
  Headphones, 
  Star, 
  Clock, 
  TrendingUp,
  Radio,
  Users,
  Wifi,
  MapPin,
  Activity
} from 'lucide-react';

const HomePage = ({ onViewChange }) => {
  const quickActions = [
    {
      title: 'Explorar Música',
      description: 'Descubre nuestra amplia colección de canciones',
      icon: Music,
      action: () => onViewChange('browse'),
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      title: 'Mis Favoritos',
      description: 'Accede rápido a tus canciones favoritas',
      icon: Star,
      action: () => onViewChange('favorites'),
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-600'
    },
    {
      title: 'Mis Pedidos',
      description: 'Ve el estado de tus peticiones musicales',
      icon: Clock,
      action: () => onViewChange('requests'),
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-600'
    }
  ];

  const stats = [
    { 
      label: 'Canciones Disponibles', 
      value: '2,500+', 
      icon: Music, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      label: 'Géneros Musicales', 
      value: '15+', 
      icon: TrendingUp, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    { 
      label: 'Tiempo Promedio', 
      value: '3 min', 
      icon: Clock, 
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20'
    }
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Explora',
      description: 'Navega por nuestra extensa biblioteca musical y encuentra tus canciones favoritas',
      icon: Music,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      step: '2',
      title: 'Pide',
      description: 'Selecciona la canción que quieres escuchar y envía tu petición al DJ',
      icon: Radio,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      step: '3',
      title: 'Disfruta',
      description: 'Relájate y disfruta tu comida mientras suena tu música favorita',
      icon: Headphones,
      gradient: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="relative animate-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-full border border-slate-700/50">
                <Headphones className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400" />
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 lg:mb-8 leading-tight">
            <span className="block text-gradient-primary bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Bienvenido a
            </span>
            <span className="block text-gradient-secondary bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">
              MusicMenu
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed">
            La experiencia musical más interactiva para tu restaurante. 
            Pide tus canciones favoritas y crea el ambiente perfecto mientras disfrutas tu comida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onViewChange('browse')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/25 btn-hover-lift"
            >
              <div className="flex items-center justify-center space-x-2">
                <Music className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Explorar Música</span>
              </div>
            </button>
            <button 
              onClick={() => onViewChange('requests')}
              className="px-8 py-4 border-2 border-slate-600 text-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Ver Mis Pedidos</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 lg:mb-16 animate-fade-in-up">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-800/60 transition-all duration-300 transform hover:scale-105 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`
                  group text-left p-6 lg:p-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 
                  rounded-3xl hover:bg-slate-800/60 transition-all duration-500 transform hover:scale-105 
                  hover:shadow-2xl card-hover animate-fade-in-up
                `}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${action.gradient} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {action.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* How it works */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-3xl p-8 lg:p-12 mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-white mb-8 lg:mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`relative w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <span className="text-2xl font-black text-white">{step.step}</span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="mb-4">
                    <IconComponent className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 backdrop-blur-md border border-slate-700/30 rounded-3xl p-8 lg:p-12 text-center animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <MapPin className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Información de la Mesa</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
              <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-2">Mesa #12</div>
              <div className="text-slate-400 text-sm font-medium">Tu ubicación</div>
            </div>
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-400">Activo</div>
                <Wifi className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-slate-400 text-sm font-medium">Estado</div>
            </div>
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Activity className="h-6 w-6 text-purple-400" />
                <div className="text-2xl lg:text-3xl font-bold text-purple-400">7:30 PM</div>
              </div>
              <div className="text-slate-400 text-sm font-medium">Conectado desde</div>
            </div>
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-6 w-6 text-amber-400" />
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">0</div>
              </div>
              <div className="text-slate-400 text-sm font-medium">Pedidos activos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;