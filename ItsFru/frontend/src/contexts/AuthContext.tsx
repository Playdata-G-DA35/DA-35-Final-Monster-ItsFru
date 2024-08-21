import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_mileage: number;
  used_mileage: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData: User = response.data;
      setUser(userData);
    } catch (error) {
      throw error; // 에러 발생 시 단순히 에러를 던집니다.
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        await fetchUserInfo(access_token);
        setIsAuthenticated(true);
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      throw error; // 에러 발생 시 단순히 에러를 던집니다.
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (newUserData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...newUserData } : null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};