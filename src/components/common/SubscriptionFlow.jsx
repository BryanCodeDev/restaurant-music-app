import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  QrCode,
  Upload,
  User,
  Building2,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PricingPlans, { PRICING_PLANS } from './PricingPlans';
import Login from '../auth/Login';
import Register from '../auth/Register';
import { PAYMENT_METHODS, SUBSCRIPTION_STEPS } from '../../constants/app';

const SubscriptionFlow = ({
  isOpen,
  onClose,
  initialPlan = null,
  onComplete
}) => {
  const { user, isAuthenticated, login, register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.QR);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    planId: '',
    userInfo: null,
    paymentInfo: null
  });

  // Estado para navegación mejorada
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [canProceed, setCanProceed] = useState(false);

  const steps = [
    { id: 1, name: 'Seleccionar Plan', description: 'Elige el plan que mejor se adapte a tu restaurante' },
    { id: 2, name: 'Autenticación', description: 'Inicia sesión o crea tu cuenta' },
    { id: 3, name: 'Información', description: 'Completa tus datos personales' },
    { id: 4, name: 'Pago', description: 'Selecciona método de pago y sube comprobante' },
    { id: 5, name: 'Confirmación', description: 'Revisa y confirma tu suscripción' }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedPlan(initialPlan);
      setError(null);
      setPaymentProof(null);
      setPaymentProofPreview(null);
      setCompletedSteps(new Set());
      setValidationErrors({});
      setCanProceed(false);
    }
  }, [isOpen, initialPlan]);

  // Event listener para navegación por teclado
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, currentStep, canProceed]);

  const handlePlanSelect = (planId) => {
    const plan = PRICING_PLANS.find(p => p.id === planId);
    setSelectedPlan(plan);
    setSubscriptionData(prev => ({ ...prev, planId }));
    setCompletedSteps(prev => new Set([...prev, 1]));
    setValidationErrors(prev => ({ ...prev, 1: null }));
  };

  // Validar paso actual
  const validateCurrentStep = () => {
    const errors = { ...validationErrors };

    switch (currentStep) {
      case 1:
        if (!selectedPlan) {
          errors[1] = 'Debes seleccionar un plan';
          setCanProceed(false);
          return false;
        }
        break;
      case 2:
        if (!isAuthenticated) {
          errors[2] = 'Debes iniciar sesión o registrarte';
          setCanProceed(false);
          return false;
        }
        break;
      case 3:
        // Validar información personal
        const nameInput = document.querySelector('input[placeholder="Tu nombre completo"]');
        const emailInput = document.querySelector('input[placeholder="tu@email.com"]');
        const phoneInput = document.querySelector('input[placeholder="+57 300 123 4567"]');

        if (!nameInput?.value.trim()) {
          errors[3] = 'El nombre es requerido';
          setCanProceed(false);
          return false;
        }
        if (!emailInput?.value.trim() || !emailInput.value.includes('@')) {
          errors[3] = 'Email válido es requerido';
          setCanProceed(false);
          return false;
        }
        if (!phoneInput?.value.trim()) {
          errors[3] = 'El teléfono es requerido';
          setCanProceed(false);
          return false;
        }
        break;
      case 4:
        if (!paymentMethod) {
          errors[4] = 'Debes seleccionar un método de pago';
          setCanProceed(false);
          return false;
        }
        if (!paymentProof) {
          errors[4] = 'Debes subir un comprobante de pago';
          setCanProceed(false);
          return false;
        }
        break;
      case 5:
        // Validación final
        if (!selectedPlan || !isAuthenticated || !paymentProof) {
          errors[5] = 'Faltan datos requeridos';
          setCanProceed(false);
          return false;
        }
        break;
    }

    setValidationErrors(errors);
    setCanProceed(true);
    return true;
  };

  // Verificar si se puede proceder al siguiente paso
  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, selectedPlan, isAuthenticated, paymentMethod, paymentProof]);

  const handleNext = () => {
    if (currentStep < steps.length && validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      setValidationErrors(prev => ({ ...prev, [currentStep]: null }));
    }
  };

  // Navegación directa a un paso específico
  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      // Verificar que todos los pasos anteriores estén completados
      for (let i = 1; i < stepNumber; i++) {
        if (!completedSteps.has(i)) {
          setError(`Debes completar el paso ${i} antes de continuar`);
          return;
        }
      }
      setCurrentStep(stepNumber);
      setError(null);
    }
  };

  // Navegación por teclado
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canProceed && currentStep < steps.length) {
      handleNext();
    } else if (e.key === 'Escape') {
      handlePrevious();
    }
  };

  const handleAuthSuccess = async (userData) => {
    setShowAuthModal(false);
    setSubscriptionData(prev => ({ ...prev, userInfo: userData }));
    handleNext();
  };

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(credentials);
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      await register(userData);
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentProofPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Aquí iría la lógica para enviar la suscripción al backend
      const subscriptionPayload = {
        planId: selectedPlan.id,
        userId: user.id,
        paymentMethod,
        paymentProof: paymentProof ? await convertFileToBase64(paymentProof) : null
      };

      // Simular envío
      console.log('Enviando suscripción:', subscriptionPayload);

      // Simular respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onComplete) {
        onComplete({
          success: true,
          subscription: subscriptionPayload,
          message: 'Tu suscripción ha sido enviada para aprobación. Te contactaremos en las próximas 24 horas.'
        });
      }

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Elige tu Plan</h2>
              <p className="text-slate-400">Selecciona el plan que mejor se adapte a tu restaurante</p>
            </div>

            <PricingPlans
              selectedPlan={selectedPlan?.id}
              onPlanSelect={handlePlanSelect}
              onPlanAction={(plan) => {
                setSelectedPlan(plan);
                setSubscriptionData(prev => ({ ...prev, planId: plan.id }));
                handleNext();
              }}
              showHeader={false}
              className="mb-0"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Autenticación</h2>
              <p className="text-slate-400">
                {isAuthenticated
                  ? 'Ya estás autenticado. Continúa con el siguiente paso.'
                  : 'Inicia sesión o crea tu cuenta para continuar'
                }
              </p>
            </div>

            {isAuthenticated ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-400 mb-2">¡Autenticado!</h3>
                <p className="text-slate-300 mb-4">
                  Bienvenido, {user?.name || user?.email}
                </p>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <User className="h-6 w-6 mx-auto mb-2" />
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                  >
                    <User className="h-6 w-6 mx-auto mb-2" />
                    Crear Cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Información Personal</h2>
              <p className="text-slate-400">Completa tus datos para continuar</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      onChange={(e) => validateCurrentStep()}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors[3] && !document.querySelector('input[placeholder="Tu nombre completo"]')?.value.trim()
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-600 focus:ring-blue-500'
                      }`}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      onChange={(e) => validateCurrentStep()}
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors[3] && (!document.querySelector('input[placeholder="tu@email.com"]')?.value.trim() || !document.querySelector('input[placeholder="tu@email.com"]')?.value.includes('@'))
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-600 focus:ring-blue-500'
                      }`}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || ''}
                    onChange={(e) => validateCurrentStep()}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors[3] && !document.querySelector('input[placeholder="+57 300 123 4567"]')?.value.trim()
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-600 focus:ring-blue-500'
                    }`}
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Información adicional
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Cuéntanos sobre tu restaurante o cualquier información adicional..."
                  />
                </div>

                {/* Mostrar errores de validación */}
                {validationErrors[3] && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <p className="text-red-400 text-sm flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors[3]}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Método de Pago</h2>
              <p className="text-slate-400">Selecciona cómo prefieres realizar el pago</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Method */}
              <div
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  paymentMethod === PAYMENT_METHODS.QR
                    ? 'ring-2 ring-blue-500 bg-blue-500/10'
                    : 'hover:bg-slate-800/50'
                } bg-slate-800/40 border border-slate-700/50 rounded-xl p-6`}
                onClick={() => setPaymentMethod(PAYMENT_METHODS.QR)}
              >
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Código QR</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Escanea el código QR con tu aplicación bancaria
                  </p>
                  <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Banco:</span>
                        <span className="text-white">Bancolombia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cuenta:</span>
                        <span className="text-white">123-456789-0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monto:</span>
                        <span className="text-green-400 font-semibold">{selectedPlan?.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    QR Generado
                  </div>
                </div>
              </div>

              {/* Transfer Method */}
              <div
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  paymentMethod === PAYMENT_METHODS.TRANSFER
                    ? 'ring-2 ring-green-500 bg-green-500/10'
                    : 'hover:bg-slate-800/50'
                } bg-slate-800/40 border border-slate-700/50 rounded-xl p-6`}
                onClick={() => setPaymentMethod(PAYMENT_METHODS.TRANSFER)}
              >
                <div className="text-center">
                  <CreditCard className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Transferencia</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Realiza una transferencia bancaria
                  </p>
                  <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Banco:</span>
                        <span className="text-white">Bancolombia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cuenta:</span>
                        <span className="text-white">123-456789-0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monto:</span>
                        <span className="text-green-400 font-semibold">{selectedPlan?.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Datos Bancarios
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Payment Proof */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Comprobante de Pago</h3>
              <p className="text-slate-400 text-sm mb-4">
                Sube una foto o captura de pantalla de tu comprobante de pago
              </p>

              <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center">
                {paymentProofPreview ? (
                  <div className="space-y-4">
                    <img
                      src={paymentProofPreview}
                      alt="Comprobante"
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setPaymentProof(null);
                        setPaymentProofPreview(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <label className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer inline-block">
                        Seleccionar Archivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-slate-500 text-sm">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Confirmar Suscripción</h2>
              <p className="text-slate-400">Revisa los detalles antes de enviar</p>
            </div>

            <div className="space-y-6">
              {/* Plan Selected */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Plan Seleccionado</h3>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPlan?.gradient} flex items-center justify-center`}>
                    {selectedPlan?.icon && React.createElement(selectedPlan.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{selectedPlan?.name}</h4>
                    <p className="text-slate-400 text-sm">{selectedPlan?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {selectedPlan?.price}
                      <span className="text-sm text-slate-400">{selectedPlan?.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nombre:</span>
                    <span className="text-white">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Método de pago:</span>
                    <span className="text-white">{paymentMethod === PAYMENT_METHODS.QR ? 'Código QR' : 'Transferencia'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {paymentProofPreview && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Comprobante de Pago</h3>
                  <img
                    src={paymentProofPreview}
                    alt="Comprobante"
                    className="max-w-full max-h-48 mx-auto rounded-lg border border-slate-600"
                  />
                </div>
              )}

              {/* Terms */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-1">Importante</h4>
                    <p className="text-sm text-slate-300">
                      Tu suscripción será revisada por nuestro equipo en las próximas 24 horas.
                      Te contactaremos para confirmar la activación de tu plan.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Proceso de Suscripción</h1>
              <p className="text-slate-400 text-sm mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={!completedSteps.has(step.id) && step.id !== currentStep && step.id > 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : step.id === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                      : completedSteps.has(step.id)
                      ? 'bg-blue-500/50 text-white hover:bg-blue-500/70'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  } ${completedSteps.has(step.id) || step.id === currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  title={`Ir al paso ${step.id}: ${step.name}`}
                >
                  {step.id < currentStep || completedSteps.has(step.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </button>

                <div className="ml-3 hidden lg:block flex-1">
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    step.id <= currentStep ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {step.description}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-700 mx-4 hidden lg:block">
                    <div className={`h-full transition-all duration-500 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-slate-700'
                    }`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error de navegación */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
              title="Paso anterior (Escape)"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center space-x-3">
              {/* Mensaje de validación */}
              {validationErrors[currentStep] && (
                <div className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors[currentStep]}</span>
                </div>
              )}

              {/* Indicador de progreso */}
              <div className="text-slate-400 text-sm">
                {completedSteps.size}/{steps.length} completados
              </div>

              {currentStep === steps.length && (
                <button
                  onClick={handleSubmitSubscription}
                  disabled={isLoading || !canProceed}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isLoading || !canProceed
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg shadow-blue-500/25'
                  }`}
                  title="Confirmar suscripción (Enter)"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Confirmar Suscripción</span>
                    </>
                  )}
                </button>
              )}

              {currentStep < steps.length && currentStep > 1 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    !canProceed
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg shadow-blue-500/25'
                  }`}
                  title="Siguiente paso (Enter)"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Ayuda de navegación */}
          <div className="mt-4 text-center">
            <p className="text-slate-500 text-xs">
              Usa las teclas <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300">Enter</kbd> para continuar y <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-300">Escape</kbd> para volver
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {authMode === 'login' ? (
                <Login
                  onLogin={handleLogin}
                  onSwitchToRegister={() => setAuthMode('register')}
                  onSwitchToCustomer={() => setShowAuthModal(false)}
                  isLoading={isLoading}
                  error={error}
                />
              ) : (
                <Register
                  onRegister={handleRegister}
                  onSwitchToLogin={() => setAuthMode('login')}
                  onSwitchToCustomer={() => setShowAuthModal(false)}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionFlow;