import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useDebounce } from "../../hooks/useDebounce";
import TransactionTable from "../../components/transactions/TransactionTable";
import TransactionForm from "../../components/transactions/TransactionForm";
import DeleteConfirmModal from "../../components/transactions/DeleteConfirmModal";
import { Transaction } from "../../types/transaction";

// Mock API functions - replace with real API calls when backend is ready
const fetchTransactions = async (
  page: number,
  limit: number,
  search?: string
) => {
  // Simulate API call with realistic delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate mock data
  const mockTransactions: Transaction[] = Array.from(
    { length: 100 },
    (_, index) => ({
      id: (index + 1).toString(),
      date: new Date(2024, 0, 1 + (index % 365)).toISOString().split("T")[0],
      description: `Transaction ${index + 1}`,
      category: [
        "Food",
        "Transport",
        "Entertainment",
        "Shopping",
        "Bills",
        "Salary",
        "Freelance",
      ][index % 7],
      amount: Math.round((Math.random() * 1000 + 50) * 100) / 100,
      type: index % 3 === 0 ? "income" : ("expense" as "income" | "expense"),
    })
  );

  // Filter by search if provided
  let filteredTransactions = mockTransactions;
  if (search) {
    filteredTransactions = mockTransactions.filter(
      (t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );

  return {
    transactions: paginatedTransactions,
    total: filteredTransactions.length,
    page,
    limit,
    totalPages: Math.ceil(filteredTransactions.length / limit),
  };
};

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize] = useState(20);

  // State for modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // RBAC checks
  const canModify = user?.role === "admin" || user?.role === "user";
  const isReadOnly = user?.role === "read-only";

  // React Query: Fetch transactions with pagination and search
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", currentPage, pageSize, debouncedSearchTerm],
    queryFn: () =>
      fetchTransactions(currentPage, pageSize, debouncedSearchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  });

  // Memoized calculations for performance
  const summaryData = useMemo(() => {
    if (!transactionsData?.transactions) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const totalIncome = transactionsData.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactionsData.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [transactionsData?.transactions]);

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
    async (transactionData: Omit<Transaction, "id">) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingTransaction) {
          alert("Transaction updated successfully!");
        } else {
          alert("Transaction added successfully!");
        }

        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        refetch();

        setIsFormOpen(false);
        setEditingTransaction(null);
      } catch (error) {
        alert("Failed to save transaction. Please try again.");
      }
    },
    [editingTransaction, queryClient, refetch]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (deletingTransaction) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        alert("Transaction deleted successfully!");

        // Invalidate and refetch transactions
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        refetch();

        setIsDeleteModalOpen(false);
        setDeletingTransaction(null);
      } catch (error) {
        alert("Failed to delete transaction. Please try again.");
      }
    }
  }, [deletingTransaction, queryClient, refetch]);

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
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your income and expenses
          </p>
        </div>
        {canModify && (
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
              <strong>Read-only mode:</strong> You can view transactions but
              cannot create, edit, or delete them.
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
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

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              Page {currentPage} of {transactionsData?.totalPages || 1}
            </span>
            <span>•</span>
            <span>{transactionsData?.total || 0} total transactions</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorBanner message="Failed to load transactions. Please try again." />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ${summaryData.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${summaryData.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              summaryData.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${summaryData.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow border">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <TransactionTable
            transactions={transactionsData?.transactions || []}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            canModify={canModify}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {transactionsData && transactionsData.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from(
            { length: Math.min(5, transactionsData.totalPages) },
            (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            }
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === transactionsData.totalPages}
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
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TransactionsPage;
