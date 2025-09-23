import React from 'react';
import { 
  Music, 
  Heart, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Clock,
  Wifi,
  Shield,
  Info
} from 'lucide-react';

const Footer = ({ restaurant, userTable, connectionStatus = 'connected' }) => {
  const currentYear = new Date().getFullYear();

  const getConnectionColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getConnectionText = (status) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Sin conexión';
      default: return 'Estado desconocido';
    }
  };

  return (
    <footer className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Music className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MusicMenu
                </span>
                <p className="text-xs text-slate-500">by MasterCode Company</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              La experiencia musical interactiva para restaurantes. Conecta con la música mientras disfrutas tu comida, solicita tus canciones favoritas y crea el ambiente perfecto.
            </p>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-sm">
              <Wifi className={`h-4 w-4 ${getConnectionColor(connectionStatus)}`} />
              <span className={getConnectionColor(connectionStatus)}>
                {getConnectionText(connectionStatus)}
              </span>
              {connectionStatus === 'connected' && (
                <span className="text-slate-500">• En vivo</span>
              )}
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>Información del Local</span>
            </h3>
            
            <div className="space-y-3">
              {restaurant && (
                <>
                  <div className="flex items-start space-x-3">
                    <img 
                      src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=40&h=40&fit=crop"}
                      alt={restaurant.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-semibold text-white text-sm">{restaurant.name}</h4>
                      <p className="text-xs text-slate-400">
                        {restaurant.city && restaurant.country && `${restaurant.city}, ${restaurant.country}`}
                      </p>
                    </div>
                  </div>
                  
                  {restaurant.address && (
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-xs">{restaurant.address}</span>
                    </div>
                  )}
                  
                  {restaurant.phone && (
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-xs">{restaurant.phone}</span>
                    </div>
                  )}
                </>
              )}
              
              {userTable && (
                <div className="mt-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300 font-medium">Tu sesión:</span>
                    <span className="text-blue-400">{userTable}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-400" />
              <span>Enlaces Útiles</span>
            </h3>
            
            <div className="space-y-2">
              <a 
                href="#about" 
                className="block text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200"
              >
                ¿Cómo funciona?
              </a>
              <a 
                href="#help" 
                className="block text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200"
              >
                Ayuda y soporte
              </a>
              <a 
                href="#privacy" 
                className="block text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200"
              >
                Privacidad
              </a>
              <a 
                href="#terms" 
                className="block text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200"
              >
                Términos de uso
              </a>
              <a 
                href="mailto:support@musicmenu.com" 
                className="flex items-center space-x-2 text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200"
              >
                <Mail className="h-3 w-3" />
                <span>Contacto</span>
              </a>
            </div>
          </div>
        </div>

        {/* Session Info Bar */}
        {(restaurant || userTable) && (
          <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Sesión iniciada:</span>
                  <span className="text-sm text-blue-400">
                    {new Date().toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                {userTable && (
                  <>
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-400">{userTable}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-400">Conexión segura</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400">Tiempo real</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <span>© {currentYear} MusicMenu.</span>
            <span>Todos los derechos reservados.</span>
            <span className="hidden sm:inline">v2.1.0</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Desarrollado con</span>
            <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
            <span>por</span>
            <a 
              href="#" 
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              MasterCode Company
            </a>
          </div>
        </div>

        {/* Performance Stats (Hidden for users, useful for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-slate-800/20 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Debug Mode</span>
              <div className="flex items-center space-x-4">
                <span>Status: {connectionStatus}</span>
                <span>Session: {userTable || 'N/A'}</span>
                <span>Restaurant: {restaurant?.slug || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile bottom padding for bottom navigation */}
      <div className="h-20 md:hidden"></div>
    </footer>
  );
};

export default Footer;