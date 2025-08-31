import React, { useState, useCallback } from "react";
import { useCategory } from "../../hooks/useCategory";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryForm from "../../components/categories/CategoryForm";
import DeleteCategoryModal from "../../components/categories/DeleteCategoryModal";
import { Category } from "../../types/category";

const CategoriesPage: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
    canModify,
    canRead,
  } = useCategory();

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Callback handlers for performance optimization
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
    async (categoryData: Omit<Category, "id">) => {
      try {
        if (editingCategory) {
          await updateCategory({ id: editingCategory.id, data: categoryData });
        } else {
          await createCategory(categoryData);
        }

        setIsFormOpen(false);
        setEditingCategory(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    },
    [editingCategory, createCategory, updateCategory]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingCategory) {
      try {
        await deleteCategory(deletingCategory.id);
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  }, [deletingCategory, deleteCategory]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  }, []);

  if (!canRead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to view categories.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Categories
          </h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          {canModify && (
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Category
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-2">
          Manage your income and expense categories
        </p>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <CategoryTable
          categories={categories}
          onEdit={canModify ? handleEditCategory : () => {}}
          onDelete={canModify ? handleDeleteCategory : () => {}}
        />
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        category={deletingCategory}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CategoriesPage;
