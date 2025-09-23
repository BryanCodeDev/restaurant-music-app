import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400
    focus:outline-none focus:ring-2 transition-all duration-200
    ${error ? 'border-red-500' : 'border-slate-600'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const iconClasses = 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label} {required && '*'}
        </label>
      )}

      <div className="relative">
        {Icon && <Icon className={iconClasses} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={Icon ? `${baseInputClasses} pl-12` : baseInputClasses}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;