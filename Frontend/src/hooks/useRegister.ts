import { useMutation } from "@tanstack/react-query";
import { RegisterFormInputs } from "../types/auth";
import { User } from "../types/auth.d";
import axiosClient from "../utils/axiosClient";

export function useRegister() {
  return useMutation<
    { token: string; user: User },
    Error,
    Omit<RegisterFormInputs, "confirmPassword">
  >({
    mutationFn: async (data: Omit<RegisterFormInputs, "confirmPassword">) => {
      const response = await axiosClient.post("/auth/register", data);
      return response.data.data;
    }
  });
}
