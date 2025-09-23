import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className = '',
  variant = 'default'
}) => {
  const getVariantClasses = (variant) => {
    const variants = {
      default: 'bg-slate-800/50 border-slate-700',
      primary: 'bg-blue-500/10 border-blue-500/30',
      success: 'bg-green-500/10 border-green-500/30',
      warning: 'bg-yellow-500/10 border-yellow-500/30',
      danger: 'bg-red-500/10 border-red-500/30'
    };
    return variants[variant] || variants.default;
  };

  const getTrendColor = (trend) => {
    const colors = {
      up: 'text-green-400',
      down: 'text-red-400',
      neutral: 'text-slate-400'
    };
    return colors[trend] || colors.neutral;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className={`border rounded-xl p-6 text-center ${getVariantClasses(variant)} ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}

      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-slate-400 mb-2">{title}</p>

      {trend && trendValue && (
        <div className={`text-sm flex items-center justify-center space-x-1 ${getTrendColor(trend)}`}>
          <span>{getTrendIcon(trend)}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;