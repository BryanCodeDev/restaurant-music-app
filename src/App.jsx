import React, { useState, useEffect } from 'react';

// Layout Components
import EnhancedNavbar from './components/layout/EnhancedNavbar';
import EnhancedFooter from './components/layout/EnhancedFooter';

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
import EditProfile from './components/auth/EditProfile';
import RestaurantDashboard from './components/restaurant/RestaurantDashboard';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Services & Hooks
import apiService from './services/apiService';
import { useRestaurantMusic } from './hooks/useRestaurantMusic';
import SpotifyLogin from './components/music/SpotifyLogin';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import routeUtils from './utils/routeUtils';

// Static Pages
import StaticPageRouter from './components/common/StaticPageRouter';

// Legal Components
import CookieBanner from './components/common/CookieBanner';

function App() {
  // Music App State
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [currentStaticPage, setCurrentStaticPage] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem('volume')) || 75);

  // Use the restaurant music hook - pass null when no restaurant selected
  const { selectedRestaurant } = useAuth();
  const restaurantMusic = useRestaurantMusic(selectedRestaurant?.slug);

  // Auto-update current song from requests
  useEffect(() => {
    if (restaurantMusic?.requests) {
      const playingRequest = restaurantMusic.requests.find(req => req.status === 'playing');
      if (playingRequest && (!currentSong || currentSong.id !== playingRequest.id)) {
        setCurrentSong(playingRequest);
        setIsPlaying(true);
      }
    }
  }, [restaurantMusic?.requests, currentSong]);

  // Persist music state to localStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    localStorage.setItem('volume', volume.toString());
  }, [currentView, volume]);

  // User Authentication Handlers - Usando AuthContext
  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleShowRegister = () => {
    setCurrentView('register');
  };

  const handleUserLogout = () => {
    setCurrentView('home');
  };

  const handleEditProfile = () => {
    setCurrentView('edit-profile');
  };

  // Static Page Handlers
  const handleShowPricing = () => {
    setCurrentStaticPage('precios');
    setCurrentView('static-page');
  };

  const handleShowFeatures = () => {
    setCurrentStaticPage('caracteristicas');
    setCurrentView('static-page');
  };

  const handleShowContact = () => {
    setCurrentStaticPage('contacto');
    setCurrentView('static-page');
  };

  const handleProfile = () => {
    handleEditProfile();
  };

  const handleSettings = () => {
    console.log('Mostrar configuraciones');
  };

  // Restaurant Selection Handler
  const handleRestaurantSelect = async (restaurant) => {
    try {
      // Usar el contexto de autenticación para seleccionar restaurante
      const { selectRestaurant } = useAuth();
      selectRestaurant(restaurant);
    } catch (error) {
      console.error('Error selecting restaurant:', error);
    }
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

  // Switch Modes - Usando AuthContext
  const switchToAdminMode = () => {
    const { switchToAdminMode: switchMode } = useAuth();
    switchMode();
  };

  const switchToCustomerMode = () => {
    const { switchToCustomerMode: switchMode } = useAuth();
    switchMode();
    setCurrentView('home');
  };


  // Render Customer Music App
  const renderMusicApp = () => {
    if (!selectedRestaurant) {
      // Redirect to selection instead of loading
      setCurrentStep('restaurant-selection');
      return null; // Or render selector, but useEffect will handle
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
            <div className="max-w-2xl mx-auto px-4 py-8">
              <Login
                onLogin={handleUserLogin}
                onSwitchToRegister={() => setCurrentView('register')}
                onSwitchToCustomer={() => setCurrentView('home')}
                isLoading={false}
                error={authError}
              />
            </div>
          );

        case 'register':
          return (
            <div className="max-w-2xl mx-auto px-4 py-8">
              <Register
                onRegister={handleUserRegister}
                onSwitchToLogin={() => setCurrentView('login')}
                onSwitchToCustomer={() => setCurrentView('home')}
                isLoading={false}
                error={authError}
              />
            </div>
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
        case 'edit-profile':
          return (
            <div className="max-w-2xl mx-auto px-4 py-8">
              <EditProfile
                userType={localStorage.getItem('user_type') || 'registered'}
                profile={userProfile || currentUser}
                onClose={() => setCurrentStep(previousStep || 'home')}
                onUpdate={(updatedProfile) => setUserProfile(updatedProfile)}
              />
            </div>
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
        <EnhancedNavbar
          currentView={currentView}
          onViewChange={setCurrentView}
          restaurant={selectedRestaurant}
          userTable={safeRestaurantMusic.userSession?.tableNumber}
          onSwitchToAdmin={switchToAdminMode}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onLogout={handleUserLogout}
          onProfile={handleProfile}
          onEditProfile={handleEditProfile}
          onSettings={handleSettings}
        />

        <main className="min-h-screen pb-24">
          {renderCurrentView()}
        </main>

        {/* Spotify Login if Pro and not connected */}
        {restaurantMusic?.planType === 'pro' && !restaurantMusic?.spotifyConnected && !['login', 'register'].includes(currentView) && selectedRestaurant && (
          <SpotifyLogin
            restaurantId={selectedRestaurant.id}
            restaurantSlug={selectedRestaurant.slug}
            onConnect={() => {
              // Refresh plan after connect
              const refreshPlan = async () => {
                const updatedMusic = useRestaurantMusic(selectedRestaurant.slug);
                // El hook se actualizará automáticamente
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
            planType={restaurantMusic?.planType || 'basic'}
            spotifyConnected={restaurantMusic?.spotifyConnected || false}
            restaurantSlug={selectedRestaurant.slug}
          />
        )}

        {/* Footer - Solo mostrar si NO está en vistas de auth y NO es página estática */}
        {!['login', 'register'].includes(currentView) && currentView !== 'static-page' && (
          <EnhancedFooter
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

  // Static Pages Router
  const renderStaticPage = () => {
    if (currentView === 'static-page' && currentStaticPage) {
      return (
        <div className="min-h-screen">
          <StaticPageRouter currentPage={currentStaticPage} />
          <EnhancedFooter />
        </div>
      );
    }
    return null;
  };

  // Main App Render Logic - Usando AuthContext
  const renderApp = () => {
    const { appMode, currentStep, user, userType } = useAuth();

    // Check if we should render a static page
    if (currentView === 'static-page' && currentStaticPage) {
      return renderStaticPage();
    }

    if (appMode === 'admin') {
      switch(currentStep) {
        case 'admin-auth':
          return (
            <AdminAuth
              onLogin={async (credentials) => {
                const { login } = useAuth();
                await login(credentials);
              }}
              onRegister={async (data) => {
                const { register } = useAuth();
                await register(data);
              }}
              onSwitchToCustomer={switchToCustomerMode}
            />
          );
        case 'restaurant-panel':
          return (
            <RestaurantDashboard
              restaurant={user?.restaurant || user}
              requests={restaurantMusic?.requests || []}
              currentSong={currentSong}
              onLogout={handleUserLogout}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onVolumeChange={handleVolumeChange}
              isPlaying={isPlaying}
              volume={volume}
              onEditProfile={handleEditProfile}
            />
          );
        case 'superadmin-panel':
          return (
            <SuperAdminDashboard
              profile={user}
              onLogout={handleUserLogout}
              onEditProfile={handleEditProfile}
            />
          );
        default:
          return (
            <AdminAuth
              onLogin={async (credentials) => {
                const { login } = useAuth();
                await login(credentials);
              }}
              onRegister={async (data) => {
                const { register } = useAuth();
                await register(data);
              }}
              onSwitchToCustomer={switchToCustomerMode}
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

  return (
    <AuthProvider>
      {renderApp()}
      <CookieBanner />
    </AuthProvider>
  );
}

export default App;