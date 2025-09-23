import React, { useState, useEffect } from 'react';
import { Users, Building2, BarChart3, AlertTriangle, CheckCircle, XCircle, Download, Edit3, LogOut, CreditCard } from 'lucide-react';
import apiService from '../../services/apiService';
import EditProfile from '../auth/EditProfile';

const SuperAdminDashboard = ({ profile, onLogout, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [approvalData, setApprovalData] = useState({ plan: 'free', notes: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [file, setFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingRes, subscriptionsRes, statsRes] = await Promise.all([
        apiService.getPendingRestaurants(),
        apiService.getAllSubscriptions(),
        apiService.getGlobalStats()
      ]);

      setPendingRestaurants(pendingRes.data?.pendingRestaurants || []);
      setSubscriptions(subscriptionsRes.data?.subscriptions || []);
      setGlobalStats(statsRes.data || {
        totalUsers: 0,
        totalRestaurants: 0,
        totalRequests: 0,
        pendingRestaurants: pendingRes.data?.pendingRestaurants?.length || 0
      });
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      const formData = new FormData();
      formData.append('plan', approvalData.plan);
      if (file) formData.append('payment_proof', file);
      if (approvalData.notes) formData.append('notes', approvalData.notes);

      const response = await apiService.approveRestaurant(restaurantId, formData);
      if (response.success) {
        loadData();
        setSelectedRestaurant(null);
        setApprovalData({ plan: 'free', notes: '' });
        setFile(null);
      } else {
        setError('Approval failed: ' + response.message);
      }
    } catch (err) {
      setError('Approval failed: ' + err.message);
    }
  };

  const handleReject = async (restaurantId) => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    try {
      const response = await apiService.rejectRestaurant(restaurantId, { reason: rejectReason });
      if (response.success) {
        loadData();
        setSelectedRestaurant(null);
        setRejectReason('');
      } else {
        setError('Rejection failed: ' + response.message);
      }
    } catch (err) {
      setError('Rejection failed: ' + err.message);
    }
  };

  const handleApproveSubscription = async (subscriptionId) => {
    try {
      const response = await apiService.approveSubscription(subscriptionId);
      if (response.success) {
        loadData();
        setSelectedSubscription(null);
      } else {
        setError('Subscription approval failed: ' + response.message);
      }
    } catch (err) {
      setError('Subscription approval failed: ' + err.message);
    }
  };

  const handleRejectSubscription = async (subscriptionId, reason) => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    try {
      const response = await apiService.rejectSubscription(subscriptionId, reason);
      if (response.success) {
        loadData();
        setSelectedSubscription(null);
      } else {
        setError('Subscription rejection failed: ' + response.message);
      }
    } catch (err) {
      setError('Subscription rejection failed: ' + err.message);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending Restaurants', icon: Building2 },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'stats', label: 'Global Stats', icon: BarChart3 }
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Super Admin Panel
            </h1>
            <p className="text-slate-400 mt-2">Manage the entire platform</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
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

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-500/20 rounded"><XCircle className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl mb-8 overflow-hidden">
          <div className="flex border-b border-slate-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-b-2 border-indigo-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <Restaurant className="h-5 w-5" />
                  <span>Pending Restaurants ({pendingRestaurants.length})</span>
                </h3>
                {pendingRestaurants.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No pending restaurants</p>
                ) : (
                  <div className="space-y-4">
                    {pendingRestaurants.map(rest => (
                      <div key={rest.id} className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{rest.name}</h4>
                            <p className="text-slate-400">{rest.email} • {rest.cuisine_type} • {rest.city}</p>
                            <p className="text-sm text-slate-500 mt-2">{rest.description}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setSelectedRestaurant(selectedRestaurant === rest.id ? null : rest.id)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              {selectedRestaurant === rest.id ? <XCircle className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        {selectedRestaurant === rest.id && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <select
                                value={approvalData.plan}
                                onChange={(e) => setApprovalData({...approvalData, plan: e.target.value})}
                                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                              >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                              </select>
                              <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*,.pdf"
                              />
                              <textarea
                                value={approvalData.notes}
                                onChange={(e) => setApprovalData({...approvalData, notes: e.target.value})}
                                placeholder="Approval notes..."
                                className="md:col-span-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                rows="2"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleApprove(rest.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Rejection reason..."
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                              />
                              <button
                                onClick={() => handleReject(rest.id, rejectReason)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Global Statistics</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">{globalStats.totalRestaurants || 0}</p>
                    <p className="text-slate-400 mt-1">Total Restaurants</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">{subscriptions.filter(s => s.status === 'approved').length}</p>
                    <p className="text-slate-400 mt-1">Active Subscriptions</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">{subscriptions.filter(s => s.status === 'pending').length}</p>
                    <p className="text-slate-400 mt-1">Pending Subscriptions</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">{globalStats.pendingRestaurants || 0}</p>
                    <p className="text-slate-400 mt-1">Pending Restaurants</p>
                  </div>
                </div>
                <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription Management ({subscriptions.length})</span>
                </h3>
                {subscriptions.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No subscriptions found</p>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map(sub => (
                      <div key={sub.id} className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{sub.restaurantName || 'Restaurant'}</h4>
                            <p className="text-slate-400">{sub.email} • Plan: {sub.planType}</p>
                            <p className="text-sm text-slate-500 mt-2">
                              Status: <span className={`px-2 py-1 rounded-full text-xs ${
                                sub.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                sub.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {sub.status}
                              </span>
                            </p>
                            {sub.paymentProof && (
                              <p className="text-sm text-blue-400 mt-1">Payment proof uploaded</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setSelectedSubscription(selectedSubscription === sub.id ? null : sub.id)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              {selectedSubscription === sub.id ? <XCircle className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        {selectedSubscription === sub.id && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <div className="flex space-x-3">
                              {sub.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveSubscription(sub.id)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                  </button>
                                  <input
                                    type="text"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Rejection reason..."
                                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  />
                                  <button
                                    onClick={() => handleRejectSubscription(sub.id, rejectReason)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal for Users */}
      {showEditProfile && (
        <EditProfile
          userType="registered"
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onUpdate={(updated) => {
            // Refresh profile
            setShowEditProfile(false);
          }}
        />
      )}

    </div>
  );
};

export default SuperAdminDashboard;