import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Music, Settings, Clock, Volume2, TrendingUp, AlertTriangle, Edit3 } from 'lucide-react';
import apiService from '../../services/apiService';
import QueueManager from '../admin/QueueManager';
import MusicPlayer from '../music/MusicPlayer';
import { useRestaurantMusic } from '../../hooks/useRestaurantMusic';

const RestaurantDashboard = ({ restaurant, requests = [], currentSong, onLogout, onPlayPause, onNext, onPrevious, onVolumeChange, isPlaying, volume, onEditProfile }) => {
  const [stats, setStats] = useState({});
  const [settings, setSettings] = useState({
    maxRequestsPerUser: restaurant?.max_requests_per_user || 2,
    queueLimit: restaurant?.queue_limit || 50,
    autoPlay: restaurant?.auto_play || true,
    allowExplicit: restaurant?.allow_explicit || false,
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [error, setError] = useState(null);
  const restaurantMusic = useRestaurantMusic(restaurant?.slug);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getRestaurantStats(restaurant.slug, '24h');
        setStats(response.data || {});
      } catch (err) {
        setError('Failed to load stats');
      }
    };
    if (restaurant) fetchStats();
  }, [restaurant]);

  const handleSaveSettings = async () => {
    try {
      await apiService.updateProfile({
        maxRequestsPerUser: settings.maxRequestsPerUser,
        queueLimit: settings.queueLimit,
        autoPlay: settings.autoPlay,
        allowExplicit: settings.allowExplicit,
      });
      setIsEditingSettings(false);
      setError(null);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingSettings(false);
    // Reset to original if needed
  };

  if (!restaurant) return <div>Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard - {restaurant.name}
            </h1>
            <p className="text-slate-400 mt-2">Manage your music experience and queue</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onEditProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.totalRequests || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Queue Length</p>
                <p className="text-2xl font-bold text-white">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-white">{restaurant.rating || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Settings Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Restaurant Settings</span>
            </h2>
            <button
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isEditingSettings ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingSettings ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Requests per User</label>
                <input
                  type="number"
                  value={settings.maxRequestsPerUser}
                  onChange={(e) => setSettings({...settings, maxRequestsPerUser: parseInt(e.target.value)})}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Queue Limit</label>
                <input
                  type="number"
                  value={settings.queueLimit}
                  onChange={(e) => setSettings({...settings, queueLimit: parseInt(e.target.value)})}
                  min="10"
                  max="200"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoPlay}
                    onChange={(e) => setSettings({...settings, autoPlay: e.target.checked})}
                    className="rounded border-slate-600 text-blue-500"
                  />
                  <span className="text-sm text-slate-300">Auto Play</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.allowExplicit}
                    onChange={(e) => setSettings({...settings, allowExplicit: e.target.checked})}
                    className="rounded border-slate-600 text-blue-500"
                  />
                  <span className="text-sm text-slate-300">Allow Explicit Content</span>
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Settings
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400">Max Requests/User:</span> <span className="font-medium">{settings.maxRequestsPerUser}</span></div>
              <div><span className="text-slate-400">Queue Limit:</span> <span className="font-medium">{settings.queueLimit}</span></div>
              <div><span className="text-slate-400">Auto Play:</span> <span className="font-medium">{settings.autoPlay ? 'Yes' : 'No'}</span></div>
              <div><span className="text-slate-400">Allow Explicit:</span> <span className="font-medium">{settings.allowExplicit ? 'Yes' : 'No'}</span></div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue Manager */}
          <div className="lg:col-span-2">
            <QueueManager 
              requests={requests}
              currentSong={currentSong}
              onCancelRequest={(id) => {/* implement */ }}
              onMoveToTop={(id) => {/* implement */ }}
              onTogglePlayPause={onPlayPause}
              onSkipToNext={onNext}
              isPlaying={isPlaying}
              maxRequestsPerUser={settings.maxRequestsPerUser}
            />
          </div>

          {/* Music Player Sidebar */}
          <div className="lg:col-span-1">
            {currentSong && (
              <MusicPlayer
                currentSong={currentSong}
                queue={requests.filter(r => r.status === 'pending')}
                isPlaying={isPlaying}
                volume={volume}
                onPlayPause={onPlayPause}
                onNext={onNext}
                onPrevious={onPrevious}
                onVolumeChange={onVolumeChange}
                onToggleFavorite={() => {/* implement */ }}
                isFavorite={false}
                planType="starter"
                spotifyConnected={false}
                restaurantSlug={restaurant.slug}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;