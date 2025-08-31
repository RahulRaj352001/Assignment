import { useMutation } from "@tanstack/react-query";
import { LoginFormInputs } from "../types/auth";
import { User } from "../types/auth.d";
import axiosClient from "../utils/axiosClient";

export function useLogin() {
  return useMutation<
    { token: string; user: User },
    Error,
    LoginFormInputs
  >({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axiosClient.post("/auth/login", data);
      return response.data;
    }
  });
}
