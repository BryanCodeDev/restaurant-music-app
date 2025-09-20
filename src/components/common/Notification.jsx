import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  XCircle
} from 'lucide-react';

const Notification = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg transition-all duration-300";

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500/10 border-green-500/30 text-green-300`;
      case 'error':
        return `${baseStyles} bg-red-500/10 border-red-500/30 text-red-300`;
      case 'warning':
        return `${baseStyles} bg-yellow-500/10 border-yellow-500/30 text-yellow-300`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500/10 border-blue-500/30 text-blue-300`;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50 max-w-sm';
      case 'top-left':
        return 'fixed top-4 left-4 z-50 max-w-sm';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50 max-w-sm';
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50 max-w-sm';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm';
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm';
      default:
        return 'fixed top-4 right-4 z-50 max-w-sm';
    }
  };

  return (
    <div className={`${getPositionStyles()} ${getStyles()}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-sm mb-1">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm opacity-90">
            {message}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Hook para usar notificaciones
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (message, title, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      title,
      ...options
    });
  };

  const error = (message, title, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      title,
      duration: 0, // Los errores no se auto-cierran
      ...options
    });
  };

  const warning = (message, title, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      title,
      ...options
    });
  };

  const info = (message, title, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      title,
      ...options
    });
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  };
};

// Componente contenedor para mostrar todas las notificaciones
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notification;