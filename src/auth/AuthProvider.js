import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import apiClient, {
  clearAccessToken,
  refreshAccessToken,
  setAccessToken,
  setSessionExpiredHandler,
} from '../services/Apis/client';


const AuthContext = createContext(null);

export const authenticatedUserFromResponse = (response) => response?.data?.data?.user ?? null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = useCallback((expired = false) => {
    clearAccessToken();
    setUser(null);
    setSessionExpired(expired);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => clearSession(true));
    return () => setSessionExpiredHandler(null);
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        await refreshAccessToken();
        const response = await apiClient.get('/auth/me');
        if (active) setUser(authenticatedUserFromResponse(response));
      } catch {
        if (active) clearSession(false);
      } finally {
        if (active) setIsBootstrapping(false);
      }
    };
    restoreSession();
    return () => { active = false; };
  }, [clearSession]);

  const login = useCallback(async (emailId, password) => {
    const response = await apiClient.post('/auth/login', { emailId, password });
    const data = response.data.data;
    const authenticatedUser = authenticatedUserFromResponse(response);
    setAccessToken(data.accessToken);
    setUser(authenticatedUser);
    setSessionExpired(false);
    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearSession(false);
    }
  }, [clearSession]);

  const passwordChanged = useCallback(() => clearSession(false), [clearSession]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isBootstrapping,
    sessionExpired,
    login,
    logout,
    passwordChanged,
  }), [user, isBootstrapping, sessionExpired, login, logout, passwordChanged]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
