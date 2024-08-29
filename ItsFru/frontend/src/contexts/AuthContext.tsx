import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

// 인터페이스 정의
export interface User {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  total_mileage: number;
  used_mileage: number;
  membership_tier: string;
  sms_consent: boolean;
}

interface JwtPayload {
  exp: number;
  sub: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

interface ErrorResponse {
  detail: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  withdrawAccount: () => Promise<void>;
  refreshToken: () => Promise<void>;
  verifyPassword: (password: string) => Promise<boolean>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const secureStorage = {
  setToken: (token: string) => localStorage.setItem('accessToken', token),
  getToken: (): string | null => localStorage.getItem('accessToken'),
  removeToken: () => localStorage.removeItem('accessToken'),
  setRefreshToken: (token: string) => localStorage.setItem('refreshToken', token),
  getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),
  removeRefreshToken: () => localStorage.removeItem('refreshToken'),
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const getToken = useCallback(() => {
    return secureStorage.getToken();
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    secureStorage.removeToken();
    secureStorage.removeRefreshToken();
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = secureStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token found');
  
      const response = await api.post<LoginResponse>('/refresh-token', { refresh_token: refreshToken });
      const { access_token, refresh_token, user: userData } = response.data;
      secureStorage.setToken(access_token);
      secureStorage.setRefreshToken(refresh_token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const response = await api.get<User>('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      logout();
    }
  }, [logout]);

  const initAuth = useCallback(async () => {
    const token = secureStorage.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          await fetchUserInfo(token);
        } else {
          await refreshToken();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      }
    }
  }, [fetchUserInfo, refreshToken, logout]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshToken();
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  const handleApiError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(axiosError.response?.data?.detail || defaultMessage);
    }
    throw new Error(defaultMessage);
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      const { access_token, refresh_token, user: userData } = response.data;
      secureStorage.setToken(access_token);
      secureStorage.setRefreshToken(refresh_token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      handleApiError(error, 'Login failed');
    }
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const token = secureStorage.getToken();
      const response = await api.post('/verify-password', { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  };

  const updateUser = async (newUserData: Partial<User>) => {
    try {
      const response = await api.put<User>('/users/me', newUserData);
      setUser(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to update user information');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.post('/change-password', { current_password: currentPassword, new_password: newPassword });
    } catch (error) {
      handleApiError(error, 'Failed to change password');
    }
  };

  const withdrawAccount = async () => {
    try {
      await api.post('/withdraw');
      logout();
    } catch (error) {
      handleApiError(error, 'Failed to withdraw account');
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
    changePassword,
    withdrawAccount,
    refreshToken,
    verifyPassword,
    getToken
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};