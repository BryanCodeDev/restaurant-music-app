// src/hooks/useRestaurantMusic.js - SOLO API REAL
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
  const [loading, setLoading] = useState(false);
  const [songsLoading, setSongsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [currentGenre, setCurrentGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // User type from storage
  const userType = useMemo(() => localStorage.getItem('user_type') || 'guest', []);

  // Inicializar cuando cambia el restaurante
  useEffect(() => {
    if (restaurantSlug) {
      initializeSession();
    } else {
      resetState();
    }
  }, [restaurantSlug, userType]);

  const resetState = () => {
    setSongs([]);
    setFavorites([]);
    setRequests([]);
    setUserSession(null);
    setRestaurant(null);
    setLoading(false);
    setSongsLoading(false);
    setRequestsLoading(false);
    setError(null);
    setCurrentGenre('all');
    setSearchTerm('');
  };

  const initializeSession = async () => {
    if (!restaurantSlug) {
      setError('No restaurant specified');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Initializing session for:', restaurantSlug, 'userType:', userType);

      // Verificar si ya hay una sesión activa válida
      let session = apiService.getCurrentSession();
      
      let registeredUserId = null;
      if (userType === 'registered') {
        // Obtener ID del usuario registrado del perfil o storage
        const profile = await apiService.getUserProfile().catch(() => null);
        if (profile) {
          registeredUserId = profile.id;
          localStorage.setItem('registered_user_id', registeredUserId);
        } else {
          registeredUserId = localStorage.getItem('registered_user_id');
        }
      }

      if (!session || session.user?.restaurantSlug !== restaurantSlug) {
        console.log('Creating new user session for:', restaurantSlug, 'with registeredUserId:', registeredUserId);
        // Crear nueva sesión de usuario real
        session = await apiService.createUserSession(restaurantSlug, null, registeredUserId);
        console.log('Session created:', session);
      }

      if (session?.user) {
        // Asegurar que userSession tenga type
        setUserSession({ ...session.user, userType });
        console.log('User session set:', { ...session.user, userType });
      }

      // Cargar datos reales del servidor
      const loadPromises = [
        loadSongs(),
        loadRestaurantInfo()
      ];
      
      if (session?.user?.tableNumber) {
        loadPromises.push(loadUserRequests(session.user.tableNumber));
      }

      // Cargar favorites basado en userType
      if (userType === 'registered' && registeredUserId) {
        const favResponse = await apiService.getFavorites(registeredUserId, 'registered');
        if (favResponse?.favorites) {
          setFavorites(favResponse.favorites);
        }
      } else if (session?.user?.id) {
        const favResponse = await apiService.getFavorites(session.user.id, 'guest');
        if (favResponse?.favorites) {
          setFavorites(favResponse.favorites);
        }
      }

      await Promise.all(loadPromises);

    } catch (err) {
      console.error('Error initializing session:', err);
      setError(`Error al conectar con el restaurante: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantInfo = async () => {
    if (!restaurantSlug) return;

    try {
      const response = await apiService.getRestaurantBySlug(restaurantSlug);
      if (response && response.restaurant) {
        setRestaurant(response.restaurant);
      }
    } catch (err) {
      console.error('Error loading restaurant info:', err);
      // No es crítico, no setear error
    }
  };

  const loadSongs = async (filters = {}) => {
    if (!restaurantSlug) {
      console.warn('No restaurant slug provided for loadSongs');
      return;
    }

    try {
      setSongsLoading(true);
      
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20
      };

      // Agregar filtros si tienen valores válidos
      if (filters.genre && filters.genre !== 'all') {
        params.genre = filters.genre;
      } else if (currentGenre !== 'all') {
        params.genre = currentGenre;
      }

      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      } else if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      console.log('Loading songs with params:', params);
      
      const response = await apiService.getSongs(restaurantSlug, params);
      console.log('Songs response:', response);
      
      if (response && response.songs) {
        setSongs(response.songs);
      } else {
        throw new Error('Invalid songs response format');
      }
      
    } catch (err) {
      console.error('Error loading songs:', err);
      setError(`Error al cargar las canciones: ${err.message}`);
      setSongs([]); // Limpiar canciones en caso de error
    } finally {
      setSongsLoading(false);
    }
  };

  const searchSongs = useCallback(async (query) => {
    if (!restaurantSlug) {
      console.warn('No restaurant slug provided for searchSongs');
      return;
    }

    try {
      setSongsLoading(true);
      
      if (!query || query.trim().length < 2) {
        // Si la query está vacía, cargar todas las canciones
        await loadSongs();
        return;
      }

      const options = {};
      if (currentGenre !== 'all') {
        options.genre = currentGenre;
      }

      const response = await apiService.searchSongs(restaurantSlug, query.trim(), options);
      
      if (response && response.songs) {
        setSongs(response.songs);
      } else {
        throw new Error('Search failed - invalid response');
      }
      
    } catch (err) {
      console.error('Error searching songs:', err);
      setError(`Error en la búsqueda: ${err.message}`);
    } finally {
      setSongsLoading(false);
    }
  }, [restaurantSlug, currentGenre]);

  const loadUserRequests = async (tableNumber) => {
    if (!restaurantSlug || !tableNumber) {
      console.warn('Missing parameters for loadUserRequests:', { restaurantSlug, tableNumber });
      return;
    }

    try {
      setRequestsLoading(true);
      const response = await apiService.getUserRequests(restaurantSlug, tableNumber);
      
      if (response && response.requests) {
        setRequests(response.requests);
      } else {
        console.warn('Invalid requests response:', response);
        setRequests([]);
      }
    } catch (err) {
      console.error('Error loading user requests:', err);
      setError(`Error al cargar tus peticiones: ${err.message}`);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const addRequest = async (song) => {
    if (!restaurantSlug) {
      setError('No hay restaurante seleccionado');
      return false;
    }

    if (!song?.id) {
      setError('Información de canción inválida');
      return false;
    }

    if (!userSession?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    // Verificar si la canción ya está en la cola
    const alreadyRequested = requests.some(
      req => req.song_id === song.id && ['pending', 'playing'].includes(req.status)
    );

    if (alreadyRequested) {
      setError('Esta canción ya está en tu cola');
      return false;
    }

    try {
      console.log('Creating request:', { restaurantSlug, songId: song.id, tableNumber: userSession.tableNumber, userType });

      // La API maneja el user_type internamente basado en token/session
      const response = await apiService.createRequest(
        restaurantSlug,
        song.id,
        userSession.tableNumber
      );

      console.log('Request created:', response);

      if (response && response.request) {
        // Recargar requests para obtener datos actualizados
        await loadUserRequests(userSession.tableNumber);
        
        // AGREGAR: Limpiar error si fue exitoso
        setError(null);
        
        return true;
      } else {
        throw new Error('Error creating request - invalid response');
      }
    } catch (err) {
      console.error('Error adding request:', err);
      
      // MEJORAR: Manejo más específico de errores
      let errorMessage = 'Error al enviar la petición';
      
      if (err.message.includes('Validation failed')) {
        errorMessage = 'Datos inválidos. Por favor intenta de nuevo.';
      } else if (err.message.includes('Queue is full')) {
        errorMessage = 'La cola está llena. Intenta más tarde.';
      } else if (err.message.includes('Maximum')) {
        errorMessage = 'Has alcanzado el límite de peticiones.';
      } else if (err.message.includes('already requested')) {
        errorMessage = 'Ya solicitaste esta canción.';
      } else if (err.message.includes('not found')) {
        errorMessage = 'Canción no encontrada.';
      } else {
        errorMessage = err.message || 'Error desconocido';
      }
      
      setError(errorMessage);
      return false;
    }
  };

  const cancelRequest = async (requestId) => {
    if (!userSession?.tableNumber) {
      setError('Sesión inválida');
      return false;
    }

    if (!requestId) {
      setError('ID de petición inválido');
      return false;
    }

    try {
      console.log('Cancelling request:', requestId);
      
      const response = await apiService.cancelRequest(requestId);
      
      if (response) {
        // Recargar requests para obtener estado actualizado
        await loadUserRequests(userSession.tableNumber);
        setError(null); // Limpiar error si fue exitoso
        return true;
      } else {
        throw new Error('Error cancelling request');
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError(`Error al cancelar la petición: ${err.message}`);
      return false;
    }
  };

  const toggleFavorite = async (song) => {
    if (!song?.id) {
      setError('Información de canción inválida');
      return false;
    }

    // Verificar tipo de usuario
    if (userType === 'guest' && !userSession?.id) {
      setError('Para guardar favoritos como invitado, necesitas una sesión activa');
      return false;
    }

    if (userType === 'registered' && !userSession?.registered_user_id && !localStorage.getItem('registered_user_id')) {
      setError('Para guardar favoritos necesitas iniciar sesión con tu cuenta');
      return false;
    }

    try {
      let userIdToUse = null;
      if (userType === 'registered') {
        userIdToUse = userSession?.registered_user_id || localStorage.getItem('registered_user_id');
      } else {
        userIdToUse = userSession?.id;
      }

      if (!userIdToUse) {
        throw new Error('ID de usuario no encontrado');
      }

      console.log('Toggle favorite:', {
        userId: userIdToUse,
        songId: song.id,
        userType,
        restaurantId: restaurant?.id || userSession?.restaurant_id
      });
      
      const response = await apiService.toggleFavorite(userIdToUse, song.id, userType, restaurant?.id || userSession?.restaurant_id);
      
      if (response) {
        // Actualizar favoritos localmente
        setFavorites(prev => {
          const exists = prev.find(fav => fav.id === song.id);
          if (exists) {
            return prev.filter(fav => fav.id !== song.id);
          } else {
            return [...prev, { ...song, dateAdded: new Date() }];
          }
        });
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error al actualizar favoritos: ' + err.message);
      return false;
    }
  };

  const isFavorite = (songId) => {
    return favorites.some(fav => fav.id === songId);
  };

  // Refrescar data cuando cambia userType
  useEffect(() => {
    if (restaurantSlug && userSession) {
      refreshData();
    }
  }, [userType]);

  const filterByGenre = async (genre) => {
    if (!restaurantSlug) return;
    
    setCurrentGenre(genre);
    await loadSongs({ genre });
  };

  const setSearch = async (term) => {
    if (!restaurantSlug) return;
    
    setSearchTerm(term);
    if (term && term.trim()) {
      await searchSongs(term);
    } else {
      await loadSongs();
    }
  };

  const clearError = () => setError(null);

  const refreshData = async () => {
    if (!restaurantSlug) return;

    const refreshPromises = [loadSongs()];
    
    if (userSession?.tableNumber) {
      refreshPromises.push(loadUserRequests(userSession.tableNumber));
    }

    await Promise.all(refreshPromises);
  };

  const getPopularSongs = async (limit = 10) => {
    if (!restaurantSlug) return [];

    try {
      const response = await apiService.getPopularSongs(restaurantSlug, limit);
      return response?.songs || [];
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
    initializeSession,
    
    // Check if hook is ready/active
    isActive: !!restaurantSlug && !loading
  };
};