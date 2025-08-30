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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, isAuthenticated: false });
  }, []);

  // TODO: Implement real API call when backend is ready
  const refreshUser = useCallback(async () => {
    // For now, just set authenticated if token exists
    // try {
    //   const { data } = await axiosClient.get("/auth/me");
    //   setState((prev) => ({ ...prev, user: data.user, isAuthenticated: true }));
    // } catch (error) {
    //   logout();
    // }

    // Temporary: If token exists, assume user is authenticated
    if (state.token) {
      setState((prev) => ({ ...prev, isAuthenticated: true }));
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token) {
      refreshUser();
    }
  }, [state.token, refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await axiosClient.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setState({ user: data.user, token: data.token, isAuthenticated: true });
  };

  const loginWithToken = useCallback((token: string, user: User) => {
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

  return (
    <AuthContext.Provider
      value={{ ...state, login, loginWithToken, register, logout, refreshUser }}
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
