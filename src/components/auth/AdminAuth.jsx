import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AdminAuth = ({ onLogin, onRegister, onSwitchToCustomer, error }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    try {
      await onLogin(credentials);
    } catch (error) {
      throw error; // Re-throw para que Login maneje el error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      await onRegister(data);
    } catch (error) {
      throw error; // Re-throw para que Register maneje el error
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  if (mode === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
        onSwitchToCustomer={onSwitchToCustomer}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={switchToRegister}
      onSwitchToCustomer={onSwitchToCustomer}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default AdminAuth;