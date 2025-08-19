// src/hooks/useMusicData.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useMusicData = () => {
  // Estados principales
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songsLoading, setSongsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Filtros y búsqueda
  const [currentGenre, setCurrentGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ===== INICIALIZACIÓN =====
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Cargar restaurante
      const restaurantData = await api.restaurants.getCurrent();
      setRestaurant(restaurantData);
      
      // Crear sesión de usuario (simular mesa)
      const tableNumber = `Mesa #${Math.floor(Math.random() * 20) + 1}`;
      const userData = await api.users.createSession(tableNumber, restaurantData.id);
      setCurrentUser(userData);
      
      // Cargar datos iniciales
      await Promise.all([
        loadSongs(),
        loadFavorites(userData.id),
        loadRequests(userData.id)
      ]);
      
    } catch (err) {
      console.error('Error initializing app:', err);
      setError('Error al inicializar la aplicación');
    } finally {
      setLoading(false);
    }
  };

  // ===== CANCIONES =====
  const loadSongs = async (params = {}) => {
    try {
      setSongsLoading(true);
      const { genre = currentGenre, search = searchTerm } = params;
      
      const queryParams = {
        restaurant_id: api.config.RESTAURANT_ID,
        ...(genre !== 'all' && { genre }),
        ...(search && { search })
      };
      
      const data = await api.songs.getAll(queryParams);
      setSongs(data.songs || []);
      
    } catch (err) {
      console.error('Error loading songs:', err);
      setError('Error al cargar las canciones');
    } finally {
      setSongsLoading(false);
    }
  };

  const searchSongs = useCallback(
    api.utils.debounce(async (query) => {
      if (!query.trim()) {
        await loadSongs();
        return;
      }
      
      try {
        setSongsLoading(true);
        const data = await api.songs.search(query, {
          restaurant_id: api.config.RESTAURANT_ID,
          genre: currentGenre !== 'all' ? currentGenre : undefined
        });
        setSongs(data.songs || []);
      } catch (err) {
        console.error('Error searching songs:', err);
        setError('Error en la búsqueda');
      } finally {
        setSongsLoading(false);
      }
    }, api.config.SEARCH_DEBOUNCE_MS),
    [currentGenre]
  );

  const filterByGenre = async (genreId) => {
    setCurrentGenre(genreId);
    await loadSongs({ genre: genreId, search: searchTerm });
  };

  const getPopularSongs = async (limit = 10) => {
    try {
      const data = await api.songs.getPopular(limit);
      return data.songs || [];
    } catch (err) {
      console.error('Error loading popular songs:', err);
      return [];
    }
  };

  // ===== FAVORITOS =====
  const loadFavorites = async (userId) => {
    if (!userId) return;
    
    try {
      const data = await api.favorites.getByUser(userId);
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Error al cargar favoritos');
    }
  };

  const toggleFavorite = async (song) => {
    if (!currentUser) return;

    try {
      const data = await api.favorites.toggle(currentUser.id, song.id);
      
      if (data.added) {
        setFavorites(prev => [...prev, song]);
      } else {
        setFavorites(prev => prev.filter(fav => fav.id !== song.id));
      }
      
      return data.added;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error al actualizar favoritos');
      return false;
    }
  };

  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  // ===== PETICIONES =====
  const loadRequests = async (userId) => {
    if (!userId) return;
    
    try {
      setRequestsLoading(true);
      const data = await api.requests.getByUser(userId);
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Error loading requests:', err);
      setError('Error al cargar peticiones');
    } finally {
      setRequestsLoading(false);
    }
  };

  const addRequest = async (song) => {
    if (!currentUser) {
      setError('Sesión de usuario no encontrada');
      return false;
    }

    // Verificar límite de peticiones
    const userPendingRequests = requests.filter(req => 
      req.status === 'pending' && req.user_id === currentUser.id
    ).length;

    if (userPendingRequests >= api.config.MAX_REQUESTS_PER_USER) {
      setError(`Máximo ${api.config.MAX_REQUESTS_PER_USER} peticiones por mesa`);
      return false;
    }

    try {
      const requestData = {
        restaurant_id: api.config.RESTAURANT_ID,
        user_id: currentUser.id,
        song_id: song.id,
        user_table: currentUser.table_number
      };

      const data = await api.requests.create(requestData);
      
      // Actualizar la lista local de peticiones
      const newRequest = {
        ...requestData,
        id: data.requestId,
        status: 'pending',
        requested_at: new Date().toISOString(),
        title: song.title,
        artist: song.artist,
        image: song.image
      };

      setRequests(prev => [...prev, newRequest]);
      return true;
      
    } catch (err) {
      console.error('Error adding request:', err);
      setError('Error al enviar la petición');
      return false;
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await api.requests.cancel(requestId);
      setRequests(prev => prev.filter(req => req.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError('Error al cancelar petición');
      return false;
    }
  };

  const getQueueStatus = async () => {
    try {
      const data = await api.requests.getQueue(api.config.RESTAURANT_ID);
      return {
        totalInQueue: data.requests?.length || 0,
        userPosition: data.requests?.findIndex(req => 
          req.user_id === currentUser?.id
        ) + 1 || 0
      };
    } catch (err) {
      console.error('Error getting queue status:', err);
      return { totalInQueue: 0, userPosition: 0 };
    }
  };

  // ===== ESTADÍSTICAS =====
  const getStats = async () => {
    try {
      const data = await api.restaurants.getStats(api.config.RESTAURANT_ID);
      return data.stats || {};
    } catch (err) {
      console.error('Error loading stats:', err);
      return {};
    }
  };

  // ===== UTILIDADES =====
  const clearError = () => setError(null);

  const refreshData = async () => {
    if (currentUser) {
      await Promise.all([
        loadSongs(),
        loadFavorites(currentUser.id),
        loadRequests(currentUser.id)
      ]);
    }
  };

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm) {
      searchSongs(searchTerm);
    } else {
      loadSongs();
    }
  }, [searchTerm, searchSongs]);

  return {
    // Estados
    songs,
    favorites,
    requests,
    currentUser,
    restaurant,
    loading,
    error,
    songsLoading,
    requestsLoading,
    currentGenre,
    searchTerm,

    // Acciones - Canciones
    loadSongs,
    searchSongs,
    filterByGenre,
    getPopularSongs,
    setSearchTerm,

    // Acciones - Favoritos
    toggleFavorite,
    isFavorite,

    // Acciones - Peticiones
    addRequest,
    cancelRequest,
    getQueueStatus,

    // Acciones - Utilidades
    getStats,
    clearError,
    refreshData,

    // Estadísticas computadas
    stats: {
      totalSongs: songs.length,
      totalFavorites: favorites.length,
      totalRequests: requests.length,
      pendingRequests: requests.filter(req => req.status === 'pending').length,
    }
  };
};

export default useMusicData;