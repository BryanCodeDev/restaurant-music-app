import React, { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './components/pages/HomePage';
import BrowseMusic from './components/pages/BrowseMusic';
import MyRequests from './components/pages/MyRequests';
import Favorites from './components/pages/Favorites';

// New SaaS Components
import RestaurantSelector from './components/pages/RestaurantSelector';
import AdminAuth from './components/auth/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';
import MusicPlayer from './components/music/MusicPlayer';
import UserLimitManager from './components/music/UserLimitManager';

function App() {
  // App State Management
  const [appMode, setAppMode] = useState('customer'); // 'customer', 'admin'
  const [currentStep, setCurrentStep] = useState('restaurant-selection'); // 'restaurant-selection', 'music-app', 'admin-auth', 'admin-dashboard'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  
  // Music App State
  const [currentView, setCurrentView] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  // User Settings
  const [userTable, setUserTable] = useState('Mesa #12');
  const maxRequestsPerUser = 2;

  // Initialize app - check if user is returning admin
  useEffect(() => {
    const savedAdmin = localStorage.getItem('musicmenu_admin');
    const savedRestaurant = localStorage.getItem('musicmenu_selected_restaurant');
    
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdminUser(adminData);
        setAppMode('admin');
        setCurrentStep('admin-dashboard');
      } catch (error) {
        localStorage.removeItem('musicmenu_admin');
      }
    } else if (savedRestaurant) {
      try {
        const restaurantData = JSON.parse(savedRestaurant);
        setSelectedRestaurant(restaurantData);
        setCurrentStep('music-app');
        // Auto-assign table number (in real app, this would be determined differently)
        setUserTable(`Mesa #${Math.floor(Math.random() * 20) + 1}`);
      } catch (error) {
        localStorage.removeItem('musicmenu_selected_restaurant');
      }
    }
  }, []);

  // Restaurant Selection Handler
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    localStorage.setItem('musicmenu_selected_restaurant', JSON.stringify(restaurant));
    setCurrentStep('music-app');
    // Simulate table assignment
    setUserTable(`Mesa #${Math.floor(Math.random() * 20) + 1}`);
  };

  // Admin Authentication Handlers
  const handleAdminLogin = (adminData) => {
    setAdminUser(adminData);
    localStorage.setItem('musicmenu_admin', JSON.stringify(adminData));
    setAppMode('admin');
    setCurrentStep('admin-dashboard');
  };

  const handleAdminRegister = (restaurantData) => {
    const adminData = {
      ...restaurantData,
      id: Date.now(),
      registeredAt: new Date()
    };
    setAdminUser(adminData);
    localStorage.setItem('musicmenu_admin', JSON.stringify(adminData));
    setAppMode('admin');
    setCurrentStep('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('musicmenu_admin');
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
  };

  // Music Control Handlers
  const toggleFavorite = (song) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === song.id);
      if (exists) {
        return prev.filter(fav => fav.id !== song.id);
      } else {
        return [...prev, { ...song, dateAdded: new Date() }];
      }
    });
  };

  const addRequest = (song) => {
    const newRequest = {
      ...song,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestedAt: new Date(),
      status: 'pending',
      userTable: userTable
    };
    
    setRequests(prev => [...prev, newRequest]);
    
    // Auto-play first song if nothing is playing
    if (!currentSong && requests.length === 0) {
      setCurrentSong(newRequest);
      setRequests(prev => prev.map(req => 
        req.id === newRequest.id ? { ...req, status: 'playing' } : req
      ));
      setIsPlaying(true);
    }
    
    return true;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const pendingRequests = requests.filter(req => req.status === 'pending');
    if (pendingRequests.length > 0) {
      const nextSong = pendingRequests[0];
      setCurrentSong(nextSong);
      setRequests(prev => prev.map(req => 
        req.id === nextSong.id 
          ? { ...req, status: 'playing' }
          : req.status === 'playing' 
            ? { ...req, status: 'completed' }
            : req
      ));
      setIsPlaying(true);
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    const completedRequests = requests
      .filter(req => req.status === 'completed')
      .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    
    if (completedRequests.length > 0) {
      const previousSong = completedRequests[0];
      setCurrentSong(previousSong);
      setRequests(prev => prev.map(req => 
        req.id === previousSong.id 
          ? { ...req, status: 'playing' }
          : req.status === 'playing' 
            ? { ...req, status: 'pending' }
            : req
      ));
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  // Switch to Admin Mode
  const switchToAdminMode = () => {
    setAppMode('admin');
    setCurrentStep('admin-auth');
  };

  // Switch to Customer Mode
  const switchToCustomerMode = () => {
    setAppMode('customer');
    setCurrentStep('restaurant-selection');
  };

  // Render Customer Music App
  const renderMusicApp = () => {
    const renderCurrentView = () => {
      const commonProps = {
        favorites,
        onToggleFavorite: toggleFavorite,
        requests,
        selectedRestaurant
      };

      switch(currentView) {
        case 'home':
          return <HomePage onViewChange={setCurrentView} {...commonProps} />;
        case 'browse':
          return (
            <UserLimitManager
              userTable={userTable}
              maxRequestsPerUser={maxRequestsPerUser}
              requests={requests}
              currentSong={currentSong}
              onRequestSong={addRequest}
            >
              <BrowseMusic 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddRequest={addRequest}
              />
            </UserLimitManager>
          );
        case 'requests':
          return <MyRequests requests={requests} />;
        case 'favorites':
          return (
            <UserLimitManager
              userTable={userTable}
              maxRequestsPerUser={maxRequestsPerUser}
              requests={requests}
              currentSong={currentSong}
              onRequestSong={addRequest}
            >
              <Favorites 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddRequest={addRequest}
              />
            </UserLimitManager>
          );
        default:
          return <HomePage onViewChange={setCurrentView} {...commonProps} />;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <Navbar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          restaurant={selectedRestaurant}
          userTable={userTable}
          onSwitchToAdmin={switchToAdminMode}
        />
        
        <main className="min-h-screen pb-24">
          {renderCurrentView()}
        </main>
        
        <Footer restaurant={selectedRestaurant} userTable={userTable} />
        
        {/* Music Player - Always visible when there's a current song */}
        {currentSong && (
          <MusicPlayer
            currentSong={currentSong}
            queue={requests.filter(req => req.status === 'pending')}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChange={handleVolumeChange}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some(fav => fav.id === currentSong.id)}
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
              requests={requests}
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