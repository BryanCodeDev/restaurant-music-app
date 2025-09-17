// src/hooks/useMusic.js
import { useState, useEffect, useMemo } from 'react';
import apiService from '../services/apiService';

export const useMusic = (restaurantSlug) => {
  const [songs, setSongs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User type from storage
  const userType = useMemo(() => localStorage.getItem('user_type') || 'guest', []);

  useEffect(() => {
    initializeSession();
  }, [restaurantSlug, userType]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      console.log('Initializing music session for:', restaurantSlug, 'userType:', userType);

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
      
      // Cargar canciones
      await loadSongs();
      
    } catch (err) {
      console.error('Error initializing session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // Cargar requests del usuario
    await loadUserRequests();
  };

  const loadSongs = async (filters = {}) => {
    try {
      const response = await apiService.getSongs(restaurantSlug, filters);
      if (response && response.songs) {
        setSongs(response.songs);
      } else {
        setSongs([]);
      }
    } catch (err) {
      setError(err.message);
      setSongs([]);
    }
  };

  const loadUserRequests = async () => {
    if (!user?.tableNumber || !restaurantSlug) return;

    try {
      const userRequests = await apiService.getUserRequests(restaurantSlug, user.tableNumber);
      if (userRequests && userRequests.requests) {
        setRequests(userRequests.requests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Error loading user requests:', err);
      setRequests([]);
    }
  };

  const addRequest = async (song) => {
    if (!user?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    // Verificar límite para guests
    if (userType === 'guest') {
      const activeRequests = requests.filter(r => ['pending', 'playing'].includes(r.status)).length;
      if (activeRequests >= 2) {
        setError('Solo puedes solicitar 2 canciones a la vez como invitado. Espera a que se reproduzcan las actuales.');
        return false;
      }
    }

    try {
      console.log('Adding request:', { songId: song.id, tableNumber: user.tableNumber, userType });

      const response = await apiService.createRequest(
        restaurantSlug,
        song.id,
        user.tableNumber
      );
      
      if (response && response.request) {
        // Actualizar lista de peticiones local y recargar para sync
        setRequests(prev => [...prev, response.request]);
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
  };

  const cancelRequest = async (requestId) => {
    if (!user?.tableNumber) {
      setError('Sesión no encontrada');
      return false;
    }

    try {
      await apiService.cancelRequest(requestId, user.tableNumber);
      // Recargar requests para sync
      await loadUserRequests();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    songs,
    requests,
    user,
    loading,
    error,
    loadSongs,
    addRequest,
    cancelRequest,
    clearError,
    userType,
    isActive: !!restaurantSlug && !loading
  };
};

export default useMusic;