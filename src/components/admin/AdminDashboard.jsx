import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Music, 
  Clock, 
  TrendingUp, 
  Play, 
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Settings,
  Bell,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Heart,
  Star,
  Activity,
  LogOut,
  Crown,
  Headphones
} from 'lucide-react';

const AdminDashboard = ({ 
  restaurant, 
  requests = [], 
  currentSong = null,
  onLogout,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  isPlaying = false,
  volume = 75
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeUsers: 0,
    songsPlayed: 0,
    avgWaitTime: 0
  });

  // Calculate stats from requests
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRequests = requests.filter(req => {
      const requestDate = new Date(req.createdAt || req.requestedAt);
      return requestDate >= today;
    });
    
    const activeUsers = new Set(
      requests.filter(req => req.status === 'pending' || req.status === 'playing')
        .map(req => req.userTable)
    ).size;
    
    const completedToday = todayRequests.filter(req => req.status === 'completed').length;
    const pendingRequests = requests.filter(req => req.status === 'pending');
    const avgWaitTime = pendingRequests.length > 0 ? pendingRequests.length * 3.5 : 0;

    setStats({
      totalRequests: todayRequests.length,
      activeUsers,
      songsPlayed: completedToday,
      avgWaitTime: Math.round(avgWaitTime)
    });
  }, [requests]);

  const recentRequests = requests
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.requestedAt) - new Date(a.createdAt || a.requestedAt))
    .slice(0, 5);

  const popularSongs = requests
    .reduce((acc, req) => {
      const key = `${req.title}-${req.artist}`;
      if (!acc[key]) {
        acc[key] = { title: req.title, artist: req.artist, requests: 0 };
      }
      acc[key].requests++;
      return acc;
    }, {});

  const popularSongsList = Object.values(popularSongs)
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 4);

  const handlePlayPause = () => {
    onPlayPause();
  };

  const handleVolumeChange = (newVolume) => {
    onVolumeChange(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      onVolumeChange(0);
    } else {
      onVolumeChange(volume);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'playing': return 'Reproduciendo';
      case 'pending': return 'En cola';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Panel de Control
                  </h1>
                  <p className="text-slate-300 mt-1">
                    Administra la música de {restaurant?.name || 'tu restaurante'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200">
                <Calendar className="h-4 w-4" />
                <span>Hoy</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Peticiones Hoy</p>
                <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
                <p className="text-emerald-400 text-sm flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{Math.round(Math.random() * 20)}%</span>
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Music className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Usuarios Activos</p>
                <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                <p className="text-emerald-400 text-sm flex items-center space-x-1 mt-1">
                  <Activity className="h-3 w-3" />
                  <span>En línea</span>
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Canciones Reproducidas</p>
                <p className="text-3xl font-bold text-white">{stats.songsPlayed}</p>
                <p className="text-blue-400 text-sm flex items-center space-x-1 mt-1">
                  <Play className="h-3 w-3" />
                  <span>Hoy</span>
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Play className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-white">{stats.avgWaitTime}m</p>
                <p className="text-yellow-400 text-sm flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Espera</span>
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Playing */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 lg:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Headphones className="h-5 w-5 text-blue-400" />
                <span>Reproduciendo Ahora</span>
              </h2>
              
              {currentSong ? (
                <div className="flex items-center space-x-6">
                  <img 
                    src={currentSong.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop"}
                    alt={currentSong.title}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{currentSong.title}</h3>
                    <p className="text-slate-400">{currentSong.artist}</p>
                    {currentSong.userTable && (
                      <p className="text-sm text-blue-400 mt-1">Solicitado por: {currentSong.userTable}</p>
                    )}
                    
                    {/* Progress Bar Placeholder */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>2:30</span>
                        <span>{currentSong.duration || '3:45'}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '42%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-xl"></div>
                    <div className="relative bg-slate-700/50 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                      <Music className="h-10 w-10 text-slate-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No hay música reproduciéndose</h3>
                  <p className="text-slate-500">Selecciona una canción de la cola para comenzar</p>
                </div>
              )}
              
              {/* Controls */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={onPrevious}
                    className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors"
                    disabled={!currentSong}
                  >
                    <SkipBack className="h-5 w-5 text-slate-400" />
                  </button>
                  
                  <button 
                    onClick={handlePlayPause}
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!currentSong}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white ml-1" />
                    )}
                  </button>
                  
                  <button 
                    onClick={onNext}
                    className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <SkipForward className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button onClick={toggleMute}>
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  <div className="w-24">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 min-w-[2rem]">{volume}%</span>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>Peticiones Recientes</span>
                </h2>
                <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Actualizar</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {recentRequests.length > 0 ? recentRequests.map((request, index) => (
                  <div key={request.id || index} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                    <img 
                      src={request.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"}
                      alt={request.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{request.title}</h4>
                      <p className="text-slate-400 text-sm">{request.artist}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-slate-300 text-sm font-medium">{request.userTable}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(request.createdAt || request.requestedAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">No hay peticiones recientes</h3>
                    <p className="text-slate-500">Las peticiones de música aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Popular Songs */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Canciones Populares</span>
              </h2>
              
              <div className="space-y-4">
                {popularSongsList.length > 0 ? popularSongsList.map((song, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{song.title}</h4>
                      <p className="text-slate-400 text-xs">{song.artist}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-3 w-3" />
                      <span className="text-xs">{song.requests}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No hay datos de popularidad</p>
                    <p className="text-slate-500 text-xs mt-1">Los datos aparecerán cuando haya más peticiones</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left">
                  <Settings className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Configuración</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Notificaciones</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <span className="text-white">Reportes</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Ver Como Cliente</span>
                </button>
              </div>
            </div>

            {/* Restaurant Info */}
            {restaurant && (
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Información del Restaurante</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop"}
                      alt={restaurant.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{restaurant.name}</h4>
                      <p className="text-slate-400 text-sm">{restaurant.email}</p>
                    </div>
                  </div>
                  
                  {restaurant.city && (
                    <div className="text-sm text-slate-400">
                      <span className="font-medium">Ubicación:</span> {restaurant.city}
                      {restaurant.country && `, ${restaurant.country}`}
                    </div>
                  )}
                  
                  <div className="text-sm text-slate-400">
                    <span className="font-medium">Plan:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      restaurant.subscriptionPlan === 'premium' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : restaurant.subscriptionPlan === 'enterprise'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {restaurant.subscriptionPlan || 'free'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2 border-t border-slate-700/30">
                    <span>Límite por usuario: {restaurant.maxRequestsPerUser || 2}</span>
                    <span>Cola máxima: {restaurant.queueLimit || 50}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;