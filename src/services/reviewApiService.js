import BaseApiService from './baseApiService';

class ReviewApiService extends BaseApiService {
  // Restaurant Reviews
  async createReview(restaurantId, rating, title = '', comment = '', musicRating = null, serviceRating = null, ambianceRating = null) {
    const body = {
      rating,
      title,
      comment,
      musicRating,
      serviceRating,
      ambianceRating
    };
    const response = await this.request(`/reviews/restaurants/${restaurantId}`, {
      method: 'POST',
      body
    });
    return response.success ? response.data : response;
  }

  async getRestaurantReviews(restaurantId, limit = 10, offset = 0) {
    const params = this.buildQueryString({ limit, offset });
    const response = await this.request(`/reviews/restaurants/${restaurantId}?${params}`);
    return response.success ? response.data : response;
  }

  async updateReview(reviewId, data) {
    const response = await this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  async deleteReview(reviewId) {
    const response = await this.request(`/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    return response.success ? response.data : response;
  }

  async getUserReviews(userId, limit = 10, offset = 0) {
    const params = this.buildQueryString({ limit, offset });
    const response = await this.request(`/reviews/user/${userId}?${params}`);
    return response.success ? response.data : response;
  }

  async respondToReview(reviewId, response) {
    const responseData = await this.request(`/reviews/${reviewId}/response`, {
      method: 'POST',
      body: { response }
    });
    return responseData.success ? responseData.data : responseData;
  }

  async getReviewStats(restaurantId) {
    const response = await this.request(`/reviews/restaurants/${restaurantId}/stats`);
    return response.success ? response.data : response;
  }

  async reportReview(reviewId, reason) {
    const response = await this.request(`/reviews/${reviewId}/report`, {
      method: 'POST',
      body: { reason }
    });
    return response.success ? response.data : response;
  }

  async getReportedReviews(limit = 10, offset = 0) {
    const params = this.buildQueryString({ limit, offset });
    const response = await this.request(`/admin/reviews/reported?${params}`);
    return response.success ? response.data : response;
  }

  async moderateReview(reviewId, action, reason = '') {
    const response = await this.request(`/admin/reviews/${reviewId}/moderate`, {
      method: 'POST',
      body: { action, reason }
    });
    return response.success ? response.data : response;
  }

  // Review reactions (likes/dislikes)
  async reactToReview(reviewId, reactionType) {
    const response = await this.request(`/reviews/${reviewId}/react`, {
      method: 'POST',
      body: { reactionType }
    });
    return response.success ? response.data : response;
  }

  async removeReaction(reviewId) {
    const response = await this.request(`/reviews/${reviewId}/react`, {
      method: 'DELETE'
    });
    return response.success ? response.data : response;
  }

  async getReviewReactions(reviewId) {
    const response = await this.request(`/reviews/${reviewId}/reactions`);
    return response.success ? response.data : response;
  }

  // Review analytics
  async getReviewAnalytics(restaurantId, period = '30d') {
    const response = await this.request(`/reviews/restaurants/${restaurantId}/analytics?period=${period}`);
    return response.success ? response.data : response;
  }

  async getTopRatedRestaurants(limit = 10, category = 'overall') {
    const params = this.buildQueryString({ limit, category });
    const response = await this.request(`/reviews/top-rated?${params}`);
    return response.success ? response.data : response;
  }

  async getReviewTrends(restaurantId, period = '30d') {
    const response = await this.request(`/reviews/restaurants/${restaurantId}/trends?period=${period}`);
    return response.success ? response.data : response;
  }
}

export default new ReviewApiService();