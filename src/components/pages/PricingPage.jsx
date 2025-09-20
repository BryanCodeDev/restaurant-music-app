import React from 'react';
import PricingPlans, { PRICING_PLANS } from '../common/PricingPlans';
import { Check, Star, Crown, Zap, ArrowRight, Shield, Headphones, BarChart3 } from 'lucide-react';

const PricingPage = () => {
  const handlePlanSelect = (planId) => {
    console.log('Plan selected:', planId);
    // Aquí iría la lógica para procesar la selección del plan
  };

  const features = [
    {
      icon: Headphones,
      title: "Música Ilimitada",
      description: "Acceso a millones de canciones para tu restaurante"
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzados",
      description: "Estadísticas detalladas de uso y preferencias"
    },
    {
      icon: Shield,
      title: "Soporte 24/7",
      description: "Atención personalizada cuando la necesites"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Planes que se Adaptan a tu
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Restaurante
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Elige el plan perfecto para tu negocio. Desde pequeños restaurantes hasta grandes cadenas,
              tenemos la solución ideal para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Check className="h-5 w-5" />
                <span>Configuración en 5 minutos</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Check className="h-5 w-5" />
                <span>Prueba gratis 14 días</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Check className="h-5 w-5" />
                <span>Sin contratos largos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PricingPlans
          onPlanSelect={handlePlanSelect}
          showHeader={false}
          className="mb-16"
        />
      </div>

      {/* Features Comparison */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mx-4 sm:mx-6 lg:mx-8 p-8 mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          ¿Por qué Elegir BryJu Sound?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Listo para Transformar tu Restaurante?
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Únete a cientos de restaurantes que ya usan BryJu Sound
        </p>
        <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto">
          <span>Comenzar Prueba Gratis</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              ¿Necesito equipo especial?
            </h3>
            <p className="text-gray-300">
              No, solo necesitas un dispositivo con conexión a internet. Funciona con cualquier
              computadora, tablet o teléfono.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              ¿Puedo cambiar de plan en cualquier momento?
            </h3>
            <p className="text-gray-300">
              Sí, puedes hacer upgrade o downgrade en cualquier momento. Los cambios se aplican
              inmediatamente.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              ¿Qué pasa con mis datos si cancelo?
            </h3>
            <p className="text-gray-300">
              Puedes exportar todos tus datos antes de cancelar. Tu información está segura
              y siempre accesible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;