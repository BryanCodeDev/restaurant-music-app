import React, { useState } from 'react';
import SongCard from './SongCard';
import { 
  Music, 
  Filter, 
  Grid3x3, 
  List, 
  SortAsc, 
  SortDesc, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

const SongList = ({
  songs = [],
  favorites = [],
  userRequests = [],
  onToggleFavorite,
  onAddRequest,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No se encontraron canciones",
  showRequestButton = true,
  maxRequestsReached = false,
  currentFilter = 'all',
  totalSongs = 0,
  hasMore = false,
  onLoadMore,
  planType = 'basic' // Nuevo prop para dual UI
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'artist', 'popularity', 'year'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Función para verificar si una canción es favorita
  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  // Función para verificar si una canción ya fue solicitada
  const isRequested = (songId) => {
    return userRequests.some(req => 
      req.song_id === songId && ['pending', 'playing'].includes(req.status)
    );
  };

  // Función para ordenar canciones
  const sortSongs = (songsToSort) => {
    return [...songsToSort].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'artist':
          valueA = typeof a.artist === 'string' ? a.artist : a.artists?.[0]?.name || '';
          valueB = typeof b.artist === 'string' ? b.artist : b.artists?.[0]?.name || '';
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
          break;
        case 'popularity':
          valueA = a.popularity || a.popularity_score || 0;
          valueB = b.popularity || b.popularity_score || 0;
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
          if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
          }
      }
      
      // Manejar undefined/null
      if (valueA == null) valueA = '';
      if (valueB == null) valueB = '';

      const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Toggle sort order
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Preparar canciones para mostrar
  const sortedSongs = sortSongs(songs);

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 animate-pulse">
          <div className="w-full h-48 bg-slate-700 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t border-slate-700/50">
            <div className="h-8 bg-slate-700 rounded w-20"></div>
            <div className="h-8 bg-slate-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  const renderError = () => (
    <div className="text-center py-12">
      <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-red-400 mb-2">
        Error al cargar las canciones
      </h3>
      <p className="text-slate-400 mb-4">
        {error || 'Hubo un problema al conectar con el servidor'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Intentar de nuevo</span>
        </button>
      )}
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <Music className="h-20 w-20 text-slate-500 mx-auto mb-6" />
      <h3 className="text-2xl font-semibold text-slate-300 mb-3">
        {emptyMessage}
      </h3>
      <div className="space-y-2 text-slate-400">
        <p>No hay canciones que coincidan con tu búsqueda.</p>
        {planType === 'pro' && !searchTerm && (
          <p className="text-sm">
            Conecta tu cuenta de Spotify para acceder a millones de canciones.
          </p>
        )}
        {currentFilter !== 'all' && (
          <p className="text-sm">
            Intenta cambiar el filtro o buscar términos diferentes
          </p>
        )}
      </div>
    </div>
  );

  // Main render logic
  if (loading && songs.length === 0) {
    return renderLoadingSkeleton();
  }

  if (error && songs.length === 0) {
    return renderError();
  }

  if (!loading && songs.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        {/* Info y contadores */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-slate-300 font-medium">
              {loading && songs.length > 0 ? (
                <span className="flex items-center space-x-2">
                  <span>Mostrando {songs.length} canción{songs.length !== 1 ? 'es' : ''}</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                `Mostrando ${songs.length} de ${totalSongs || songs.length} canción${songs.length !== 1 ? 'es' : ''}`
              )}
            </p>
            {currentFilter !== 'all' && (
              <p className="text-sm text-slate-500">
                Filtrado por: <span className="text-blue-400 capitalize">{currentFilter}</span>
              </p>
            )}
            {/* Source counts */}
            {planType === 'pro' && songs.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-slate-400">Fuentes: </span>
                <span className="mr-2">{sortedSongs.filter(s => s.source === 'bd').length} BD</span>
                <span>{sortedSongs.filter(s => s.source === 'spotify').length} Spotify</span>
              </p>
            )}
          </div>
        </div>

        {/* Controles de vista y ordenamiento */}
        <div className="flex items-center space-x-3">
          {/* Sort controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Ordenar:</span>
            <div className="flex items-center space-x-1">
              {[
                { id: 'title', label: 'Título' },
                { id: 'artist', label: 'Artista' },
                { id: 'popularity', label: 'Popular' },
                { id: 'year', label: 'Año' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === option.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.id && (
                    sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className="w-px h-6 bg-slate-600"></div>

          {/* View mode toggle */}
          <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de cuadrícula"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de canciones */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 lg:grid-cols-2'
      }`}>
        {sortedSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavorite={isFavorite(song.id)}
            onToggleFavorite={onToggleFavorite}
            onAddRequest={onAddRequest}
            showRequestButton={showRequestButton}
            isRequested={isRequested(song.id)}
            userRequests={userRequests}
            maxRequestsReached={maxRequestsReached}
            disabled={loading}
            planType={planType}
            source={song.source}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            <Music className="h-4 w-4" />
            <span>Cargar más canciones</span>
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {loading && songs.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-xl text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando más canciones...</span>
          </div>
        </div>
      )}

      {/* Mensaje para scroll infinito */}
      {!hasMore && songs.length >= 20 && !loading && (
        <div className="text-center py-8 border-t border-slate-700/50">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/30 rounded-xl text-slate-400">
            <Music className="h-4 w-4" />
            <span>Has visto todas las canciones disponibles</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            ¿No encuentras lo que buscas? Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default SongList;