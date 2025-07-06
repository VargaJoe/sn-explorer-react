import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import sensenetService from './services/sensenet';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<{
  user: any;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get current user on mount
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const user = await sensenetService.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await sensenetService.login(username, password);
      const user = await sensenetService.getCurrentUser();
      setUser(user);
    } catch (e: any) {
      setError('Login failed. Please check your credentials.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await sensenetService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {isLoading ? null : user ? children : <LoginForm onLogin={login} isLoading={isLoading} error={error} />}
    </AuthContext.Provider>
  );
};
