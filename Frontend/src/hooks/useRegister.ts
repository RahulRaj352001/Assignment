import { useMutation } from "@tanstack/react-query";
import { RegisterFormInputs } from "../types/auth";
import { User } from "../types/auth.d";

export function useRegister() {
  return useMutation<
    { token: string; user: User },
    Error,
    Omit<RegisterFormInputs, "confirmPassword">
  >({
    mutationFn: async (data: Omit<RegisterFormInputs, "confirmPassword">) => {
      // Simulate API request with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate registration logic
      if (data.email === "demo@demo.com") {
        throw new Error("Email already exists");
      }
      
      return { 
        token: "demo-token", 
        user: { id: "1", email: data.email, name: data.name, role: "user" } 
      };
    }
  });
}
