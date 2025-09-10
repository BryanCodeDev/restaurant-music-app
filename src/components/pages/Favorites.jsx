import React, { useState } from 'react';
import { 
  Heart, 
  Play, 
  Music, 
  Clock, 
  Star, 
  Trash2,
  SortDesc,
  Filter
} from 'lucide-react';

const Favorites = ({ 
  favorites = [], 
  onToggleFavorite, 
  onAddRequest, 
  restaurantSlug 
}) => {
  const [requestingId, setRequestingId] = useState(null);
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'artist'
  const [filterGenre, setFilterGenre] = useState('all');

  // Obtener géneros únicos de favoritos
  const availableGenres = [...new Set(favorites.map(fav => fav.genre))].filter(Boolean);

  const handleRequestSong = async (song) => {
    if (requestingId || !onAddRequest) return;
    
    setRequestingId(song.id);
    try {
      await onAddRequest(song);
    } finally {
      setRequestingId(null);
    }
  };

  const handleRemoveFavorite = async (song) => {
    if (onToggleFavorite) {
      await onToggleFavorite(song);
    }
  };

  const sortedAndFilteredFavorites = favorites
    .filter(fav => filterGenre === 'all' || fav.genre === filterGenre)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });

  const formatDuration = (duration) => {
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Mis Favoritos
          </span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Tu música favorita, siempre a mano
        </p>
      </div>

      {/* Stats and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4 text-slate-400">
          <Heart className="h-5 w-5 text-red-400" />
          <span>{favorites.length} canción{favorites.length !== 1 ? 'es' : ''} favorita{favorites.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Genre Filter */}
          {availableGenres.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos los géneros</option>
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <SortDesc className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dateAdded">Más recientes</option>
              <option value="title">Título A-Z</option>
              <option value="artist">Artista A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {sortedAndFilteredFavorites.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
              <Heart className="h-16 w-16 text-slate-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-400 mb-4">
            {favorites.length === 0 ? 'No tienes favoritos aún' : 'No hay favoritos en este filtro'}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {favorites.length === 0 
              ? 'Explora nuestro catálogo y agrega canciones a favoritos con el ❤️'
              : 'Intenta cambiar el filtro para ver más canciones'
            }
          </p>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredFavorites.map((song, index) => (
            <div
              key={`${song.id}-${song.dateAdded}`}
              className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Song Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={song.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'}
                  alt={`${song.title} - ${song.artist}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Remove from Favorites Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleRemoveFavorite(song)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-200"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Duration and Heart Badge */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <div className="px-2 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs rounded-full">
                    {formatDuration(song.duration)}
                  </div>
                  <div className="p-1 bg-red-500/80 backdrop-blur-md rounded-full">
                    <Heart className="h-3 w-3 text-white fill-current" />
                  </div>
                </div>
              </div>

              {/* Song Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-1">
                    {song.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-1">
                    {song.artist}
                  </p>
                  {song.album && (
                    <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                      {song.album} • {song.year}
                    </p>
                  )}
                </div>

                {/* Genre and Popularity */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                    {song.genre}
                  </span>
                  {song.popularity && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs">{song.popularity}</span>
                    </div>
                  )}
                </div>

                {/* Date Added */}
                {song.dateAdded && (
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Agregado {new Date(song.dateAdded).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}

                {/* Request Button */}
                <button
                  onClick={() => handleRequestSong(song)}
                  disabled={requestingId === song.id}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    requestingId === song.id
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transform hover:scale-105 shadow-lg shadow-red-500/25'
                  }`}
                >
                  {requestingId === song.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Pedir Canción</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {favorites.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8 text-center">
          <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">
            ¡Perfecto!
          </h3>
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tienes {favorites.length} canción{favorites.length !== 1 ? 'es' : ''} en favoritos. 
            Puedes pedirlas directamente desde aquí o seguir explorando para encontrar más música.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;