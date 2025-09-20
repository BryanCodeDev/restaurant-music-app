import React from 'react';
import { Check, X, Crown, Star, Zap } from 'lucide-react';

// Configuración de planes de suscripción
export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$80.000',
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
    gradient: 'from-blue-500 to-blue-600',
    popular: false,
    icon: Star,
    buttonText: 'Comenzar con Starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$120.000',
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
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    popular: true,
    icon: Crown,
    buttonText: 'Elegir Professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$300.000',
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
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    popular: false,
    icon: Zap,
    buttonText: 'Contactar Ventas'
  }
];

// Hook para usar planes de precios
export const usePricingPlans = () => {
  const getPlanById = (id) => {
    return PRICING_PLANS.find(plan => plan.id === id);
  };

  const getPopularPlan = () => {
    return PRICING_PLANS.find(plan => plan.popular);
  };

  const getPlansByCategory = (category) => {
    switch (category) {
      case 'popular':
        return PRICING_PLANS.filter(plan => plan.popular);
      case 'basic':
        return PRICING_PLANS.filter(plan => !plan.popular);
      default:
        return PRICING_PLANS;
    }
  };

  return {
    plans: PRICING_PLANS,
    getPlanById,
    getPopularPlan,
    getPlansByCategory
  };
};

// Componente de tarjeta individual de plan
const PricingCard = ({
  plan,
  selected = false,
  onSelect,
  showButton = true,
  buttonAction,
  className = ''
}) => {
  const IconComponent = plan.icon;

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        selected ? 'scale-105' : ''
      } ${className}`}
      onClick={() => onSelect && onSelect(plan.id)}
    >
      <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
        selected
          ? `border-${plan.color}-500 bg-gradient-to-br from-${plan.color}-500/10 to-${plan.color}-600/10 shadow-lg shadow-${plan.color}-500/20`
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
      }`}>

        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg shadow-purple-500/25">
              <Crown className="h-3 w-3" />
              <span>MÁS POPULAR</span>
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
            selected ? `bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/20` : 'bg-slate-700'
          }`}>
            <IconComponent className={`h-6 w-6 ${
              selected ? `text-${plan.color}-400` : 'text-slate-400'
            }`} />
          </div>

          <h4 className={`text-xl font-bold mb-1 ${
            selected ? `text-${plan.color}-400` : 'text-white'
          }`}>
            {plan.name}
          </h4>

          <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

          <div className="flex items-baseline justify-center space-x-1">
            <span className={`text-3xl font-black ${
              selected ? `text-${plan.color}-400` : 'text-white'
            }`}>
              {plan.price}
            </span>
            <span className="text-slate-400">{plan.period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className={`h-4 w-4 ${
                selected ? `text-${plan.color}-400` : 'text-emerald-400'
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

        {/* Button */}
        {showButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (buttonAction) buttonAction(plan);
            }}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              selected
                ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg shadow-${plan.color}-500/25 transform hover:scale-105`
                : `bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white`
            }`}
          >
            {plan.buttonText}
          </button>
        )}

        {/* Selected Indicator */}
        {selected && (
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-500 bg-amber-500/5 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

// Componente principal de planes de precios
const PricingPlans = ({
  selectedPlan = null,
  onPlanSelect,
  onPlanAction,
  layout = 'grid', // 'grid' | 'list'
  showHeader = true,
  showGuarantee = true,
  className = ''
}) => {
  const { plans } = usePricingPlans();

  const handlePlanSelect = (planId) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    }
  };

  const handlePlanAction = (plan) => {
    if (onPlanAction) {
      onPlanAction(plan);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Elige tu Plan</h3>
          <p className="text-slate-400">Selecciona el plan que mejor se adapte a tu restaurante</p>
        </div>
      )}

      {/* Plans Grid */}
      <div className={
        layout === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={handlePlanSelect}
            buttonAction={handlePlanAction}
            className={layout === 'list' ? 'max-w-md mx-auto' : ''}
          />
        ))}
      </div>

      {/* Guarantee */}
      {showGuarantee && (
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Garantía de 30 días</h4>
              <p className="text-sm text-slate-400">
                Si no estás satisfecho con el servicio, te devolvemos el 100% de tu dinero en los primeros 30 días.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para comparación de planes
const PricingComparison = ({ onPlanSelect, className = '' }) => {
  const { plans } = usePricingPlans();

  const allFeatures = Array.from(
    new Set(plans.flatMap(plan => plan.features))
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left p-4 font-semibold text-white">Características</th>
            {plans.map((plan) => (
              <th key={plan.id} className="text-center p-4 font-semibold text-white min-w-[200px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <plan.icon className="h-5 w-5 text-amber-400" />
                    <span>{plan.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">
                    {plan.price}
                    <span className="text-sm text-slate-400">{plan.period}</span>
                  </div>
                  <button
                    onClick={() => onPlanSelect && onPlanSelect(plan.id)}
                    className={`w-full py-2 px-4 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-${plan.color}-500/25`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature, index) => (
            <tr key={index} className="border-b border-slate-700/50">
              <td className="p-4 text-slate-300 font-medium">{feature}</td>
              {plans.map((plan) => (
                <td key={plan.id} className="text-center p-4">
                  {plan.features.includes(feature) ? (
                    <Check className="h-5 w-5 text-green-400 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-400 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para mostrar solo el plan seleccionado
const SelectedPlanCard = ({ planId, onChange, className = '' }) => {
  const { getPlanById } = usePricingPlans();
  const plan = getPlanById(planId);

  if (!plan) return null;

  return (
    <div className={`bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">Plan Seleccionado</h4>
        <button
          onClick={onChange}
          className="text-amber-400 hover:text-amber-300 text-sm underline"
        >
          Cambiar plan
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/20 flex items-center justify-center`}>
          <plan.icon className={`h-6 w-6 text-${plan.color}-400`} />
        </div>

        <div className="flex-1">
          <h5 className="font-semibold text-white">{plan.name}</h5>
          <p className="text-slate-400 text-sm">{plan.description}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">
            {plan.price}
            <span className="text-sm text-slate-400">{plan.period}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {plan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PricingCard, PricingComparison, SelectedPlanCard };
export default PricingPlans;