import React, { useState } from 'react';
import { 
  Clock, 
  Play, 
  User, 
  X, 
  ChevronDown, 
  ChevronUp,
  Music,
  AlertCircle,
  CheckCircle,
  Pause,
  Timer,
  Users
} from 'lucide-react';

const QueueManager = ({ 
  requests = [], 
  currentSong = null,
  onCancelRequest,
  onMoveToTop,
  onTogglePlayPause,
  isPlaying = false,
  maxRequestsPerUser = 2
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const playingRequest = requests.find(req => req.status === 'playing');
  
  const getQueuePosition = (requestId) => {
    return pendingRequests.findIndex(req => req.id === requestId) + 1;
  };

  const getEstimatedTime = (position) => {
    return position * 3.5; // 3.5 minutos promedio por canción
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserRequestCount = (userTable) => {
    return pendingRequests.filter(req => req.userTable === userTable).length;
  };

  const getTotalQueueTime = () => {
    return Math.round(pendingRequests.length * 3.5);
  };

  if (!requests.length && !currentSong) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full opacity-20 blur-xl"></div>
          <div className="relative bg-slate-700/50 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <Music className="h-10 w-10 text-slate-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-400 mb-2">
          No hay música en cola
        </h3>
        <p className="text-slate-500">
          Las peticiones musicales aparecerán aquí cuando los clientes hagan solicitudes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Clock className="h-6 w-6 text-purple-400" />
                {pendingRequests.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">Cola de Reproducción</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                {pendingRequests.length} en cola
              </span>
              {getTotalQueueTime() > 0 && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  ~{getTotalQueueTime()} min
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30 text-sm text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{new Set(pendingRequests.map(r => r.userTable)).size} mesas activas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Timer className="h-4 w-4" />
              <span>Promedio: 3.5 min/canción</span>
            </div>
          </div>
          
          {maxRequestsPerUser && (
            <span className="text-xs">
              Máximo {maxRequestsPerUser} canciones por mesa
            </span>
          )}
        </div>
      </div>

      {/* Currently Playing */}
      {(playingRequest || currentSong) && (
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-slate-700/30">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={(playingRequest || currentSong)?.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop"}
                alt={(playingRequest || currentSong)?.title}
                className="w-14 h-14 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <button 
                  onClick={onTogglePlayPause}
                  className="p-1 bg-emerald-500/80 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-white" />
                  ) : (
                    <Play className="h-4 w-4 text-white ml-0.5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Play className="h-3 w-3 mr-1" />
                  {isPlaying ? 'Reproduciendo' : 'Pausado'}
                </span>
              </div>
              <h4 className="font-bold text-white text-lg">
                {(playingRequest || currentSong)?.title}
              </h4>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <span>{(playingRequest || currentSong)?.artist}</span>
                {playingRequest && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{playingRequest.userTable}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className={`transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-20 opacity-75'
      } overflow-y-auto`}>
        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-slate-700/30">
            {pendingRequests.map((request, index) => {
              const position = index + 1;
              const estimatedTime = getEstimatedTime(position);
              const userRequestCount = getUserRequestCount(request.userTable);
              
              return (
                <div key={request.id} className="p-4 hover:bg-slate-700/30 transition-colors group">
                  <div className="flex items-center space-x-4">
                    {/* Position Number */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 rounded-xl flex items-center justify-center text-sm font-bold">
                        {position}
                      </div>
                      {position === 1 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Song Image */}
                    <img 
                      src={request.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"}
                      alt={request.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white truncate">
                            {request.title}
                          </h4>
                          <p className="text-slate-400 text-sm truncate">
                            {request.artist}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {/* User Request Count Warning */}
                          {userRequestCount >= maxRequestsPerUser && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                              <AlertCircle className="h-3 w-3" />
                              <span>Límite</span>
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {position > 1 && onMoveToTop && (
                              <button
                                onClick={() => onMoveToTop(request.id)}
                                className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded"
                                title="Mover al inicio"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                            )}
                            
                            {onCancelRequest && (
                              <button
                                onClick={() => onCancelRequest(request.id)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                                title="Cancelar petición"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Request Details */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{request.userTable}</span>
                          {userRequestCount > 1 && (
                            <span className="px-1.5 py-0.5 bg-slate-700/50 rounded-full text-xs">
                              {userRequestCount}/{maxRequestsPerUser}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>~{estimatedTime} min</span>
                        </span>
                        <span>{formatTime(request.requestedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              No hay canciones en cola
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Los clientes pueden hacer peticiones musicales desde sus mesas
            </p>
          </div>
        )}
      </div>

      {/* Footer with Summary */}
      {pendingRequests.length > 0 && isExpanded && (
        <div className="p-4 bg-slate-700/20 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Total: {pendingRequests.length} canciones</span>
              <span>Tiempo estimado: ~{getTotalQueueTime()} minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Sistema activo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManager;