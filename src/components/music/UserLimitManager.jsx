import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, Music } from 'lucide-react';

const UserLimitManager = ({ 
  children, 
  userTable, 
  maxRequestsPerUser = 2, 
  requests = [], 
  currentSong,
  onRequestSong 
}) => {
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [userActiveRequests, setUserActiveRequests] = useState(0);

  useEffect(() => {
    // Contar peticiones activas del usuario
    const activeRequests = requests.filter(request => 
      request.user_table === userTable && 
      ['pending', 'playing'].includes(request.status)
    ).length;
    
    setUserActiveRequests(activeRequests);
  }, [requests, userTable]);

  const canMakeRequest = userActiveRequests < maxRequestsPerUser;
  const requestsRemaining = maxRequestsPerUser - userActiveRequests;

  const handleRequestAttempt = async (song) => {
    if (!canMakeRequest) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
      return false;
    }

    if (onRequestSong) {
      const result = await onRequestSong(song);
      return result;
    }
    
    return false;
  };

  // Crear un contexto o props mejoradas para el componente hijo
  const enhancedProps = {
    canMakeRequest,
    requestsRemaining,
    userActiveRequests,
    maxRequestsPerUser,
    onRequestSong: handleRequestAttempt
  };

  return (
    <div className="relative">
      {/* Limit Warning */}
      {showLimitWarning && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500/90 backdrop-blur-md border border-yellow-400/50 text-yellow-900 px-6 py-4 rounded-2xl shadow-xl animate-scale-in">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h4 className="font-bold">Límite alcanzado</h4>
              <p className="text-sm">
                Ya tienes {maxRequestsPerUser} peticiones activas. 
                Espera a que se completen para hacer más peticiones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="mb-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-white">{userTable}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">
                {userActiveRequests}/{maxRequestsPerUser} peticiones activas
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Request Status Indicators */}
            <div className="flex space-x-2">
              {[...Array(maxRequestsPerUser)].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < userActiveRequests
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-slate-600'
                  }`}
                  title={`Petición ${index + 1}`}
                />
              ))}
            </div>

            {canMakeRequest ? (
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {requestsRemaining} disponible{requestsRemaining !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Límite alcanzado</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {userActiveRequests > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-sm text-slate-400">
              <p>
                Peticiones en cola: {requests.filter(r => r.user_table === userTable && r.status === 'pending').length}
                {requests.filter(r => r.user_table === userTable && r.status === 'playing').length > 0 && (
                  <span className="text-green-400 ml-2">• Una de tus canciones está sonando</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Children */}
      {React.cloneElement(children, enhancedProps)}
    </div>
  );
};

export default UserLimitManager;