import { useState, useCallback } from 'react';

// Hook para manejar formularios de manera optimizada
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar un campo específico
  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Limpiar error si el campo ha sido tocado
    if (touched[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  }, [touched, errors]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((field, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  // Validar un campo específico
  const validateField = useCallback((field) => {
    const rules = validationRules[field];
    if (!rules) return true;

    const value = values[field];
    const fieldErrors = [];

    rules.forEach(rule => {
      if (rule.required && (!value || value.toString().trim() === '')) {
        fieldErrors.push(rule.message || 'Este campo es requerido');
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(rule.message || `Mínimo ${rule.minLength} caracteres`);
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(rule.message || `Máximo ${rule.maxLength} caracteres`);
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message || 'Formato inválido');
      }

      if (value && rule.custom && !rule.custom(value, values)) {
        fieldErrors.push(rule.message || 'Valor inválido');
      }
    });

    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors[0] : undefined
    }));

    return fieldErrors.length === 0;
  }, [values, validationRules]);

  // Validar todos los campos
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, errors]);

  // Manejar cambios en inputs
  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFieldValue(field, value);
  }, [setFieldValue]);

  // Manejar blur en inputs
  const handleBlur = useCallback((field) => () => {
    setFieldTouched(field, true);
    validateField(field);
  }, [setFieldTouched, validateField]);

  // Resetear formulario
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Setear múltiples valores
  const setValuesBatch = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Setear múltiples errores
  const setErrorsBatch = useCallback((newErrors) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    setValues: setValuesBatch,
    setErrors: setErrorsBatch,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    reset,
    setIsSubmitting
  };
};

// Hook para formularios con validación asíncrona
export const useAsyncForm = (initialValues = {}, validationRules = {}) => {
  const form = useForm(initialValues, validationRules);
  const [asyncErrors, setAsyncErrors] = useState({});

  const validateAsync = useCallback(async (field) => {
    const rules = validationRules[field];
    if (!rules) return true;

    const asyncRules = rules.filter(rule => rule.async);
    if (asyncRules.length === 0) return true;

    const value = form.values[field];
    const fieldErrors = [];

    for (const rule of asyncRules) {
      try {
        const isValid = await rule.validator(value, form.values);
        if (!isValid) {
          fieldErrors.push(rule.message || 'Valor inválido');
        }
      } catch (error) {
        fieldErrors.push(rule.message || 'Error de validación');
      }
    }

    setAsyncErrors(prev => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors[0] : undefined
    }));

    return fieldErrors.length === 0;
  }, [form.values, validationRules]);

  const getFieldError = useCallback((field) => {
    return form.errors[field] || asyncErrors[field];
  }, [form.errors, asyncErrors]);

  return {
    ...form,
    asyncErrors,
    validateAsync,
    getFieldError
  };
};