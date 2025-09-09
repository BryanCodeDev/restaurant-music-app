import React from 'react';

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Géneros Musicales</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const IconComponent = genre.icon;
          return (
            <button
              key={genre.id}
              onClick={() => onGenreChange(genre.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                selectedGenre === genre.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-400'
                  : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
              }`}
            >
              <IconComponent className={`h-4 w-4 ${genre.color}`} />
              <span className="text-sm font-medium">{genre.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreFilter;