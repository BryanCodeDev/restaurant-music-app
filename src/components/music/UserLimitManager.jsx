import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  Music,
  Timer,
  Users,
  Info
} from 'lucide-react';

const UserLimitManager = ({ 
  userTable = "Mesa #12",
  maxRequestsPerUser = 2,
  requests = [],
  currentSong = null,
  onRequestSong,
  children
}) => {
  const [userRequests, setUserRequests] = useState([]);
  const [canRequest, setCanRequest] = useState(true);
  const [timeUntilNextRequest, setTimeUntilNextRequest] = useState(0);

  // Filtrar requests del usuario actual
  useEffect(() => {
    const filteredRequests = requests.filter(req => 
      req.userTable === userTable && (req.status === 'pending' || req.status === 'playing')
    );
    setUserRequests(filteredRequests);
    
    // Verificar si puede hacer más peticiones
    setCanRequest(filteredRequests.length < maxRequestsPerUser);
  }, [requests, userTable, maxRequestsPerUser]);

  // Calcular tiempo hasta próxima petición
  useEffect(() => {
    if (userRequests.length >= maxRequestsPerUser) {
      // Encontrar la canción más antigua del usuario
      const oldestRequest = userRequests
        .sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt))[0];
      
      if (oldestRequest) {
        // Calcular posición en cola y tiempo estimado
        const queuePosition = requests
          .filter(req => req.status === 'pending')
          .findIndex(req => req.id === oldestRequest.id);
        
        if (queuePosition !== -1) {
          const estimatedTime = (queuePosition + 1) * 3.5 * 60; // 3.5 min por canción en segundos
          setTimeUntilNextRequest(Math.round(estimatedTime / 60)); // en minutos
        }
      }
    } else {
      setTimeUntilNextRequest(0);
    }
  }, [userRequests, requests, maxRequestsPerUser]);

  const handleRequestSong = (song) => {
    if (!canRequest) {
      return false;
    }

    const newRequest = {
      ...song,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userTable,
      requestedAt: new Date(),
      status: 'pending'
    };

    onRequestSong?.(newRequest);
    return true;
  };

  const getRequestStatus = (requestId) => {
    const request = requests.find(req => req.id === requestId);
    return request?.status || 'unknown';
  };

  const getQueuePosition = (requestId) => {
    const pendingRequests = requests.filter(req => req.status === 'pending');
    const position = pendingRequests.findIndex(req => req.id === requestId);
    return position !== -1 ? position + 1 : null;
  };

  const formatTimeRemaining = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Componente wrapper para mostrar información de límites
  return (
    <div className="space-y-4">
      
      {/* Status Bar - Solo mostrar si hay información relevante */}
      {(userRequests.length > 0 || !canRequest) && (
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                canRequest 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                <User className="h-5 w-5" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{userTable}</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    {userRequests.length}/{maxRequestsPerUser} canciones
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm">
                  {canRequest 
                    ? `Puedes pedir ${maxRequestsPerUser - userRequests.length} canción${maxRequestsPerUser - userRequests.length !== 1 ? 'es' : ''} más`
                    : 'Has alcanzado el límite de peticiones'
                  }
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-right">
              {canRequest ? (
                <div className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Disponible</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    ~{timeUntilNextRequest} min para siguiente
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Peticiones Activas del Usuario */}
      {userRequests.length > 0 && (
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Music className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white">Tus Peticiones</h3>
          </div>
          
          <div className="space-y-3">
            {userRequests.map((request) => {
              const status = getRequestStatus(request.id);
              const queuePosition = getQueuePosition(request.id);
              
              return (
                <div key={request.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
                  <img 
                    src={request.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"}
                    alt={request.title}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">
                      {request.title}
                    </h4>
                    <p className="text-slate-400 text-xs truncate">
                      {request.artist}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'playing' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {status === 'playing' ? (
                        <>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-1"></div>
                          Reproduciendo
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {queuePosition ? `#${queuePosition} en cola` : 'En cola'}
                        </>
                      )}
                    </div>
                    
                    {queuePosition && (
                      <p className="text-xs text-slate-500 mt-1">
                        ~{queuePosition * 3.5} min
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Información de Límites - Solo mostrar si es necesario */}
      {!canRequest && timeUntilNextRequest > 5 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">
                ¿Por qué hay un límite?
              </h4>
              <div className="text-sm text-slate-300 space-y-1">
                <p>• Garantizamos que todos los clientes puedan participar</p>
                <p>• Evitamos colas demasiado largas</p>
                <p>• Mantenemos variedad musical para todos</p>
              </div>
              
              <div className="mt-3 p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">
                  <strong className="text-blue-400">Consejo:</strong> Mientras esperas, 
                  puedes explorar nueva música y preparar tu próxima selección.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renderizar componentes hijos con props adicionales */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onAddRequest: handleRequestSong,
            canRequest,
            userRequestCount: userRequests.length,
            maxRequests: maxRequestsPerUser,
            timeUntilNextRequest,
            userTable
          });
        }
        return child;
      })}

      {/* Overlay de bloqueo cuando no se puede hacer peticiones */}
      {!canRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/95 border border-slate-700/50 rounded-3xl p-6 max-w-md w-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="h-8 w-8 text-yellow-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Límite de Peticiones Alcanzado
              </h3>
              
              <p className="text-slate-400 mb-4">
                Has pedido el máximo de {maxRequestsPerUser} canciones. 
                Podrás hacer una nueva petición cuando una de tus canciones termine de reproducirse.
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                <p className="text-blue-400 font-medium">
                  Tiempo estimado: {formatTimeRemaining(timeUntilNextRequest)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()} // Temporal - debería cerrar el overlay
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLimitManager;