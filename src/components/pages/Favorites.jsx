import React, { useState } from 'react';
import SongCard from '../music/SongCard';
import { 
  Heart, 
  Music, 
  Play, 
  Shuffle, 
  Plus, 
  Download,
  Share2,
  Filter,
  Grid,
  List,
  SortAsc
} from 'lucide-react';

const Favorites = ({ favorites = [], onToggleFavorite, onAddRequest }) => {
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'artist', 'popularity'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showActions, setShowActions] = useState(false);

  const sortOptions = [
    { value: 'dateAdded', label: 'Fecha agregada' },
    { value: 'title', label: 'Título' },
    { value: 'artist', label: 'Artista' },
    { value: 'popularity', label: 'Popularidad' }
  ];

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'popularity':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'dateAdded':
      default:
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
    }
  });

  const handlePlayAll = () => {
    favorites.forEach(song => onAddRequest(song));
  };

  const handleShuffle = () => {
    const shuffled = [...favorites].sort(() => Math.random() - 0.5);
    shuffled.slice(0, 10).forEach(song => onAddRequest(song)); // Limitar a 10 canciones
  };

  const getGenreStats = () => {
    const genreCounts = {};
    favorites.forEach(song => {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
    });
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4 lg:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-slate-300 text-base sm:text-lg">
            Tus canciones favoritas en un solo lugar
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Stats and Quick Actions */}
            <div className="mb-8 lg:mb-12 animate-fade-in-up">
              <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 lg:p-8">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {favorites.length}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      Canción{favorites.length !== 1 ? 'es' : ''} favorita{favorites.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {new Set(favorites.map(s => s.artist)).size}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      Artistas únicos
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      {new Set(favorites.map(s => s.genre)).size}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      Géneros diferentes
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      {Math.round(favorites.reduce((acc, song) => {
                        const [min, sec] = song.duration.split(':').map(Number);
                        return acc + (min * 60 + sec);
                      }, 0) / 60)}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      Minutos totales
                    </div>
                  </div>
                </div>

                {/* Genre Distribution */}
                {getGenreStats().length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3 text-center lg:text-left">
                      Géneros favoritos:
                    </h3>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      {getGenreStats().map(([genre, count]) => (
                        <span 
                          key={genre}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {genre} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    onClick={handlePlayAll}
                    className="group flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                    <span>Reproducir Todas</span>
                  </button>
                  
                  <button
                    onClick={handleShuffle}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all duration-300"
                  >
                    <Shuffle className="h-5 w-5" />
                    <span>Reproducir Aleatoriamente</span>
                  </button>
                  
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all duration-300 lg:hidden"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Más Acciones</span>
                  </button>
                </div>

                {/* Extended Actions - Mobile */}
                {showActions && (
                  <div className="mt-4 pt-4 border-t border-slate-700/30 flex flex-col sm:flex-row gap-3 lg:hidden">
                    <button className="flex items-center justify-center space-x-2 px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200">
                      <Download className="h-4 w-4" />
                      <span>Exportar Lista</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200">
                      <Share2 className="h-4 w-4" />
                      <span>Compartir</span>
                    </button>
                  </div>
                )}

                {/* Extended Actions - Desktop */}
                <div className="hidden lg:flex items-center justify-between mt-6 pt-6 border-t border-slate-700/30">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200">
                      <Download className="h-4 w-4" />
                      <span>Exportar</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2.5 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200">
                      <Share2 className="h-4 w-4" />
                      <span>Compartir</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <SortAsc className="h-4 w-4 text-slate-400" />
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center bg-slate-800/50 border border-slate-600 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className={`
              animate-fade-in-up
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
                : 'space-y-4'
              }
            `}>
              {sortedFavorites.map((song, index) => (
                <div
                  key={song.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <SongCard
                    song={song}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                    onAddRequest={onAddRequest}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 lg:py-24 animate-fade-in-up">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
              <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
                <Heart className="h-16 w-16 text-slate-500" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-400 mb-4">
              No tienes canciones favoritas
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Explora nuestra biblioteca musical y agrega canciones a tus favoritos haciendo clic en el corazón
            </p>
            <button 
              onClick={() => window.location.href = '#browse'}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
            >
              <Music className="h-5 w-5" />
              <span>Explorar Música</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;