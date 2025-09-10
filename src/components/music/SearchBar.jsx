import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, TrendingUp, Clock, Music } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar canciones, artistas o álbumes...",
  isLoading = false,
  recentSearches = [],
  popularSearches = [],
  onClearRecent,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionBoxRef = useRef(null);

  // Manejar click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionBoxRef.current && 
        !suggestionBoxRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const handleInputChange = (value) => {
    onSearchChange(value);
    setShowSuggestions(value.trim().length === 0 && (recentSearches.length > 0 || popularSearches.length > 0));
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(searchTerm.trim().length === 0 && (recentSearches.length > 0 || popularSearches.length > 0));
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Pequeño delay para permitir clicks en sugerencias
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Input Field */}
      <div className={`relative transition-all duration-200 ${
        isFocused 
          ? 'transform scale-[1.02]' 
          : ''
      }`}>
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
          isFocused ? 'text-blue-400' : 'text-slate-400'
        }`}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 backdrop-blur-md border-2 rounded-2xl text-white placeholder-slate-400 
            focus:outline-none focus:ring-4 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed ${
            isFocused
              ? 'border-blue-500 bg-slate-800/70 focus:ring-blue-500/20 shadow-lg shadow-blue-500/10'
              : 'border-slate-700/50 hover:border-slate-600/70'
          }`}
        />
        
        {searchTerm && !disabled && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-white text-slate-400 transition-colors duration-200 group"
            title="Limpiar búsqueda"
          >
            <div className="p-1 rounded-full group-hover:bg-slate-700/50 transition-colors">
              <X className="h-4 w-4" />
            </div>
          </button>
        )}
      </div>

      {/* Suggestions Box */}
      {showSuggestions && !disabled && (
        <div 
          ref={suggestionBoxRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div className="p-4 border-b border-slate-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-slate-300">Búsquedas populares</span>
              </div>
              <div className="space-y-2">
                {popularSearches.slice(0, 4).map((search, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-lg">
                      <Music className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Búsquedas recientes</span>
                </div>
                {onClearRecent && (
                  <button
                    onClick={onClearRecent}
                    className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center space-x-3 group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="truncate flex-1">{search}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3 text-slate-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {popularSearches.length === 0 && recentSearches.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                Busca canciones, artistas o álbumes
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Search Tips */}
      {isFocused && searchTerm.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1">
          <div className="text-xs text-slate-500 px-4 py-2">
            <span>Consejo: </span>
            <span className="text-slate-400">
              Prueba buscar por título, artista, álbum o género
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span className="text-sm text-slate-300">Buscando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;