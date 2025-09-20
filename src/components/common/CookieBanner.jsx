import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Check, AlertCircle } from 'lucide-react';

const CookieBanner = ({ onAccept, onReject, onConfigure }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    setIsVisible(false);
    onAccept?.();
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true, // Essential cookies cannot be rejected
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    setIsVisible(false);
    onReject?.();
  };

  const handleConfigure = () => {
    setIsVisible(false);
    onConfigure?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cookie className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                🍪 Gestionamos Cookies para Mejorar tu Experiencia
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Utilizamos cookies para brindarte la mejor experiencia en BryJu Sound.
                Algunas son esenciales para el funcionamiento del sitio, mientras que otras
                nos ayudan a mejorar nuestros servicios.
              </p>

              {showDetails && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Cookies esenciales (requeridas)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">Cookies de análisis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">Cookies funcionales</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300">Cookies de marketing</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Aceptar Todas</span>
                </button>

                <button
                  onClick={handleRejectAll}
                  className="bg-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  Solo Esenciales
                </button>

                <button
                  onClick={handleConfigure}
                  className="border border-slate-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800/50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurar</span>
                </button>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-purple-400 hover:text-purple-300 text-sm underline"
                >
                  {showDetails ? 'Menos info' : 'Más información'}
                </button>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-xs text-gray-400">
                <span>Lee nuestra</span>
                <a href="/politica-privacidad" className="text-purple-400 hover:text-purple-300 underline">
                  Política de Privacidad
                </a>
                <span>y</span>
                <a href="/politica-cookies" className="text-purple-400 hover:text-purple-300 underline">
                  Política de Cookies
                </a>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;