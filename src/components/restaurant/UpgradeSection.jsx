import React, { useState } from 'react';
import { ArrowUp, Crown, Settings } from 'lucide-react';
import PricingPlans, { PricingUpgrade, PricingModal } from '../common/PricingPlans';

const UpgradeSection = ({ currentPlan = 'starter', restaurantName = 'Tu Restaurante' }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = (plan) => {
    console.log('Upgrade to plan:', plan);
    // Aquí iría la lógica para procesar el upgrade
    setShowUpgradeModal(false);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Opciones de Upgrade</h3>
          <p className="text-slate-400">
            Desbloquea más funcionalidades para {restaurantName}
          </p>
        </div>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
        >
          <ArrowUp className="h-4 w-4" />
          <span>Ver Planes</span>
        </button>
      </div>

      {/* Current Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Plan Actual</span>
          </div>
          <p className="text-white font-semibold">Starter</p>
          <p className="text-slate-400 text-sm">$80.000/mes</p>
        </div>

        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Recomendado</span>
          </div>
          <p className="text-white font-semibold">Professional</p>
          <p className="text-slate-400 text-sm">$120.000/mes</p>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">Premium</span>
          </div>
          <p className="text-white font-semibold">Enterprise</p>
          <p className="text-slate-400 text-sm">$300.000/mes</p>
        </div>
      </div>

      {/* Benefits Preview */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-blue-400 mb-3">¿Por qué actualizar?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Hasta 10,000 peticiones mensuales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Integración con Spotify</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Soporte prioritario 24/7</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-slate-300">Analytics avanzados</span>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <PricingModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onPlanSelect={handleUpgrade}
        currentPlan={currentPlan}
      />
    </div>
  );
};

export default UpgradeSection;