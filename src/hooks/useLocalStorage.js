import { useState } from 'react';

// Hook personalizado para manejar localStorage con estado
export const useLocalStorage = (key, initialValue) => {
  // Obtener valor inicial del localStorage o usar el valor por defecto
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value) => {
    try {
      // Permitir que value sea una función
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Guardar en el estado
      setStoredValue(valueToStore);

      // Guardar en localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Función para remover el valor
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook para valores booleanos en localStorage
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  const toggle = () => setValue(!value);

  return [value, setValue, toggle, removeValue];
};

// Hook para valores numéricos en localStorage
export const useLocalStorageNumber = (key, initialValue = 0) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  const increment = (amount = 1) => setValue(prev => Number(prev) + amount);
  const decrement = (amount = 1) => setValue(prev => Number(prev) - amount);

  return [Number(value), setValue, increment, decrement, removeValue];
};