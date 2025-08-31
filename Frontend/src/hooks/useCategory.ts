import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";
import axiosClient from "../utils/axiosClient";
import { Category } from "../types/category";
import { CreateCategoryData, UpdateCategoryData } from "../validation/categorySchema";

export const useCategory = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  // Fetch all categories
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosClient.get("/categories");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
    gcTime: 1000 * 60 * 60 * 2, // 2 hours garbage collection
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await axiosClient.post("/categories", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification("success", "Category created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to create category";
      addNotification("error", errorMessage);
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryData }) => {
      const response = await axiosClient.put(`/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification("success", "Category updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update category";
      addNotification("error", errorMessage);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await axiosClient.delete(`/categories/${categoryId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      addNotification("success", "Category deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to delete category";
      addNotification("error", errorMessage);
    },
  });

  // RBAC checks
  const canModify = user?.role === "admin";
  const canRead = user?.role === "admin" || user?.role === "user" || user?.role === "read-only";

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    canModify,
    canRead,
  };
};
