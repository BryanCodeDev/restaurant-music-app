import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import BrowseMusic from './components/pages/BrowseMusic';
import MyRequests from './components/pages/MyRequests';
import Favorites from './components/pages/Favorites';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);

  const toggleFavorite = (song) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === song.id);
      if (exists) {
        return prev.filter(fav => fav.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const addRequest = (song) => {
    const newRequest = {
      ...song,
      requestedAt: new Date(),
      status: 'pending'
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'home':
        return <HomePage onViewChange={setCurrentView} />;
      case 'browse':
        return (
          <BrowseMusic 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddRequest={addRequest}
          />
        );
      case 'requests':
        return <MyRequests requests={requests} />;
      case 'favorites':
        return (
          <Favorites 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddRequest={addRequest}
          />
        );
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="min-h-screen">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;