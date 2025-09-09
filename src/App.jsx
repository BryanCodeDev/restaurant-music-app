import React, { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './components/pages/HomePage';
import BrowseMusic from './components/pages/BrowseMusic';
import MyRequests from './components/pages/MyRequests';
import Favorites from './components/pages/Favorites';

// SaaS Components
import RestaurantSelector from './components/pages/RestaurantSelector';
import AdminAuth from './components/auth/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';
import MusicPlayer from './components/music/MusicPlayer';
import UserLimitManager from './components/music/UserLimitManager';

// Services
import apiService from './services/apiService';
import { useRestaurantMusic } from './hooks/useRestaurantMusic';

function App() {
  // App State Management
  const [appMode, setAppMode] = useState('customer'); // 'customer', 'admin'
  const [currentStep, setCurrentStep] = useState('restaurant-selection');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  
  // Music App State
  const [currentView, setCurrentView] = useState('home');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  // Hook para manejar la música cuando tenemos restaurante seleccionado
  const restaurantMusic = selectedRestaurant ? 
    useRestaurantMusic(selectedRestaurant.slug) : 
    { userSession: null, requests: [], favorites: [], addRequest: () => {}, toggleFavorite: () => {} };

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Verificar sesión de admin
      const savedAdmin = localStorage.getItem('admin_token');
      if (savedAdmin) {
        const profile = await apiService.getProfile();
        if (profile.data?.restaurant) {
          setAdminUser(profile.data.restaurant);
          setAppMode('admin');
          setCurrentStep('admin-dashboard');
          return;
        }
      }
    } catch (error) {
      // Token inválido, limpiar
      localStorage.removeItem('admin_token');
    }

    // Verificar sesión de usuario
    try {
      const savedSession = apiService.getCurrentSession();
      if (savedSession && savedSession.user) {
        // Simular datos del restaurante desde la sesión
        const restaurant = {
          id: savedSession.user.restaurantId,
          name: savedSession.user.restaurantName || 'Restaurante',
          slug: savedSession.restaurantSlug || 'restaurant'
        };
        
        setSelectedRestaurant(restaurant);
        setCurrentStep('music-app');
        return;
      }
    } catch (error) {
      // Sesión inválida, continuar con selección
      apiService.clearSession();
    }

    // Por defecto, mostrar selector de restaurantes
    setCurrentStep('restaurant-selection');
  };

  // Restaurant Selection Handler
  const handleRestaurantSelect = async (restaurant) => {
    try {
      setSelectedRestaurant(restaurant);
      setCurrentStep('music-app');
      
      // El hook useRestaurantMusic se encargará de crear la sesión
      console.log('Restaurant selected:', restaurant.name);
      
    } catch (error) {
      console.error('Error selecting restaurant:', error);
    }
  };

  // Admin Authentication Handlers
  const handleAdminLogin = async (credentials) => {
    try {
      const result = await apiService.loginRestaurant(credentials.email, credentials.password);
      setAdminUser(result.restaurant);
      setAppMode('admin');
      setCurrentStep('admin-dashboard');
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleAdminRegister = async (data) => {
    try {
      const result = await apiService.registerRestaurant(data);
      setAdminUser(result.restaurant);
      setAppMode('admin');
      setCurrentStep('admin-dashboard');
    } catch (error) {
      throw new Error(error.message || 'Error al registrar restaurante');
    }
  };

  const handleAdminLogout = () => {
    apiService.clearSession();
    setAdminUser(null);
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
    setCurrentSong(null);
    setIsPlaying(false);
  };

  // Music Control Handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const pendingRequests = restaurantMusic.requests?.filter(req => req.status === 'pending') || [];
    if (pendingRequests.length > 0) {
      const nextSong = pendingRequests[0];
      setCurrentSong(nextSong);
      setIsPlaying(true);
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    const completedRequests = restaurantMusic.requests?.filter(req => req.status === 'completed') || [];
    if (completedRequests.length > 0) {
      const previousSong = completedRequests[completedRequests.length - 1];
      setCurrentSong(previousSong);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  // Switch Modes
  const switchToAdminMode = () => {
    setAppMode('admin');
    setCurrentStep('admin-auth');
  };

  const switchToCustomerMode = () => {
    apiService.clearSession();
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
    setSelectedRestaurant(null);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  // Auto-start music when requests change
  useEffect(() => {
    if (!currentSong && restaurantMusic.requests?.length > 0) {
      const playingRequest = restaurantMusic.requests.find(req => req.status === 'playing');
      if (playingRequest) {
        setCurrentSong(playingRequest);
        setIsPlaying(true);
      }
    }
  }, [restaurantMusic.requests, currentSong]);

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

    const renderCurrentView = () => {
      const commonProps = {
        restaurantSlug: selectedRestaurant.slug,
        favorites: restaurantMusic.favorites || [],
        requests: restaurantMusic.requests || [],
        userSession: restaurantMusic.userSession
      };

      switch(currentView) {
        case 'home':
          return (
            <HomePage 
              onViewChange={setCurrentView} 
              restaurant={selectedRestaurant}
              userSession={restaurantMusic.userSession}
              stats={restaurantMusic.stats}
            />
          );
        case 'browse':
          return (
            <UserLimitManager
              userTable={restaurantMusic.userSession?.tableNumber}
              maxRequestsPerUser={2}
              requests={restaurantMusic.requests || []}
              currentSong={currentSong}
              onRequestSong={restaurantMusic.addRequest}
            >
              <BrowseMusic 
                restaurantSlug={selectedRestaurant.slug}
                {...commonProps}
              />
            </UserLimitManager>
          );
        case 'requests':
          return (
            <MyRequests 
              requests={restaurantMusic.requests || []} 
              userSession={restaurantMusic.userSession}
              onCancelRequest={restaurantMusic.cancelRequest}
            />
          );
        case 'favorites':
          return (
            <UserLimitManager
              userTable={restaurantMusic.userSession?.tableNumber}
              maxRequestsPerUser={2}
              requests={restaurantMusic.requests || []}
              currentSong={currentSong}
              onRequestSong={restaurantMusic.addRequest}
            >
              <Favorites 
                favorites={restaurantMusic.favorites || []}
                onToggleFavorite={restaurantMusic.toggleFavorite}
                onAddRequest={restaurantMusic.addRequest}
                restaurantSlug={selectedRestaurant.slug}
              />
            </UserLimitManager>
          );
        default:
          return (
            <HomePage 
              onViewChange={setCurrentView} 
              restaurant={selectedRestaurant}
              userSession={restaurantMusic.userSession}
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
          userTable={restaurantMusic.userSession?.tableNumber}
          onSwitchToAdmin={switchToAdminMode}
        />
        
        <main className="min-h-screen pb-24">
          {renderCurrentView()}
        </main>
        
        <Footer 
          restaurant={selectedRestaurant} 
          userTable={restaurantMusic.userSession?.tableNumber} 
        />
        
        {/* Music Player */}
        {currentSong && (
          <MusicPlayer
            currentSong={currentSong}
            queue={restaurantMusic.requests?.filter(req => req.status === 'pending') || []}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChange={handleVolumeChange}
            onToggleFavorite={restaurantMusic.toggleFavorite}
            isFavorite={restaurantMusic.favorites?.some(fav => fav.id === currentSong.id)}
          />
        )}
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
            />
          );
        case 'admin-dashboard':
          return (
            <AdminDashboard 
              restaurant={adminUser}
              requests={restaurantMusic.requests || []}
              currentSong={currentSong}
              onLogout={handleAdminLogout}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onVolumeChange={handleVolumeChange}
              isPlaying={isPlaying}
              volume={volume}
            />
          );
        default:
          return (
            <AdminAuth 
              onLogin={handleAdminLogin}
              onRegister={handleAdminRegister}
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

  return renderApp();
}

export default App;