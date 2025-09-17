// src/hooks/useMusic.js - CENTRALIZADO PARA PLANOS DUALES
import { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '../services/apiService';

export const useMusic = (restaurantSlug) => {
  // Estados principales
  const [songs, setSongs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para plan dual
  const [planType, setPlanType] = useState('basic');
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  // User type from storage
  const userType = useMemo(() => localStorage.getItem('user_type') || 'guest', []);

  // Estados de UI
  const [songsLoading, setSongsLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    if (restaurantSlug) {
      initializeMusic();
    } else {
      resetMusicState();
    }
  }, [restaurantSlug, userType]);

  const resetMusicState = () => {
    setSongs([]);
    setRequests([]);
    setCurrentSong(null);
    setIsPlaying(false);
    setUser(null);
    setPlanType('basic');
    setSpotifyConnected(false);
    setLoading(false);
    setError(null);
    setSongsLoading(false);
    setRequestsLoading(false);
  };

  const initializeMusic = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initializing music for:', restaurantSlug, 'userType:', userType);

      let registeredUserId = null;
      if (userType === 'registered') {
        const profile = await apiService.getUserProfile().catch(() => null);
        if (profile) {
          registeredUserId = profile.id;
          localStorage.setItem('registered_user_id', registeredUserId);
        } else {
          registeredUserId = localStorage.getItem('registered_user_id');
        }
      }

      // Crear sesión de usuario
      const userData = await apiService.createUserSession(restaurantSlug, null, registeredUserId);
      const sessionUser = { ...userData.user, userType };
      setUser(sessionUser);

      // Fetch planType y estado Spotify
      const restaurantPlan = await apiService.getRestaurantPlan(restaurantSlug);
      if (restaurantPlan) {
        setPlanType(restaurantPlan.plan_type || 'basic');
        if (restaurantPlan.plan_type === 'pro') {
          setSpotifyConnected(!!restaurantPlan.spotify_tokens);
        }
      }

      // Cargar datos iniciales
      const loadPromises = [
        loadSongs(),
        loadUserRequests()
      ];
      await Promise.all(loadPromises);

    } catch (err) {
      console.error('Error initializing music:', err);
      setError(`Error al inicializar música: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = useCallback(async (filters = {}) => {
    if (!restaurantSlug) return;

    try {
      setSongsLoading(true);
      
      // Para basic, usar getSongs; para pro, cargar populares o recomendados via Spotify si conectado
      let response;
      if (planType === 'pro' && spotifyConnected) {
        // Para Pro, usar searchMusic con query vacía o get popular (asumir endpoint)
        response = await apiService.getPopularSongs(restaurantSlug); // Fallback, o custom /spotify/popular
      } else {
        const params = {
          page: filters.page || 1,
          limit: filters.limit || 20,
          ...filters
        };
        response = await apiService.getSongs(restaurantSlug, params);
      }

      let results = [];
      if (planType === 'pro' && response.tracks) {
        results = response.tracks.map(track => ({
          ...track,
          source: 'spotify',
          id: track.id,
          title: track.name,
          artist: track.artists[0]?.name || 'Unknown',
          image: track.album?.images[1]?.url,
          duration: apiService.formatDuration(track.duration_ms),
          preview_url: null
        }));
      } else if (response.songs) {
        results = response.songs.map(song => ({ ...song, source: 'bd' }));
      }

      setSongs(results);
    } catch (err) {
      console.error('Error loading songs:', err);
      setError(`Error al cargar canciones: ${err.message}`);
      setSongs([]);
    } finally {
      setSongsLoading(false);
    }
  }, [restaurantSlug, planType, spotifyConnected]);

  const loadUserRequests = useCallback(async () => {
    if (!user?.tableNumber || !restaurantSlug) return;

    try {
      setRequestsLoading(true);
      // Usar getUnifiedQueue para cola dual
      const response = await apiService.getUnifiedQueue(restaurantSlug, { tableNumber: user.tableNumber });
      if (response.requests) {
        setRequests(response.requests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Error loading user requests:', err);
      setError(`Error al cargar peticiones: ${err.message}`);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [restaurantSlug, user?.tableNumber]);

  const searchMusic = useCallback(async (query, options = {}) => {
    if (!restaurantSlug) return;

    try {
      setSongsLoading(true);
      const response = await apiService.searchMusic(query, planType, restaurantSlug, options);
      
      let results = [];
      if (planType === 'pro' && response.success && response.tracks) {
        results = response.tracks.map(track => ({
          ...track,
          source: 'spotify',
          id: track.id,
          title: track.name,
          artist: track.artists[0]?.name || 'Unknown',
          image: track.album?.images[1]?.url,
          duration: apiService.formatDuration(track.duration_ms),
          preview_url: null
        }));
      } else if (response.songs) {
        results = response.songs.map(song => ({ ...song, source: 'bd' }));
      }

      setSongs(results);
    } catch (err) {
      console.error('Error searching music:', err);
      if (planType === 'pro' && err.message.includes('SpotifyNotConnected')) {
        setError('Conecta tu cuenta de Spotify para buscar');
      } else {
        setError(`Error en la búsqueda: ${err.message}`);
      }
      setSongs([]);
    } finally {
      setSongsLoading(false);
    }
  }, [restaurantSlug, planType]);

  const addRequest = useCallback(async (song) => {
    if (!user?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    // Verificar límite para guests (más permisivo para Pro?)
    const maxRequests = userType === 'guest' ? 2 : 5;
    const activeRequests = requests.filter(r => ['pending', 'playing'].includes(r.status)).length;
    if (activeRequests >= maxRequests) {
      setError(`Solo puedes solicitar ${maxRequests} canciones a la vez. Espera a que se reproduzcan las actuales.`);
      return false;
    }

    // Para Pro, verificar conexión
    if (planType === 'pro' && !spotifyConnected) {
      setError('Conecta Spotify para agregar canciones del plan Pro');
      return false;
    }

    try {
      console.log('Adding request:', { songId: song.id, tableNumber: user.tableNumber, userType, planType, source: song.source });

      const songData = {
        songId: song.id,
        trackId: song.trackId, // Spotify
        uri: song.uri, // Spotify
        title: song.title,
        artist: song.artist,
        source: song.source || (planType === 'pro' ? 'spotify' : 'bd')
      };

      const response = await apiService.addToQueue(songData, planType, restaurantSlug, user.tableNumber);
      
      if (response && (response.request || response.success)) {
        // Actualizar local y recargar
        setRequests(prev => [...prev, { ...songData, ...response.request, status: 'pending' }]);
        await loadUserRequests();
        setError(null);
        return true;
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Error adding request:', err);
      setError(err.message);
      return false;
    }
  }, [restaurantSlug, user?.tableNumber, userType, planType, spotifyConnected, requests]);

  const cancelRequest = useCallback(async (requestId) => {
    if (!user?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    try {
      await apiService.cancelRequest(requestId, user.tableNumber);
      await loadUserRequests();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [user?.tableNumber]);

  const playSong = useCallback(async (song) => {
    if (!restaurantSlug) return false;

    try {
      const songData = {
        songId: song.id,
        trackId: song.trackId,
        uri: song.uri,
        source: song.source
      };
      const response = await apiService.playSong(songData, planType, restaurantSlug);
      if (response.success) {
        setCurrentSong(song);
        setIsPlaying(true);
        return true;
      }
      throw new Error('Play failed');
    } catch (err) {
      console.error('Error playing song:', err);
      setError(err.message);
      return false;
    }
  }, [restaurantSlug, planType]);

  const clearError = () => setError(null);

  const refreshPlan = useCallback(async () => {
    if (restaurantSlug) {
      const plan = await apiService.getRestaurantPlan(restaurantSlug);
      if (plan) {
        setPlanType(plan.plan_type || 'basic');
        setSpotifyConnected(plan.plan_type === 'pro' && !!plan.spotify_tokens);
      }
    }
  }, [restaurantSlug]);

  return {
    // Estados
    songs,
    requests,
    currentSong,
    isPlaying,
    user,
    planType,
    spotifyConnected,
    loading,
    songsLoading,
    requestsLoading,
    error,

    // Acciones
    loadSongs,
    searchMusic,
    addRequest,
    cancelRequest,
    playSong,
    loadUserRequests,
    refreshPlan,
    clearError,

    userType,
    isActive: !!restaurantSlug && !loading
  };
};

export default useMusic;