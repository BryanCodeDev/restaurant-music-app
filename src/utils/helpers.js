// Utilidades y helpers generales para la aplicación

/**
 * Formatea la duración de milisegundos a formato MM:SS
 * @param {number} ms - Duración en milisegundos
 * @returns {string} Duración formateada
 */
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formatea la duración de segundos a formato MM:SS
 * @param {number} seconds - Duración en segundos
 * @returns {string} Duración formateada
 */
export const formatDurationFromSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formatea fecha a formato legible en español
 * @param {Date|string} date - Fecha a formatear
 * @param {boolean} includeTime - Si incluir la hora
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = true) => {
  const dateObj = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Formatea hora a formato legible
 * @param {Date|string} date - Fecha con hora
 * @returns {string} Hora formateada (HH:MM)
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Debounce function para limitar la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Genera un ID único simple
 * @returns {string} ID único
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida si una URL de imagen es válida
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
export const isValidImageUrl = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext)) || 
         url.includes('picsum.photos') || 
         url.includes('unsplash.com');
};

/**
 * Convierte un género en emoji
 * @param {string} genre - Género musical
 * @returns {string} Emoji correspondiente
 */
export const getGenreEmoji = (genre) => {
  const genreEmojis = {
    'rock': '🎸',
    'pop': '✨',
    'jazz': '🎷',
    'reggaeton': '🔥',
    'electronic': '🎛️',
    'hiphop': '🎤',
    'salsa': '💃',
    'flamenco': '👏',
    'classical': '🎼',
    'country': '🤠',
    'blues': '🎺',
    'folk': '🪕'
  };
  
  return genreEmojis[genre.toLowerCase()] || '🎵';
};

/**
 * Calcula el color de progreso basado en porcentaje
 * @param {number} percentage - Porcentaje (0-100)
 * @returns {string} Clase CSS de color
 */
export const getProgressColor = (percentage) => {
  if (percentage < 25) return 'text-red-400';
  if (percentage < 50) return 'text-yellow-400';
  if (percentage < 75) return 'text-blue-400';
  return 'text-green-400';
};

/**
 * Filtra canciones por múltiples criterios
 * @param {Array} songs - Array de canciones
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} genre - Género seleccionado
 * @param {number} year - Año de filtro (opcional)
 * @returns {Array} Canciones filtradas
 */
export const filterSongs = (songs, searchTerm = '', genre = 'all', year = null) => {
  let filteredSongs = [...songs];

  // Filtrar por término de búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredSongs = filteredSongs.filter(song => 
      song.title.toLowerCase().includes(term) || 
      song.artist.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term)
    );
  }

  // Filtrar por género
  if (genre && genre !== 'all') {
    filteredSongs = filteredSongs.filter(song => 
      song.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  // Filtrar por año
  if (year) {
    filteredSongs = filteredSongs.filter(song => song.year === year);
  }

  return filteredSongs;
};

/**
 * Ordena canciones por diferentes criterios
 * @param {Array} songs - Array de canciones
 * @param {string} sortBy - Criterio de ordenamiento
 * @param {string} order - Orden (asc/desc)
 * @returns {Array} Canciones ordenadas
 */
export const sortSongs = (songs, sortBy = 'title', order = 'asc') => {
  const sortedSongs = [...songs];
  
  sortedSongs.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];
    
    // Manejar diferentes tipos de datos
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (order === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
  
  return sortedSongs;
};

/**
 * Obtiene canciones aleatorias de un array
 * @param {Array} songs - Array de canciones
 * @param {number} count - Número de canciones a retornar
 * @returns {Array} Canciones aleatorias
 */
export const getRandomSongs = (songs, count = 5) => {
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Calcula estadísticas de una lista de canciones
 * @param {Array} songs - Array de canciones
 * @returns {Object} Estadísticas
 */
export const getSongStats = (songs) => {
  if (!songs || songs.length === 0) {
    return {
      totalSongs: 0,
      genres: [],
      averageYear: 0,
      totalDuration: '0:00'
    };
  }

  const genres = [...new Set(songs.map(song => song.genre))];
  const years = songs.map(song => song.year).filter(year => year);
  const averageYear = years.length > 0 ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : 0;
  
  // Calcular duración total (asumiendo formato MM:SS)
  const totalMinutes = songs.reduce((total, song) => {
    if (song.duration) {
      const [minutes, seconds] = song.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }
    return total;
  }, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const totalDuration = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:00` : `${minutes}:00`;

  return {
    totalSongs: songs.length,
    genres: genres.length,
    averageYear,
    totalDuration
  };
};

/**
 * Convierte texto a formato de URL amigable
 * @param {string} text - Texto a convertir
 * @returns {string} Slug de URL
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios con guiones
    .replace(/^-+|-+$/g, ''); // Remover guiones del inicio y final
};

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formatea números con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};

/**
 * Calcula tiempo transcurrido desde una fecha
 * @param {Date|string} date - Fecha inicial
 * @returns {string} Tiempo transcurrido
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `Hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} true si fue exitoso
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} true si es móvil
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Genera colores aleatorios para gradientes
 * @returns {Object} Colores from y to para gradientes
 */
export const getRandomGradient = () => {
  const colors = [
    'purple', 'pink', 'blue', 'indigo', 'cyan', 
    'teal', 'green', 'yellow', 'orange', 'red'
  ];
  
  const shades = ['400', '500', '600'];
  
  const fromColor = colors[Math.floor(Math.random() * colors.length)];
  let toColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Asegurar que los colores sean diferentes
  while (toColor === fromColor) {
    toColor = colors[Math.floor(Math.random() * colors.length)];
  }
  
  const fromShade = shades[Math.floor(Math.random() * shades.length)];
  const toShade = shades[Math.floor(Math.random() * shades.length)];
  
  return {
    from: `${fromColor}-${fromShade}`,
    to: `${toColor}-${toShade}`,
    class: `from-${fromColor}-${fromShade} to-${toColor}-${toShade}`
  };
};