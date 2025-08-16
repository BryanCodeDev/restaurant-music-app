import React from 'react';
import SongCard from './SongCard';
import { Music } from 'lucide-react';

const SongList = ({ 
  songs, 
  favorites = [], 
  onToggleFavorite, 
  onAddRequest, 
  loading = false,
  emptyMessage = "No se encontraron canciones",
  showRequestButton = true
}) => {
  
  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
              <div className="h-8 bg-gray-600 rounded w-20"></div>
              <div className="h-8 bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Intenta ajustar tus filtros o términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <p className="text-gray-300 text-sm">
          Mostrando {songs.length} canción{songs.length !== 1 ? 'es' : ''}
        </p>
        
        {/* Opciones de vista (opcional para futuro) */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-purple-400 bg-purple-500/20 rounded-lg">
            <Music className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid de canciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavorite={isFavorite(song.id)}
            onToggleFavorite={onToggleFavorite}
            onAddRequest={onAddRequest}
            showRequestButton={showRequestButton}
          />
        ))}
      </div>

      {/* Mensaje para scroll infinito (futuro) */}
      {songs.length >= 20 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">
            ¿No encuentras lo que buscas? Intenta ser más específico en la búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default SongList;