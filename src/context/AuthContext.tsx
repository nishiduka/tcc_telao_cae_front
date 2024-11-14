import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import api from '../services/api';
import UserEntity from '../domain/entity/userEntity';
import * as authServices from '../services/auth';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  user: UserEntity | null;
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  user: null,
  token: null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserEntity | null>(null);

  const retriveUser = useCallback(async () => {
    try {
      const currentUser = await authServices.getCurrentUser();
      setUser(currentUser);
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      retriveUser();
    }
    setIsLoading(false); // Define o carregamento como concluído
  }, [retriveUser]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    retriveUser();
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, token }}
    >
      {!isLoading ? children : <div>Carregando...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
