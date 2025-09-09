import React, { useState, useEffect } from 'react';
import SearchBar from '../music/SearchBar';
import GenreFilter from '../music/GenreFilter';
import SongCard from '../music/SongCard';
import { Music, Filter, X, SlidersHorizontal, Grid, List, AlertCircle } from 'lucide-react';
import { useRestaurantMusic } from '../../hooks/useRestaurantMusic';

const BrowseMusic = ({ restaurantSlug }) => {
  const {
    songs,
    favorites,
    loading,
    songsLoading,
    error,
    currentGenre,
    searchTerm,
    userSession,
    addRequest,
    toggleFavorite,
    isFavorite,
    filterByGenre,
    setSearch,
    clearError,
    stats
  } = useRestaurantMusic(restaurantSlug);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const clearFilters = () => {
    setSearch('');
    filterByGenre('all');
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || currentGenre !== 'all';

  const handleAddRequest = async (song) => {
    const success = await addRequest(song);
    if (success) {
      // Mostrar notificación de éxito
      console.log('Petición enviada exitosamente');
    }
  };

  const handleToggleFavorite = async (song) => {
    await toggleFavorite(song);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-6 sm:py-8 pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Cargando biblioteca musical...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4 lg:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-lg"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
                <Music className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explorar Música
            </h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Descubre y pide tus canciones favoritas de nuestra extensa biblioteca musical
          </p>
          
          {/* User Session Info */}
          {userSession && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-400">Conectado como:</span>
              <span className="ml-2 font-semibold text-blue-400">{userSession.tableNumber}</span>
            </div>
          )}
        </div>

        {/* Search and Controls Bar */}
        <div className="mb-6 lg:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearch}
                placeholder="Buscar canciones, artistas o álbumes..."
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm border transition-all duration-300
                  ${showFilters || hasActiveFilters
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-slate-800/40 text-slate-300 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
                  }
                `}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* View Mode Toggle - Solo visible en desktop */}
              <div className="hidden lg:flex items-center bg-slate-800/40 border border-slate-700/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-center sm:justify-start">
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
              >
                <X className="h-4 w-4" />
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}
        </div>

        {/* Genre Filters */}
        <div className={`
          mb-6 lg:mb-8 transition-all duration-500 overflow-hidden
          ${showFilters 
            ? 'max-h-96 opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 transform -translate-y-4 lg:max-h-96 lg:opacity-100 lg:transform-none'
          }
        `}>
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-2xl p-4 sm:p-6">
            <GenreFilter 
              selectedGenre={currentGenre}
              onGenreChange={filterByGenre}
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <p className="text-slate-300 text-sm sm:text-base">
                <span className="font-semibold text-white">{songs.length}</span> 
                {' '}canción{songs.length !== 1 ? 'es' : ''} encontrada{songs.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <>
                    {' '}para <span className="text-blue-400 font-medium">"{searchTerm}"</span>
                  </>
                )}
              </p>
              
              {/* Indicadores de filtros activos */}
              {currentGenre !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentGenre}
                </span>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>Favoritos: {stats.totalFavorites}</span>
              <span>Peticiones: {stats.pendingRequests}</span>
            </div>
          </div>
        </div>

        {/* Loading indicator for songs */}
        {songsLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-slate-400">Cargando canciones...</p>
          </div>
        )}

        {/* Songs Grid/List */}
        {!songsLoading && songs.length > 0 ? (
          <div className={`
            animate-fade-in-up
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
              : 'space-y-4'
            }
          `}>
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SongCard
                  song={song}
                  isFavorite={isFavorite(song.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddRequest={handleAddRequest}
                />
              </div>
            ))}
          </div>
        ) : !songsLoading && (
          <div className="text-center py-16 lg:py-24 animate-fade-in-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
              <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
                <Music className="h-16 w-16 text-slate-500" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-400 mb-4">
              No se encontraron canciones
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {hasActiveFilters 
                ? 'Intenta ajustar tus filtros o términos de búsqueda para encontrar más resultados.'
                : 'No hay canciones disponibles en este momento.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Music className="h-5 w-5" />
                <span>Ver todas las canciones</span>
              </button>
            )}
          </div>
        )}

        {/* Load More Button - Para futuras implementaciones */}
        {songs.length >= 20 && (
          <div className="text-center mt-12 lg:mt-16">
            <button className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">
              Cargar más canciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseMusic;