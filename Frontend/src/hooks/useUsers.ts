import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";
import axiosClient from "../utils/axiosClient";
import { User, CreateUserInput, UpdateUserInput } from "../types/user";
import { UpdateUserRoleData } from "../validation/userSchema";

export const useUsers = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  // Fetch all users (admin only)
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosClient.get("/users");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    enabled: !authLoading && !!user && user.role === "admin", // Only fetch if auth is loaded, user exists and is admin
  });

  // Create user mutation (admin only)
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await axiosClient.post("/users", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addNotification("success", "User created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to create user";
      addNotification("error", errorMessage);
    },
  });

  // Update user mutation (admin only)
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      const response = await axiosClient.put(`/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addNotification("success", "User updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update user";
      addNotification("error", errorMessage);
    },
  });

  // Update user role mutation (admin only)
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRoleData }) => {
      const response = await axiosClient.put(`/users/${id}/role`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addNotification("success", "User role updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update user role";
      addNotification("error", errorMessage);
    },
  });

  // Delete user mutation (admin only)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addNotification("success", "User deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to delete user";
      addNotification("error", errorMessage);
    },
  });

  // RBAC checks
  const canManageUsers = !authLoading && !!user && user.role === "admin";
  const canReadUsers = !authLoading && !!user && user.role === "admin";

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    updateUserRole: updateUserRoleMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    canManageUsers,
    canReadUsers,
  };
};
