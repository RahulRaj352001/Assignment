import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";
import axiosClient from "../utils/axiosClient";
import { 
  CreateTransactionInput, 
  UpdateTransactionInput, 
  TransactionFilters,
  TransactionResponse 
} from "../types/transaction";

export const useTransactions = (filters: TransactionFilters = {}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  // Prepare query parameters
  const queryParams = new URLSearchParams();
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.category_id) queryParams.append("category_id", filters.category_id.toString());
  if (filters.start_date) queryParams.append("start_date", filters.start_date);
  if (filters.end_date) queryParams.append("end_date", filters.end_date);
  
  // Admin can filter by user_id, regular users can only see their own transactions
  if (user?.role === "admin" && filters.user_id) {
    queryParams.append("user_id", filters.user_id);
  } else if (!filters.user_id && user?.id) {
    // If no user_id is provided, use current user's ID
    queryParams.append("user_id", user.id);
  }

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery<TransactionResponse>({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const response = await axiosClient.get(`/transactions?${queryParams.toString()}`);
      const data = response.data.data;
      
      // Validate and sanitize the response data
      if (data && typeof data === 'object') {
        // Ensure transactions array exists and is valid
        if (data.transactions && Array.isArray(data.transactions)) {
          data.transactions = data.transactions.map((t: any) => ({
            ...t,
            amount: parseFloat(t.amount?.toString() || "0") || 0,
            category_id: parseInt(t.category_id?.toString() || "0") || 0,
          }));
        }
        
        // Ensure numeric fields are properly parsed
        if (data.total !== undefined) data.total = parseInt(data.total.toString()) || 0;
        if (data.page !== undefined) data.page = parseInt(data.page.toString()) || 1;
        if (data.totalPages !== undefined) data.totalPages = parseInt(data.totalPages.toString()) || 1;
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    enabled: !authLoading && !!user,
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const response = await axiosClient.post("/transactions", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      addNotification("success", "Transaction created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to create transaction";
      addNotification("error", errorMessage);
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransactionInput }) => {
      const response = await axiosClient.put(`/transactions/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      addNotification("success", "Transaction updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to update transaction";
      addNotification("error", errorMessage);
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await axiosClient.delete(`/transactions/${transactionId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      addNotification("success", "Transaction deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to delete transaction";
      addNotification("error", errorMessage);
    },
  });

  // RBAC checks
  const canCreate = !authLoading && !!user && (user.role === "admin" || user.role === "user");
  const canUpdate = !authLoading && !!user && (user.role === "admin" || user.role === "user");
  const canDelete = !authLoading && !!user && (user.role === "admin" || user.role === "user");
  const canRead = !authLoading && !!user && (user.role === "admin" || user.role === "user" || user.role === "read-only");
  const isAdmin = !authLoading && !!user && user.role === "admin";

  return {
    transactions: transactionsData?.transactions || [],
    total: parseInt(transactionsData?.total?.toString() || "0") || 0,
    page: parseInt(transactionsData?.page?.toString() || "1") || 1,
    totalPages: parseInt(transactionsData?.totalPages?.toString() || "1") || 1,
    isLoading,
    error,
    refetch,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateTransactionMutation.isPending,
    isDeleting: deleteTransactionMutation.isPending,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    isAdmin,
  };
};
