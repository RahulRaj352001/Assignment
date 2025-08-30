import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AuthGuard from "../../components/auth/AuthGuard";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import DeleteUserModal from "../../components/users/DeleteUserModal";
import { User, CreateUserInput, UpdateUserInput } from "../../types/user";

// Mock API functions (replace with real API calls when backend is ready)
const fetchUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data
  return [
    {
      id: "1",
      name: "John Admin",
      email: "admin@demo.com",
      role: "admin" as const,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Jane User",
      email: "user@demo.com",
      role: "user" as const,
      createdAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "3",
      name: "Bob Viewer",
      email: "viewer@demo.com",
      role: "read-only" as const,
      createdAt: "2024-01-25T09:15:00Z",
    },
    {
      id: "4",
      name: "Alice Manager",
      email: "manager@demo.com",
      role: "user" as const,
      createdAt: "2024-02-01T11:45:00Z",
    },
  ];
};

const createUser = async (userData: CreateUserInput): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate validation error for existing email
  if (userData.email === "demo@demo.com") {
    throw new Error("Email already exists");
  }

  // Return mock created user
  return {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  };
};

const updateUser = async (userData: UpdateUserInput): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock updated user
  return {
    ...userData,
    createdAt: new Date().toISOString(),
  } as User;
};

const deleteUser = async (userId: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Simulate potential error
  if (userId === "1") {
    throw new Error("Cannot delete the last admin user");
  }
};

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // React Query hooks
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User created successfully!");
    },
    onError: (error: Error) => {
      alert(`Failed to create user: ${error.message}`);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User updated successfully!");
    },
    onError: (error: Error) => {
      alert(`Failed to update user: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User deleted successfully!");
    },
    onError: (error: Error) => {
      alert(`Failed to delete user: ${error.message}`);
    },
  });

  // Event handlers
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (userData: CreateUserInput | UpdateUserInput) => {
      if ("id" in userData) {
        // Update existing user
        await updateUserMutation.mutateAsync(userData);
      } else {
        // Create new user
        await createUserMutation.mutateAsync(userData);
      }
    },
    [updateUserMutation, createUserMutation]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingUser) {
      await deleteUserMutation.mutateAsync(deletingUser.id);
    }
  }, [deletingUser, deleteUserMutation]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingUser(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
            <div className="flex space-x-2">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error banner
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );

  return (
    <AuthGuard roles={["admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              Add User
            </button>
          </div>
        </div>

        {/* Admin Info Banner */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
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
              <strong>Admin Access:</strong> You have full control over user
              management. You can create, edit, and delete users, and assign
              appropriate roles.
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner message="Failed to load users. Please try again." />
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </div>

        {/* User Form Modal */}
        <UserForm
          user={editingUser}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          isSubmitting={
            createUserMutation.isPending || updateUserMutation.isPending
          }
        />

        {/* Delete Confirmation Modal */}
        <DeleteUserModal
          user={deletingUser}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteUserMutation.isPending}
        />

        {/* Demo Info */}
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
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
            <div className="text-sm">
              <p className="font-medium">Demo Mode:</p>
              <ul className="mt-1 list-disc list-inside text-xs">
                <li>
                  Try creating a user with email "demo@demo.com" to see
                  validation error
                </li>
                <li>
                  Try deleting user "John Admin" (ID: 1) to see deletion error
                </li>
                <li>All other operations will simulate success</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default UsersPage;
