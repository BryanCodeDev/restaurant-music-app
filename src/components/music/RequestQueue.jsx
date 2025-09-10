import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  User, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Pause,
  Music2,
  Calendar,
  Hash,
  Timer,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const RequestQueue = ({ 
  requests = [], 
  onCancelRequest, 
  currentlyPlaying = null,
  allowCancellation = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('position'); // 'position', 'time', 'table'

  // Filtrar y organizar peticiones por estado
  const organizedRequests = {
    playing: requests.filter(req => req.status === 'playing'),
    pending: requests.filter(req => req.status === 'pending').sort((a, b) => {
      if (sortBy === 'position') return (a.queue_position || 0) - (b.queue_position || 0);
      if (sortBy === 'time') return new Date(a.requested_at) - new Date(b.requested_at);
      if (sortBy === 'table') return (a.user_table || '').localeCompare(b.user_table || '');
      return 0;
    }),
    completed: requests.filter(req => req.status === 'completed'),
    cancelled: requests.filter(req => req.status === 'cancelled')
  };

  const totalPending = organizedRequests.pending.length;
  const currentlyPlayingSong = organizedRequests.playing[0] || currentlyPlaying;

  // Calcular tiempo estimado
  const getEstimatedTime = (position) => {
    return Math.max(1, position * 3.5); // 3.5 minutos promedio por canción
  };

  // Formatear tiempo
  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear duración relativa
  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now - past) / 60000);
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    const hours = Math.floor(diffInMinutes / 60);
    return `Hace ${hours}h`;
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-gray-400 bg-gray-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (!requests.length) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center">
        <Music2 className="h-16 w-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay peticiones</h3>
        <p className="text-slate-400">La cola de música está vacía</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Cola de Peticiones</h3>
                <p className="text-slate-400 text-sm">
                  {totalPending} en espera • ~{getEstimatedTime(totalPending)} min total
                </p>
              </div>
            </div>
            
            {totalPending > 0 && (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                  {totalPending} pendientes
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {totalPending > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white"
                title={isExpanded ? 'Contraer cola' : 'Expandir cola'}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Currently Playing */}
      {currentlyPlayingSong && (
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={currentlyPlayingSong.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop"}
                alt={currentlyPlayingSong.title}
                className="w-14 h-14 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Play className="h-5 w-5 text-green-400 fill-current animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  <Play className="h-3 w-3 mr-1.5 fill-current" />
                  Reproduciendo ahora
                </span>
              </div>
              
              <h4 className="font-bold text-white text-base truncate mb-1">
                {currentlyPlayingSong.title}
              </h4>
              
              <div className="flex items-center space-x-4 text-sm text-slate-300">
                <span>{currentlyPlayingSong.artist}</span>
                {currentlyPlayingSong.user_table && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{currentlyPlayingSong.user_table}</span>
                    </span>
                  </>
                )}
                {currentlyPlayingSong.duration && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Timer className="h-4 w-4" />
                      <span>{currentlyPlayingSong.duration}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      {totalPending > 1 && (
        <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-700/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Ordenar por:</span>
            <div className="flex items-center space-x-2">
              {[
                { id: 'position', label: 'Posición', icon: Hash },
                { id: 'time', label: 'Hora', icon: Calendar },
                { id: 'table', label: 'Mesa', icon: User }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === option.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <option.icon className="h-3 w-3" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className={`transition-all duration-300 ${
        isExpanded || totalPending <= 3 ? 'max-h-96' : 'max-h-80'
      } overflow-y-auto`}>
        {totalPending > 0 ? (
          <div className="divide-y divide-slate-700/30">
            {organizedRequests.pending.map((request, index) => {
              const position = (request.queue_position || index + 1);
              const estimatedTime = getEstimatedTime(position);
              
              return (
                <div key={request.id} className="p-4 hover:bg-slate-700/30 transition-colors group">
                  <div className="flex items-center space-x-4">
                    {/* Position number */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300 rounded-xl flex items-center justify-center text-sm font-bold border border-purple-500/30">
                      {position}
                    </div>
                    
                    {/* Song image */}
                    <div className="relative">
                      <img 
                        src={request.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"}
                        alt={request.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate text-sm mb-1">
                        {request.title}
                      </h4>
                      
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Music2 className="h-3 w-3" />
                          <span>{request.artist}</span>
                        </span>
                        
                        {request.user_table && (
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{request.user_table}</span>
                          </span>
                        )}
                        
                        <span className="flex items-center space-x-1">
                          <Timer className="h-3 w-3" />
                          <span>~{estimatedTime} min</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Status and Actions */}
                    <div className="flex items-center space-x-3">
                      {/* Request time info */}
                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {formatTime(request.requested_at)}
                        </div>
                        <div className="text-xs text-slate-600">
                          {getTimeAgo(request.requested_at)}
                        </div>
                      </div>
                      
                      {/* Cancel button */}
                      {allowCancellation && onCancelRequest && request.status === 'pending' && (
                        <button
                          onClick={() => onCancelRequest(request.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Cancelar petición"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Clock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium mb-2">Cola vacía</p>
            <p className="text-slate-500 text-sm">No hay canciones pendientes</p>
          </div>
        )}
      </div>

      {/* Footer with Stats */}
      {totalPending > 0 && (
        <div className="p-4 bg-slate-700/30 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                <span className="font-semibold text-white">{totalPending}</span> en cola
              </span>
              <span className="text-slate-400">
                Tiempo total: ~{getEstimatedTime(totalPending)} minutos
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {organizedRequests.completed.length > 0 && (
                <span className="text-slate-500 text-xs">
                  {organizedRequests.completed.length} completadas hoy
                </span>
              )}
              
              {!isExpanded && totalPending > 3 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                >
                  Ver todas
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Specific Cases */}
      {totalPending === 0 && organizedRequests.completed.length > 0 && (
        <div className="p-8 text-center bg-slate-700/20">
          <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-2">
            No hay canciones en espera
          </p>
          <p className="text-slate-500 text-xs">
            {organizedRequests.completed.length} canciones completadas hoy
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestQueue;