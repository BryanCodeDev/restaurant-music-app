import React from 'react';
import { 
  Headphones, 
  Heart, 
  Music, 
  Star, 
  Clock, 
  HelpCircle,
  MapPin,
  Wifi,
  Shield,
  Github,
  Twitter,
  Instagram,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const footerLinks = {
    navegacion: [
      { name: 'Explorar Música', icon: Music, href: '#browse' },
      { name: 'Mis Favoritos', icon: Star, href: '#favorites' },
      { name: 'Historial', icon: Clock, href: '#requests' },
      { name: 'Ayuda', icon: HelpCircle, href: '#help' }
    ],
    informacion: [
      { name: 'Acerca de', icon: null, href: '#about' },
      { name: 'Privacidad', icon: Shield, href: '#privacy' },
      { name: 'Términos', icon: null, href: '#terms' },
      { name: 'Contacto', icon: null, href: '#contact' }
    ],
    social: [
      { name: 'GitHub', icon: Github, href: '#github' },
      { name: 'Twitter', icon: Twitter, href: '#twitter' },
      { name: 'Instagram', icon: Instagram, href: '#instagram' }
    ]
  };

  return (
    <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 mt-auto relative overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo y descripción */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MusicMenu
                </span>
                <span className="text-xs text-slate-400">
                  Música interactiva para restaurantes
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
              La forma más innovadora de disfrutar la música en tu restaurante favorito. 
              Pide tus canciones y crea el ambiente perfecto mientras disfrutas tu comida.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              {footerLinks.social.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105"
                    title={social.name}
                  >
                    <SocialIcon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Enlaces de navegación */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-400" />
              <span>Navegación</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.navegacion.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {LinkIcon && <LinkIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />}
                      <span className="text-sm">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Información del restaurante */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <span>Mesa Actual</span>
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Mesa:</span>
                  <span className="text-sm font-semibold text-blue-400">#12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Conectado:</span>
                  <span className="text-sm font-semibold text-emerald-400">{currentTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Estado:</span>
                  <div className="flex items-center space-x-1">
                    <Wifi className="h-3 w-3 text-emerald-400" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/20 border border-slate-700/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-400">0</div>
                  <div className="text-xs text-slate-500">En cola</div>
                </div>
                <div className="bg-slate-800/20 border border-slate-700/20 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-400">2.5k+</div>
                  <div className="text-xs text-slate-500">Canciones</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-slate-700/50 mt-8 lg:mt-12 pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-slate-400 text-sm">
              <p className="text-center sm:text-left">
                © 2024 MusicMenu. Todos los derechos reservados.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full" />
              <p className="flex items-center space-x-1">
                <span>Hecho con</span>
                <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
                <span>para los amantes de la música</span>
              </p>
            </div>
            
            {/* Links adicionales */}
            <div className="flex items-center space-x-4 text-sm">
              {footerLinks.informacion.slice(0, 2).map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center space-x-1"
                  >
                    {link.icon && <link.icon className="h-3 w-3" />}
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                  {index < 1 && <div className="w-1 h-1 bg-slate-600 rounded-full" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Version info - Solo visible en desarrollo */}
          <div className="mt-4 pt-4 border-t border-slate-700/30 text-center">
            <p className="text-xs text-slate-500">
              Versión 1.0.0 • Última actualización: Agosto 2024 • 
              <span className="text-blue-400 ml-1">Estado: Estable</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;