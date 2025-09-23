import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  MoreHorizontal,
  Music,
  Clock,
  User,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat
} from 'lucide-react';
import VolumeControl from '../common/VolumeControl';
import PlaybackControls from '../common/PlaybackControls';

// Componente simple para icono de Spotify
const SpotifyIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.4c-.2.3-.6.4-1 .2-2.8-1.7-6.3-2.1-10.4-1.1-.4.1-.8-.1-.9-.5s.1-.8.5-.9c4.4-1.1 8.4-.6 11.6 1.3.4.2.5.7.2 1zm1.5-3.3c-.3.4-.8.5-1.2.2-3.2-2-8.1-2.6-11.8-1.4-.4.1-.9-.1-1-.5s.1-.9.5-1c4.1-1.3 9.3-.7 13 1.6.4.2.5.8.5 1.1zm.1-3.4c-3.8-2.3-10.1-2.5-13.7-1.4-.5.1-1-.2-1.1-.7s.2-1 .7-1.1c4.1-1.3 11.1-1.1 15.4 1.6.4.2.5.8.4 1.2-.1.4-.5.5-.7.4z"/>
  </svg>
);
import apiService from '../../services/apiService';

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
  isFavorite = false,
  planType = 'basic',
  spotifyConnected = false,
  restaurantSlug,
  onPlaySong // De useMusic
}) => {
  const audioRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  // Fetch accessToken for Pro
  useEffect(() => {
    if (planType === 'pro' && spotifyConnected && restaurantSlug) {
      const fetchToken = async () => {
        try {
          const restaurant = await apiService.getRestaurantPlan(restaurantSlug);
          if (restaurant && restaurant.spotify_tokens) {
            setAccessToken(restaurant.spotify_tokens.access_token);
          } else {
            await apiService.refreshSpotifyToken(restaurant.id);
            const refreshed = await apiService.getRestaurantPlan(restaurantSlug);
            setAccessToken(refreshed.spotify_tokens.access_token);
          }
        } catch (err) {
          console.error('Token fetch error:', err);
        }
      };
      fetchToken();
    }
  }, [planType, spotifyConnected, restaurantSlug]);

  // Load Spotify SDK for Pro
  useEffect(() => {
    if (planType !== 'pro' || !accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Restaurant Music Player',
        getOAuthToken: (cb) => cb(accessToken),
        volume: volume / 100
      });

      // Event handlers
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      });

      spotifyPlayer.addListener('player_state_changed', (state => {
        if (!state) return;
        setCurrentSong(state.track_window.current_track ? {
          id: state.track_window.current_track.id,
          title: state.track_window.current_track.name,
          artist: state.track_window.current_track.artists[0].name,
          image: state.track_window.current_track.album.images[0].url,
          duration: formatTime(state.track_window.current_track.duration_ms / 1000),
          source: 'spotify',
          uri: state.track_window.current_track.uri
        } : null);
        setIsPlaying(state.is_playing);
        setCurrentTime(state.position / 1000);
        if (onPlayPause) onPlayPause(state.is_playing);
      }));

      spotifyPlayer.addListener('playback_error', (error) => {
        console.error('Playback error:', error);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
      setSdkReady(true);
    };

    return () => {
      document.body.removeChild(script);
      if (player) player.disconnect();
    };
  }, [planType, accessToken, volume]);

  // Audio events for Basic
  useEffect(() => {
    if (planType !== 'basic' || !currentSong?.preview_url || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentSong.preview_url;
    audio.volume = volume / 100;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onNext) onNext();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong?.preview_url, volume, onNext]);

  // Play/Pause handler
  const handlePlayPause = useCallback(() => {
    if (planType === 'basic' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } else if (planType === 'pro' && player && deviceId) {
      player.togglePlay();
    } else if (onPlayPause) {
      onPlayPause();
    }
  }, [planType, isPlaying, player, deviceId, onPlayPause]);

  // Next/Previous for Pro
  const handleNext = useCallback(() => {
    if (planType === 'pro' && player) {
      player.nextTrack();
    } else if (onNext) onNext();
  }, [planType, player, onNext]);

  const handlePrevious = useCallback(() => {
    if (planType === 'pro' && player) {
      player.previousTrack();
    } else if (onPrevious) onPrevious();
  }, [planType, player, onPrevious]);


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
          {planType === 'pro' && !spotifyConnected && (
            <span className="ml-2">(Conecta Spotify para reproducir)</span>
          )}
        </div>
      </div>
    );
  }

  const pendingQueue = queue.filter(song => song.status === 'pending' || !song.status);

  // Audio element for Basic
  const audioElement = planType === 'basic' && currentSong.preview_url && (
    <audio
      ref={audioRef}
      controls={false}
      className="hidden"
    />
  );

  // Spotify connection status
  const connectionStatus = planType === 'pro' && (
    <div className="flex items-center space-x-2 text-xs text-slate-400">
      {spotifyConnected ? (
        <>
          <SpotifyIcon className="h-3 w-3" />
          <span>Spotify conectado</span>
        </>
      ) : (
        <span className="text-red-400">Spotify no conectado</span>
      )}
    </div>
  );

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
                src={currentSong.image || currentSong.preview_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop"}
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
              {/* Source icon */}
              {currentSong.source === 'spotify' && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full">
                  <SpotifyIcon className="h-3 w-3 text-white" />
                </div>
              )}
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
          <div className="hidden md:flex items-center justify-center flex-1">
            <PlaybackControls
              isPlaying={isPlaying}
              isShuffled={isShuffled}
              repeatMode={repeatMode}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onShuffle={() => setIsShuffled(!isShuffled)}
              onRepeat={toggleRepeat}
            />
          </div>
        
          {/* Connection status for Pro */}
          {connectionStatus}

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
            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />

            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          
            {/* Play song button for current if not playing */}
            {currentSong && !isPlaying && (
              <button
                onClick={handlePlaySong}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                title="Reproducir esta canción"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
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

      {/* Audio element for Basic plan */}
      {audioElement}
    </div>
  );
};

export default MusicPlayer;