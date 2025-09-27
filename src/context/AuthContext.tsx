'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getTokensFromLocalStorage, setTokensInLocalStorage } from '@utils/tokenUtils';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string | null, refresh: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const { accessToken, refreshToken } = getTokensFromLocalStorage();
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  }, []);

  const setTokens = (access: string | null, refresh: string | null) => {
    setTokensInLocalStorage(access, refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
