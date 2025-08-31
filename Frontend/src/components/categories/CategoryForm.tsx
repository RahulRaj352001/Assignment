import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Category } from "../../types/category";
import { useAuth } from "../../hooks/useAuth";
import {
  categorySchema,
  CategoryFormData,
} from "../../validation/categorySchema";

interface CategoryFormProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, "id">) => Promise<void>;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { user } = useAuth();
  const canModify = user?.role === "admin" || user?.role === "user";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name || "",
      type: category?.type || "expense",
    },
  });

  // Reset form when category changes (for edit mode)
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        type: category.type,
      });
    } else {
      reset({
        name: "",
        type: "expense",
      });
    }
  }, [category, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCancel}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {category ? "Edit Category" : "Add New Category"}
                </h3>
                <div className="mt-4">
                  <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                  >
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category Name
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        id="name"
                        disabled={!canModify}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        } ${
                          !canModify ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter category name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Type Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            {...register("type")}
                            type="radio"
                            value="expense"
                            disabled={!canModify}
                            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
                              !canModify ? "cursor-not-allowed" : ""
                            }`}
                          />
                          <span
                            className={`ml-2 text-sm ${
                              !canModify ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            💸 Expense
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register("type")}
                            type="radio"
                            value="income"
                            disabled={!canModify}
                            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
                              !canModify ? "cursor-not-allowed" : ""
                            }`}
                          />
                          <span
                            className={`ml-2 text-sm ${
                              !canModify ? "text-gray-400" : "text-gray-700"
                            }`}
                          >
                            💰 Income
                          </span>
                        </label>
                      </div>
                      {errors.type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.type.message}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={!canModify || isSubmitting || !isValid}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                canModify && !isSubmitting && isValid
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {category ? "Updating..." : "Creating..."}
                </div>
              ) : category ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
