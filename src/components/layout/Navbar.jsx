import React, { useState } from 'react';
import { Home, Music, Clock, Heart, Headphones, Menu, X } from 'lucide-react';

const Navbar = ({ currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'browse', label: 'Música', icon: Music },
    { id: 'requests', label: 'Mis Pedidos', icon: Clock },
    { id: 'favorites', label: 'Favoritos', icon: Heart }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (itemId) => {
    onViewChange(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <Headphones className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MusicMenu
              </span>
              <span className="text-xs text-slate-400 hidden sm:block">
                Mesa #12
              </span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium text-sm
                      transition-all duration-300 transform hover:scale-105
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700'
                      }
                    `}
                  >
                    <IconComponent className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                    
                    {/* Indicador activo */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Mobile Menu */}
            <div className="fixed inset-x-0 top-16 mx-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 lg:hidden animate-scale-in">
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        group w-full flex items-center space-x-4 px-4 py-4 rounded-xl font-medium text-base
                        transition-all duration-300 text-left
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700'
                        }
                      `}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isActive ? 'bg-blue-500/20' : 'bg-slate-800/50 group-hover:bg-slate-800'}`}>
                        <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold">{item.label}</span>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.id === 'home' && 'Panel principal'}
                          {item.id === 'browse' && 'Explorar canciones'}
                          {item.id === 'requests' && 'Ver peticiones'}
                          {item.id === 'favorites' && 'Música favorita'}
                        </div>
                      </div>
                      
                      {/* Flecha indicadora */}
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Información adicional en el menú móvil */}
              <div className="border-t border-slate-700/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Mesa #12</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-medium">Conectado</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Navigation for Mobile (alternativa al overlay) - Opcional */}
        <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 lg:hidden z-40 md:hidden">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-medium
                    transition-all duration-300 min-h-[60px]
                    ${isActive
                      ? 'bg-gradient-to-b from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform duration-300`} />
                  <span className="leading-tight text-center">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;