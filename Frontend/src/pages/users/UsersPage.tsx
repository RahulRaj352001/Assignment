import React, { useState, useCallback } from "react";
import { useUsers } from "../../hooks/useUsers";
import AuthGuard from "../../components/auth/AuthGuard";
import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import DeleteUserModal from "../../components/users/DeleteUserModal";
import { User, CreateUserInput, UpdateUserInput } from "../../types/user";
import { useAuth } from "../../hooks/useAuth";

const UsersPage: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
    canManageUsers,
    canReadUsers,
  } = useUsers();
  const { isLoading: authLoading } = useAuth();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

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
      try {
        if (editingUser) {
          // Update existing user - ensure it's UpdateUserInput type
          if ("id" in userData) {
            await updateUser({ id: editingUser.id, data: userData });
          } else {
            // Convert CreateUserInput to UpdateUserInput
            const updateData: UpdateUserInput = {
              id: editingUser.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              ...(userData.password && { password: userData.password }),
            };
            await updateUser({ id: editingUser.id, data: updateData });
          }
        } else {
          // Create new user - ensure password is present
          if ("password" in userData && userData.password) {
            await createUser(userData as CreateUserInput);
          } else {
            throw new Error("Password is required for new users");
          }
        }

        setIsFormOpen(false);
        setEditingUser(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    },
    [editingUser, createUser, updateUser]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser.id);
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  }, [deletingUser, deleteUser]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingUser(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  }, []);

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canReadUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to view user management.
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
            Error Loading Users
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
    <AuthGuard roles={["admin"]}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage system users, roles, and permissions
              </p>
            </div>
            {canManageUsers && (
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            )}
          </div>
        </div>

        {/* Admin Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
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
              <p className="font-medium">Admin Access:</p>
              <p className="mt-1">
                You have full control over user management. You can create,
                edit, and delete users, and assign appropriate roles.
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <UserTable
              users={users}
              onEdit={canManageUsers ? handleEditUser : () => {}}
              onDelete={canManageUsers ? handleDeleteUser : () => {}}
            />
          )}
        </div>

        {/* User Form Modal */}
        <UserForm
          user={editingUser}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating || isUpdating}
        />

        {/* Delete Confirmation Modal */}
        <DeleteUserModal
          user={deletingUser}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </AuthGuard>
  );
};

export default UsersPage;
