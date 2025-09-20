import React from 'react';
import { Loader2, Music, Headphones } from 'lucide-react';

const LoadingSpinner = ({
  size = 'default',
  variant = 'default',
  message = 'Cargando...',
  showIcon = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = {
    small: 'p-2',
    default: 'p-4',
    large: 'p-6',
    xl: 'p-8'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'music':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              <Music className={`${sizeClasses[size]} text-white animate-pulse`} />
            </div>
          </div>
        );

      case 'headphones':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
              <Headphones className={`${sizeClasses[size]} text-white animate-bounce`} />
            </div>
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className={`relative border-4 border-blue-500 border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`}></div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      {showIcon && renderSpinner()}
      {message && (
        <p className={`mt-3 ${textSizes[size]} text-slate-300 text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

// Componentes específicos para casos de uso comunes
export const PageLoading = ({ message = 'Cargando página...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
    <LoadingSpinner size="xl" variant="music" message={message} />
  </div>
);

export const CardLoading = ({ message = 'Cargando...' }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
    <LoadingSpinner size="large" variant="default" message={message} />
  </div>
);

export const ButtonLoading = ({ message = 'Procesando...' }) => (
  <div className="flex items-center space-x-2">
    <LoadingSpinner size="small" variant="default" showIcon={true} />
    <span className="text-sm">{message}</span>
  </div>
);

export const InlineLoading = ({ message = 'Cargando...' }) => (
  <div className="flex items-center space-x-2 text-slate-400">
    <LoadingSpinner size="small" variant="dots" showIcon={true} />
    <span className="text-sm">{message}</span>
  </div>
);

export default LoadingSpinner;