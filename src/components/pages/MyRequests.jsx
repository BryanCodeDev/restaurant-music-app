import React from 'react';
import { Clock, Play, CheckCircle, XCircle, Music } from 'lucide-react';

const MyRequests = ({ requests }) => {
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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Clock className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mis Pedidos
            </h1>
          </div>
          <p className="text-gray-300">
            Revisa el estado de todas tus peticiones musicales
          </p>
        </div>

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    {/* Song Image */}
                    <img 
                      src={request.image} 
                      alt={`${request.title} - ${request.artist}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{request.title}</h3>
                      <p className="text-gray-300 truncate">{request.artist}</p>
                      <p className="text-gray-400 text-sm">
                        Solicitada a las {formatTime(request.requestedAt)}
                      </p>
                    </div>
                    
                    {/* Status */}
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getStatusColor(request.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar for pending requests */}
                  {request.status === 'pending' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Posición en cola: #{index + 1}</span>
                        <span>Tiempo estimado: {(index + 1) * 3} min</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(10, 100 - (index * 20))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No tienes pedidos musicales
            </h3>
            <p className="text-gray-500 mb-6">
              ¡Explora nuestra biblioteca y haz tu primera petición!
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              Explorar Música
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {requests.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen de Pedidos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {requests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-gray-400 text-sm">En Cola</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {requests.filter(r => r.status === 'playing').length}
                </div>
                <div className="text-gray-400 text-sm">Reproduciendo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {requests.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-gray-400 text-sm">Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {requests.length}
                </div>
                <div className="text-gray-400 text-sm">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;