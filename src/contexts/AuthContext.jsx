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
  CLEAR_ERROR: 'CLEAR_ERROR'
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
  error: null
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
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType || USER_TYPES.GUEST,
        isAuthenticated: !!action.payload.user,
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
        isAuthenticated: state.isAuthenticated
      }));
    }
  }, [state.user, state.userType, state.appMode, state.currentStep, state.selectedRestaurant, state.isAuthenticated, state.isLoading]);

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Verificar sesión guardada
      const savedState = localStorage.getItem('auth_state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState.isAuthenticated && parsedState.user) {
            // Validar token con el backend
            const profileResponse = await apiService.getProfile();
            if (profileResponse.success && profileResponse.data) {
              dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: {
                  user: profileResponse.data,
                  userType: parsedState.userType
                }
              });

              // Restaurar estado de la aplicación
              dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: parsedState.appMode });
              dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: parsedState.currentStep });
              dispatch({ type: AUTH_ACTIONS.SET_SELECTED_RESTAURANT, payload: parsedState.selectedRestaurant });
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
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

    } catch (error) {
      console.error('Error initializing auth:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Error al inicializar la aplicación' });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      let result;
      let userType = credentials.userType || USER_TYPES.REGISTERED;

      switch (userType) {
        case USER_TYPES.RESTAURANT:
          result = await apiService.loginRestaurant(credentials.email, credentials.password);
          break;
        case USER_TYPES.SUPERADMIN:
          result = await apiService.loginUser(credentials.email, credentials.password);
          break;
        default:
          result = await apiService.loginUser(credentials.email, credentials.password);
          break;
      }

      if (result && (result.success || result.access_token || result.user || result.data)) {
        let userData = result.data?.user || result.user || result.data || result;

        // Si no tenemos datos completos del usuario, intentar obtener perfil adicional
        if (!userData.id && !userData.email) {
          try {
            const profileResponse = await apiService.getProfile();
            if (profileResponse.success && profileResponse.data) {
              if (userType === USER_TYPES.RESTAURANT) {
                userData = { ...userData, ...profileResponse.data, restaurant: profileResponse.data.restaurant || userData.restaurant };
              } else {
                userData = { ...userData, ...profileResponse.data, user: profileResponse.data.user || userData };
              }
            }
          } catch (profileError) {
            console.warn('Could not fetch profile:', profileError);
            // Si no podemos obtener el perfil, usar los datos del login
            if (!userData.id) {
              userData = {
                ...userData,
                id: userData.id || Date.now(), // Fallback ID
                email: userData.email || credentials.email
              };
            }
          }
        }

        // Asegurar que tenemos datos mínimos del usuario
        if (!userData.id) {
          userData.id = userData.id || Date.now();
        }
        if (!userData.email) {
          userData.email = userData.email || credentials.email;
        }

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: userData, userType }
        });

        // Determinar siguiente paso
        let nextStep = 'restaurant-selection';
        let nextAppMode = APP_MODES.CUSTOMER;

        if (userType === USER_TYPES.SUPERADMIN || userData.role === USER_TYPES.SUPERADMIN) {
          nextStep = 'superadmin-panel';
          nextAppMode = APP_MODES.ADMIN;
        } else if (userType === USER_TYPES.RESTAURANT) {
          nextStep = 'restaurant-panel';
          nextAppMode = APP_MODES.ADMIN;
        }

        dispatch({ type: AUTH_ACTIONS.SET_APP_MODE, payload: nextAppMode });
        dispatch({ type: AUTH_ACTIONS.SET_CURRENT_STEP, payload: nextStep });

        return { success: true, userType, nextStep };
      } else {
        throw new Error(result?.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de conexión. Verifica tus credenciales.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
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

        // Si no tenemos datos completos del usuario, intentar obtener perfil adicional
        if (!user.id && !user.email) {
          try {
            const profileResponse = await apiService.getProfile();
            if (profileResponse.success && profileResponse.data) {
              if (userType === USER_TYPES.RESTAURANT) {
                user = { ...user, ...profileResponse.data, restaurant: profileResponse.data.restaurant || user.restaurant };
              } else {
                user = { ...user, ...profileResponse.data, user: profileResponse.data.user || user };
              }
            }
          } catch (profileError) {
            console.warn('Could not fetch profile after register:', profileError);
            // Si no podemos obtener el perfil, usar los datos del registro
            if (!user.id) {
              user = {
                ...user,
                id: user.id || Date.now(), // Fallback ID
                email: user.email || userData.email
              };
            }
          }
        }

        // Asegurar que tenemos datos mínimos del usuario
        if (!user.id) {
          user.id = user.id || Date.now();
        }
        if (!user.email) {
          user.email = user.email || userData.email;
        }

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
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    apiService.clearSession();
    localStorage.removeItem('auth_state');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
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