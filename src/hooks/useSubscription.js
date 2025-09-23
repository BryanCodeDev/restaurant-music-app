import { useState, useEffect, useCallback } from 'react';
import { SUBSCRIPTION_STATUS, PLAN_TYPES } from '../constants/app';
import restaurantApiService from '../services/restaurantApiService';
import adminApiService from '../services/adminApiService';

export const useSubscription = (restaurantSlug = null) => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar información de suscripción
  const loadSubscription = useCallback(async () => {
    if (!restaurantSlug) return;

    try {
      setLoading(true);
      setError(null);
      const response = await restaurantApiService.getSubscriptionInfo(restaurantSlug);
      if (response.success) {
        setSubscription(response.data);
      } else {
        setError(response.message || 'Error al cargar suscripción');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar suscripción');
    } finally {
      setLoading(false);
    }
  }, [restaurantSlug]);

  // Cargar planes disponibles
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await restaurantApiService.getAvailablePlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        setError(response.message || 'Error al cargar planes');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar planes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar si la suscripción está activa
  const isSubscriptionActive = useCallback(() => {
    if (!subscription) return false;

    const now = new Date();
    const endDate = subscription.subscription_end_date ? new Date(subscription.subscription_end_date) : null;
    const status = subscription.subscription_status;

    return status === SUBSCRIPTION_STATUS.ACTIVE &&
           (!endDate || endDate > now);
  }, [subscription]);

  // Verificar si la suscripción está expirada
  const isSubscriptionExpired = useCallback(() => {
    if (!subscription || !subscription.subscription_end_date) return false;

    const now = new Date();
    const endDate = new Date(subscription.subscription_end_date);

    return endDate <= now;
  }, [subscription]);

  // Obtener días restantes de suscripción
  const getDaysRemaining = useCallback(() => {
    if (!subscription || !subscription.subscription_end_date) return null;

    const now = new Date();
    const endDate = new Date(subscription.subscription_end_date);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }, [subscription]);

  // Verificar si puede hacer upgrade
  const canUpgrade = useCallback((targetPlanId) => {
    if (!subscription || !targetPlanId) return false;

    const currentPlan = plans.find(p => p.id === subscription.subscription_plan_id);
    const targetPlan = plans.find(p => p.id === targetPlanId);

    if (!currentPlan || !targetPlan) return false;

    // Lógica de comparación de planes
    const planHierarchy = {
      [PLAN_TYPES.STARTER]: 1,
      [PLAN_TYPES.PROFESSIONAL]: 2,
      [PLAN_TYPES.ENTERPRISE]: 3
    };

    return planHierarchy[targetPlan.id] > planHierarchy[currentPlan.id];
  }, [subscription, plans]);

  // Solicitar upgrade de suscripción
  const requestUpgrade = useCallback(async (targetPlanId, paymentProof = null) => {
    if (!restaurantSlug || !targetPlanId) {
      throw new Error('Información requerida faltante');
    }

    try {
      setLoading(true);
      setError(null);

      const upgradeData = {
        target_plan_id: targetPlanId,
        current_plan_id: subscription?.subscription_plan_id,
        payment_proof: paymentProof
      };

      const response = await restaurantApiService.requestSubscriptionUpgrade(restaurantSlug, upgradeData);

      if (response.success) {
        await loadSubscription(); // Recargar información
        return response.data;
      } else {
        throw new Error(response.message || 'Error al solicitar upgrade');
      }
    } catch (err) {
      setError(err.message || 'Error al solicitar upgrade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantSlug, subscription, loadSubscription]);

  // Cancelar suscripción
  const cancelSubscription = useCallback(async (cancellationReason) => {
    if (!restaurantSlug) {
      throw new Error('Información requerida faltante');
    }

    try {
      setLoading(true);
      setError(null);

      const response = await restaurantApiService.cancelSubscription(restaurantSlug, {
        reason: cancellationReason,
        effective_date: new Date().toISOString()
      });

      if (response.success) {
        await loadSubscription(); // Recargar información
        return response.data;
      } else {
        throw new Error(response.message || 'Error al cancelar suscripción');
      }
    } catch (err) {
      setError(err.message || 'Error al cancelar suscripción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantSlug, loadSubscription]);

  // Obtener plan actual
  const getCurrentPlan = useCallback(() => {
    if (!subscription || !plans.length) return null;
    return plans.find(p => p.id === subscription.subscription_plan_id);
  }, [subscription, plans]);

  // Obtener estadísticas de uso
  const getUsageStats = useCallback(() => {
    if (!subscription) return null;

    const currentPlan = getCurrentPlan();
    if (!currentPlan) return null;

    return {
      plan_name: currentPlan.name,
      status: subscription.subscription_status,
      start_date: subscription.subscription_start_date,
      end_date: subscription.subscription_end_date,
      days_remaining: getDaysRemaining(),
      is_active: isSubscriptionActive(),
      is_expired: isSubscriptionExpired(),
      can_upgrade: canUpgrade(PLAN_TYPES.PROFESSIONAL) || canUpgrade(PLAN_TYPES.ENTERPRISE)
    };
  }, [subscription, getCurrentPlan, getDaysRemaining, isSubscriptionActive, isSubscriptionExpired, canUpgrade]);

  // Cargar datos iniciales
  useEffect(() => {
    if (restaurantSlug) {
      loadSubscription();
    }
    loadPlans();
  }, [restaurantSlug, loadSubscription, loadPlans]);

  return {
    // Estado
    subscription,
    plans,
    loading,
    error,

    // Métodos de verificación
    isSubscriptionActive,
    isSubscriptionExpired,
    getDaysRemaining,
    canUpgrade,
    getCurrentPlan,
    getUsageStats,

    // Métodos de acción
    requestUpgrade,
    cancelSubscription,
    loadSubscription,
    loadPlans,

    // Utilidades
    refresh: loadSubscription
  };
};

// Hook para admin de suscripciones
export const useSubscriptionAdmin = () => {
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar suscripciones pendientes
  const loadPendingSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.getPendingSubscriptions();
      if (response.success) {
        setPendingSubscriptions(response.data);
      } else {
        setError(response.message || 'Error al cargar suscripciones pendientes');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar suscripciones pendientes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas de suscripciones
  const loadSubscriptionStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.getSubscriptionStats();
      if (response.success) {
        setSubscriptionStats(response.data);
      } else {
        setError(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Aprobar suscripción
  const approveSubscription = useCallback(async (restaurantId, subscriptionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.approveSubscription(restaurantId, subscriptionData);
      if (response.success) {
        await loadPendingSubscriptions(); // Recargar lista
        return response.data;
      } else {
        throw new Error(response.message || 'Error al aprobar suscripción');
      }
    } catch (err) {
      setError(err.message || 'Error al aprobar suscripción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPendingSubscriptions]);

  // Rechazar suscripción
  const rejectSubscription = useCallback(async (restaurantId, rejectionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.rejectSubscription(restaurantId, rejectionData);
      if (response.success) {
        await loadPendingSubscriptions(); // Recargar lista
        return response.data;
      } else {
        throw new Error(response.message || 'Error al rechazar suscripción');
      }
    } catch (err) {
      setError(err.message || 'Error al rechazar suscripción');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPendingSubscriptions]);

  // Cargar datos iniciales
  useEffect(() => {
    loadPendingSubscriptions();
    loadSubscriptionStats();
  }, [loadPendingSubscriptions, loadSubscriptionStats]);

  return {
    // Estado
    pendingSubscriptions,
    subscriptionStats,
    loading,
    error,

    // Métodos
    approveSubscription,
    rejectSubscription,
    loadPendingSubscriptions,
    loadSubscriptionStats,
    refresh: () => {
      loadPendingSubscriptions();
      loadSubscriptionStats();
    }
  };
};

export default useSubscription;