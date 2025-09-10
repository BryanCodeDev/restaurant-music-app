import React from 'react';
import { 
  Music, 
  Guitar, 
  Mic2, 
  Radio, 
  Headphones, 
  Volume2,
  Disc3,
  Heart,
  Zap,
  Sparkles,
  Crown,
  Flame
} from 'lucide-react';

const GenreFilter = ({ selectedGenre, onGenreChange, availableGenres = [] }) => {
  // Géneros predefinidos con sus iconos y colores
  const genreConfig = {
    'all': { 
      name: 'Todos', 
      icon: Music, 
      color: 'text-white',
      bgColor: 'from-slate-500 to-slate-600'
    },
    'rock': { 
      name: 'Rock', 
      icon: Guitar, 
      color: 'text-red-400',
      bgColor: 'from-red-500 to-orange-500'
    },
    'pop': { 
      name: 'Pop', 
      icon: Sparkles, 
      color: 'text-pink-400',
      bgColor: 'from-pink-500 to-purple-500'
    },
    'jazz': { 
      name: 'Jazz', 
      icon: Volume2, 
      color: 'text-amber-400',
      bgColor: 'from-amber-500 to-yellow-500'
    },
    'reggaeton': { 
      name: 'Reggaeton', 
      icon: Flame, 
      color: 'text-green-400',
      bgColor: 'from-green-500 to-emerald-500'
    },
    'electronic': { 
      name: 'Electronic', 
      icon: Zap, 
      color: 'text-cyan-400',
      bgColor: 'from-cyan-500 to-blue-500'
    },
    'hip-hop': { 
      name: 'Hip-Hop', 
      icon: Mic2, 
      color: 'text-purple-400',
      bgColor: 'from-purple-500 to-indigo-500'
    },
    'hiphop': { 
      name: 'Hip-Hop', 
      icon: Mic2, 
      color: 'text-purple-400',
      bgColor: 'from-purple-500 to-indigo-500'
    },
    'salsa': { 
      name: 'Salsa', 
      icon: Heart, 
      color: 'text-red-400',
      bgColor: 'from-red-500 to-rose-500'
    },
    'reggae': { 
      name: 'Reggae', 
      icon: Radio, 
      color: 'text-green-400',
      bgColor: 'from-green-500 to-lime-500'
    },
    'classical': { 
      name: 'Clásica', 
      icon: Crown, 
      color: 'text-violet-400',
      bgColor: 'from-violet-500 to-purple-500'
    },
    'ballad': { 
      name: 'Baladas', 
      icon: Heart, 
      color: 'text-rose-400',
      bgColor: 'from-rose-500 to-pink-500'
    },
    'funk': { 
      name: 'Funk', 
      icon: Disc3, 
      color: 'text-orange-400',
      bgColor: 'from-orange-500 to-red-500'
    }
  };

  // Combinar géneros disponibles del servidor con configuración predefinida
  const getDisplayGenres = () => {
    const genres = [{ id: 'all', name: 'Todos', count: 0 }];
    
    // Si hay géneros disponibles del servidor, usarlos
    if (availableGenres.length > 0) {
      availableGenres.forEach(genre => {
        const genreKey = genre.genre || genre.name || genre;
        const genreData = genreConfig[genreKey.toLowerCase()] || {
          name: genreKey.charAt(0).toUpperCase() + genreKey.slice(1),
          icon: Music,
          color: 'text-slate-400',
          bgColor: 'from-slate-500 to-slate-600'
        };
        
        genres.push({
          id: genreKey.toLowerCase(),
          name: genreData.name,
          icon: genreData.icon,
          color: genreData.color,
          bgColor: genreData.bgColor,
          count: genre.count || 0
        });
      });
    } else {
      // Fallback: mostrar géneros predefinidos más comunes
      const commonGenres = ['rock', 'pop', 'jazz', 'reggaeton', 'electronic', 'hip-hop', 'salsa'];
      commonGenres.forEach(genreKey => {
        const genreData = genreConfig[genreKey];
        genres.push({
          id: genreKey,
          name: genreData.name,
          icon: genreData.icon,
          color: genreData.color,
          bgColor: genreData.bgColor,
          count: 0
        });
      });
    }
    
    return genres;
  };

  const genres = getDisplayGenres();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Music className="h-5 w-5 text-purple-400" />
          <span>Géneros Musicales</span>
        </h3>
        
        {selectedGenre !== 'all' && (
          <button
            onClick={() => onGenreChange('all')}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => {
          const IconComponent = genre.icon;
          const isSelected = selectedGenre === genre.id;
          
          return (
            <button
              key={genre.id}
              onClick={() => onGenreChange(genre.id)}
              className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 border ${
                isSelected
                  ? `bg-gradient-to-r ${genre.bgColor} text-white border-white/30 shadow-lg shadow-purple-500/25`
                  : 'bg-slate-800/40 text-slate-300 border-slate-700/50 hover:bg-slate-800/60 hover:text-white hover:border-slate-600'
              }`}
            >
              {/* Icono */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isSelected 
                  ? 'bg-white/20' 
                  : 'bg-slate-700/50 group-hover:bg-slate-700'
              } transition-colors`}>
                <IconComponent className={`h-4 w-4 ${
                  isSelected 
                    ? 'text-white' 
                    : `${genre.color} group-hover:text-white`
                } transition-colors`} />
              </div>
              
              {/* Texto */}
              <div className="flex flex-col items-start">
                <span className="font-semibold">{genre.name}</span>
                {genre.count > 0 && (
                  <span className="text-xs opacity-75">
                    {genre.count} canciones
                  </span>
                )}
              </div>
              
              {/* Indicator de selección */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-purple-500 animate-pulse"></div>
              )}
              
              {/* Efecto de hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-transparent transition-all duration-300 rounded-xl pointer-events-none"></div>
            </button>
          );
        })}
      </div>
      
      {/* Información adicional */}
      <div className="text-xs text-slate-500 text-center pt-2">
        {selectedGenre === 'all' 
          ? 'Mostrando todos los géneros disponibles'
          : `Filtrando por ${genres.find(g => g.id === selectedGenre)?.name || selectedGenre}`
        }
      </div>
    </div>
  );
};

export default GenreFilter;