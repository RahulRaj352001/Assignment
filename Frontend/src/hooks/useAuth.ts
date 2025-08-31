import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthContext";
import { LoginFormInputs, RegisterFormInputs } from "../types/auth";
import { User } from "../types/auth.d";
import axiosClient from "../utils/axiosClient";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Login mutation
  const loginMutation = useMutation<
    { token: string; user: User },
    Error,
    LoginFormInputs
  >({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axiosClient.post("/auth/login", data);
      return response.data.data;
    },
  });

  // Register mutation
  const registerMutation = useMutation<
    { token: string; user: User },
    Error,
    Omit<RegisterFormInputs, "confirmPassword">
  >({
    mutationFn: async (data: Omit<RegisterFormInputs, "confirmPassword">) => {
      const response = await axiosClient.post("/auth/register", data);
      return response.data.data;
    },
  });

  return {
    ...context,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
