import React from 'react';
import {
  Music,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  ArrowUp
} from 'lucide-react';

const EnhancedFooter = ({ restaurant, userTable }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 mt-auto w-full">
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BryJu Sound</span>
            </div>
            <p className="text-gray-400 mb-6">
              La plataforma líder de música interactiva para restaurantes en Colombia.
              Transformamos la experiencia de tus clientes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <a href="/caracteristicas" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="/precios" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Integraciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Centro de Ayuda
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <a href="/sobre-nosotros" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Casos de Éxito
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Prensa
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <a href="mailto:hola@bryjusound.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                  hola@bryjusound.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-purple-400" />
                <a href="tel:+573001234567" className="text-gray-400 hover:text-purple-400 transition-colors">
                  +57 300 123 4567
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400">Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Quieres estar al día?
            </h3>
            <p className="text-gray-400 mb-4">
              Suscríbete a nuestro newsletter para recibir tips sobre música en restaurantes
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4 md:mb-0">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>por BryJu Sound</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <a href="/terminos" className="hover:text-purple-400 transition-colors">
              Términos y Condiciones
            </a>
            <span className="text-gray-600">•</span>
            <a href="/politica-privacidad" className="hover:text-purple-400 transition-colors">
              Política de Privacidad
            </a>
            <span className="text-gray-600">•</span>
            <a href="/politica-cookies" className="hover:text-purple-400 transition-colors">
              Política de Cookies
            </a>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-600">© {currentYear} BryJu Sound. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center z-50"
        aria-label="Volver arriba"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default EnhancedFooter;