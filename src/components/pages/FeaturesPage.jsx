import React from 'react';
import {
  Music,
  Users,
  BarChart3,
  Smartphone,
  Shield,
  Zap,
  Headphones,
  Settings,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Music,
      title: "Música Interactiva",
      description: "Tus clientes pueden solicitar canciones en tiempo real desde sus dispositivos móviles.",
      benefits: ["Cola de reproducción en vivo", "Votación de canciones", "Historial de peticiones"]
    },
    {
      icon: Users,
      title: "Experiencia Social",
      description: "Crea un ambiente único donde los clientes interactúan con la música y entre ellos.",
      benefits: ["Compartir canciones favoritas", "Crear playlists colaborativas", "Sistema de reviews"]
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzados",
      description: "Conoce las preferencias de tus clientes y optimiza tu oferta musical.",
      benefits: ["Estadísticas de uso", "Canciones más populares", "Comportamiento por horario"]
    }
  ];

  const technicalFeatures = [
    {
      icon: Smartphone,
      title: "Multi-Plataforma",
      description: "Funciona en cualquier dispositivo con navegador web moderno."
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description: "Datos encriptados y protección contra uso indebido."
    },
    {
      icon: Zap,
      title: "Tiempo Real",
      description: "Actualizaciones instantáneas para todos los usuarios conectados."
    },
    {
      icon: Headphones,
      title: "Calidad HD",
      description: "Streaming de alta calidad para la mejor experiencia auditiva."
    },
    {
      icon: Settings,
      title: "Control Total",
      description: "Configura límites, horarios y contenido según tus necesidades."
    },
    {
      icon: Star,
      title: "Sin Límites",
      description: "Escala según el crecimiento de tu restaurante."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Propietario - La Terraza Musical",
      content: "BryJu Sound transformó completamente la experiencia en nuestro restaurante. Los clientes aman poder elegir la música.",
      rating: 5
    },
    {
      name: "María González",
      role: "Gerente - El Rincón del Sabor",
      content: "El aumento en el tiempo de permanencia de los clientes es notable. Ahora todos quieren volver.",
      rating: 5
    },
    {
      name: "Andrés Martínez",
      role: "Dueño - Café Central",
      content: "La implementación fue muy sencilla y el soporte es excelente. Totalmente recomendado.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Características que
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Revolucionan
              </span>
              <br />tu Restaurante
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Descubre todas las funcionalidades que hacen de BryJu Sound la plataforma líder
              de música interactiva para restaurantes en Colombia.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Features Grid */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Funcionalidades Técnicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          ¿Cómo Funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instalación</h3>
            <p className="text-gray-300">Configura tu cuenta en menos de 5 minutos</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Conexión</h3>
            <p className="text-gray-300">Conecta tu sistema de sonido existente</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Clientes</h3>
            <p className="text-gray-300">Tus clientes comienzan a pedir canciones</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Disfruta</h3>
            <p className="text-gray-300">Ve cómo mejora la experiencia en tu restaurante</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Lo que Dicen Nuestros Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Listo para Comenzar?
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Prueba BryJu Sound gratis por 14 días
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
            Comenzar Prueba Gratis
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
            Ver Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;