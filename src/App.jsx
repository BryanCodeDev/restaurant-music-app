import React, { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './components/pages/HomePage';
import BrowseMusic from './components/pages/BrowseMusic';
import MyRequests from './components/pages/MyRequests';
import Favorites from './components/pages/Favorites';
import ListeningHistory from './components/pages/ListeningHistory';
import RestaurantReviews from './components/pages/RestaurantReviews';
import PlaylistManager from './components/music/PlaylistManager';

// SaaS Components
import RestaurantSelector from './components/pages/RestaurantSelector';
import AdminAuth from './components/auth/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';
import QueueManager from './components/admin/QueueManager';
import MusicPlayer from './components/music/MusicPlayer';
import UserLimitManager from './components/music/UserLimitManager';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Services & Hooks
import apiService from './services/apiService';
import { useRestaurantMusic } from './hooks/useRestaurantMusic';
import SpotifyLogin from './components/music/SpotifyLogin';

function App() {
  // App State Management
  const [appMode, setAppMode] = useState('customer'); // 'customer', 'admin'
  const [currentStep, setCurrentStep] = useState('restaurant-selection');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Global plan state
  const [planType, setPlanType] = useState('basic');
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  // User Authentication State - SIN MODALES
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Music App State
  const [currentView, setCurrentView] = useState('home');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLoading, setIsLoading] = useState(true);

  // Use the restaurant music hook - pass null when no restaurant selected
  const restaurantMusic = useRestaurantMusic(selectedRestaurant?.slug);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Auto-update current song from requests
  useEffect(() => {
    if (restaurantMusic?.requests && appMode === 'admin') {
      const playingRequest = restaurantMusic.requests.find(req => req.status === 'playing');
      if (playingRequest && (!currentSong || currentSong.id !== playingRequest.id)) {
        setCurrentSong(playingRequest);
        setIsPlaying(true);
      }
    }

    // Update global plan state
    if (restaurantMusic?.planType) {
      setPlanType(restaurantMusic.planType);
      setSpotifyConnected(restaurantMusic.spotifyConnected);
    }
  }, [restaurantMusic?.requests, appMode, currentSong, restaurantMusic?.planType, restaurantMusic?.spotifyConnected]);

  const initializeApp = async () => {
    setIsLoading(true);
    
    try {
      // Check for admin session
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        try {
          const profile = await apiService.getProfile();
          if (profile.success && profile.data) {
            setAdminUser(profile.data);
            setAppMode('admin');
            setCurrentStep('admin-dashboard');
            return;
          }
        } catch (error) {
          localStorage.removeItem('admin_token');
          console.log('Invalid admin token, cleared');
        }
      }

      // Check for user session
      const userSession = localStorage.getItem('musicmenu_user');
      if (userSession) {
        try {
          const userData = JSON.parse(userSession);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('musicmenu_user');
          console.log('Invalid user session, cleared');
        }
      }

      // Check for customer session
      const customerSession = apiService.getCurrentSession();
      if (customerSession?.user) {
        try {
          // Try to validate session with backend
          const restaurants = await apiService.getRestaurants();
          const restaurant = restaurants.find(r => r.id === customerSession.user.restaurantId);
          
          if (restaurant) {
            setSelectedRestaurant(restaurant);
            setCurrentStep('music-app');
            return;
          }
        } catch (error) {
          apiService.clearSession();
          console.log('Invalid customer session, cleared');
        }
      }

      // Default to restaurant selection
      setCurrentStep('restaurant-selection');
    } catch (error) {
      console.error('App initialization error:', error);
      setCurrentStep('restaurant-selection');
    } finally {
      setIsLoading(false);
    }
  };

  // User Authentication Handlers - SIN MODALES
  const handleShowLogin = () => {
    setCurrentView('login');
    setAuthError(null);
  };

  const handleShowRegister = () => {
    setCurrentView('register');
    setAuthError(null);
  };

  const handleUserLogin = async (credentials) => {
    setAuthError(null);
    try {
      // Simular autenticación de usuario (reemplaza con tu API real)
      const result = await apiService.loginUser(credentials);
      
      if (result.success && result.data) {
        setCurrentUser(result.data);
        setIsAuthenticated(true);
        localStorage.setItem('musicmenu_user', JSON.stringify(result.data));
        setCurrentView('home'); // Volver a home después del login
      } else {
        throw new Error(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión. Verifica tus credenciales.';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleUserRegister = async (data) => {
    setAuthError(null);
    try {
      // Simular registro de usuario (reemplaza con tu API real)
      const result = await apiService.registerUser(data);
      
      if (result.success && result.data) {
        setCurrentUser(result.data);
        setIsAuthenticated(true);
        localStorage.setItem('musicmenu_user', JSON.stringify(result.data));
        setCurrentView('home'); // Volver a home después del registro
      } else {
        throw new Error(result.message || 'Error al registrar usuario');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar el usuario';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('musicmenu_user');
    setCurrentView('home');
  };

  const handleProfile = () => {
    // Implementar vista de perfil
    console.log('Mostrar perfil de usuario');
  };

  const handleSettings = () => {
    // Implementar configuraciones de usuario
    console.log('Mostrar configuraciones');
  };

  // Restaurant Selection Handler
  const handleRestaurantSelect = async (restaurant) => {
    try {
      setSelectedRestaurant(restaurant);
      setCurrentStep('music-app');
    } catch (error) {
      console.error('Error selecting restaurant:', error);
    }
  };

  // Admin Authentication Handlers
  const handleAdminLogin = async (credentials) => {
    setAuthError(null);
    try {
      const result = await apiService.loginRestaurant(credentials.email, credentials.password);
      
      if (result.success && result.data) {
        setAdminUser(result.data);
        setAppMode('admin');
        setCurrentStep('admin-dashboard');
      } else {
        throw new Error(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión. Verifica tus credenciales.';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleAdminRegister = async (data) => {
    setAuthError(null);
    try {
      const result = await apiService.registerRestaurant(data);
      
      if (result.success && result.data) {
        setAdminUser(result.data);
        setAppMode('admin');
        setCurrentStep('admin-dashboard');
      } else {
        throw new Error(result.message || 'Error al registrar restaurante');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar el restaurante';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleAdminLogout = () => {
    apiService.clearSession();
    localStorage.removeItem('admin_token');
    setAdminUser(null);
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
    setSelectedRestaurant(null);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  // Music Control Handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = async () => {
    if (!restaurantMusic?.requests) return;

    const pendingRequests = restaurantMusic.requests.filter(req => req.status === 'pending');
    if (pendingRequests.length > 0) {
      const nextSong = pendingRequests[0];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      
      // Update song status in backend if admin
      if (appMode === 'admin') {
        try {
          await apiService.updateRequestStatus(nextSong.id, 'playing');
        } catch (error) {
          console.error('Error updating song status:', error);
        }
      }
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handlePrevious = async () => {
    if (!restaurantMusic?.requests) return;

    const completedRequests = restaurantMusic.requests.filter(req => req.status === 'completed');
    if (completedRequests.length > 0) {
      const previousSong = completedRequests[completedRequests.length - 1];
      setCurrentSong(previousSong);
      setIsPlaying(true);
      
      // Update song status in backend if admin
      if (appMode === 'admin') {
        try {
          await apiService.updateRequestStatus(previousSong.id, 'playing');
        } catch (error) {
          console.error('Error updating song status:', error);
        }
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleSkipToNext = async () => {
    if (currentSong && appMode === 'admin') {
      try {
        // Mark current as completed
        await apiService.updateRequestStatus(currentSong.id, 'completed');
        
        // Move to next song
        await handleNext();
      } catch (error) {
        console.error('Error skipping to next song:', error);
      }
    }
  };

  // Queue Management Handlers (Admin only)
  const handleCancelRequest = async (requestId) => {
    if (appMode === 'admin' && restaurantMusic?.cancelRequest) {
      try {
        await restaurantMusic.cancelRequest(requestId);
      } catch (error) {
        console.error('Error canceling request:', error);
      }
    }
  };

  const handleMoveToTop = async (requestId) => {
    if (appMode === 'admin') {
      try {
        await apiService.updateRequestPosition(requestId, 1);
      } catch (error) {
        console.error('Error moving request to top:', error);
      }
    }
  };

  // Switch Modes
  const switchToAdminMode = () => {
    setAuthError(null);
    setAppMode('admin');
    setCurrentStep('admin-auth');
  };

  const switchToCustomerMode = () => {
    apiService.clearSession();
    localStorage.removeItem('admin_token');
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
    setSelectedRestaurant(null);
    setAdminUser(null);
    setCurrentSong(null);
    setIsPlaying(false);
    setAuthError(null);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Cargando MusicMenu</h2>
          <p className="text-slate-400">Inicializando la aplicación...</p>
        </div>
      </div>
    );
  }

  // Render Customer Music App
  const renderMusicApp = () => {
    if (!selectedRestaurant) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">Cargando restaurante...</p>
          </div>
        </div>
      );
    }

    // Provide safe defaults for restaurantMusic
    const safeRestaurantMusic = {
      userSession: {
        ...restaurantMusic?.userSession,
        isAuthenticated: isAuthenticated,
        type: isAuthenticated ? 'user' : 'guest'
      },
      requests: restaurantMusic?.requests || [],
      favorites: restaurantMusic?.favorites || [],
      stats: restaurantMusic?.stats || {},
      isLoading: restaurantMusic?.isLoading || false,
      error: restaurantMusic?.error || null,
      addRequest: restaurantMusic?.addRequest || (() => Promise.resolve(false)),
      toggleFavorite: restaurantMusic?.toggleFavorite || (() => Promise.resolve(false)),
      cancelRequest: restaurantMusic?.cancelRequest || (() => Promise.resolve(false)),
      planType,
      spotifyConnected
    };

    const renderCurrentView = () => {
      const commonProps = {
        restaurantSlug: selectedRestaurant.slug,
        favorites: safeRestaurantMusic.favorites,
        requests: safeRestaurantMusic.requests,
        userSession: safeRestaurantMusic.userSession,
        planType,
        spotifyConnected
      };

      switch(currentView) {
        case 'home':
          return (
            <HomePage 
              onViewChange={setCurrentView} 
              restaurant={selectedRestaurant}
              userSession={safeRestaurantMusic.userSession}
              stats={safeRestaurantMusic.stats}
            />
          );

        case 'login':
          return (
            <Login 
              onLogin={handleUserLogin}
              onSwitchToRegister={() => setCurrentView('register')}
              onSwitchToCustomer={() => setCurrentView('home')}
              isLoading={false}
              error={authError}
            />
          );

        case 'register':
          return (
            <Register 
              onRegister={handleUserRegister}
              onSwitchToLogin={() => setCurrentView('login')}
              onSwitchToCustomer={() => setCurrentView('home')}
              isLoading={false}
              error={authError}
            />
          );

        case 'browse':
          return (
            <UserLimitManager
              userTable={safeRestaurantMusic.userSession?.tableNumber}
              maxRequestsPerUser={2}
              requests={safeRestaurantMusic.requests}
              currentSong={currentSong}
              onRequestSong={safeRestaurantMusic.addRequest}
            >
              <BrowseMusic 
                restaurantSlug={selectedRestaurant.slug}
                {...commonProps}
                onAddRequest={safeRestaurantMusic.addRequest}
                onToggleFavorite={safeRestaurantMusic.toggleFavorite}
              />
            </UserLimitManager>
          );
        case 'requests':
          return (
            <MyRequests 
              requests={safeRestaurantMusic.requests} 
              userSession={safeRestaurantMusic.userSession}
              onCancelRequest={safeRestaurantMusic.cancelRequest}
            />
          );
        case 'favorites':
          return (
            <UserLimitManager
              userTable={safeRestaurantMusic.userSession?.tableNumber}
              maxRequestsPerUser={2}
              requests={safeRestaurantMusic.requests}
              currentSong={currentSong}
              onRequestSong={safeRestaurantMusic.addRequest}
            >
              <Favorites
                favorites={safeRestaurantMusic.favorites}
                onToggleFavorite={safeRestaurantMusic.toggleFavorite}
                onAddRequest={safeRestaurantMusic.addRequest}
                restaurantSlug={selectedRestaurant.slug}
                planType={planType}
                spotifyConnected={spotifyConnected}
              />
            </UserLimitManager>
          );
        case 'playlists':
          if (!isAuthenticated || currentUser.type !== 'registered') {
            return <div className="text-center p-8">Debes iniciar sesión como usuario registrado para acceder a playlists.</div>;
          }
          return (
            <PlaylistManager
              userId={localStorage.getItem('registered_user_id')}
              restaurantSlug={selectedRestaurant.slug}
            />
          );
        case 'history':
          if (!isAuthenticated || currentUser.type !== 'registered') {
            return <div className="text-center p-8">Debes iniciar sesión como usuario registrado para acceder al historial.</div>;
          }
          return (
            <ListeningHistory
              userId={localStorage.getItem('registered_user_id')}
              restaurantSlug={selectedRestaurant.slug}
            />
          );
        case 'reviews':
          return (
            <RestaurantReviews
              restaurantSlug={selectedRestaurant.slug}
            />
          );
        default:
          return (
            <HomePage
              onViewChange={setCurrentView}
              restaurant={selectedRestaurant}
              userSession={safeRestaurantMusic.userSession}
            />
          );
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <Navbar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          restaurant={selectedRestaurant}
          userTable={safeRestaurantMusic.userSession?.tableNumber}
          onSwitchToAdmin={switchToAdminMode}
          isAuthenticated={isAuthenticated}
          user={currentUser}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onLogout={handleUserLogout}
          onProfile={handleProfile}
          onSettings={handleSettings}
        />
        
        <main className="min-h-screen pb-24">
          {renderCurrentView()}
        </main>
        
        {/* Spotify Login if Pro and not connected */}
        {planType === 'pro' && !spotifyConnected && !['login', 'register'].includes(currentView) && selectedRestaurant && (
          <SpotifyLogin
            restaurantId={selectedRestaurant.id}
            restaurantSlug={selectedRestaurant.slug}
            onConnect={() => {
              // Refresh plan after connect
              const refreshPlan = async () => {
                const updatedMusic = useRestaurantMusic(selectedRestaurant.slug);
                setPlanType(updatedMusic.planType);
                setSpotifyConnected(updatedMusic.spotifyConnected);
              };
              refreshPlan();
            }}
          />
        )}
      
        {/* Music Player - Solo mostrar si NO está en vistas de auth */}
        {currentSong && !['login', 'register'].includes(currentView) && (
          <MusicPlayer
            currentSong={currentSong}
            queue={safeRestaurantMusic.requests?.filter(req => req.status === 'pending') || []}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChange={handleVolumeChange}
            onToggleFavorite={safeRestaurantMusic.toggleFavorite}
            isFavorite={safeRestaurantMusic.favorites?.some(fav => fav.id === currentSong.id)}
            planType={planType}
            spotifyConnected={spotifyConnected}
            restaurantSlug={selectedRestaurant.slug}
          />
        )}

        {/* Footer - Solo mostrar si NO está en vistas de auth */}
        {!['login', 'register'].includes(currentView) && (
          <Footer 
            restaurant={selectedRestaurant} 
            userTable={safeRestaurantMusic.userSession?.tableNumber} 
          />
        )}
      </div>
    );
  };

  // Render Admin Dashboard with Queue Manager
  const renderAdminDashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2">
            <AdminDashboard 
              restaurant={adminUser}
              requests={restaurantMusic?.requests || []}
              currentSong={currentSong}
              onLogout={handleAdminLogout}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onVolumeChange={handleVolumeChange}
              isPlaying={isPlaying}
              volume={volume}
            />
          </div>
          
          {/* Queue Manager */}
          <div className="lg:col-span-1">
            <QueueManager 
              requests={restaurantMusic?.requests || []}
              currentSong={currentSong}
              onCancelRequest={handleCancelRequest}
              onMoveToTop={handleMoveToTop}
              onTogglePlayPause={handlePlayPause}
              onSkipToNext={handleSkipToNext}
              isPlaying={isPlaying}
              maxRequestsPerUser={2}
            />
          </div>
        </div>
      </div>
    );
  };

  // Main App Render Logic
  const renderApp = () => {
    if (appMode === 'admin') {
      switch(currentStep) {
        case 'admin-auth':
          return (
            <AdminAuth 
              onLogin={handleAdminLogin}
              onRegister={handleAdminRegister}
              onSwitchToCustomer={switchToCustomerMode}
              error={authError}
            />
          );
        case 'admin-dashboard':
          return renderAdminDashboard();
        default:
          return (
            <AdminAuth 
              onLogin={handleAdminLogin}
              onRegister={handleAdminRegister}
              onSwitchToCustomer={switchToCustomerMode}
              error={authError}
            />
          );
      }
    } else {
      switch(currentStep) {
        case 'restaurant-selection':
          return (
            <RestaurantSelector 
              onRestaurantSelect={handleRestaurantSelect}
              onSwitchToAdmin={switchToAdminMode}
            />
          );
        case 'music-app':
          return renderMusicApp();
        default:
          return (
            <RestaurantSelector 
              onRestaurantSelect={handleRestaurantSelect}
              onSwitchToAdmin={switchToAdminMode}
            />
          );
      }
    }
  };

  // Error handling for plan limitations
  const renderErrorMessage = (message) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">{message}</h3>
        <p className="text-slate-400 mb-6">Actualiza a plan Pro para acceder a Spotify.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );

  return renderApp();
}

export default App;