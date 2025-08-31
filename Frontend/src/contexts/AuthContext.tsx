import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosClient from "../utils/axiosClient";
import { AuthState, User } from "../types/auth.d";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string, user: User) => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  // Fetch current user profile from backend
  const refreshUser = useCallback(async () => {
    if (!state.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching user profile with token:", state.token);
      const { data } = await axiosClient.get("/users/profile/me");
      console.log("User profile response:", data);

      if (data && data.data) {
        setState((prev) => ({
          ...prev,
          user: data.data,
          isAuthenticated: true,
        }));
        console.log("User profile set successfully:", data.data);
      } else {
        console.error("Invalid user profile data structure:", data);
        logout();
      }
    } catch (error: any) {
      console.error("Failed to fetch user profile:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [state.token, logout]);

  useEffect(() => {
    if (state.token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [state.token, refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await axiosClient.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, token: data.token, isAuthenticated: true });
  };

  const loginWithToken = useCallback((token: string, user: User) => {
    console.log(user, token);
    localStorage.setItem("token", token);
    setState({ user, token, isAuthenticated: true });
    console.log("Login successful:", { user, token, isAuthenticated: true }); // Debug log
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const { data } = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, token: data.token, isAuthenticated: true });
  };

  const refreshToken = async () => {
    try {
      const { data } = await axiosClient.post("/auth/refresh");
      localStorage.setItem("token", data.token);
      setState((prev) => ({ ...prev, token: data.token }));
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithToken,
        register,
        logout,
        refreshUser,
        refreshToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
