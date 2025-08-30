import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryForm from "../../components/categories/CategoryForm";
import DeleteCategoryModal from "../../components/categories/DeleteCategoryModal";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../types/category";

const CategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // RBAC checks
  const canModify = user?.role === "admin" || user?.role === "user";
  const isReadOnly = user?.role === "read-only";

  // React Query: Fetch categories with 1 hour cache
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: "1", name: "Food & Dining", type: "expense" },
        { id: "2", name: "Transportation", type: "expense" },
        { id: "3", name: "Entertainment", type: "expense" },
        { id: "4", name: "Shopping", type: "expense" },
        { id: "5", name: "Bills & Utilities", type: "expense" },
        { id: "6", name: "Salary", type: "income" },
        { id: "7", name: "Freelance", type: "income" },
        { id: "8", name: "Investments", type: "income" },
      ];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
    gcTime: 1000 * 60 * 60 * 2, // 2 hours garbage collection
  });

  // React Query: Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newCategory: Category = {
        id: Date.now().toString(),
        ...data,
      };
      return newCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category created successfully!");
    },
    onError: (error) => {
      alert(`Failed to create category: ${error.message}`);
    },
  });

  // React Query: Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: UpdateCategoryInput) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category updated successfully!");
    },
    onError: (error) => {
      alert(`Failed to update category: ${error.message}`);
    },
  });

  // React Query: Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category deleted successfully!");
    },
    onError: (error) => {
      alert(`Failed to delete category: ${error.message}`);
    },
  });

  // Event handlers
  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  const handleDeleteCategory = useCallback((category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateCategoryInput) => {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          ...data,
        });
      } else {
        await createCategoryMutation.mutateAsync(data);
      }
    },
    [editingCategory, updateCategoryMutation, createCategoryMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingCategory) {
      await deleteCategoryMutation.mutateAsync(deletingCategory.id);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    }
  }, [deletingCategory, deleteCategoryMutation]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  // Error component
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={() => refetch()}
        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Try again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your income and expense categories
          </p>
        </div>
        {canModify && (
          <button
            onClick={handleAddCategory}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Category
          </button>
        )}
      </div>

      {/* Role-based info banner */}
      {isReadOnly && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <div className="flex">
            <svg
              className="w-5 h-5 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">
              <strong>Read-only mode:</strong> You can view categories but
              cannot create, edit, or delete them.
            </span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <ErrorBanner message="Failed to load categories. Please try again." />
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* Category Form Modal */}
      <CategoryForm
        category={editingCategory}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isSubmitting={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        category={deletingCategory}
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCategoryMutation.isPending}
      />
    </div>
  );
};

export default CategoriesPage;
