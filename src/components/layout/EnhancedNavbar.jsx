import React, { useState } from 'react';
import {
  Home,
  Music,
  Clock,
  Heart,
  Headphones,
  Menu,
  X,
  MapPin,
  User,
  LogOut,
  Settings,
  Crown,
  UserPlus,
  LogIn,
  ChevronDown,
  BarChart3,
  List,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import routeUtils from '../../utils/routeUtils';

const EnhancedNavbar = ({
  currentView,
  onViewChange,
  restaurant,
  userTable,
  onSwitchToAdmin,
  onShowLogin,
  onShowRegister,
  onLogout,
  onProfile,
  onEditProfile,
  onSettings,
  onSelectRestaurant,
  appMode
}) => {
  const { user, userType, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  // Obtener configuración de navegación
  const navConfig = routeUtils.getNavigationConfig(userType, appMode || 'restaurant-selector');
  const navbarItems = routeUtils.getNavbarItems(appMode || 'restaurant-selector');
  const showAuthButtons = routeUtils.shouldShowAuthButtons(userType);
  const showAdminButton = routeUtils.shouldShowAdminButton(userType);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (itemId) => {
    onViewChange(itemId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };

  const handleShowLogin = () => {
    if (onShowLogin) {
      onShowLogin();
    }
    closeAllMenus();
  };

  const handleShowRegister = () => {
    if (onShowRegister) {
      onShowRegister();
    }
    closeAllMenus();
  };

  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowAuthMenu(false);
    setIsMobileMenuOpen(false);
  };

  // Iconos para los items de navegación
  const getIcon = (iconName) => {
    const icons = {
      Home,
      Music,
      Clock,
      Heart,
      BarChart3,
      List,
      Settings
    };
    return icons[iconName] || Home;
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
                BryJu Sound
              </span>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                {restaurant && (
                  <>
                    <span>{restaurant.name}</span>
                    <span>•</span>
                  </>
                )}
                <span>{userTable}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              {navbarItems.map((item) => {
                const IconComponent = getIcon(item.icon);
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

                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Restaurant Info - Desktop */}
            {restaurant && (
              <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <img
                  src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=32&h=32&fit=crop"}
                  alt={restaurant.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium text-white">{restaurant.name}</p>
                  <p className="text-slate-400 text-xs flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{userTable}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              /* Usuario autenticado - Menú de perfil */
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowAuthMenu(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name || user?.email || 'Usuario'}</p>
                    <p className="text-xs text-slate-400 capitalize">{userType}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={closeAllMenus}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50">
                      <div className="p-4 border-b border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name || 'Usuario'}</p>
                            <p className="text-sm text-slate-400">{user.email}</p>
                            <p className="text-xs text-slate-500 capitalize">{userType}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            onEditProfile?.();
                            closeAllMenus();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <Edit3 className="h-5 w-5 text-blue-400" />
                          <span className="text-slate-300 font-medium">Editar Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            onProfile?.();
                            closeAllMenus();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <User className="h-5 w-5 text-blue-400" />
                          <span className="text-slate-300 font-medium">Mi Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            onSettings?.();
                            closeAllMenus();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <Settings className="h-5 w-5 text-slate-400" />
                          <span className="text-slate-300 font-medium">Configuración</span>
                        </button>

                        {showAdminButton && (
                          <>
                            <div className="h-px bg-slate-700/30 my-2 mx-3"></div>
                            <button
                              onClick={() => {
                                onSwitchToAdmin?.();
                                closeAllMenus();
                              }}
                              className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                            >
                              <Crown className="h-5 w-5 text-yellow-400" />
                              <span className="text-slate-300 font-medium">Panel Administrativo</span>
                            </button>
                          </>
                        )}

                        {/* Botón para cambiar restaurante */}
                        {restaurant && (
                          <>
                            <div className="h-px bg-slate-700/30 my-2 mx-3"></div>
                            <button
                              onClick={() => {
                                onSelectRestaurant?.();
                                closeAllMenus();
                              }}
                              className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                            >
                              <RefreshCw className="h-5 w-5 text-blue-400" />
                              <span className="text-slate-300 font-medium">Cambiar Restaurante</span>
                            </button>
                          </>
                        )}

                        <div className="h-px bg-slate-700/30 my-2 mx-3"></div>

                        <button
                          onClick={() => {
                            handleLogout();
                            closeAllMenus();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-red-500/10 rounded-xl transition-colors text-red-400 hover:text-red-300"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="font-medium">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : showAuthButtons ? (
              /* Usuario no autenticado - Botones de auth */
              <div className="flex items-center space-x-2">
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => {
                      setShowAuthMenu(!showAuthMenu);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">Mi Cuenta</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Auth Dropdown */}
                  {showAuthMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={closeAllMenus}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50">
                        <div className="p-2">
                          <button
                            onClick={handleShowLogin}
                            className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                          >
                            <LogIn className="h-5 w-5 text-emerald-400" />
                            <span className="text-slate-300 font-medium">Iniciar Sesión</span>
                          </button>

                          <button
                            onClick={handleShowRegister}
                            className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                          >
                            <UserPlus className="h-5 w-5 text-blue-400" />
                            <span className="text-slate-300 font-medium">Registrarse</span>
                          </button>

                          {showAdminButton && (
                            <>
                              <div className="h-px bg-slate-700/30 my-2 mx-3"></div>
                              <button
                                onClick={() => {
                                  onSwitchToAdmin?.();
                                  closeAllMenus();
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                              >
                                <Crown className="h-5 w-5 text-yellow-400" />
                                <span className="text-slate-300 font-medium">Panel Administrativo</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile auth buttons */}
                <div className="flex sm:hidden space-x-1">
                  <button
                    onClick={handleShowLogin}
                    className="p-2 rounded-lg bg-slate-800/50 text-emerald-400 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200"
                    title="Iniciar Sesión"
                  >
                    <LogIn className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleShowRegister}
                    className="p-2 rounded-lg bg-slate-800/50 text-blue-400 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-200"
                    title="Registrarse"
                  >
                    <UserPlus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : null}

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
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />

            <div className="fixed inset-x-0 top-16 mx-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 lg:hidden animate-scale-in overflow-y-auto max-h-[calc(100vh-8rem)]">
              {/* Restaurant Info - Mobile */}
              {restaurant && (
                <div className="p-4 border-b border-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <img
                      src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=48&h=48&fit=crop"}
                      alt={restaurant.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{restaurant.name}</h3>
                      <p className="text-sm text-slate-400 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{userTable}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2">
                {navbarItems.map((item) => {
                  const IconComponent = getIcon(item.icon);
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
                          {item.id === 'dashboard' && 'Panel de control'}
                          {item.id === 'queue' && 'Gestión de cola'}
                          {item.id === 'settings' && 'Configuraciones'}
                        </div>
                      </div>

                      {isActive && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-slate-700/50 p-4">
                <div className="space-y-2">
                  {isAuthenticated && user ? (
                    /* Usuario autenticado - Mobile */
                    <>
                      <div className="px-4 py-2 text-sm text-slate-400 border-b border-slate-700/30 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <span>{user.name || user.email}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onEditProfile?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <Edit3 className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-300 font-medium">Editar Perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          onProfile?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <User className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-300 font-medium">Mi Perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          onSettings?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <Settings className="h-5 w-5 text-slate-400" />
                        <span className="text-slate-300 font-medium">Configuración</span>
                      </button>

                      {showAdminButton && (
                        <button
                          onClick={() => {
                            onSwitchToAdmin?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <Crown className="h-5 w-5 text-yellow-400" />
                          <span className="text-slate-300 font-medium">Panel Administrativo</span>
                        </button>
                      )}

                      {/* Botón para cambiar restaurante - Mobile */}
                      {restaurant && (
                        <button
                          onClick={() => {
                            onSelectRestaurant?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <RefreshCw className="h-5 w-5 text-blue-400" />
                          <span className="text-slate-300 font-medium">Cambiar Restaurante</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-500/10 rounded-xl transition-colors text-red-400"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </>
                  ) : showAuthButtons ? (
                    /* Usuario no autenticado - Mobile */
                    <>
                      <button
                        onClick={() => {
                          handleShowLogin();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <LogIn className="h-5 w-5 text-emerald-400" />
                        <span className="text-slate-300 font-medium">Iniciar Sesión</span>
                      </button>

                      <button
                        onClick={() => {
                          handleShowRegister();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                      >
                        <UserPlus className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-300 font-medium">Registrarse</span>
                      </button>

                      {showAdminButton && (
                        <button
                          onClick={() => {
                            onSwitchToAdmin?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800/50 rounded-xl transition-colors"
                        >
                          <Crown className="h-5 w-5 text-yellow-400" />
                          <span className="text-slate-300 font-medium">Panel Administrativo</span>
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Navigation for Mobile - Alternative */}
        <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 lg:hidden z-40 md:hidden pb-4">
          <div className="grid grid-cols-4 gap-1 p-2 mx-4">
            {navbarItems.map((item) => {
              const IconComponent = getIcon(item.icon);
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

export default EnhancedNavbar;