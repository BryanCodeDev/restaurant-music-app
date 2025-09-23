import BaseApiService from './baseApiService';

class RestaurantApiService extends BaseApiService {
  // Public restaurant endpoints
  async getPublicRestaurants(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/restaurants${queryString ? `?${queryString}` : ''}`;

    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async getRestaurantBySlug(slug) {
    const response = await this.request(`/restaurants/${slug}`);
    return response.success ? response.data : response;
  }

  async getRestaurantStats(slug, period = '24h') {
    const response = await this.request(`/restaurants/${slug}/stats?period=${period}`);
    return response.success ? response.data : response;
  }

  // Restaurant management (for restaurant owners)
  async updateRestaurant(slug, data) {
    const response = await this.request(`/restaurants/${slug}`, {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  async updateRestaurantSettings(slug, settings) {
    const response = await this.request(`/restaurants/${slug}/settings`, {
      method: 'PUT',
      body: settings
    });
    return response.success ? response.data : response;
  }

  async getRestaurantReviews(restaurantId, limit = 10, offset = 0) {
    const params = this.buildQueryString({ limit, offset });
    const response = await this.request(`/reviews/restaurants/${restaurantId}?${params}`);
    return response.success ? response.data : response;
  }

  async respondToReview(reviewId, response) {
    const responseData = await this.request(`/reviews/${reviewId}/response`, {
      method: 'POST',
      body: { response }
    });
    return responseData.success ? responseData.data : responseData;
  }

  // Music library management
  async getRestaurantSongs(slug, params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/songs/${slug}${queryString ? `?${queryString}` : ''}`;

    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async addSongToLibrary(slug, songData) {
    const response = await this.request(`/songs/${slug}`, {
      method: 'POST',
      body: songData
    });
    return response.success ? response.data : response;
  }

  async updateSongInLibrary(slug, songId, songData) {
    const response = await this.request(`/songs/${slug}/${songId}`, {
      method: 'PUT',
      body: songData
    });
    return response.success ? response.data : response;
  }

  async removeSongFromLibrary(slug, songId) {
    const response = await this.request(`/songs/${slug}/${songId}`, {
      method: 'DELETE'
    });
    return response.success ? response.data : response;
  }

  async importSpotifyPlaylist(slug, playlistId) {
    const response = await this.request(`/songs/${slug}/import-spotify/${playlistId}`, {
      method: 'POST'
    });
    return response.success ? response.data : response;
  }

  // Queue management
  async getRestaurantQueue(slug, params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/requests/${slug}/queue${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async updateRequestStatus(requestId, status) {
    const validStatuses = ['pending', 'playing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid request status');
    }

    const response = await this.request(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: { status }
    });
    return response.success ? response.data : response;
  }

  async updateRequestPosition(requestId, position) {
    const response = await this.request(`/requests/${requestId}/position`, {
      method: 'PATCH',
      body: { position }
    });
    return response.success ? response.data : response;
  }

  async getRequestStats(slug, period = '24h') {
    const response = await this.request(`/requests/${slug}/stats?period=${period}`);
    return response.success ? response.data : response;
  }

  // Subscription management for restaurants
  async getSubscriptionInfo(slug) {
    const response = await this.request(`/restaurants/${slug}/subscription`);
    return response.success ? response.data : response;
  }

  async requestSubscriptionUpgrade(slug, subscriptionData) {
    const response = await this.request(`/restaurants/${slug}/subscription/upgrade`, {
      method: 'POST',
      body: subscriptionData
    });
    return response.success ? response.data : response;
  }

  async updateSubscription(slug, subscriptionData) {
    const response = await this.request(`/restaurants/${slug}/subscription`, {
      method: 'PUT',
      body: subscriptionData
    });
    return response.success ? response.data : response;
  }

  async cancelSubscription(slug, cancellationData) {
    const response = await this.request(`/restaurants/${slug}/subscription/cancel`, {
      method: 'POST',
      body: cancellationData
    });
    return response.success ? response.data : response;
  }

  async getSubscriptionHistory(slug) {
    const response = await this.request(`/restaurants/${slug}/subscription/history`);
    return response.success ? response.data : response;
  }

  async getAvailablePlans() {
    const response = await this.request('/subscription-plans');
    return response.success ? response.data : response;
  }
}

export default new RestaurantApiService();