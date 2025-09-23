import React from 'react';

const FeatureCard = ({
  icon: Icon,
  title,
  features,
  variant = 'primary',
  className = ''
}) => {
  const getVariantClasses = (variant) => {
    const variants = {
      primary: 'bg-blue-500/10 border-blue-500/30',
      secondary: 'bg-yellow-500/10 border-yellow-500/30',
      success: 'bg-emerald-500/10 border-emerald-500/30',
      danger: 'bg-red-500/10 border-red-500/30'
    };
    return variants[variant] || variants.primary;
  };

  const getTitleColor = (variant) => {
    const colors = {
      primary: 'text-blue-400',
      secondary: 'text-yellow-400',
      success: 'text-emerald-400',
      danger: 'text-red-400'
    };
    return colors[variant] || colors.primary;
  };

  return (
    <div className={`p-3 md:p-4 ${getVariantClasses(variant)} border rounded-xl ${className}`}>
      <div className="flex items-start space-x-2 md:space-x-3">
        <Icon className="h-4 md:h-5 w-4 md:w-5 text-current mt-0.5 flex-shrink-0" />
        <div>
          <h4 className={`font-semibold text-sm md:text-base ${getTitleColor(variant)} mb-1.5 md:mb-2`}>
            {title}
          </h4>
          <ul className="text-xs md:text-sm text-slate-300 space-y-0.5 md:space-y-1">
            {features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;