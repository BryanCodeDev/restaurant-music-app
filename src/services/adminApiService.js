import BaseApiService from './baseApiService';

class AdminApiService extends BaseApiService {
  // Super Admin methods
  async getPendingRestaurants() {
    const response = await this.request('/admin/pending-restaurants');
    return response.success ? response.data : response;
  }

  async approveRestaurant(id, data) {
    const formData = new FormData();
    if (data.subscription_plan_id) formData.append('subscription_plan_id', data.subscription_plan_id);
    if (data.subscription_status) formData.append('subscription_status', data.subscription_status);
    if (data.payment_proof) formData.append('payment_proof', data.payment_proof);
    if (data.notes) formData.append('notes', data.notes);
    const response = await this.request(`/admin/approve-restaurant/${id}`, {
      method: 'PATCH',
      body: formData
    });
    return response;
  }

  // Subscription management methods
  async getSubscriptionPlans() {
    const response = await this.request('/admin/subscription-plans');
    return response.success ? response.data : response;
  }

  async createSubscriptionPlan(planData) {
    const response = await this.request('/admin/subscription-plans', {
      method: 'POST',
      body: planData
    });
    return response.success ? response.data : response;
  }

  async updateSubscriptionPlan(planId, planData) {
    const response = await this.request(`/admin/subscription-plans/${planId}`, {
      method: 'PUT',
      body: planData
    });
    return response.success ? response.data : response;
  }

  async deleteSubscriptionPlan(planId) {
    const response = await this.request(`/admin/subscription-plans/${planId}`, {
      method: 'DELETE'
    });
    return response.success ? response.data : response;
  }

  async getSubscriptionStats() {
    const response = await this.request('/admin/subscription-stats');
    return response.success ? response.data : response;
  }

  async getPendingSubscriptions() {
    const response = await this.request('/admin/pending-subscriptions');
    return response.success ? response.data : response;
  }

  async approveSubscription(restaurantId, subscriptionData) {
    const response = await this.request(`/admin/approve-subscription/${restaurantId}`, {
      method: 'POST',
      body: subscriptionData
    });
    return response.success ? response.data : response;
  }

  async rejectSubscription(restaurantId, rejectionData) {
    const response = await this.request(`/admin/reject-subscription/${restaurantId}`, {
      method: 'POST',
      body: rejectionData
    });
    return response.success ? response.data : response;
  }

  async rejectRestaurant(id, data) {
    const response = await this.request(`/admin/reject-restaurant/${id}`, {
      method: 'POST',
      body: data // {reason_rejection}
    });
    return response;
  }

  async getAllUsers() {
    const response = await this.request('/admin/users');
    return response.success ? response.data : response;
  }

  async updateUser(userId, data) {
    const response = await this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: data
    });
    return response.success ? response.data : response;
  }

  async getGlobalStats() {
    const response = await this.request('/admin/stats');
    return response.success ? response.data : response;
  }

  async getSystemLogs(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/admin/logs${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async exportReport(format = 'json', params = {}) {
    const queryString = this.buildQueryString({ format, ...params });
    const endpoint = `/admin/export${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response;
  }

  // Restaurant Admin methods
  async getRestaurantUsers(restaurantId) {
    const response = await this.request(`/admin/restaurants/${restaurantId}/users`);
    return response.success ? response.data : response;
  }

  async manageUserPermissions(userId, permissions) {
    const response = await this.request(`/admin/users/${userId}/permissions`, {
      method: 'PUT',
      body: { permissions }
    });
    return response.success ? response.data : response;
  }

  async getAuditTrail(userId, params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `/admin/audit/${userId}${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.success ? response.data : response;
  }

  async bulkUserAction(action, userIds) {
    const response = await this.request('/admin/users/bulk', {
      method: 'POST',
      body: { action, userIds }
    });
    return response.success ? response.data : response;
  }
}

export default new AdminApiService();