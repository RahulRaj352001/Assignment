import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User, CreateUserInput, UpdateUserInput } from "../../types/user";
import { userSchema, UserFormData } from "../../validation/userSchema";

interface UserFormProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as const,
    },
  });

  // Reset form when user changes (for edit mode)
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "", // Don't pre-fill password
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode && user) {
        // Edit mode - password is optional
        const updateData: UpdateUserInput = {
          id: user.id,
          name: data.name,
          email: data.email,
          role: data.role,
          ...(data.password && { password: data.password }),
        };
        await onSubmit(updateData);
      } else {
        // Create mode - password is required
        if (!data.password) {
          return; // This shouldn't happen due to validation
        }
        const createData: CreateUserInput = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {user ? "Edit User" : "Add New User"}
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
                        Full Name
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        id="name"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        id="email"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password{" "}
                        {!isEditMode && <span className="text-red-500">*</span>}
                        {isEditMode && (
                          <span className="text-gray-500 text-xs">
                            (leave blank to keep current)
                          </span>
                        )}
                      </label>
                      <input
                        {...register("password")}
                        type="password"
                        id="password"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={
                          isEditMode
                            ? "Enter new password (optional)"
                            : "Enter password"
                        }
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Role Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Role
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            {...register("role")}
                            type="radio"
                            value="user"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            👤 User - Can manage own transactions and categories
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register("role")}
                            type="radio"
                            value="admin"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            👑 Admin - Full access to all features
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            {...register("role")}
                            type="radio"
                            value="read-only"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            👁️ Read-only - View-only access to all data
                          </span>
                        </label>
                      </div>
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role.message}
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
                            {user ? "Updating..." : "Creating..."}
                          </div>
                        ) : user ? (
                          "Update User"
                        ) : (
                          "Create User"
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

export default UserForm;
