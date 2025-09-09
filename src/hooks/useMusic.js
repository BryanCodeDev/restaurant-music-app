// src/hooks/useMusic.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useMusic = (restaurantSlug) => {
  const [songs, setSongs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeSession();
  }, [restaurantSlug]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Crear sesión de usuario
      const userData = await api.createUserSession(restaurantSlug);
      setUser(userData.user);
      
      // Cargar canciones
      await loadSongs();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async (filters = {}) => {
    try {
      const response = await api.getSongs(restaurantSlug, filters);
      setSongs(response.data.songs);
    } catch (err) {
      setError(err.message);
    }
  };

  const addRequest = async (song) => {
    try {
      const response = await api.createRequest(
        restaurantSlug, 
        song.id, 
        user?.tableNumber
      );
      
      // Actualizar lista de peticiones local
      setRequests(prev => [...prev, response.data.request]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await api.cancelRequest(requestId, user?.tableNumber);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    songs,
    requests,
    user,
    loading,
    error,
    loadSongs,
    addRequest,
    cancelRequest,
    clearError: () => setError(null)
  };
};

export default useMusic;