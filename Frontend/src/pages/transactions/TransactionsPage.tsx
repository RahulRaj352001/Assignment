import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDebounce } from "../../hooks/useDebounce";
import TransactionTable from "../../components/transactions/TransactionTable";
import TransactionForm from "../../components/transactions/TransactionForm";
import DeleteConfirmModal from "../../components/transactions/DeleteConfirmModal";
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../../types/transaction";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategory } from "../../hooks/useCategory";

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();

  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize] = useState(20);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use the transactions hook with filters
  const {
    transactions,
    total,
    page,
    totalPages,
    isLoading,
    error,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isCreating,
    isUpdating,
    isDeleting,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    isAdmin,
  } = useTransactions({
    page: currentPage,
    limit: pageSize,
    user_id: selectedUserId || undefined,
  });

  // Get categories for the table
  const { categories } = useCategory();

  // RBAC checks
  const canModify = canUpdate || canDelete;
  const isReadOnly = user?.role === "read-only";

  // Memoized calculations for performance
  const summaryData = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (sum, t) => sum + (parseFloat(t.amount?.toString() || "0") || 0),
        0
      );

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (sum, t) => sum + (parseFloat(t.amount?.toString() || "0") || 0),
        0
      );

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [transactions]);

  // Callback handlers for performance optimization
  const handleAddTransaction = useCallback(() => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }, []);

  const handleDeleteTransaction = useCallback((transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (
      transactionData: CreateTransactionInput | UpdateTransactionInput
    ) => {
      try {
        if (editingTransaction) {
          // Update existing transaction
          await updateTransaction({
            id: editingTransaction.id,
            data: transactionData as UpdateTransactionInput,
          });
        } else {
          // Create new transaction
          await createTransaction(transactionData as CreateTransactionInput);
        }

        setIsFormOpen(false);
        setEditingTransaction(null);
      } catch (error) {
        // Error handling is done in the hook
        console.error("Transaction operation failed:", error);
      }
    },
    [editingTransaction, createTransaction, updateTransaction]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingTransaction) {
      try {
        await deleteTransaction(deletingTransaction.id);
        setIsDeleteModalOpen(false);
        setDeletingTransaction(null);
      } catch (error) {
        // Error handling is done in the hook
        console.error("Delete operation failed:", error);
      }
    }
  }, [deletingTransaction, deleteTransaction]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingTransaction(null);
  }, []);

  const handleUserFilterChange = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage(1); // Reset to first page when changing user filter
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4" data-testid="loading-skeleton">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );

  // Error component
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={() => refetch()}
        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
      >
        Try again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 text-gray-300 dark:text-gray-600 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No transactions yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Get started by adding your first transaction to track your finances.
      </p>
      {canCreate && (
        <button
          onClick={handleAddTransaction}
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
          Add Your First Transaction
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your income and expenses
          </p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddTransaction}
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
            Add Transaction
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={
            error instanceof Error
              ? error.message
              : "Failed to load transactions"
          }
        />
      )}

      {/* Role-based info banner */}
      {isReadOnly && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500 text-blue-700 dark:text-blue-200 px-4 py-3 rounded">
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
              <strong>Read-only mode:</strong> You can view transactions but
              cannot create, edit, or delete them.
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search Transactions
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by description or category..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <span>•</span>
            <span>{total || 0} total transactions</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${(summaryData?.totalIncome || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${(summaryData?.totalExpenses || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Balance
          </h3>
          <p
            className={`text-2xl font-bold ${
              (summaryData?.balance || 0) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            ${(summaryData?.balance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="p-8">
            <ErrorBanner
              message={
                error instanceof Error
                  ? error.message
                  : "Failed to load transactions"
              }
            />
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            canModify={canModify}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pageNum === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TransactionsPage;
