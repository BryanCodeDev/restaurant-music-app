import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/apiService';

// Estados de autenticación
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Tipos de usuario
const USER_TYPES = {
  GUEST: 'guest',
  REGISTERED: 'registered',
  RESTAURANT: 'restaurant',
  SUPERADMIN: 'superadmin'
};

// Estados de la aplicación
const APP_MODES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  SET_APP_MODE: 'SET_APP_MODE',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_SELECTED_RESTAURANT: 'SET_SELECTED_RESTAURANT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_SUCCESS_MESSAGE: 'CLEAR_SUCCESS_MESSAGE'
};

// Estado inicial
const initialState = {
  user: null,
  userType: USER_TYPES.GUEST,
  appMode: APP_MODES.CUSTOMER,
  currentStep: 'restaurant-selection',
  selectedRestaurant: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  successMessage: null
};

// Reducer de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      const user = action.payload.user;
      const userType = action.payload.userType || USER_TYPES.GUEST;

      console.log('Setting user in reducer:', user);
      console.log('User type:', userType);

      return {
        ...state,
        user: user,
        userType: userType,
        isAuthenticated: !!user,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case AUTH_ACTIONS.SET_APP_MODE:
      return {
        ...state,
        appMode: action.payload
      };

    case AUTH_ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case AUTH_ACTIONS.SET_SELECTED_RESTAURANT:
      return {
        ...state,
        selectedRestaurant: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload
      };

    case AUTH_ACTIONS.CLEAR_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: null
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar aplicación
  useEffect(() => {
    initializeAuth();
  }, []);

  // Persistir estado en localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('auth_state', JSON.stringify({
        user: state.user,
        userType: state.userType,
        appMode: state.appMode,
        currentStep: state.currentStep,
        selectedRestaurant: state.selectedRestaurant,
        isAuthenticated: state.isAuthenticated,
        successMessage: state.successMessage
      }));
    }
  }, [state.user, state.userType, state.appMode, state.currentStep, state.selectedRestaurant, state.isAuthenticated, state.isLoading, state.successMessage]);

  // Debug logging para el estado de autenticación
  useEffect(() => {
    console.log('AuthContext - Estado actualizado:', {
      user: state.user ? { id: state.user.id, name: state.user.name, email: state.user.email } : null,
      userType: state.userType,
      isAuthenticated: state.isAuthenticated,
      appMode: state.appMode,
      currentStep: state.currentStep,
      selectedRestaurant: state.selectedRestaurant ? { id: state.selectedRestaurant.id, name: state.selectedRestaurant.name } : null,
      successMessage: state.successMessage
    });
  }, [state.user, state.userType, state.isAuthenticated, state.appMode, state.currentStep, state.selectedRestaurant, state.successMessage]);

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Verificar sesión guardada
      const savedState = localStorage.getItem('auth_state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState.isAuthenticated && parsedState.user) {
            // Verificar si el token existe y no ha expirado
            const token = localStorage.getItem('token') || localStorage.getItem('access_token');
            if (token) {
              // Intentar validar el token con un timeout para evitar bloqueos
              try {
                const profilePromise = apiService.getProfile();
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Profile validation timeout')), 5000)
                );

                const profileResponse = await Promise.race([profilePromise, timeoutPromise]);

                if (profileResponse.success && profileResponse.data) {
                  dispatch({
                    type: AUTH_ACTIONS.SET_USER,
                    payload: {
                      user: profileResponse.data,
                      userType: parsedState.userType
                    }
                  });
                } else {
                  // Si falla la validación, usar los datos guardados
                  dispatch({
                    type: AUTH_ACTIONS.SET_USER,
                    payload: {
                      user: parsedState.user,
                      userType: parsedState.userType
                    }
                  });
                }
              } catch (profileError) {
                // Si hay error (rate limiting, timeout, etc.), usar los datos guardados
                console.warn('Profile validation failed, using saved data:', profileError);
                dispatch({
                  type: AUTH_ACTIONS.SET_USER,
                  payload: {
                    user: parsedState.user,
                    userType: parsedState.userType
                  }
                });
              }

              // Restaurar estado de la aplicación
              dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: parsedState.appMode });
              dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: parsedState.currentStep });
              dispatch({ type: AUTH_ACTIONS.SET_SELECTED_RESTAURANT, payload: parsedState.selectedRestaurant });
              if (parsedState.successMessage) {
                dispatch({ type: AUTH_ACTIONS.SET_SUCCESS_MESSAGE, payload: parsedState.successMessage });
              }
              return;
            }
          }
        } catch (error) {
          console.warn('Error parsing saved auth state:', error);
          localStorage.removeItem('auth_state');
        }
      }

      // Si no hay sesión válida, estado inicial
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: null, userType: USER_TYPES.GUEST } });

    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Error al inicializar la aplicación' });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      let result;
      let userType = credentials.userType || USER_TYPES.REGISTERED;

      console.log('AuthContext - Iniciando login con:', { email: credentials.email, userType });

      // Agregar timeout para evitar que se quede colgado
      const loginPromise = (() => {
        switch (userType) {
          case USER_TYPES.RESTAURANT:
            return apiService.loginRestaurant(credentials.email, credentials.password);
          case USER_TYPES.SUPERADMIN:
            return apiService.loginUser(credentials.email, credentials.password);
          default:
            return apiService.loginUser(credentials.email, credentials.password);
        }
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 10000)
      );

      result = await Promise.race([loginPromise, timeoutPromise]);

      if (result && (result.success || result.access_token || result.user || result.data)) {
        let userData = result.data?.user || result.user || result.data || result;

        console.log('AuthContext - Login result:', result);
        console.log('AuthContext - Extracted userData:', userData);

        // Validar que tenemos datos de usuario válidos
        if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
          throw new Error('No se recibieron datos de usuario válidos del servidor');
        }

        // Determinar el tipo de usuario basado en los datos recibidos
        let finalUserType = userType;

        // Si es un usuario registrado, verificar si es superadmin
        if (userType === USER_TYPES.REGISTERED) {
          if (userData.role === 'superadmin' || userData.is_superadmin) {
            finalUserType = USER_TYPES.SUPERADMIN;
          }
        }

        // Si es un restaurante, verificar si es superadmin
        if (userType === USER_TYPES.RESTAURANT) {
          if (userData.role === 'superadmin' || userData.is_superadmin) {
            finalUserType = USER_TYPES.SUPERADMIN;
          }
        }

        // Obtener perfil adicional (solo si es necesario)
        if (finalUserType === USER_TYPES.RESTAURANT) {
          try {
            const profilePromise = apiService.getProfile();
            const profileTimeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );

            const profileResponse = await Promise.race([profilePromise, profileTimeoutPromise]);
            console.log('AuthContext - Profile response:', profileResponse);
            if (profileResponse.success && profileResponse.data) {
              userData = { ...userData, restaurant: profileResponse.data.restaurant || userData.restaurant };
            }
          } catch (profileError) {
            console.warn('AuthContext - Could not fetch restaurant profile:', profileError);
            // No lanzar error aquí, continuar con los datos que tenemos
          }
        }

        console.log('AuthContext - Final userData before dispatch:', userData);
        console.log('AuthContext - Final userType:', finalUserType);

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: userData, userType: finalUserType }
        });

        // Determinar siguiente paso basado en el tipo de usuario
        let nextStep = 'restaurant-selection';
        let nextAppMode = APP_MODES.CUSTOMER;

        if (finalUserType === USER_TYPES.SUPERADMIN) {
          nextStep = 'superadmin-panel';
          nextAppMode = APP_MODES.ADMIN;
        } else if (finalUserType === USER_TYPES.RESTAURANT) {
          nextStep = 'restaurant-panel';
          nextAppMode = APP_MODES.ADMIN;
        } else if (finalUserType === USER_TYPES.REGISTERED) {
          // Usuario registrado normal - ir a selección de restaurante
          nextStep = 'restaurant-selection';
          nextAppMode = APP_MODES.CUSTOMER;
        }

        dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: nextAppMode });
        dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: nextStep });

        // Mostrar mensaje de éxito
        const successMessage = '¡Inicio de sesión exitoso! Bienvenido de vuelta.';
        dispatch({ type: AUTH_ACTIONS.SET_SUCCESS_MESSAGE, payload: successMessage });

        // Debug logging para verificar el estado después del login
        console.log('AuthContext - Login successful:', {
          user: userData,
          userType: finalUserType,
          isAuthenticated: true,
          nextStep,
          nextAppMode,
          successMessage
        });

        return { success: true, userType: finalUserType, nextStep, successMessage };
      } else {
        throw new Error(result?.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión. Verifica tus credenciales.';
      console.error('AuthContext - Login error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      let result;
      let userType = userData.userType || USER_TYPES.REGISTERED;

      switch (userType) {
        case USER_TYPES.RESTAURANT:
          result = await apiService.registerRestaurant(userData);
          break;
        default:
          result = await apiService.registerUser(userData);
          break;
      }

      if (result && (result.success || result.access_token || result.user || result.data)) {
        let user = result.data?.user || result.user || result.data || result;

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user, userType }
        });

        // Determinar siguiente paso
        let nextStep = 'restaurant-selection';
        let nextAppMode = APP_MODES.CUSTOMER;

        if (userType === USER_TYPES.RESTAURANT) {
          nextStep = 'admin-dashboard'; // Restaurante debe esperar aprobación
          nextAppMode = APP_MODES.ADMIN;
        }

        dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: nextAppMode });
        dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: nextStep });

        return { success: true, userType, nextStep };
      } else {
        throw new Error(result?.message || 'Error al registrar usuario');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar el usuario';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    console.log('AuthContext - Ejecutando logout...');
    try {
      // Limpiar sesión del API
      apiService.clearSession();

      // Limpiar localStorage
      localStorage.removeItem('auth_state');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('currentView');

      // Limpiar cookies si existen
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Resetear estado
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      console.log('AuthContext - Logout completado exitosamente');
    } catch (error) {
      console.error('AuthContext - Error durante logout:', error);
      // Forzar logout incluso si hay error
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const switchToAdminMode = () => {
    dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: APP_MODES.ADMIN });
    dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: 'admin-auth' });
  };

  const switchToCustomerMode = () => {
    dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: APP_MODES.CUSTOMER });
    dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: 'restaurant-selection' });
    dispatch({ type: AUTH_ACTIONS.SET_SELECTED_RESTAURANT, payload: null });
  };

  const selectRestaurant = (restaurant) => {
    dispatch({ type: AUTH_ACTIONS.SET_SELECTED_RESTAURANT, payload: restaurant });
    dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: 'music-app' });
  };

  const setCurrentStep = (step) => {
    dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: step });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const clearSuccessMessage = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_SUCCESS_MESSAGE });
  };

  const showSuccessMessage = (message) => {
    dispatch({ type: AUTH_ACTIONS.SET_SUCCESS_MESSAGE, payload: message });
  };

  const value = {
    // Estado
    ...state,

    // Acciones
    login,
    register,
    logout,
    switchToAdminMode,
    switchToCustomerMode,
    selectRestaurant,
    setCurrentStep,
    clearError,
    clearSuccessMessage,
    showSuccessMessage,

    // Constantes
    USER_TYPES,
    APP_MODES,
    AUTH_STATES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;