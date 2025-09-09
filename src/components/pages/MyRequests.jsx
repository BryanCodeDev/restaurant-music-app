import React from 'react';
import { Clock, Play, CheckCircle, XCircle, Music, AlertCircle, RefreshCw } from 'lucide-react';

const MyRequests = ({ requests = [], userSession, onCancelRequest, onRefresh }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'playing': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return Clock;
      case 'playing': return Play;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En cola';
      case 'playing': return 'Reproduciendo';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQueuePosition = (request) => {
    if (request.status !== 'pending') return null;
    const pendingRequests = requests
      .filter(r => r.status === 'pending')
      .sort((a, b) => new Date(a.requestedAt || a.requested_at) - new Date(b.requestedAt || b.requested_at));
    
    return pendingRequests.findIndex(r => r.id === request.id) + 1;
  };

  const handleCancelRequest = async (requestId) => {
    if (onCancelRequest) {
      try {
        await onCancelRequest(requestId);
      } catch (error) {
        console.error('Error cancelling request:', error);
      }
    }
  };

  return (
    <div className="min-h-screen py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20 blur-lg"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mis Pedidos
            </h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Revisa el estado de todas tus peticiones musicales
          </p>
          
          {/* User Info */}
          {userSession && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-400">Mesa:</span>
              <span className="ml-2 font-semibold text-purple-400">{userSession.tableNumber}</span>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onRefresh}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
          </div>
        )}

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const StatusIcon = getStatusIcon(request.status);
              const queuePosition = getQueuePosition(request);
              const canCancel = request.status === 'pending';
              
              return (
                <div key={request.id} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    {/* Song Image */}
                    <img 
                      src={request.image || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop`}
                      alt={`${request.title} - ${request.artist}`}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg truncate">{request.title}</h3>
                      <p className="text-slate-300 truncate">{request.artist}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                        <span>Solicitada: {formatTime(request.requestedAt || request.requested_at)}</span>
                        {request.album && (
                          <>
                            <span>•</span>
                            <span>{request.album}</span>
                          </>
                        )}
                        {request.duration && (
                          <>
                            <span>•</span>
                            <span>{request.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status and Actions */}
                    <div className="flex items-center space-x-4">
                      {/* Queue Position */}
                      {queuePosition && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">#{queuePosition}</div>
                          <div className="text-xs text-slate-500">En cola</div>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(request.status)} border border-current/30`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {getStatusText(request.status)}
                        </span>
                      </div>

                      {/* Cancel Button */}
                      {canCancel && onCancelRequest && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Cancelar petición"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar for pending requests */}
                  {request.status === 'pending' && queuePosition && (
                    <div className="mt-4 pt-4 border-t border-slate-700/30">
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Posición en cola: #{queuePosition}</span>
                        <span>Tiempo estimado: {queuePosition * 3} min</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(10, 100 - (queuePosition * 20))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Playing indicator */}
                  {request.status === 'playing' && (
                    <div className="mt-4 pt-4 border-t border-slate-700/30">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Reproduciendo ahora</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-2xl"></div>
              <div className="relative bg-slate-800/50 p-8 rounded-full border border-slate-700/50 w-32 h-32 flex items-center justify-center mx-auto">
                <Music className="h-16 w-16 text-slate-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No tienes pedidos musicales
            </h3>
            <p className="text-slate-500 mb-6">
              ¡Explora nuestra biblioteca y haz tu primera petición!
            </p>
            <button 
              onClick={() => window.location.hash = '#browse'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
            >
              Explorar Música
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {requests.length > 0 && (
          <div className="mt-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <span>Resumen de Pedidos</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">
                  {requests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-slate-400 text-sm">En Cola</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-2xl font-bold text-green-400">
                  {requests.filter(r => r.status === 'playing').length}
                </div>
                <div className="text-slate-400 text-sm">Reproduciendo</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {requests.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-slate-400 text-sm">Completadas</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">
                  {requests.length}
                </div>
                <div className="text-slate-400 text-sm">Total</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-slate-700/30 text-center">
              <p className="text-slate-400 text-sm">
                Las peticiones se procesan en orden de llegada. 
                {requests.filter(r => r.status === 'pending').length > 0 && 
                  ` Tiempo estimado de espera: ~${requests.filter(r => r.status === 'pending').length * 3} minutos.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;