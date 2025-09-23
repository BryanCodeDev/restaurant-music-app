import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 ${className}`}>
      <p className="text-red-400 text-sm flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{error}</span>
      </p>
    </div>
  );
};

export default ErrorMessage;