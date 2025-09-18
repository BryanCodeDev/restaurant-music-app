import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit3, Save, X, AlertCircle, Lock, Calendar, Hash, MapPin, Building2, Shield } from 'lucide-react';
import apiService from '../../services/apiService';

const EditProfile = ({ userType = 'registered', profile = {}, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    preferredGenres: [],
    themePreference: 'dark',
    privacyLevel: 'public',
    // Restaurant specific
    restaurantName: '',
    ownerName: '',
    address: '',
    city: '',
    country: 'Colombia',
    cuisineType: '',
    description: '',
    maxRequestsPerUser: 2,
    queueLimit: 50,
    autoPlay: true,
    allowExplicit: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const genres = ['pop', 'rock', 'ballad', 'electronic', 'hip-hop', 'reggaeton', 'jazz', 'classical', 'latin', 'country'];
  const themes = ['light', 'dark', 'auto'];
  const privacyLevels = ['public', 'friends', 'private'];
  const cuisineTypes = ['Colombiana', 'Italiana', 'Mexicana', 'Asiática', 'Mediterránea', 'Internacional'];

  useEffect(() => {
    if (profile) {
      const baseData = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        dateOfBirth: profile.dateOfBirth || '',
        preferredGenres: profile.preferredGenres || [],
        themePreference: profile.themePreference || 'dark',
        privacyLevel: profile.privacyLevel || 'public',
      };

      if (userType === 'restaurant') {
        Object.assign(baseData, {
          restaurantName: profile.name || '',
          ownerName: profile.ownerName || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || 'Colombia',
          cuisineType: profile.cuisineType || '',
          description: profile.description || '',
          maxRequestsPerUser: profile.maxRequestsPerUser || 2,
          queueLimit: profile.queueLimit || 50,
          autoPlay: profile.autoPlay !== false,
          allowExplicit: profile.allowExplicit || false,
        });
      }

      setFormData(baseData);
    }
  }, [profile, userType]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (userType === 'restaurant') {
      if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (isPasswordChange) {
      if (!currentPassword) newErrors.currentPassword = 'Current password required';
      if (!newPassword || newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
      if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const updateData = { ...formData };

      if (userType === 'registered') {
        delete updateData.restaurantName;
        delete updateData.ownerName;
        // etc., remove restaurant fields
      } else {
        updateData.name = formData.restaurantName;
        // Map restaurant fields
      }

      if (isPasswordChange && newPassword) {
        updateData.password = newPassword; // Backend will hash
      } else {
        delete updateData.password;
      }

      const response = await apiService.updateProfile(updateData);

      if (response.success) {
        onUpdate?.(response.data);
        onClose?.();
      } else {
        setErrors({ submit: response.message || 'Update failed' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre]
    }));
  };

  const isUserType = userType === 'registered';
  const isRestaurantType = userType === 'restaurant';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              {isUserType ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
              <span>Edit {isUserType ? 'Profile' : 'Restaurant Profile'}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {isUserType ? 'Name' : 'Restaurant Name'} *
              </label>
              <input
                type="text"
                value={isUserType ? formData.name : formData.restaurantName}
                onChange={(e) => setFormData(isUserType ? {...formData, name: e.target.value} : {...formData, restaurantName: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white ${errors.name ? 'border-red-500' : 'border-slate-600'}`}
                placeholder={isUserType ? 'Your name' : 'Restaurant name'}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white ${errors.email ? 'border-red-500' : 'border-slate-600'}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.email}</p>}
            </div>
          </div>

          {isUserType && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Genres</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`p-2 rounded-lg border transition-colors ${
                        formData.preferredGenres.includes(genre)
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-slate-600 hover:border-blue-500 hover:bg-blue-500/5 text-slate-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Theme Preference</label>
                  <select
                    value={formData.themePreference}
                    onChange={(e) => setFormData({...formData, themePreference: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {themes.map(theme => <option key={theme} value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Privacy Level</label>
                  <select
                    value={formData.privacyLevel}
                    onChange={(e) => setFormData({...formData, privacyLevel: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {privacyLevels.map(level => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {isRestaurantType && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Owner full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="USA">USA</option>
                    {/* Add more */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cuisine Type</label>
                  <select
                    value={formData.cuisineType}
                    onChange={(e) => setFormData({...formData, cuisineType: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="">Select type</option>
                    {cuisineTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Restaurant description..."
                  maxLength="1000"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Requests per User</label>
                  <input
                    type="number"
                    value={formData.maxRequestsPerUser}
                    onChange={(e) => setFormData({...formData, maxRequestsPerUser: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Queue Limit</label>
                  <input
                    type="number"
                    value={formData.queueLimit}
                    onChange={(e) => setFormData({...formData, queueLimit: parseInt(e.target.value)})}
                    min="10"
                    max="200"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.autoPlay}
                    onChange={(e) => setFormData({...formData, autoPlay: e.target.checked})}
                    className="rounded border-slate-600 text-blue-500"
                  />
                  <span className="text-sm text-slate-300">Auto Play</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.allowExplicit}
                    onChange={(e) => setFormData({...formData, allowExplicit: e.target.checked})}
                    className="rounded border-slate-600 text-blue-500"
                  />
                  <span className="text-sm text-slate-300">Allow Explicit Content</span>
                </label>
              </div>
            </>
          )}

          {/* Password Change Section */}
          <div className="border-t border-slate-700 pt-6">
            <button
              type="button"
              onClick={() => setIsPasswordChange(!isPasswordChange)}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4"
            >
              <Lock className="h-4 w-4" />
              <span>{isPasswordChange ? 'Cancel' : 'Change Password'}</span>
            </button>

            {isPasswordChange && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white ${errors.currentPassword ? 'border-red-500' : 'border-slate-600'}`}
                    placeholder="Current password"
                  />
                  {errors.currentPassword && <p className="text-red-400 text-sm mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.currentPassword}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white ${errors.newPassword ? 'border-red-500' : 'border-slate-600'}`}
                    placeholder="New password"
                  />
                  {errors.newPassword && <p className="text-red-400 text-sm mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600'}`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.confirmPassword}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm flex items-center space-x-2"><AlertCircle className="h-4 w-4" />{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;