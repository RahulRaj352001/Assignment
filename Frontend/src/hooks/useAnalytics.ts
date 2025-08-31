import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";
import axiosClient from "../utils/axiosClient";
import { CategoryBreakdown, MonthlyTrend, IncomeExpense } from "../types/analytics";

// Real API functions
const fetchCategoryBreakdown = async (user_id?: string): Promise<CategoryBreakdown[]> => {
  const params = new URLSearchParams();
  if (user_id) params.append("user_id", user_id);
  
  const response = await axiosClient.get(`/analytics/categories?${params.toString()}`);
  return response.data.data;
};

const fetchMonthlyTrend = async (user_id?: string): Promise<MonthlyTrend[]> => {
  const params = new URLSearchParams();
  if (user_id) params.append("user_id", user_id);
  
  const response = await axiosClient.get(`/analytics/monthly?${params.toString()}`);
  return response.data.data;
};

const fetchIncomeExpense = async (user_id?: string): Promise<IncomeExpense[]> => {
  const params = new URLSearchParams();
  if (user_id) params.append("user_id", user_id);
  
  const response = await axiosClient.get(`/analytics/income-expense?${params.toString()}`);
  return response.data.data;
};

const refreshCache = async (user_id?: string) => {
  const response = await axiosClient.post(`/analytics/refresh-cache?user_id=${user_id}`);
  return response.data.data;
};

// Custom hook for analytics data
export const useAnalytics = (year: number, fromDate?: string, toDate?: string, selectedUserId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use selectedUserId if provided (for admin), otherwise use current user's ID
  const targetUserId = selectedUserId || user?.id;
  
  // Category breakdown query
  const categoryBreakdown = useQuery({
    queryKey: ["analytics", "category-breakdown", targetUserId],
    queryFn: () => fetchCategoryBreakdown(targetUserId),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    enabled: !!targetUserId,
  });

  // Monthly trend query
  const monthlyTrend = useQuery({
    queryKey: ["analytics", "monthly-trend", targetUserId],
    queryFn: () => fetchMonthlyTrend(targetUserId),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    enabled: !!targetUserId,
  });

  // Income vs expense trend query
  const incomeExpense = useQuery({
    queryKey: ["analytics", "income-expense", targetUserId],
    queryFn: () => fetchIncomeExpense(targetUserId),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    enabled: !!targetUserId,
  });

  return {
    categoryBreakdown,
    monthlyTrend,
    incomeExpense,
    // Combined loading state
    isLoading: categoryBreakdown.isLoading || monthlyTrend.isLoading || incomeExpense.isLoading,
    // Combined error state
    hasError: categoryBreakdown.error || monthlyTrend.error || incomeExpense.error,
    // Combined data
    data: {
      categoryBreakdown: categoryBreakdown.data || [],
      monthlyTrend: monthlyTrend.data || [],
      incomeExpense: incomeExpense.data || [],
    },
    // Individual refetch functions
    refetch: {
      categoryBreakdown: categoryBreakdown.refetch,
      monthlyTrend: monthlyTrend.refetch,
      incomeExpense: incomeExpense.refetch,
    },
    // Cache refresh function
    refreshCache: () => {
      // Invalidate all analytics queries for the current user
      queryClient.invalidateQueries({ queryKey: ["analytics", "category-breakdown", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "monthly-trend", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "income-expense", targetUserId] });
    },
  };
};

// Individual hooks for specific analytics
export const useCategoryBreakdown = (user_id?: string) => {
  return useQuery({
    queryKey: ["analytics", "category-breakdown", user_id],
    queryFn: () => fetchCategoryBreakdown(user_id),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useMonthlyTrend = (user_id?: string) => {
  return useQuery({
    queryKey: ["analytics", "monthly-trend", user_id],
    queryFn: () => fetchMonthlyTrend(user_id),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useIncomeExpense = (user_id?: string) => {
  return useQuery({
    queryKey: ["analytics", "income-expense", user_id],
    queryFn: () => fetchIncomeExpense(user_id),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useRefreshCache = (user_id?: string) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  
  return useMutation({
    mutationFn: () => refreshCache(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "category-breakdown", user_id] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "monthly-trend", user_id] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "income-expense", user_id] });
      addNotification("success", "Cache refreshed successfully!");
    },
    onError: (error: any) => {
      addNotification("error", error.response?.data?.message || error.message || "Failed to refresh cache");
    },
  });
};
