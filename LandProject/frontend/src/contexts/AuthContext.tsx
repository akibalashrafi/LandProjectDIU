import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'CITIZEN' | 'ADMIN' | 'REVIEWER';
  address?: string;
  nidMasked?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  quickLogin: (roleOrPhone: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('landsure_token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (phone: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed.');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('landsure_token', data.token);
  };

  /**
   * Fast one-click login for demo / presentation scenarios
   */
  const quickLogin = async (roleOrPhone: string) => {
    let phone = '01711000001';
    let pass = 'Password123!';

    if (roleOrPhone === 'ADMIN' || roleOrPhone === '01811000001') {
      phone = '01811000001';
      pass = 'AdminPassword123!';
    } else if (roleOrPhone === 'REVIEWER' || roleOrPhone === '01911000001') {
      phone = '01911000001';
      pass = 'ReviewerPassword123!';
    } else if (roleOrPhone === 'BUYER' || roleOrPhone === '01711000002') {
      phone = '01711000002';
      pass = 'Password123!';
    }

    await login(phone, pass);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('landsure_token');
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
