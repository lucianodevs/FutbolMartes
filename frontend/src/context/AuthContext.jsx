import { createContext, useEffect, useState } from 'react';
import { loginRequest, profileRequest } from '@/services/authService';
import { setAuthToken } from '@/services/http';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('futbol_stats_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('futbol_stats_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(storedToken);
        const profile = await profileRequest();
        setUser(profile);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('futbol_stats_token');
        setAuthToken(null);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const result = await loginRequest(credentials);
    localStorage.setItem('futbol_stats_token', result.token);
    setAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    localStorage.removeItem('futbol_stats_token');
    setAuthToken(null);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
