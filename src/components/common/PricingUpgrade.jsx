import React from 'react';
import { ArrowUp, Crown, Zap } from 'lucide-react';
import PricingPlans, { usePricingPlans, SelectedPlanCard } from './PricingPlans';

// Componente para mostrar opciones de upgrade
const PricingUpgrade = ({
  currentPlan = 'starter',
  onUpgrade,
  showCurrentPlan = true,
  title = 'Actualiza tu Plan',
  description = 'Desbloquea más funcionalidades para tu restaurante',
  className = ''
}) => {
  const { getPlanById, getPopularPlan } = usePricingPlans();

  const currentPlanData = getPlanById(currentPlan);
  const popularPlan = getPopularPlan();

  const handleUpgrade = (plan) => {
    if (onUpgrade) {
      onUpgrade(plan);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>

      {/* Current Plan */}
      {showCurrentPlan && currentPlanData && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">Tu Plan Actual</h4>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              {currentPlanData.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {currentPlanData.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white">Planes Disponibles</h4>

        {/* Popular Plan Highlight */}
        {popularPlan && popularPlan.id !== currentPlan && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-amber-400" />
              <div>
                <h5 className="font-semibold text-amber-400">Recomendado: {popularPlan.name}</h5>
                <p className="text-sm text-slate-300">
                  La mayoría de restaurantes eligen este plan por su excelente relación calidad-precio.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {['professional', 'enterprise'].map((planId) => {
            const plan = getPlanById(planId);
            if (!plan || plan.id === currentPlan) return null;

            const isUpgrade = true; // Logic to determine if it's an upgrade

            return (
              <div
                key={planId}
                className="relative bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors"
              >
                {/* Upgrade Badge */}
                {isUpgrade && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <ArrowUp className="h-3 w-3" />
                      <span>Upgrade</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-4">
                  <plan.icon className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <h5 className="font-semibold text-white">{plan.name}</h5>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-amber-400">
                    {plan.price}
                    <span className="text-sm text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">¿Por qué actualizar?</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Más peticiones mensuales para tus clientes</li>
              <li>• Funcionalidades avanzadas de música</li>
              <li>• Soporte prioritario 24/7</li>
              <li>• Analytics detallados de uso</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar comparación de planes en una página de precios
const PricingPage = ({
  onPlanSelect,
  highlightPlan = 'professional',
  className = ''
}) => {
  return (
    <div className={`py-12 ${className}`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Planes que se Adaptan a tu Restaurante
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Elige el plan perfecto para tu negocio. Todos incluyen garantía de 30 días.
        </p>
      </div>

      <PricingPlans
        onPlanSelect={onPlanSelect}
        layout="grid"
        showHeader={false}
        showGuarantee={true}
      />
    </div>
  );
};

// Componente para mostrar planes en un modal
const PricingModal = ({
  isOpen,
  onClose,
  onPlanSelect,
  currentPlan = null
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Selecciona tu Plan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <PricingPlans
          selectedPlan={currentPlan}
          onPlanSelect={onPlanSelect}
          layout="grid"
          showHeader={true}
          showGuarantee={true}
        />

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export { PricingUpgrade, PricingPage, PricingModal };
export default PricingPlans;