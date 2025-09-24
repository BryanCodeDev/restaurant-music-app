import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Star, Zap, AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff, Clock, Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SubscriptionFlow from '../common/SubscriptionFlow';
import PricingPlans, { PRICING_PLANS } from '../common/PricingPlans';
import { SUBSCRIPTION_TYPES, SUBSCRIPTION_STATUS } from '../../constants/app';

const SubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const planType = searchParams.get('plan') || SUBSCRIPTION_TYPES.NEW;
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Estados mejorados para manejo de errores
  const [errorType, setErrorType] = useState(null); // 'network', 'validation', 'server', 'unknown'
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastErrorTime, setLastErrorTime] = useState(null);

  const getPageTitle = () => {
    switch (planType) {
      case SUBSCRIPTION_TYPES.NEW:
        return 'Elige tu Plan';
      case SUBSCRIPTION_TYPES.RENEWAL:
        return 'Renovar Suscripción';
      case SUBSCRIPTION_TYPES.PENDING:
        return 'Suscripción Pendiente';
      default:
        return 'Planes de Suscripción';
    }
  };

  const getPageDescription = () => {
    switch (planType) {
      case SUBSCRIPTION_TYPES.NEW:
        return 'Selecciona el plan perfecto para tu restaurante y comienza a disfrutar de todas las funciones premium';
      case SUBSCRIPTION_TYPES.RENEWAL:
        return 'Renueva tu suscripción para continuar disfrutando de todas las funciones premium';
      case SUBSCRIPTION_TYPES.PENDING:
        return 'Tu suscripción está siendo revisada. Te contactaremos pronto para confirmar la activación';
      default:
        return 'Descubre todos nuestros planes y elige el que mejor se adapte a tu restaurante';
    }
  };

  const handlePlanSelect = (planId) => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorType(null);

      const plan = PRICING_PLANS.find(p => p.id === planId);
      if (!plan) {
        const validationError = new Error('Plan no encontrado');
        validationError.status = 400;
        throw validationError;
      }

      setSelectedPlan(plan);
      setShowSubscriptionFlow(true);
    } catch (err) {
      const errorType = detectErrorType(err);
      setErrorType(errorType);

      switch (errorType) {
        case 'validation':
          handleValidationError(err);
          break;
        case 'network':
          handleConnectionError();
          break;
        case 'server':
          handleServerError(err);
          break;
        default:
          handleUnknownError(err);
      }

      console.error('Error selecting plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionComplete = (result) => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorType(null);

      if (result.success) {
        setSuccess(true);
        setShowSubscriptionFlow(false);
        setSelectedPlan(null);
        setRetryCount(0);

        // Mostrar mensaje de éxito con mejor UX
        setTimeout(() => {
          // Usar un toast o notificación en lugar de alert
          const event = new CustomEvent('showNotification', {
            detail: {
              type: 'success',
              title: '¡Suscripción enviada exitosamente!',
              message: 'Te contactaremos en las próximas 24 horas para confirmar tu plan.',
              duration: 5000
            }
          });
          window.dispatchEvent(event);
        }, 500);
      } else {
        const serverError = new Error(result.message || 'Error al procesar la suscripción');
        serverError.status = 500;
        throw serverError;
      }
    } catch (err) {
      const errorType = detectErrorType(err);
      setErrorType(errorType);

      switch (errorType) {
        case 'validation':
          handleValidationError(err);
          break;
        case 'network':
          handleConnectionError();
          break;
        case 'server':
          handleServerError(err);
          break;
        default:
          handleUnknownError(err);
      }

      console.error('Error completing subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Detectar tipo de error
  const detectErrorType = (error) => {
    if (!navigator.onLine) return 'network';
    if (error?.message?.includes('fetch')) return 'network';
    if (error?.status === 400) return 'validation';
    if (error?.status >= 500) return 'server';
    return 'unknown';
  };

  // Manejar errores de conexión
  const handleConnectionError = () => {
    setErrorType('network');
    setError('No hay conexión a internet. Verifica tu conexión e intenta nuevamente.');
    setLastErrorTime(Date.now());
  };

  // Manejar errores de servidor
  const handleServerError = (error) => {
    setErrorType('server');
    setError('Error del servidor. Estamos trabajando para solucionarlo. Intenta nuevamente en unos minutos.');
    setLastErrorTime(Date.now());
  };

  // Manejar errores de validación
  const handleValidationError = (error) => {
    setErrorType('validation');
    setError(error.message || 'Los datos ingresados no son válidos. Revisa la información e intenta nuevamente.');
    setLastErrorTime(Date.now());
  };

  // Manejar errores desconocidos
  const handleUnknownError = (error) => {
    setErrorType('unknown');
    setError('Ha ocurrido un error inesperado. Intenta nuevamente o contacta al soporte.');
    setLastErrorTime(Date.now());
  };

  const handleRetry = () => {
    setError(null);
    setErrorType(null);
    setSuccess(false);
    setRetryCount(prev => prev + 1);
  };

  // Verificar conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      handleConnectionError();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {getPageTitle()}
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {getPageDescription()}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {errorType === 'network' && <WifiOff className="h-5 w-5 text-red-400" />}
                {errorType === 'server' && <AlertCircle className="h-5 w-5 text-red-400" />}
                {errorType === 'validation' && <Info className="h-5 w-5 text-red-400" />}
                {errorType === 'unknown' && <AlertCircle className="h-5 w-5 text-red-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400">
                  {errorType === 'network' && 'Error de Conexión'}
                  {errorType === 'server' && 'Error del Servidor'}
                  {errorType === 'validation' && 'Error de Validación'}
                  {errorType === 'unknown' && 'Error'}
                </h3>
                <p className="text-slate-300 mb-2">{error}</p>

                {/* Información adicional según el tipo de error */}
                {errorType === 'network' && (
                  <div className="text-sm text-slate-400">
                    <p>• Verifica tu conexión a internet</p>
                    <p>• Intenta recargar la página</p>
                    <p>• Si el problema persiste, contacta al soporte</p>
                  </div>
                )}

                {errorType === 'server' && (
                  <div className="text-sm text-slate-400">
                    <p>• Estamos trabajando para solucionarlo</p>
                    <p>• Intenta nuevamente en unos minutos</p>
                    <p>• Intento #{retryCount}</p>
                  </div>
                )}

                {errorType === 'validation' && (
                  <div className="text-sm text-slate-400">
                    <p>• Revisa los datos ingresados</p>
                    <p>• Asegúrate de completar todos los campos requeridos</p>
                  </div>
                )}

                {lastErrorTime && (
                  <p className="text-xs text-slate-500 mt-2">
                    Error reportado: {new Date(lastErrorTime).toLocaleString('es-CO')}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reintentar</span>
                </button>

                {/* Botón de soporte para errores persistentes */}
                {retryCount >= 3 && (
                  <button
                    onClick={() => window.open('https://wa.me/+573212209943', '_blank')}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    Contactar Soporte
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Indicador de conexión */}
        {!isOnline && (
          <div className="mb-8 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center space-x-2 text-yellow-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Sin conexión a internet</span>
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400">¡Suscripción Exitosa!</h3>
                <p className="text-slate-300">Tu suscripción ha sido enviada para revisión. Te contactaremos pronto.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading eliminado - mostrar directamente el contenido */}

        {/* Content based on plan type */}
        {planType === SUBSCRIPTION_TYPES.PENDING ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Suscripción Pendiente</h2>
              <p className="text-slate-300 mb-6">
                Tu solicitud de suscripción está siendo revisada por nuestro equipo.
                Te contactaremos en las próximas 24 horas para confirmar la activación de tu plan.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">
                  📧 Revisa tu correo electrónico para actualizaciones<br/>
                  📱 También te contactaremos por WhatsApp si proporcionaste tu número
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pricing Plans */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <PricingPlans
                showSubscriptionFlow={false}
                onPlanAction={handlePlanSelect}
                showHeader={false}
                className="mb-0"
              />
            </div>

            {/* Features Comparison */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">¿Por qué elegir nuestros planes?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Sin costos ocultos</h4>
                  <p className="text-slate-400 text-sm">Precios transparentes y sin sorpresas</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Soporte premium</h4>
                  <p className="text-slate-400 text-sm">Atención personalizada 24/7</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Activación rápida</h4>
                  <p className="text-slate-400 text-sm">Tu plan se activa en menos de 24 horas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Flow Modal */}
        <SubscriptionFlow
          isOpen={showSubscriptionFlow}
          onClose={() => setShowSubscriptionFlow(false)}
          initialPlan={selectedPlan}
          onComplete={handleSubscriptionComplete}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;