import React from 'react';
import { Play, Heart, Clock, User, Star, Disc3, Music } from 'lucide-react';
import apiService from '../../services/apiService';

const SongCard = ({
  song,
  isFavorite,
  onToggleFavorite,
  onAddRequest,
  showRequestButton = true,
  planType = 'basic',
  source = 'bd' // 'bd' | 'spotify'
}) => {
  const handleRequest = () => {
    onAddRequest(song);
  };

  const handleFavorite = () => {
    onToggleFavorite(song);
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return 'text-emerald-400 bg-emerald-500/20';
    if (popularity >= 75) return 'text-blue-400 bg-blue-500/20';
    if (popularity >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-slate-400 bg-slate-500/20';
  };

  const formatDuration = (durationMs) => {
    if (!durationMs) return '0:00';
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 card-hover">
      
      {/* Imagen del álbum con overlay de play */}
      <div className="relative overflow-hidden">
        <img 
          src={song.image || song.preview_image || (source === 'spotify' ? song.album?.images?.[1]?.url : '/default-album.jpg')}
          alt={`${song.title} - ${song.artist || song.artists?.[0]?.name}`}
          className="w-full h-44 sm:h-48 md:h-52 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = source === 'spotify' ? song.album?.images?.[0]?.url : '/default-album.jpg';
          }}
        />
        
        {/* Overlay con botón de play */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-white">
              <Play className="h-6 w-6 ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
        
        {/* Badge de popularidad */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPopularityColor(song.popularity || song.popularity_score)}`}>
            <Star className="h-3 w-3" />
            <span>{song.popularity || song.popularity_score || 0}</span>
          </div>
          {/* Source Badge */}
          {source === 'spotify' && (
            <div className="absolute top-3 left-3 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full text-xs font-medium">
              <Music className="h-3 w-3 inline mr-1" />
              Spotify
            </div>
          )}
        </div>
      </div>

      {/* Información de la canción */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Título y artista */}
        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg truncate group-hover:text-blue-300 transition-colors">
            {song.title || song.name}
          </h3>
          <div className="flex items-center text-slate-400 text-sm space-x-2">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{song.artist || song.artists?.[0]?.name || 'Unknown Artist'}</span>
          </div>
        </div>
        
        {/* Metadatos */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{song.duration || formatDuration(song.duration_ms)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Disc3 className="h-3 w-3" />
            <span>{song.year || song.album?.release_date?.split('-')[0] || 'N/A'}</span>
          </div>
        </div>

        {/* Tag del género */}
        <div className="flex justify-start">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30">
            {song.genre || (source === 'spotify' ? song.explicit ? 'Explicit' : 'Pop' : 'General')}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="flex items-center justify-between gap-3">
          {/* Botón de favorito */}
          <button
            onClick={handleFavorite}
            className={`
              group/fav flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 max-w-[120px]
              ${isFavorite
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700 hover:text-red-400 hover:border-red-500/30'
              }
            `}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite ? 'fill-current scale-110' : 'group-hover/fav:scale-110'
              }`} 
            />
            <span className="hidden sm:inline">
              {isFavorite ? 'Favorito' : 'Me gusta'}
            </span>
            {/* Preview audio for basic plan */}
            {planType === 'basic' && song.preview_url && (
              <audio controls className="hidden" src={song.preview_url} />
            )}
          </button>

          {/* Botón de petición */}
          {showRequestButton && (
            <button
              onClick={handleRequest}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 flex-1 btn-hover-glow"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              <span>Pedir</span>
            </button>
          )}
        </div>
      </div>

      {/* Borde decorativo */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-purple-400/0 group-hover:from-blue-400/5 group-hover:to-purple-400/5 transition-all duration-700 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default SongCard;