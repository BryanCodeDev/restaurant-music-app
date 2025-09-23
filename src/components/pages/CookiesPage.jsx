import React, { useState } from 'react';
import { Cookie, Settings, Eye, BarChart3, Target, Shield, Check, X } from 'lucide-react';

const CookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    functional: true
  });

  const lastUpdated = "20 de septiembre de 2025";

  const cookieCategories = [
    {
      id: 'essential',
      name: 'Cookies Esenciales',
      required: true,
      description: 'Necesarias para el funcionamiento básico del sitio web.',
      icon: Shield,
      cookies: [
        { name: 'session_id', purpose: 'Mantener tu sesión activa', duration: 'Sesión' },
        { name: 'csrf_token', purpose: 'Proteger contra ataques CSRF', duration: 'Sesión' },
        { name: 'auth_token', purpose: 'Mantener tu autenticación', duration: '30 días' }
      ]
    },
    {
      id: 'functional',
      name: 'Cookies Funcionales',
      required: false,
      description: 'Mejoran tu experiencia recordando tus preferencias.',
      icon: Settings,
      cookies: [
        { name: 'theme_preference', purpose: 'Recordar tu tema preferido', duration: '1 año' },
        { name: 'language', purpose: 'Recordar tu idioma', duration: '1 año' },
        { name: 'layout_preferences', purpose: 'Recordar configuración de interfaz', duration: '1 año' }
      ]
    },
    {
      id: 'analytics',
      name: 'Cookies de Análisis',
      required: false,
      description: 'Nos ayudan a entender cómo usas el sitio web.',
      icon: BarChart3,
      cookies: [
        { name: '_ga', purpose: 'Google Analytics - Análisis de uso', duration: '2 años' },
        { name: '_gid', purpose: 'Google Analytics - Sesiones', duration: '24 horas' },
        { name: '_gat', purpose: 'Google Analytics - Rate limiting', duration: '1 minuto' }
      ]
    },
    {
      id: 'marketing',
      name: 'Cookies de Marketing',
      required: false,
      description: 'Utilizadas para mostrar anuncios relevantes.',
      icon: Target,
      cookies: [
        { name: 'fb_pixel', purpose: 'Facebook Pixel - Publicidad', duration: '3 meses' },
        { name: 'google_ads', purpose: 'Google Ads - Publicidad', duration: '2 años' },
        { name: 'linkedin_insight', purpose: 'LinkedIn Marketing', duration: '6 meses' }
      ]
    }
  ];

  const handleCookieToggle = (categoryId) => {
    if (categoryId === 'essential') return; // Cannot disable essential cookies

    setCookiePreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSavePreferences = () => {
    // Here you would implement the actual cookie saving logic
    console.log('Saving cookie preferences:', cookiePreferences);
    alert('Preferencias de cookies guardadas correctamente.');
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    });
    handleSavePreferences();
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true, // Essential cookies cannot be rejected
      analytics: false,
      marketing: false,
      functional: false
    });
    handleSavePreferences();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Cookie className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Última actualización: {lastUpdated}
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <Eye className="h-5 w-5" />
              <span>Transparencia total sobre nuestras cookies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">¿Qué son las Cookies?</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
                cuando visitas nuestro sitio web. Nos ayudan a brindarte una mejor experiencia
                y a entender cómo utilizas nuestro servicio.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Información Importante</h4>
                <p className="text-sm text-blue-200">
                  Utilizamos cookies de acuerdo con la legislación vigente y siempre
                  buscando mejorar tu experiencia en BryJu Sound.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Categories */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Tipos de Cookies que Utilizamos</h2>
            <div className="space-y-6">
              {cookieCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          category.required
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            {category.name}
                            {category.required && (
                              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Requeridas
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        </div>
                      </div>

                      {!category.required && (
                        <button
                          onClick={() => handleCookieToggle(category.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            cookiePreferences[category.id] ? 'bg-purple-600' : 'bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences[category.id] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      )}
                    </div>

                    <div className="pl-15">
                      <h4 className="font-medium text-white mb-2">Cookies específicas:</h4>
                      <div className="space-y-2">
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-slate-800/30 rounded">
                            <div>
                              <span className="font-mono text-sm text-purple-300">{cookie.name}</span>
                              <p className="text-xs text-gray-400">{cookie.purpose}</p>
                            </div>
                            <span className="text-xs text-gray-500">{cookie.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Gestionar tus Preferencias</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Puedes controlar tus preferencias de cookies en cualquier momento.
                Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-colors"
                >
                  <Check className="h-4 w-4 inline mr-2" />
                  Aceptar Todas
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-600 transition-colors"
                >
                  <X className="h-4 w-4 inline mr-2" />
                  Rechazar Opcionales
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Información Adicional</h2>
            <div className="text-gray-300 space-y-4">

              <h4 className="font-semibold text-white">Cómo Gestionar Cookies en tu Navegador</h4>
              <p>
                También puedes controlar las cookies directamente desde la configuración de tu navegador:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li>• <strong>Firefox:</strong> Preferencias → Privacidad y seguridad → Cookies</li>
                <li>• <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web</li>
                <li>• <strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
              </ul>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-300 mb-2">Cookies de Terceros</h4>
                <p className="text-sm text-yellow-200">
                  Algunas cookies son establecidas por servicios de terceros que utilizamos,
                  como Google Analytics y redes sociales. Estas se rigen por sus propias políticas.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">¿Tienes Preguntas?</h2>
            <div className="text-gray-300 space-y-2">
              <p>
                Si tienes dudas sobre nuestra política de cookies o cómo gestionamos tu privacidad:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Email: privacidad@bryjusound.com</li>
                <li>• Teléfono: +57 300 123 4567</li>
                <li>• Respuesta garantizada en máximo 48 horas</li>
              </ul>
            </div>
          </section>

          {/* Compliance */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Política Actualizada</span>
            </div>
            <p className="text-sm text-blue-200">
              Esta política cumple con la legislación vigente sobre cookies y protección de datos.
              Última revisión: {lastUpdated}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;