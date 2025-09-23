import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const VolumeControl = ({
  volume = 75,
  onVolumeChange,
  className = '',
  showLabel = false
}) => {
  const [showSlider, setShowSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(volume === 0);

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange?.(75); // Restore to 75% when unmuting
    } else {
      setIsMuted(true);
      onVolumeChange?.(0);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  };

  const currentVolume = isMuted ? 0 : volume;

  return (
    <div className={`flex items-center space-x-2 relative ${className}`}>
      <button
        onClick={handleVolumeToggle}
        onMouseEnter={() => setShowSlider(true)}
        className="p-2 text-slate-400 hover:text-white transition-colors"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted || currentVolume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {showLabel && (
        <span className="text-xs text-slate-400 min-w-[2rem]">
          {currentVolume}%
        </span>
      )}

      <div
        className={`transition-all duration-300 overflow-hidden ${
          showSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={currentVolume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${currentVolume}%, #374151 ${currentVolume}%, #374151 100%)`
          }}
        />
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

export default VolumeControl;