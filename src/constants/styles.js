// Constantes de estilos reutilizables
export const GRADIENT_CLASSES = {
  primary: 'from-blue-500 to-purple-600',
  secondary: 'from-yellow-500 to-amber-600',
  success: 'from-green-500 to-emerald-600',
  danger: 'from-red-500 to-red-600',
  warning: 'from-orange-500 to-yellow-500',
  indigo: 'from-indigo-500 to-violet-600'
};

export const SHADOW_CLASSES = {
  primary: 'shadow-blue-500/25',
  secondary: 'shadow-yellow-500/25',
  success: 'shadow-green-500/25',
  danger: 'shadow-red-500/25',
  warning: 'shadow-orange-500/25',
  indigo: 'shadow-indigo-500/25'
};

export const FOCUS_CLASSES = {
  primary: 'focus:ring-blue-500',
  secondary: 'focus:ring-yellow-500',
  success: 'focus:ring-green-500',
  danger: 'focus:ring-red-500',
  warning: 'focus:ring-orange-500',
  indigo: 'focus:ring-indigo-500'
};

export const BORDER_CLASSES = {
  primary: 'border-blue-500/30',
  secondary: 'border-yellow-500/30',
  success: 'border-green-500/30',
  danger: 'border-red-500/30',
  warning: 'border-orange-500/30',
  indigo: 'border-indigo-500/30'
};

export const BACKGROUND_CLASSES = {
  primary: 'bg-blue-500/10',
  secondary: 'bg-yellow-500/10',
  success: 'bg-green-500/10',
  danger: 'bg-red-500/10',
  warning: 'bg-orange-500/10',
  indigo: 'bg-indigo-500/10'
};

export const TEXT_COLORS = {
  primary: 'text-blue-400',
  secondary: 'text-yellow-400',
  success: 'text-green-400',
  danger: 'text-red-400',
  warning: 'text-orange-400',
  indigo: 'text-indigo-400'
};

export const HOVER_CLASSES = {
  primary: 'hover:from-blue-600 hover:to-purple-700',
  secondary: 'hover:from-yellow-600 hover:to-amber-700',
  success: 'hover:from-green-600 hover:to-emerald-700',
  danger: 'hover:from-red-600 hover:to-red-700',
  warning: 'hover:from-orange-600 hover:to-yellow-700',
  indigo: 'hover:from-indigo-600 hover:to-violet-700'
};

// Funciones helper para generar clases
export const getGradientButtonClasses = (variant = 'primary') => {
  return `bg-gradient-to-r ${GRADIENT_CLASSES[variant]} ${HOVER_CLASSES[variant]} ${SHADOW_CLASSES[variant]} shadow-lg`;
};

export const getFocusRingClasses = (variant = 'primary') => {
  return `focus:ring-2 ${FOCUS_CLASSES[variant]} focus:ring-offset-2`;
};

export const getCardClasses = (variant = 'primary') => {
  return `${BACKGROUND_CLASSES[variant]} ${BORDER_CLASSES[variant]} border`;
};

export const getTextColorClasses = (variant = 'primary') => {
  return TEXT_COLORS[variant];
};