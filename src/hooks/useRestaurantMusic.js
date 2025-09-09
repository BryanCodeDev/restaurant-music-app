// src/hooks/useRestaurantMusic.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useRestaurantMusic = (restaurantSlug) => {
  // Estados principales
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [songsLoading, setSongsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [currentGenre, setCurrentGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Inicializar cuando cambia el restaurante
  useEffect(() => {
    if (restaurantSlug) {
      initializeSession();
    }
  }, [restaurantSlug]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si ya hay una sesión activa
      let session = apiService.getCurrentSession();
      
      if (!session) {
        // Crear nueva sesión de usuario
        session = await apiService.createUserSession(restaurantSlug);
        setUserSession(session.user);
      } else {
        setUserSession(session.user);
      }

      // Cargar datos iniciales en paralelo
      await Promise.all([
        loadSongs(),
        loadUserRequests(session.user?.tableNumber),
        // loadFavorites(session.user?.id) // Implementar si necesitas persistir favoritos
      ]);

    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Error al conectar con el restaurante. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async (filters = {}) => {
    if (!restaurantSlug) return;

    try {
      setSongsLoading(true);
      const params = {
        genre: filters.genre || currentGenre !== 'all' ? currentGenre : undefined,
        search: filters.search || searchTerm,
        page: filters.page || 1,
        limit: filters.limit || 20
      };

      // Limpiar parámetros undefined
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiService.getSongs(restaurantSlug, params);
      setSongs(response.data?.songs || []);
      
    } catch (err) {
      console.error('Error loading songs:', err);
      setError('Error al cargar las canciones');
    } finally {
      setSongsLoading(false);
    }
  };

  const searchSongs = useCallback(async (query) => {
    if (!restaurantSlug) return;

    try {
      setSongsLoading(true);
      
      if (!query.trim()) {
        await loadSongs();
        return;
      }

      const response = await apiService.searchSongs(restaurantSlug, query, {
        genre: currentGenre !== 'all' ? currentGenre : undefined
      });
      
      setSongs(response.data?.songs || []);
      
    } catch (err) {
      console.error('Error searching songs:', err);
      setError('Error en la búsqueda');
    } finally {
      setSongsLoading(false);
    }
  }, [restaurantSlug, currentGenre]);

  const loadUserRequests = async (tableNumber) => {
    if (!restaurantSlug || !tableNumber) return;

    try {
      setRequestsLoading(true);
      const response = await apiService.getUserRequests(restaurantSlug, tableNumber);
      setRequests(response.data?.requests || []);
    } catch (err) {
      console.error('Error loading user requests:', err);
      setError('Error al cargar tus peticiones');
    } finally {
      setRequestsLoading(false);
    }
  };

  const addRequest = async (song) => {
    if (!userSession?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    try {
      const response = await apiService.createRequest(
        restaurantSlug, 
        song.id, 
        userSession.tableNumber
      );

      if (response.success) {
        // Actualizar requests localmente
        const newRequest = response.data.request;
        setRequests(prev => [...prev, newRequest]);
        
        // Recargar requests para obtener datos actualizados
        await loadUserRequests(userSession.tableNumber);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error adding request:', err);
      setError(err.message || 'Error al enviar la petición');
      return false;
    }
  };

  const cancelRequest = async (requestId) => {
    if (!userSession?.tableNumber) return false;

    try {
      const response = await apiService.cancelRequest(requestId, userSession.tableNumber);
      
      if (response.success) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError('Error al cancelar la petición');
      return false;
    }
  };

  const toggleFavorite = async (song) => {
    // Para esta versión, manejar favoritos localmente
    // En el futuro se puede implementar persistencia en el backend
    
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === song.id);
      if (exists) {
        return prev.filter(fav => fav.id !== song.id);
      } else {
        return [...prev, { ...song, dateAdded: new Date() }];
      }
    });

    return true;
  };

  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  const filterByGenre = async (genre) => {
    setCurrentGenre(genre);
    await loadSongs({ genre });
  };

  const setSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      await searchSongs(term);
    } else {
      await loadSongs();
    }
  };

  const clearError = () => setError(null);

  const refreshData = async () => {
    if (userSession?.tableNumber) {
      await Promise.all([
        loadSongs(),
        loadUserRequests(userSession.tableNumber)
      ]);
    }
  };

  const getPopularSongs = async (limit = 10) => {
    try {
      const response = await apiService.getPopularSongs(restaurantSlug, limit);
      return response.data?.songs || [];
    } catch (err) {
      console.error('Error loading popular songs:', err);
      return [];
    }
  };

  // Estados computados
  const stats = {
    totalSongs: songs.length,
    totalFavorites: favorites.length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(req => req.status === 'pending').length,
    playingRequests: requests.filter(req => req.status === 'playing').length,
    completedRequests: requests.filter(req => req.status === 'completed').length
  };

  return {
    // Estados principales
    songs,
    favorites,
    requests,
    userSession,
    restaurant,
    
    // Estados de UI
    loading,
    songsLoading,
    requestsLoading,
    error,
    
    // Filtros
    currentGenre,
    searchTerm,
    
    // Acciones - Canciones
    loadSongs,
    searchSongs,
    filterByGenre,
    setSearch,
    getPopularSongs,
    
    // Acciones - Peticiones
    addRequest,
    cancelRequest,
    loadUserRequests,
    
    // Acciones - Favoritos
    toggleFavorite,
    isFavorite,
    
    // Utilidades
    clearError,
    refreshData,
    stats,
    
    // Funciones de inicialización
    initializeSession
  };
};