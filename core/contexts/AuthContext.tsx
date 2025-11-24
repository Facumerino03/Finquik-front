import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.error("Error restoring token:", e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authActions = {
    login: async (credentials: any) => {
      const response = await api.post("/api/auth/login", credentials);
      const { accessToken } = response.data;
      await SecureStore.setItemAsync("userToken", accessToken);
      setUserToken(accessToken);
    },
    register: async (userData: any) => {
      await api.post("/api/auth/register", userData);
      await authActions.login({
        email: userData.email,
        password: userData.password,
      });
    },
    logout: async () => {
      await SecureStore.deleteItemAsync("userToken");
      setUserToken(null);
    },
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, ...authActions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
