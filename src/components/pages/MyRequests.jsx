import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Trash2,
  Music,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import apiService from '../../services/apiService';

const MyRequests = ({ userSession, onCancelRequest, restaurantSlug }) => {
  const [localRequests, setLocalRequests] = useState([]);
  const [cancelingId, setCancelingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);

  const tableNumber = userSession?.tableNumber;

  useEffect(() => {
    if (!restaurantSlug || !tableNumber) {
      setLoading(false);
      return;
    }

    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUserRequests(restaurantSlug, tableNumber);
        if (response && response.requests) {
          setLocalRequests(response.requests);
        } else {
          setLocalRequests([]);
        }
      } catch (err) {
        console.error('Error loading requests:', err);
        setLocalRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();

    // Polling cada 10 segundos
    const interval = setInterval(loadRequests, 10000);
    setPollingInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [restaurantSlug, tableNumber]);

  const requests = localRequests;

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      label: 'En Cola',
      description: 'Tu canción está esperando en la cola'
    },
    playing: {
      icon: Play,
      color: 'text-green-400 bg-green-500/20 border-green-500/30',
      label: 'Reproduciendo',
      description: 'Tu canción se está reproduciendo ahora'
    },
    completed: {
      icon: CheckCircle,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      label: 'Completada',
      description: 'Tu canción ya fue reproducida'
    },
    cancelled: {
      icon: XCircle,
      color: 'text-red-400 bg-red-500/20 border-red-500/30',
      label: 'Cancelada',
      description: 'Esta petición fue cancelada'
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (cancelingId || !onCancelRequest) return;
    
    setCancelingId(requestId);
    try {
      await onCancelRequest(requestId);
    } finally {
      setCancelingId(null);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const groupedRequests = {
    pending: requests.filter(req => req.status === 'pending'),
    playing: requests.filter(req => req.status === 'playing'),
    completed: requests.filter(req => req.status === 'completed'),
    cancelled: requests.filter(req => req.status === 'cancelled')
  };

  const totalRequests = requests.length;
  const activeRequests = groupedRequests.pending.length + groupedRequests.playing.length;

  // Loading eliminado - mostrar directamente el contenido

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mis Peticiones
          </span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Sigue el estado de todas tus canciones solicitadas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{totalRequests}</div>
          <div className="text-sm text-slate-400">Total</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{groupedRequests.pending.length}</div>
          <div className="text-sm text-slate-400">En Cola</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{groupedRequests.playing.length}</div>
          <div className="text-sm text-slate-400">Sonando</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{groupedRequests.completed.length}</div>
          <div className="text-sm text-slate-400">Completadas</div>
        </div>
      </div>

      {/* Current Queue Info */}
      {activeRequests > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <Play className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Estado Actual</h2>
          </div>
          <p className="text-slate-300">
            Tienes {activeRequests} canción{activeRequests !== 1 ? 'es' : ''} activa{activeRequests !== 1 ? 's' : ''} en el sistema.
            {groupedRequests.pending.length > 0 && (
              <span className="text-yellow-400 font-medium">
                {' '}{groupedRequests.pending.length} esperando en cola.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Requests List */}
      {totalRequests === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
            <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
              <Music className="h-16 w-16 text-slate-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-400 mb-4">
            No has hecho peticiones aún
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Explora nuestro catálogo musical y solicita tus canciones favoritas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Requests */}
          {(groupedRequests.pending.length > 0 || groupedRequests.playing.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span>Peticiones Activas</span>
              </h2>
              
              {/* Playing Now */}
              {groupedRequests.playing.map((request, index) => {
                const config = statusConfig[request.status];
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={request.id}
                    className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 backdrop-blur-md border border-green-500/20 rounded-2xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Song Image */}
                      <img
                        src={request.song?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'}
                        alt={`${request.song?.title} - ${request.song?.artist}`}
                        className="w-16 h-16 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-white text-lg leading-tight">
                              {request.song?.title || 'Canción Desconocida'}
                            </h3>
                            <p className="text-slate-300">{request.song?.artist || 'Artista Desconocido'}</p>
                          </div>
                          
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${config.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(request.requested_at)} {formatTime(request.requested_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{request.user_table}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-500 mt-2">{config.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Pending Requests */}
              {groupedRequests.pending.map((request, index) => {
                const config = statusConfig[request.status];
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={request.id}
                    className="bg-gradient-to-r from-yellow-500/10 to-orange-600/10 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.song?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'}
                        alt={`${request.song?.title} - ${request.song?.artist}`}
                        className="w-16 h-16 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-white text-lg leading-tight">
                              {request.song?.title || 'Canción Desconocida'}
                            </h3>
                            <p className="text-slate-300">{request.song?.artist || 'Artista Desconocido'}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${config.color}`}>
                              <IconComponent className="h-4 w-4" />
                              <span className="text-sm font-medium">{config.label}</span>
                            </div>
                            
                            {onCancelRequest && (
                              <button
                                onClick={() => handleCancelRequest(request.id)}
                                disabled={cancelingId === request.id}
                                className="p-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cancelar petición"
                              >
                                <Trash2 className={`h-4 w-4 ${cancelingId === request.id ? 'animate-spin' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(request.requested_at)} {formatTime(request.requested_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{request.user_table}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-500 mt-2">{config.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completed Requests */}
          {groupedRequests.completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span>Completadas</span>
              </h2>
              
              {groupedRequests.completed.map((request, index) => {
                const config = statusConfig[request.status];
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={request.id}
                    className="bg-slate-800/20 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6 opacity-75"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.song?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'}
                        alt={`${request.song?.title} - ${request.song?.artist}`}
                        className="w-16 h-16 rounded-xl object-cover opacity-75"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-slate-300 text-lg leading-tight">
                              {request.song?.title || 'Canción Desconocida'}
                            </h3>
                            <p className="text-slate-400">{request.song?.artist || 'Artista Desconocido'}</p>
                          </div>
                          
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${config.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(request.completed_at || request.requested_at)} {formatTime(request.completed_at || request.requested_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{request.user_table}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cancelled Requests */}
          {groupedRequests.cancelled.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-400" />
                <span>Canceladas</span>
              </h2>
              
              {groupedRequests.cancelled.map((request, index) => {
                const config = statusConfig[request.status];
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={request.id}
                    className="bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 opacity-75"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.song?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'}
                        alt={`${request.song?.title} - ${request.song?.artist}`}
                        className="w-16 h-16 rounded-xl object-cover opacity-50"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-slate-400 text-lg leading-tight line-through">
                              {request.song?.title || 'Canción Desconocida'}
                            </h3>
                            <p className="text-slate-500">{request.song?.artist || 'Artista Desconocido'}</p>
                          </div>
                          
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${config.color}`}>
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(request.requested_at)} {formatTime(request.requested_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{request.user_table}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRequests;