import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  Music, 
  Users, 
  Clock,
  Headphones,
  ArrowRight,
  Volume2,
  Crown,
  Settings,
  Play,
  Pause,
  Radio,
  Disc,
  Mic2,
  Sparkles,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import apiService from '../../services/apiService';

const RestaurantSelector = ({ onRestaurantSelect, onSwitchToAdmin }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlayingPreview, setCurrentPlayingPreview] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using your existing API service with the correct endpoint
      const response = await apiService.request('/restaurants');
      
      // Handle different possible response structures from your API
      let restaurantData = [];
      if (response.success && response.data) {
        restaurantData = response.data.restaurants || response.data || [];
      } else if (response.restaurants) {
        restaurantData = response.restaurants;
      } else if (Array.isArray(response)) {
        restaurantData = response;
      }
      
      // Transform the API data to include enhanced UI properties while keeping real data
      const enhancedRestaurants = restaurantData.map(restaurant => ({
        ...restaurant,
        // Keep all original API data
        // Add fallback values for enhanced UI features if not provided by API
        coverImage: restaurant.coverImage || restaurant.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&crop=center',
        reviewCount: restaurant.reviewCount || 0,
        activeCustomers: restaurant.activeCustomers || 0,
        totalSongs: restaurant.totalSongs || 0,
        genres: restaurant.genres || ['Música Variada'],
        specialFeatures: restaurant.specialFeatures || [],
        priceRange: restaurant.priceRange || '$',
        musicStyle: restaurant.musicStyle || 'Variado',
        hours: restaurant.hours || (restaurant.isActive ? 'Abierto ahora' : 'Cerrado'),
        currentArtist: restaurant.currentArtist || (restaurant.currentSong ? restaurant.currentSong.split(' - ')[1] : null)
      }));
      
      setRestaurants(enhancedRestaurants);
    } catch (err) {
      console.error('Error loading restaurants:', err);
      setError('Error al cargar restaurantes. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', name: 'Todos', count: restaurants.length },
    { id: 'active', name: 'Abiertos Ahora', count: restaurants.filter(r => r.isActive).length },
    { id: 'premium', name: 'Premium', count: restaurants.filter(r => r.priceRange && r.priceRange.length >= 3).length },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (restaurant.genres && restaurant.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase())));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && restaurant.isActive;
    if (selectedFilter === 'premium') return matchesSearch && restaurant.priceRange && restaurant.priceRange.length >= 3;
    
    return matchesSearch;
  });

  const handlePreviewPlay = (restaurantId) => {
    setCurrentPlayingPreview(currentPlayingPreview === restaurantId ? null : restaurantId);
  };

  const handleRestaurantSelect = (restaurant) => {
    onRestaurantSelect(restaurant);
  };

  const handleRetry = () => {
    loadRestaurants();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 blur-2xl animate-pulse"></div>
            <div className="relative w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sintonizando MusicMenu</h2>
          <p className="text-slate-400">Cargando restaurantes disponibles...</p>
          <div className="flex justify-center mt-6 space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-8 bg-blue-500 rounded-full animate-pulse" 
                   style={{ animationDelay: `${i * 0.3}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '60s' }}></div>
      </div>

      {/* Floating Music Notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} 
               className="absolute text-blue-300/20 animate-bounce" 
               style={{ 
                 left: `${Math.random() * 100}%`, 
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 4}s`,
                 animationDuration: `${3 + Math.random() * 2}s`
               }}>
            <Music className="h-6 w-6" />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Header */}
        <div className="text-center mb-16 lg:mb-20 relative">
          
          {/* Main Logo Animation */}
          <div className="flex justify-center mb-8 lg:mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 lg:p-10 rounded-full border border-slate-700/50 group-hover:border-blue-500/50 transition-all duration-500">
                <div className="relative">
                  <Headphones className="h-20 w-20 sm:h-24 sm:w-24 text-blue-400 group-hover:text-purple-400 transition-colors duration-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dynamic Title */}
          <div className="relative mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-none">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicMenu
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-4 text-xl lg:text-2xl font-semibold text-slate-300">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              <span>Tu música, tu momento, tu elección</span>
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          {/* Value Proposition */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed mb-8">
              Convierte cada comida en una experiencia única. Elige la banda sonora perfecta mientras disfrutas de los mejores sabores de la ciudad.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Radio, text: 'Música en Vivo', color: 'from-blue-500 to-cyan-500' },
                { icon: Mic2, text: 'Peticiones Instantáneas', color: 'from-purple-500 to-pink-500' },
                { icon: Award, text: 'Experiencia Premium', color: 'from-yellow-500 to-orange-500' },
              ].map((feature, index) => (
                <div key={index} className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} bg-opacity-20 backdrop-blur-sm border border-white/10 rounded-full text-white text-sm font-medium`}>
                  <feature.icon className="h-4 w-4" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar - Using real data */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-white mb-1">
                {restaurants.length || '0'}
              </div>
              <div className="text-slate-400 text-sm">Restaurantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-white mb-1">
                {restaurants.reduce((sum, r) => sum + (r.totalSongs || 0), 0) || '10K+'}
              </div>
              <div className="text-slate-400 text-sm">Canciones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-slate-400 text-sm">Disponible</div>
            </div>
          </div>
        </div>

        {/* Admin Access - More Prominent */}
        <div className="flex justify-center mb-12">
          <button
            onClick={onSwitchToAdmin}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-2xl shadow-yellow-500/25 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Crown className="h-6 w-6 relative z-10 group-hover:animate-bounce" />
            <span className="relative z-10">Portal Administrador</span>
            <Zap className="h-5 w-5 relative z-10 group-hover:animate-pulse" />
          </button>
        </div>

        {/* Enhanced Search Section */}
        <div className="mb-12 space-y-8">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por restaurante, ubicación o estilo musical..."
                  className="w-full pl-16 pr-6 py-6 bg-transparent text-white text-lg placeholder-slate-400 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                  <div className="flex items-center space-x-2 text-slate-500 text-sm">
                    <Music className="h-4 w-4" />
                    <span>Buscar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`group flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105'
                    : 'bg-slate-800/40 text-slate-300 border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <span>{filter.name}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50'
                }`}>
                  {filter.count}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl text-center">
            <div className="text-red-300 text-lg font-semibold mb-2">{error}</div>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-500/30 hover:bg-red-500/50 border border-red-400/50 rounded-xl text-red-200 font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Results Counter */}
        {!error && (
          <div className="text-center mb-8">
            <p className="text-slate-400 text-lg">
              {filteredRestaurants.length} experiencia{filteredRestaurants.length !== 1 ? 's' : ''} musical{filteredRestaurants.length !== 1 ? 'es' : ''} disponible{filteredRestaurants.length !== 1 ? 's' : ''}
              {searchTerm && (
                <span className="text-blue-400 font-semibold"> para "{searchTerm}"</span>
              )}
            </p>
          </div>
        )}

        {/* Enhanced Restaurant Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden hover:bg-slate-800/60 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer transform"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => handleRestaurantSelect(restaurant)}
            >
              {/* Premium Badge */}
              {restaurant.priceRange && restaurant.priceRange.length >= 3 && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                    <Award className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                  restaurant.isActive 
                    ? 'bg-emerald-500/90 text-white border border-emerald-400/50' 
                    : 'bg-red-500/90 text-white border border-red-400/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    restaurant.isActive ? 'bg-white animate-pulse' : 'bg-white/70'
                  }`}></div>
                  <span>{restaurant.isActive ? 'En Vivo' : 'Cerrado'}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={restaurant.coverImage} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&crop=center';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                {/* Play Preview Button */}
                {restaurant.isActive && restaurant.currentSong && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewPlay(restaurant.id);
                      }}
                      className={`flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border-2 transition-all duration-300 ${
                        currentPlayingPreview === restaurant.id
                          ? 'bg-red-500/90 border-red-400 text-white'
                          : 'bg-white/20 border-white/50 text-white hover:bg-white/30'
                      }`}
                    >
                      {currentPlayingPreview === restaurant.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Currently Playing */}
                {restaurant.isActive && restaurant.currentSong && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white">
                      <Volume2 className="h-3 w-3 animate-pulse text-green-400" />
                      <span className="font-medium">Ahora</span>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/30">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 transform scale-75 group-hover:scale-100 transition-all duration-500">
                    <ArrowRight className="h-8 w-8 ml-1" />
                  </div>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6 space-y-5">
                
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-black text-xl text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                        {restaurant.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{restaurant.type || 'Restaurante'}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold">{restaurant.rating || 'N/A'}</span>
                      </div>
                      {restaurant.reviewCount > 0 && (
                        <span className="text-xs text-slate-500">({restaurant.reviewCount})</span>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-slate-400 space-x-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{restaurant.address}</span>
                    {restaurant.priceRange && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-sm">{restaurant.priceRange}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Current Song Display */}
                {restaurant.isActive && restaurant.currentSong && (
                  <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 border border-slate-600/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <Disc className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="text-xs font-bold uppercase tracking-wide">Sonando Ahora</span>
                      </div>
                      {currentPlayingPreview === restaurant.id && (
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" 
                                 style={{ animationDelay: `${i * 0.15}s` }}></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{restaurant.currentSong}</p>
                      {restaurant.currentArtist && (
                        <p className="text-slate-300 text-xs mt-1">{restaurant.currentArtist}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Music Genres */}
                {restaurant.genres && restaurant.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {restaurant.genres.slice(0, 3).map((genre, genreIndex) => (
                      <span key={genreIndex} className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 font-medium">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 py-3 border-t border-slate-700/30">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-slate-400 mb-1">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div className="text-white font-bold text-sm">{restaurant.queueLength || 0}</div>
                    <div className="text-slate-500 text-xs">En Cola</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-slate-400 mb-1">
                      <Users className="h-3 w-3" />
                    </div>
                    <div className="text-white font-bold text-sm">{restaurant.activeCustomers || 0}</div>
                    <div className="text-slate-500 text-xs">Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-slate-400 mb-1">
                      <Music className="h-3 w-3" />
                    </div>
                    <div className="text-white font-bold text-sm">{restaurant.totalSongs || 0}</div>
                    <div className="text-slate-500 text-xs">Canciones</div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestaurantSelect(restaurant);
                  }}
                  className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-bold text-sm transition-all duration-500 transform ${
                    restaurant.isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg shadow-blue-500/25'
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={!restaurant.isActive}
                >
                  {restaurant.isActive ? (
                    <>
                      <Headphones className="h-5 w-5" />
                      <span>Conectar & Escuchar</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5" />
                      <span>{restaurant.hours}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && !loading && !error && (
          <div className="text-center py-20 lg:py-32">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-12 rounded-full border border-slate-700/50 w-48 h-48 flex items-center justify-center mx-auto">
                <div className="text-center">
                  <Music className="h-16 w-16 text-slate-500 mx-auto mb-2" />
                  <div className="w-8 h-1 bg-slate-600 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-400 mb-6">
              Sin resultados por ahora
            </h3>
            <p className="text-slate-500 mb-12 max-w-lg mx-auto text-lg leading-relaxed">
              No encontramos restaurantes que coincidan con tu búsqueda. Prueba con otros filtros o términos para descubrir nuevas experiencias musicales.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Ver Todas las Experiencias</span>
              </button>
              
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <span className="text-slate-500">Prueba buscar:</span>
                {['Jazz', 'Rock', 'Zona Rosa', 'Premium'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full text-sm hover:bg-slate-700/50 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Section */}
        {filteredRestaurants.length > 0 && (
          <div className="text-center mt-20 py-16 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">Próximamente</span>
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                ¿Tienes un restaurante?
              </h3>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Únete a la revolución musical gastronómica. Ofrece a tus clientes una experiencia única donde ellos eligen la música perfecta para acompañar sus comidas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={onSwitchToAdmin}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                >
                  <Settings className="h-5 w-5" />
                  <span>Registra tu Restaurante</span>
                </button>
                
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <span>o</span>
                  <button 
                    onClick={onSwitchToAdmin}
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    inicia sesión como administrador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantSelector;