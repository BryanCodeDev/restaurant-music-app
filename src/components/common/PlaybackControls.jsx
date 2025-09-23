import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';

const PlaybackControls = ({
  isPlaying = false,
  isShuffled = false,
  repeatMode = 'none', // 'none', 'one', 'all'
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizes = {
    sm: 'p-2',
    md: 'p-2',
    lg: 'p-3'
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return <Repeat className={iconSizes[size]} />;
    }
    return <Repeat className={iconSizes[size]} />;
  };

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <button
        onClick={onShuffle}
        className={`transition-colors ${
          isShuffled
            ? 'text-blue-400 bg-blue-500/20'
            : 'text-slate-400 hover:text-white'
        } ${buttonSizes[size]} rounded-full`}
        title="Reproducción aleatoria"
      >
        <Shuffle className={iconSizes[size]} />
      </button>

      <button
        onClick={onPrevious}
        className={`text-slate-400 hover:text-white transition-colors ${buttonSizes[size]}`}
        title="Canción anterior"
      >
        <SkipBack className={iconSizes[size]} />
      </button>

      <button
        onClick={onPlayPause}
        className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 ${buttonSizes[size]}`}
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? (
          <Pause className={`${iconSizes[size]} text-white`} />
        ) : (
          <Play className={`${iconSizes[size]} text-white ml-0.5`} />
        )}
      </button>

      <button
        onClick={onNext}
        className={`text-slate-400 hover:text-white transition-colors ${buttonSizes[size]}`}
        title="Siguiente canción"
      >
        <SkipForward className={iconSizes[size]} />
      </button>

      <button
        onClick={onRepeat}
        className={`transition-colors relative ${
          repeatMode !== 'none'
            ? 'text-blue-400 bg-blue-500/20'
            : 'text-slate-400 hover:text-white'
        } ${buttonSizes[size]} rounded-full`}
        title={`Repetir: ${repeatMode === 'none' ? 'desactivado' : repeatMode === 'one' ? 'una canción' : 'todas'}`}
      >
        {getRepeatIcon()}
        {repeatMode === 'one' && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default PlaybackControls;