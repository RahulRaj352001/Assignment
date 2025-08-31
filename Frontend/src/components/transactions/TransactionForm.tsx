import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../../types/transaction";
import {
  transactionSchema,
  TransactionFormData,
} from "../../validation/transactionSchema";
import { useCategory } from "../../hooks/useCategory";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/useAuth";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    transaction: CreateTransactionInput | UpdateTransactionInput
  ) => Promise<void>;
  transaction?: Transaction | null;
  isSubmitting: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  isSubmitting,
}) => {
  const { user } = useAuth();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategory();
  const { users } = useUsers();
  const isEditMode = !!transaction;
  const isAdmin = user?.role === "admin";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema),
    mode: "onChange",
    defaultValues: {
      user_id: user?.id || "",
      category_id: 0,
      type: "expense",
      amount: 0,
      description: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  const watchType = watch("type");

  // For now, show all categories since backend doesn't have type field yet
  // TODO: Add type field to backend categories and restore filtering
  const filteredCategories = categories;

  // Reset form when transaction changes (for edit mode)
  useEffect(() => {
    if (transaction) {
      reset({
        user_id: transaction.user_id,
        category_id: transaction.category_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date.split("T")[0],
      });
    } else {
      reset({
        user_id: user?.id || "",
        category_id: 0,
        type: "expense",
        amount: 0,
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [transaction, reset, user]);

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditMode && transaction) {
        // Edit mode
        const updateData: UpdateTransactionInput = {
          id: transaction.id,
          category_id: data.category_id,
          type: data.type,
          amount: data.amount,
          description: data.description,
          transaction_date: data.transaction_date,
        };
        await onSubmit(updateData);
      } else {
        // Create mode
        const createData: CreateTransactionInput = {
          user_id: data.user_id,
          category_id: data.category_id,
          type: data.type,
          amount: data.amount,
          description: data.description,
          transaction_date: data.transaction_date,
        };
        await onSubmit(createData);
      }
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {transaction ? "Edit Transaction" : "Add New Transaction"}
                </h3>
                <div className="mt-4">
                  <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4"
                  >
                    {/* User Selection (Admin only) */}
                    {isAdmin && !isEditMode && (
                      <div>
                        <label
                          htmlFor="user_id"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          User
                        </label>
                        <select
                          {...register("user_id")}
                          id="user_id"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.user_id
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                        >
  
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </select>
                        {errors.user_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.user_id.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            {...register("type")}
                            type="radio"
                            value="expense"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            💸 Expense
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register("type")}
                            type="radio"
                            value="income"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
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

                    {/* Category Selection */}
                    <div>
                      <label
                        htmlFor="category_id"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category
                      </label>
                      {/* Debug info */}
                      <div className="text-xs text-gray-500 mb-1">
                        {categoriesLoading
                          ? "Loading categories..."
                          : categoriesError
                          ? `Error: ${categoriesError.message}`
                          : `Found ${filteredCategories.length} categories`}
                      </div>
                      <select
                        {...register("category_id")}
                        id="category_id"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.category_id
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select category</option>
                        {filteredCategories.length === 0 ? (
                          <option disabled>No categories available</option>
                        ) : (
                          filteredCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.category_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category_id.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <input
                        {...register("description")}
                        type="text"
                        id="description"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.description
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter transaction description"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <input
                        {...register("amount")}
                        type="number"
                        step="0.01"
                        min="0"
                        id="amount"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.amount
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="transaction_date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date
                      </label>
                      <input
                        {...register("transaction_date")}
                        type="date"
                        id="transaction_date"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.transaction_date
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.transaction_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.transaction_date.message}
                        </p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                          !isValid || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
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
                            {transaction ? "Updating..." : "Creating..."}
                          </div>
                        ) : transaction ? (
                          "Update Transaction"
                        ) : (
                          "Create Transaction"
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
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
