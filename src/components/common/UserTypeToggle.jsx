import React from 'react';
import { User, Building2, Shield } from 'lucide-react';

const UserTypeToggle = ({
  userType,
  onToggle,
  showSuperAdmin = false,
  disabled = false
}) => {
  const getGradientClasses = (type) => {
    const gradients = {
      user: 'from-blue-500/20 to-purple-500/20 border-blue-500/30 bg-blue-500/10',
      restaurant: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 bg-yellow-500/10',
      superadmin: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30 bg-indigo-500/10'
    };
    return gradients[type] || gradients.user;
  };

  const getTextColor = (type) => {
    const colors = {
      user: 'text-blue-300 border-blue-500/30',
      restaurant: 'text-yellow-300 border-yellow-500/30',
      superadmin: 'text-indigo-300 border-indigo-500/30'
    };
    return colors[type] || colors.user;
  };

  const getIcon = (type) => {
    const icons = {
      user: User,
      restaurant: Building2,
      superadmin: Shield
    };
    return icons[type] || User;
  };

  const getLabel = (type) => {
    const labels = {
      user: 'Usuario',
      restaurant: 'Restaurante',
      superadmin: 'Super Admin'
    };
    return labels[type] || 'Usuario';
  };

  const types = showSuperAdmin
    ? ['user', 'restaurant', 'superadmin']
    : ['user', 'restaurant'];

  const currentIndex = types.indexOf(userType);
  const togglePosition = `${(currentIndex / types.length) * 100}%`;

  return (
    <div className="mb-8">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-1">
        <div className="flex relative">
          {/* Toggle Background */}
          <div
            className={`absolute top-0 left-0 h-full w-1/${types.length} bg-gradient-to-r rounded-xl transition-all duration-300 ease-in-out ${getGradientClasses(userType)}`}
            style={{ left: togglePosition }}
          />

          {types.map((type) => {
            const Icon = getIcon(type);
            const isActive = userType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => !disabled && onToggle(type)}
                className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? getTextColor(type)
                    : 'text-slate-400 hover:text-slate-300'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={disabled}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{getLabel(type)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserTypeToggle;