import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  Headphones,
  Crown,
  Phone,
  MapPin,
  User,
  Upload,
  CheckCircle,
  ArrowLeft,
  Zap,
  Star,
  Shield,
  Calendar,
  CreditCard,
  Check,
  X
} from 'lucide-react';

const AdminRegister = ({ onRegister, onSwitchToLogin, onSwitchToCustomer, onBack, isLoading = false, error = null }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Datos básicos, 2: Plan, 3: Verificación
  const [formData, setFormData] = useState({
    // Datos del restaurante
    restaurantName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia',
    
    // Datos del contacto
    ownerName: '',
    ownerTitle: 'Propietario',
    
    // Plan de suscripción
    selectedPlan: 'starter',
    
    // Verificación
    businessDocument: null,
    acceptTerms: false,
    acceptMarketing: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: '/mes',
      description: 'Perfecto para comenzar',
      features: [
        'Hasta 50 mesas',
        'Cola musical básica',
        '1,000 peticiones/mes',
        'Soporte por email',
        'Estadísticas básicas'
      ],
      limitations: [
        'Sin personalización avanzada',
        'Sin API access'
      ],
      color: 'blue',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/mes',
      description: 'Ideal para restaurantes establecidos',
      features: [
        'Mesas ilimitadas',
        'Cola musical avanzada',
        '10,000 peticiones/mes',
        'Soporte prioritario 24/7',
        'Analytics completos',
        'Personalización completa',
        'Integración con Spotify',
        'Control de contenido'
      ],
      limitations: [],
      color: 'amber',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/mes',
      description: 'Para cadenas y grandes establecimientos',
      features: [
        'Todo lo de Professional',
        'Múltiples ubicaciones',
        'Peticiones ilimitadas',
        'Soporte dedicado',
        'API completa',
        'White-label',
        'Integración personalizada',
        'SLA garantizado'
      ],
      limitations: [],
      color: 'purple',
      popular: false
    }
  ];

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.restaurantName) {
      newErrors.restaurantName = 'El nombre del restaurante es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.ownerName) {
      newErrors.ownerName = 'El nombre del contacto es requerido';
    }

    if (!formData.address) {
      newErrors.address = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos de servicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await onRegister(formData);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al registrar restaurante' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, businessDocument: file }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-amber-400" />
          <span>Información del Restaurante</span>
        </h3>
        
        <div className="space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre del restaurante *
            </label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => handleInputChange('restaurantName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                errors.restaurantName ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Ej: Restaurante La Terraza"
            />
            {errors.restaurantName && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.restaurantName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email corporativo *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="admin@turestaurante.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirmar contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-400" />
          <span>Datos de Contacto</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre del contacto *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                errors.ownerName ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Tu nombre completo"
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.ownerName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
              placeholder="+57 300 123 4567"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-emerald-400" />
          <span>Ubicación</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Dirección *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${
                errors.address ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Dirección completa del restaurante"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                placeholder="Bogotá"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                País
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                placeholder="Colombia"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Elige tu Plan</h3>
        <p className="text-slate-400">Selecciona el plan que mejor se adapte a tu restaurante</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleInputChange('selectedPlan', plan.id)}
            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              formData.selectedPlan === plan.id ? 'scale-105' : ''
            }`}
          >
            <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              formData.selectedPlan === plan.id
                ? `border-${plan.color}-500 bg-${plan.color}-500/10 shadow-lg shadow-${plan.color}-500/20`
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className={`text-xl font-bold mb-1 ${
                  formData.selectedPlan === plan.id ? `text-${plan.color}-400` : 'text-white'
                }`}>
                  {plan.name}
                </h4>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className={`text-3xl font-black ${
                    formData.selectedPlan === plan.id ? `text-${plan.color}-400` : 'text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className={`h-4 w-4 ${
                      formData.selectedPlan === plan.id ? `text-${plan.color}-400` : 'text-emerald-400'
                    }`} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center space-x-3 opacity-60">
                    <X className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-slate-400">{limitation}</span>
                  </div>
                ))}
              </div>

              {formData.selectedPlan === plan.id && (
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-500 bg-amber-500/5 pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white mb-1">Garantía de 30 días</h4>
            <p className="text-sm text-slate-400">
              Si no estás satisfecho con el servicio, te devolvemos el 100% de tu dinero en los primeros 30 días.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Verificación Final</h3>
        <p className="text-slate-400">Últimos pasos para completar tu registro</p>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-4">Resumen de tu registro</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Restaurante:</span>
            <span className="text-white font-medium">{formData.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="text-white">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Plan seleccionado:</span>
            <span className="text-amber-400 font-medium">
              {plans.find(p => p.id === formData.selectedPlan)?.name} - {plans.find(p => p.id === formData.selectedPlan)?.price}/mes
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Contacto:</span>
            <span className="text-white">{formData.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Documento de verificación (opcional)
        </label>
        <div className="relative">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-400">
                <span className="font-semibold">Click para subir</span> tu RUT, cámara de comercio o similar
              </p>
              <p className="text-xs text-slate-500">PDF, JPG, PNG (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              accept=".pdf,.jpg,.jpeg,.png" 
            />
          </label>
          {formData.businessDocument && (
            <p className="mt-2 text-sm text-emerald-400 flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Documento cargado: {formData.businessDocument.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
            className={`mt-1 h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-600 rounded bg-slate-800 ${
              errors.acceptTerms ? 'ring-1 ring-red-500' : ''
            }`}
          />
          <div className="text-sm">
            <span className="text-slate-300">
              Acepto los{' '}
              <button type="button" className="text-amber-400 hover:text-amber-300 underline">
                términos de servicio
              </button>{' '}
              y la{' '}
              <button type="button" className="text-amber-400 hover:text-amber-300 underline">
                política de privacidad
              </button>
            </span>
            {errors.acceptTerms && (
              <p className="mt-1 text-red-400 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs">{errors.acceptTerms}</span>
              </p>
            )}
          </div>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptMarketing}
            onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
            className="mt-1 h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-600 rounded bg-slate-800"
          />
          <span className="text-sm text-slate-300">
            Quiero recibir noticias sobre nuevas funcionalidades y promociones especiales
          </span>
        </label>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">Proceso de verificación</h4>
            <p className="text-sm text-slate-400">
              Tu cuenta será revisada en 24-48 horas. Recibirás un email de confirmación una vez aprobada.
              Mientras tanto, tendrás acceso a todas las funciones básicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver</span>
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl opacity-20 blur"></div>
                <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 p-4 rounded-xl">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Registra tu Restaurante
            </h1>
            <p className="text-slate-400 mb-8">
              Únete a la plataforma líder en experiencias musicales gastronómicas
            </p>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step ? 'bg-amber-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
            
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.submit}</span>
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : null}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStep > 1
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <Crown className="h-5 w-5" />
                    <span>Completar Registro</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === 1 ? 'Continuar' : 'Finalizar'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-slate-400 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>

            {onSwitchToCustomer && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-500">¿Eres cliente?</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSwitchToCustomer}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  <Headphones className="h-4 w-4" />
                  <span>Acceso de Cliente</span>
                </button>
              </>
            )}

            <div className="pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Al registrar tu restaurante, aceptas nuestros términos de servicio empresarial.
                <br />Todos los datos están protegidos bajo estrictas medidas de seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;