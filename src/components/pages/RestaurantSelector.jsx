import React, { useState } from 'react';
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
  Wifi
} from 'lucide-react';

// Mock data para restaurantes
const mockRestaurants = [
  {
    id: 1,
    name: "Café Bohemia",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop&crop=center",
    address: "Zona Rosa, Bogotá",
    type: "Café & Bistró",
    rating: 4.8,
    currentSong: "Bohemian Rhapsody - Queen",
    queueLength: 3,
    isActive: true,
    ambiance: "Relajado",
    capacity: 45
  },
  {
    id: 2,
    name: "El Rincón del Jazz",
    logo: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=100&h=100&fit=crop&crop=center",
    address: "La Candelaria, Bogotá",
    type: "Jazz Club",
    rating: 4.9,
    currentSong: "Take Five - Dave Brubeck",
    queueLength: 5,
    isActive: true,
    ambiance: "Jazz",
    capacity: 80
  },
  {
    id: 3,
    name: "Taco Libre",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center",
    address: "Chapinero, Bogotá",
    type: "Restaurante Mexicano",
    rating: 4.6,
    currentSong: "La Vida Es Un Carnaval - Celia Cruz",
    queueLength: 2,
    isActive: true,
    ambiance: "Festivo",
    capacity: 60
  },
  {
    id: 4,
    name: "Burger Station",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
    address: "Usaquén, Bogotá",
    type: "Casual Dining",
    rating: 4.4,
    currentSong: "Uptown Funk - Bruno Mars",
    queueLength: 1,
    isActive: false,
    ambiance: "Moderno",
    capacity: 50
  },
  {
    id: 5,
    name: "La Parrilla Gourmet",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop&crop=center",
    address: "Zona T, Bogotá",
    type: "Steakhouse",
    rating: 4.7,
    currentSong: "Hotel California - Eagles",
    queueLength: 4,
    isActive: true,
    ambiance: "Elegante",
    capacity: 70
  },
  {
    id: 6,
    name: "Sushi Zen",
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop&crop=center",
    address: "Rosales, Bogotá",
    type: "Restaurante Japonés",
    rating: 4.5,
    currentSong: "Clair de Lune - Debussy",
    queueLength: 0,
    isActive: true,
    ambiance: "Zen",
    capacity: 35
  }
];

const RestaurantSelector = ({ onRestaurantSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Todos', count: mockRestaurants.length },
    { id: 'active', name: 'Activos', count: mockRestaurants.filter(r => r.isActive).length },
    { id: 'cafe', name: 'Cafés', count: mockRestaurants.filter(r => r.type.includes('Café')).length },
    { id: 'restaurant', name: 'Restaurantes', count: mockRestaurants.filter(r => r.type.includes('Restaurante')).length }
  ];

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && restaurant.isActive;
    if (selectedFilter === 'cafe') return matchesSearch && restaurant.type.includes('Café');
    if (selectedFilter === 'restaurant') return matchesSearch && restaurant.type.includes('Restaurante');
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-full border border-slate-700/50">
                <Headphones className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 lg:mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MusicMenu
            </span>
            <span className="block text-2xl lg:text-3xl font-semibold text-slate-300 mt-4">
              Selecciona tu Restaurante
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Encuentra tu local favorito y comienza a disfrutar de música personalizada mientras comes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 lg:mb-12 space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar restaurantes por nombre o ubicación..."
                className="w-full pl-12 pr-6 py-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/40 text-slate-300 border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
                }`}
              >
                <span>{filter.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-slate-400">
            {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            {searchTerm && (
              <span className="text-blue-400"> para "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onRestaurantSelect(restaurant)}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                  restaurant.isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    restaurant.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <span>{restaurant.isActive ? 'Activo' : 'Cerrado'}</span>
                </div>
              </div>

              {/* Restaurant Logo */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <ArrowRight className="h-6 w-6 ml-1" />
                  </div>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6 space-y-4">
                {/* Name and Type */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                      {restaurant.type}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-slate-400 space-x-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{restaurant.address}</span>
                </div>

                {/* Current Playing */}
                {restaurant.isActive && (
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-3 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Sonando ahora:</span>
                    </div>
                    <p className="text-sm text-white font-medium truncate">
                      {restaurant.currentSong}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{restaurant.queueLength} en cola</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{restaurant.capacity} pax</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-400">
                    <Music className="h-3 w-3" />
                    <span className="text-xs">{restaurant.ambiance}</span>
                  </div>
                </div>

                {/* Connect Button */}
                <button 
                  onClick={() => onRestaurantSelect(restaurant)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                  disabled={!restaurant.isActive}
                >
                  <Wifi className="h-4 w-4" />
                  <span>{restaurant.isActive ? 'Conectar' : 'Cerrado'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
              <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
                <MapPin className="h-16 w-16 text-slate-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-4">
              No se encontraron restaurantes
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Intenta cambiar los filtros o términos de búsqueda para encontrar restaurantes disponibles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Ver Todos los Restaurantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantSelector;