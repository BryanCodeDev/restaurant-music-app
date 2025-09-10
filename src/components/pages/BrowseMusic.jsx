import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Heart, 
  Clock, 
  Music,
  Volume2,
  Star,
  TrendingUp
} from 'lucide-react';
import { useRestaurantMusic } from '../../hooks/useRestaurantMusic';

const BrowseMusic = ({ restaurantSlug, favorites, requests, userSession }) => {
  const {
    songs,
    songsLoading,
    error,
    currentGenre,
    searchTerm,
    loadSongs,
    searchSongs,
    filterByGenre,
    setSearch,
    addRequest,
    toggleFavorite,
    isFavorite
  } = useRestaurantMusic(restaurantSlug);

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [requestingId, setRequestingId] = useState(null);

  const genres = [
    { id: 'all', name: 'Todos', emoji: '🎵' },
    { id: 'rock', name: 'Rock', emoji: '🎸' },
    { id: 'pop', name: 'Pop', emoji: '✨' },
    { id: 'reggaeton', name: 'Reggaeton', emoji: '🔥' },
    { id: 'salsa', name: 'Salsa', emoji: '💃' },
    { id: 'electronic', name: 'Electrónica', emoji: '🎛️' },
    { id: 'ballad', name: 'Baladas', emoji: '❤️' },
    { id: 'hip-hop', name: 'Hip Hop', emoji: '🎤' },
    { id: 'jazz', name: 'Jazz', emoji: '🎷' },
    { id: 'classical', name: 'Clásica', emoji: '🎼' },
    { id: 'reggae', name: 'Reggae', emoji: '🌿' },
    { id: 'funk', name: 'Funk', emoji: '🕺' }
  ];

  useEffect(() => {
    if (restaurantSlug) {
      loadSongs();
    }
  }, [restaurantSlug]);

  const handleSearch = async (term) => {
    setLocalSearchTerm(term);
    await setSearch(term);
  };

  const handleGenreFilter = async (genreId) => {
    setSelectedGenre(genreId);
    await filterByGenre(genreId);
  };

  const handleRequestSong = async (song) => {
    if (requestingId) return;
    
    setRequestingId(song.id);
    try {
      const success = await addRequest(song);
      if (!success) {
        // El error se maneja en el hook
      }
    } finally {
      setRequestingId(null);
    }
  };

  const handleToggleFavorite = async (song) => {
    await toggleFavorite(song);
  };

  const isRequested = (songId) => {
    return requests.some(request => 
      request.song?.id === songId && 
      ['pending', 'playing'].includes(request.status)
    );
  };

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
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explorar Música
          </span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Descubre y solicita tu música favorita
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por título, artista o álbum..."
              className="w-full pl-12 pr-6 py-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreFilter(genre.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedGenre === genre.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800/40 text-slate-300 border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              <span>{genre.emoji}</span>
              <span>{genre.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400">
          {songs.length} canción{songs.length !== 1 ? 'es' : ''} encontrada{songs.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <TrendingUp className="h-4 w-4" />
          <span>Populares primero</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {songsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800/40 rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-slate-700/50 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
              <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Songs Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song, index) => (
            <div
              key={song.id}
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
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleToggleFavorite(song)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                      isFavorite(song.id)
                        ? 'bg-red-500/80 text-white'
                        : 'bg-slate-900/80 text-slate-300 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(song.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 left-4 px-2 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs rounded-full">
                  {formatDuration(song.duration)}
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
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                    {genres.find(g => g.id === song.genre)?.name || song.genre}
                  </span>
                  {song.popularity && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs">{song.popularity}</span>
                    </div>
                  )}
                </div>

                {/* Request Button */}
                <button
                  onClick={() => handleRequestSong(song)}
                  disabled={isRequested(song.id) || requestingId === song.id}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isRequested(song.id)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                      : requestingId === song.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg shadow-blue-500/25'
                  }`}
                >
                  {requestingId === song.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : isRequested(song.id) ? (
                    <>
                      <Clock className="h-4 w-4" />
                      <span>En Cola</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Pedir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!songsLoading && songs.length === 0 && (
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
            <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
              <Music className="h-16 w-16 text-slate-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-400 mb-4">
            No se encontraron canciones
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Intenta cambiar los filtros o términos de búsqueda para encontrar música.
          </p>
          <button
            onClick={() => {
              handleSearch('');
              handleGenreFilter('all');
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Ver Toda la Música
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseMusic;