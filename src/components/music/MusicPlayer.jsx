import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Music,
  Clock,
  User,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const MusicPlayer = ({ 
  currentSong, 
  queue = [], 
  isPlaying = false, 
  volume = 75,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  // Mock progress for demo
  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const duration = parseDuration(currentSong.duration);
          const newTime = prev + 1;
          return newTime >= duration ? 0 : newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong]);

  const parseDuration = (duration) => {
    if (!duration) return 180; // Default 3 minutes
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentSong) return 0;
    const duration = parseDuration(currentSong.duration);
    return (currentTime / duration) * 100;
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    onVolumeChange?.(isMuted ? volume : 0);
  };

  const handleVolumeChange = (newVolume) => {
    onVolumeChange?.(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return <Repeat className="h-4 w-4" />;
    }
    return <Repeat className="h-4 w-4" />;
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4">
        <div className="flex items-center justify-center space-x-4 text-slate-400">
          <Music className="h-6 w-6" />
          <span>No hay música reproduciéndose</span>
        </div>
      </div>
    );
  }

  const pendingQueue = queue.filter(song => song.status === 'pending' || !song.status);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-50">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-700 cursor-pointer" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const duration = parseDuration(currentSong.duration);
        setCurrentTime(Math.floor(duration * percent));
      }}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Queue Display (collapsible) */}
      {showQueue && pendingQueue.length > 0 && (
        <div className="border-b border-slate-700/50 bg-slate-800/50 max-h-32 overflow-y-auto">
          <div className="p-3">
            <h4 className="text-xs font-medium text-slate-400 mb-2 flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>Próximas en la cola ({pendingQueue.length})</span>
            </h4>
            <div className="space-y-1">
              {pendingQueue.slice(0, 3).map((song, index) => (
                <div key={song.id || index} className="flex items-center space-x-2 text-xs">
                  <span className="w-4 text-slate-500">{index + 1}.</span>
                  <img 
                    src={song.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop"}
                    alt={song.title}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-white truncate flex-1">{song.title}</span>
                  <span className="text-slate-400">{song.artist}</span>
                  {song.userTable && (
                    <span className="text-slate-500 flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{song.userTable}</span>
                    </span>
                  )}
                </div>
              ))}
              {pendingQueue.length > 3 && (
                <div className="text-xs text-slate-500 text-center">
                  +{pendingQueue.length - 3} más en cola
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Song Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative group">
              <img 
                src={currentSong.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop"}
                alt={currentSong.title}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
              />
              {/* Status indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                isPlaying ? 'bg-green-500' : 'bg-slate-500'
              }`}>
                {isPlaying && (
                  <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                  {currentSong.title}
                </h4>
                {currentSong.userTable && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{currentSong.userTable}</span>
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs sm:text-sm truncate">
                {currentSong.artist}
                {currentSong.genre && (
                  <span className="mx-2">•</span>
                )}
                {currentSong.genre && (
                  <span className="text-slate-500">{currentSong.genre}</span>
                )}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{currentSong.duration || '0:00'}</span>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center justify-center space-x-4 flex-1">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2 rounded-full transition-colors ${
                isShuffled 
                  ? 'text-blue-400 bg-blue-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Reproducción aleatoria"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            
            <button 
              onClick={onPrevious}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Canción anterior"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button 
              onClick={onPlayPause}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={onNext}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Siguiente canción"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors relative ${
                repeatMode !== 'none'
                  ? 'text-blue-400 bg-blue-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title={`Repetir: ${repeatMode === 'none' ? 'desactivado' : repeatMode === 'one' ? 'una canción' : 'todas'}`}
            >
              {getRepeatIcon()}
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Mobile Play Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button 
              onClick={onPlayPause}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/25"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center space-x-3 flex-1 justify-end">
            {/* Queue toggle */}
            {pendingQueue.length > 0 && (
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-2 rounded-full transition-colors ${
                  showQueue ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400 hover:text-white'
                }`}
                title={`${showQueue ? 'Ocultar' : 'Mostrar'} cola (${pendingQueue.length})`}
              >
                {showQueue ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            )}

            <button 
              onClick={() => onToggleFavorite?.(currentSong)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-slate-400 hover:text-red-400'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 relative">
              <button 
                onClick={handleVolumeToggle}
                onMouseEnter={() => setShowVolumeControl(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  showVolumeControl ? 'w-20 opacity-100' : 'w-0 opacity-0'
                }`}
                onMouseEnter={() => setShowVolumeControl(true)}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                  }}
                />
              </div>
            </div>

            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Queue Indicator for Mobile */}
        {pendingQueue.length > 0 && (
          <div className="mt-3 flex items-center justify-center">
            <button
              onClick={() => setShowQueue(!showQueue)}
              className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 rounded-full hover:bg-slate-700 transition-colors"
            >
              <Music className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-slate-300">
                {pendingQueue.length} canción{pendingQueue.length !== 1 ? 'es' : ''} en cola
              </span>
              {showQueue ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
          </div>
        )}

        {/* Mobile Controls - Expanded */}
        <div className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onPrevious}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button 
              onClick={onNext}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onToggleFavorite?.(currentSong)}
              className={`p-2 transition-colors ${
                isFavorite
                  ? 'text-red-400'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button 
              onClick={handleVolumeToggle}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            {pendingQueue.length > 0 && (
              <button
                onClick={() => setShowQueue(!showQueue)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                {showQueue ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;