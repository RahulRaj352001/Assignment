import { useMutation } from "@tanstack/react-query";
import { LoginFormInputs } from "../types/auth";
import { User } from "../types/auth.d";

export function useLogin() {
  return useMutation<
    { token: string; user: User },
    Error,
    LoginFormInputs
  >({
    mutationFn: async (data: LoginFormInputs) => {
      // Simulate API request with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (data.email === "demo@demo.com" && data.password === "password") {
        return { 
          token: "demo-token", 
          user: { id: "1", email: data.email, name: "Demo User", role: "user" } 
        };
      } else {
        throw new Error("Invalid credentials");
      }
    }
  });
}
