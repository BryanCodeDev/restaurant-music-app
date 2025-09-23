import React, { useState, useEffect } from 'react';
import { Music, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';

const SpotifyLogin = ({ restaurantId, restaurantSlug, onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Handle callback from Spotify OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const errorParam = urlParams.get('error');

    if (code && state) {
      handleCallback(code, state);
    } else if (errorParam) {
      setError('Error en la autenticación de Spotify: ' + errorParam);
    }

    // Check initial connection (simulated, use hook if available)
    setConnected(localStorage.getItem(`spotify_connected_${restaurantSlug}`) === 'true');
  }, [restaurantSlug]);

  const handleLogin = async () => {
    if (!restaurantId) {
      setError('ID de restaurante requerido');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiService.spotifyLogin(restaurantId);
    } catch (err) {
      setError('Error iniciando login de Spotify');
    }
  };

  const handleCallback = async (code, state) => {
    setLoading(true);
    try {
      await apiService.handleSpotifyCallback(code, state);
      setConnected(true);
      localStorage.setItem(`spotify_connected_${restaurantSlug}`, 'true');
      if (onConnect) onConnect();
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError('Error completando conexión de Spotify: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (connected) {
    return (
      <div className="flex items-center space-x-2 text-green-400 text-sm bg-green-500/10 p-2 rounded-lg">
        <Music className="h-4 w-4" />
        <span>Spotify conectado</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 bg-slate-800 p-4 rounded-lg shadow-lg z-40 max-w-sm border border-slate-700">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          <span>Plan Pro: Conecta Spotify</span>
        </div>
        <p className="text-slate-300 text-sm">Para acceder a Spotify, conecta tu cuenta Premium.</p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <Music className="h-4 w-4" />
              <span>Conectar Spotify</span>
            </>
          )}
        </button>
        {error && (
          <p className="text-red-400 text-xs text-center bg-red-500/10 p-1 rounded">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SpotifyLogin;