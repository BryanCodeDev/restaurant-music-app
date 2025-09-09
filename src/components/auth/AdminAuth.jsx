import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AdminAuth = ({ onLogin, onRegister, onSwitchToCustomer }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const handleLogin = async (credentials) => {
    try {
      await onLogin(credentials);
    } catch (error) {
      throw error; // Re-throw para que Login maneje el error
    }
  };

  const handleRegister = async (data) => {
    try {
      await onRegister(data);
    } catch (error) {
      throw error; // Re-throw para que Register maneje el error
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
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={switchToRegister}
      onSwitchToCustomer={onSwitchToCustomer}
    />
  );
};

export default AdminAuth;