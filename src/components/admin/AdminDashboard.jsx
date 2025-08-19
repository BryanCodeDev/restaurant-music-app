import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';

const AdminDashboard = ({ restaurant }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: "5:55",
    currentTime: "2:30",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  // Mock data for statistics
  const stats = {
    totalRequests: 245,
    activeUsers: 12,
    songsPlayed: 89,
    avgWaitTime: 4.5
  };

  const recentRequests = [
    {
      id: 1,
      song: "Hotel California",
      artist: "Eagles",
      user: "Mesa #5",
      time: "Hace 2 min",
      status: "pending"
    },
    {
      id: 2,
      song: "Billie Jean",
      artist: "Michael Jackson",
      user: "Mesa #12",
      time: "Hace 5 min",
      status: "playing"
    },
    {
      id: 3,
      song: "Shape of You",
      artist: "Ed Sheeran",
      user: "Mesa #8",
      time: "Hace 8 min",
      status: "completed"
    }
  ];

  const popularSongs = [
    { title: "Bohemian Rhapsody", artist: "Queen", requests: 15 },
    { title: "Hotel California", artist: "Eagles", requests: 12 },
    { title: "Billie Jean", artist: "Michael Jackson", requests: 10 },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", requests: 8 }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Panel de Control
              </h1>
              <p className="text-slate-300 mt-2">
                Administra la música de {restaurant?.name || 'tu restaurante'}
              </p>
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
                  <span>+12%</span>
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
              <h2 className="text-xl font-bold text-white mb-6">Reproduciendo Ahora</h2>
              
              <div className="flex items-center space-x-6">
                <img 
                  src={currentlyPlaying.image}
                  alt={currentlyPlaying.title}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{currentlyPlaying.title}</h3>
                  <p className="text-slate-400">{currentlyPlaying.artist}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>{currentlyPlaying.currentTime}</span>
                      <span>{currentlyPlaying.duration}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '42%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <button className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors">
                    <SkipBack className="h-5 w-5 text-slate-400" />
                  </button>
                  
                  <button 
                    onClick={handlePlayPause}
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white ml-1" />
                    )}
                  </button>
                  
                  <button className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors">
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
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Peticiones Recientes</h2>
                <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Actualizar</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{request.song}</h4>
                      <p className="text-slate-400 text-sm">{request.artist}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-slate-300 text-sm font-medium">{request.user}</p>
                      <p className="text-slate-500 text-xs">{request.time}</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'playing' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : request.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {request.status === 'playing' && 'Reproduciendo'}
                      {request.status === 'pending' && 'En cola'}
                      {request.status === 'completed' && 'Completada'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Popular Songs */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Canciones Populares</h2>
              
              <div className="space-y-4">
                {popularSongs.map((song, index) => (
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
                ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;