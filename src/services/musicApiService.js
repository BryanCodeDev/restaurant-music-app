import BaseApiService from './baseApiService';

class MusicApiService extends BaseApiService {
  // Songs
  async getSongs(restaurantSlug, params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/songs/${restaurantSlug}${queryString ? `?${queryString}` : ''}`;

    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async searchSongs(restaurantSlug, query, options = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const params = this.buildQueryString({ q: query.trim(), ...options });
    const response = await this.request(`/songs/${restaurantSlug}/search?${params}`);
    return response.success ? response.data : response;
  }

  async getPopularSongs(restaurantSlug, limit = 10) {
    const response = await this.request(`/songs/${restaurantSlug}/popular?limit=${limit}`);
    return response.success ? response.data : response;
  }

  async getSongsByGenre(restaurantSlug, genre, limit = 20) {
    const response = await this.request(`/songs/${restaurantSlug}/genre/${genre}?limit=${limit}`);
    return response.success ? response.data : response;
  }

  async getSongDetails(restaurantSlug, songId) {
    const response = await this.request(`/songs/${restaurantSlug}/song/${songId}`);
    return response.success ? response.data : response;
  }

  async getGenres(restaurantSlug) {
    const response = await this.request(`/songs/${restaurantSlug}/genres`);
    return response.success ? response.data : response;
  }

  // Requests
  async createRequest(restaurantSlug, songId, tableNumber) {
    if (!songId) {
      throw new Error('Song ID is required');
    }

    const response = await this.request(`/requests/${restaurantSlug}`, {
      method: 'POST',
      body: { songId, tableNumber }
    });

    return response.success ? response.data : response;
  }

  async getUserRequests(restaurantSlug, tableNumber = null) {
    const params = tableNumber ? `?tableNumber=${encodeURIComponent(tableNumber)}` : '';
    const response = await this.request(`/requests/${restaurantSlug}/user${params}`);
    return response.success ? response.data : response;
  }

  async cancelRequest(requestId, tableNumber) {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    const response = await this.request(`/requests/${requestId}`, {
      method: 'DELETE',
      body: { tableNumber }
    });
    return response.success ? response.data : response;
  }

  // Favorites
  async getFavorites(userId, userType = 'guest') {
    const params = this.buildQueryString({ userType });
    const response = await this.request(`/favorites/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  async toggleFavorite(userId, songId, userType = 'guest', restaurantId) {
    const body = {
      userId,
      songId,
      userType,
      restaurantId
    };
    const response = await this.request('/favorites/toggle', {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  // Playlists
  async createPlaylist(userId, name, description = '', isPublic = false) {
    const body = { name, description, isPublic };
    const response = await this.request(`/playlists/user/${userId}`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getUserPlaylists(userId, limit = 10, offset = 0) {
    const params = this.buildQueryString({ limit, offset });
    const response = await this.request(`/playlists/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  async addSongToPlaylist(playlistId, songId, position = null) {
    const body = { songId, position };
    const response = await this.request(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getPlaylistSongs(playlistId) {
    const response = await this.request(`/playlists/${playlistId}/songs`);
    return response.success ? response.data : response;
  }

  // Listening History
  async getListeningHistory(userId, limit = 50, fromDate = null) {
    const params = this.buildQueryString({ limit, fromDate });
    const response = await this.request(`/history/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  // Spotify Integration (Pro Plan)
  async getRestaurantPlan(slug) {
    const response = await this.request(`/restaurants/${slug}`);
    return response.success ? response.data : null; // Incluye planType (basic/pro) y spotifyTokens si pro
  }

  async spotifyLogin(restaurantId) {
    // Redirigir a OAuth endpoint del backend
    const loginUrl = `${this.baseURL}/spotify/login?restaurantId=${restaurantId}`;
    window.location.href = loginUrl;
    return null; // No response, es redirección
  }

  async handleSpotifyCallback(code, state) {
    // El backend maneja el callback; frontend refresca el plan/tokens
    try {
      const response = await this.request(`/spotify/callback?code=${code}&state=${state}`);
      if (response.success) {
        // Refrescar plan con tokens actualizados
        const slug = localStorage.getItem('current_restaurant_slug') || state;
        return await this.getRestaurantPlan(slug);
      }
      throw new Error('Callback failed');
    } catch (error) {
      console.error('Spotify callback error:', error);
      throw error;
    }
  }

  async refreshSpotifyToken(restaurantId) {
    try {
      const response = await this.request(`/spotify/${restaurantId}/refresh`);
      if (response.success && response.access_token) {
        // Opcional: Guardar token en localStorage para uso rápido (pero preferir backend)
        const key = `spotify_access_token_${restaurantId}`;
        localStorage.setItem(key, response.access_token);
        if (response.expires_in) {
          localStorage.setItem(`${key}_expires`, Date.now() + (response.expires_in * 1000));
        }
      }
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh Spotify token');
    }
  }

  // Búsqueda unificada (dual)
  async searchMusic(query, planType, restaurantSlug = null, options = {}) {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    if (planType === 'pro') {
      if (!restaurantSlug) throw new Error('Restaurant slug required for Spotify search');
      const params = this.buildQueryString({ q: query.trim(), ...options });
      const response = await this.request(`/spotify/search?${params}`);
      // Añadir source para UI
      if (response.success && response.tracks) {
        response.tracks = response.tracks.map(track => ({
          ...track,
          source: 'spotify',
          id: track.id,
          title: track.name,
          artist: track.artists?.[0]?.name || 'Unknown',
          image: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url,
          duration: this.formatDuration(track.duration_ms),
          preview_url: null // Spotify no provee preview en search
        }));
      }
      return response;
    } else {
      // Fallback a basic search
      if (!restaurantSlug) throw new Error('Restaurant slug required for basic search');
      return await this.searchSongs(restaurantSlug, query, options);
    }
  }

  // Agregar a cola unificada (dual)
  async addToQueue(songData, planType, restaurantSlug = null, tableNumber = null) {
    const body = { ...songData, tableNumber };
    if (planType === 'pro') {
      if (!restaurantSlug) throw new Error('Restaurant slug required for Spotify queue');
      if (!songData.trackId && !songData.uri) throw new Error('Track ID or URI required for Spotify');
      body.trackId = songData.trackId || songData.id;
      body.uri = songData.uri || `spotify:track:${body.trackId}`;
      return await this.request('/spotify/queue', { method: 'POST', body });
    } else {
      // Basic: usar createRequest existente
      if (!restaurantSlug || !songData.songId) throw new Error('Song ID and slug required for basic queue');
      return await this.createRequest(restaurantSlug, songData.songId, tableNumber);
    }
  }

  // Reproducir canción unificada (dual)
  async playSong(songData, planType, restaurantSlug = null) {
    const body = { ...songData };
    if (planType === 'pro') {
      if (!restaurantSlug) throw new Error('Restaurant slug required for Spotify play');
      if (!songData.trackId && !songData.uri) throw new Error('Track ID or URI required');
      body.trackId = songData.trackId || songData.id;
      body.uri = songData.uri || `spotify:track:${body.trackId}`;
      return await this.request('/spotify/play', { method: 'POST', body });
    } else {
      // Basic
      if (!restaurantSlug || !songData.songId) throw new Error('Song ID and slug required for basic play');
      body.songId = songData.songId || songData.id;
      return await this.request('/songs/play', { method: 'POST', body });
    }
  }

  // Obtener cola unificada (backend maneja mixto si pro)
  async getUnifiedQueue(restaurantSlug, params = {}) {
    // Usar endpoint existente, asumiendo backend integra spotify queue si plan pro
    const queryString = this.buildQueryString(params);
    const endpoint = `/requests/${restaurantSlug}/queue${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);

    // Opcional: Enriquecer con source si backend no lo hace
    if (response.success && response.requests) {
      // Asumir backend añade source; si no, lógica client-side basada en id format
    }

    return response.success ? response.data : response;
  }
}

export default new MusicApiService();