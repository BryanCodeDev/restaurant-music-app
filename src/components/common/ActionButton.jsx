import React from 'react';
import { Loader2 } from 'lucide-react';

const ActionButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 transform hover:scale-105 shadow-lg shadow-blue-500/25',
    secondary: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 focus:ring-yellow-500 transform hover:scale-105 shadow-lg shadow-yellow-500/25',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 transform hover:scale-105 shadow-lg shadow-green-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 transform hover:scale-105 shadow-lg shadow-red-500/25',
    outline: 'bg-transparent text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-white focus:ring-slate-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    xl: 'px-8 py-5 text-lg'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const renderIcon = () => {
    if (!Icon || loading) return null;

    const iconClass = `${iconSizes[size]} ${
      iconPosition === 'left' && children ? 'mr-2' : ''
    } ${
      iconPosition === 'right' && children ? 'ml-2' : ''
    }`;

    return <Icon className={iconClass} />;
  };

  const renderSpinner = () => (
    <Loader2 className={`animate-spin ${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && renderSpinner()}
      {!loading && iconPosition === 'left' && renderIcon()}
      {children}
      {!loading && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default ActionButton;