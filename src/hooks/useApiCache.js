import { useState, useEffect, useCallback, useRef } from 'react';

// Hook para cachear resultados de API
export const useApiCache = (cacheKey, fetchFunction, dependencies = [], ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const fetchData = useCallback(async (force = false) => {
    // Verificar cache si no se fuerza la actualización
    if (!force && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        setData(cached.data);
        return cached.data;
      } else {
        // Remover cache expirado
        cacheRef.current.delete(cacheKey);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);

      // Guardar en cache
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFunction, ttl]);

  // Limpiar cache específico
  const clearCache = useCallback(() => {
    cacheRef.current.delete(cacheKey);
    setData(null);
  }, [cacheKey]);

  // Limpiar todo el cache
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
    setData(null);
  }, []);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    clearCache,
    clearAllCache
  };
};

// Hook para debounce de búsquedas
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttling de funciones
export const useThrottle = (callback, delay = 100) => {
  const lastRan = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }, [callback, delay]);
};