import React, { useState } from 'react';
import { Clock, Play, User, X, ChevronDown, ChevronUp } from 'lucide-react';

const RequestQueue = ({ requests = [], onCancelRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const playingRequest = requests.find(req => req.status === 'playing');
  
  const getQueuePosition = (requestId) => {
    return pendingRequests.findIndex(req => req.id === requestId) + 1;
  };

  const getEstimatedTime = (position) => {
    return position * 3; // 3 minutos promedio por canción
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!requests.length) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
        <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No hay peticiones en cola</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">Cola de Peticiones</h3>
            </div>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
              {pendingRequests.length} en cola
            </span>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Currently Playing */}
      {playingRequest && (
        <div className="p-4 bg-green-500/10 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={playingRequest.image} 
                alt={playingRequest.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-green-400 fill-current" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                  <Play className="h-3 w-3 mr-1" />
                  Reproduciendo
                </span>
              </div>
              <h4 className="font-medium text-white truncate">{playingRequest.title}</h4>
              <p className="text-gray-300 text-sm truncate">{playingRequest.artist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-32 overflow-hidden'}`}>
        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-white/10">
            {pendingRequests.map((request, index) => {
              const position = index + 1;
              const estimatedTime = getEstimatedTime(position);
              
              return (
                <div key={request.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-3">
                    {/* Position number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-sm font-semibold">
                      {position}
                    </div>
                    
                    {/* Song image */}
                    <img 
                      src={request.image} 
                      alt={request.title}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    
                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate text-sm">{request.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{request.artist}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>~{estimatedTime} min</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Cancel button */}
                    {onCancelRequest && (
                      <button
                        onClick={() => onCancelRequest(request.id)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Cancelar petición"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Request time */}
                  <div className="ml-11 mt-1">
                    <span className="text-xs text-gray-500">
                      Solicitada: {formatTime(request.requestedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No hay canciones en cola</p>
          </div>
        )}
      </div>

      {/* Footer with total time */}
      {pendingRequests.length > 0 && (
        <div className="p-3 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total en cola: {pendingRequests.length} canciones</span>
            <span>Tiempo estimado: ~{getEstimatedTime(pendingRequests.length)} minutos</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestQueue;