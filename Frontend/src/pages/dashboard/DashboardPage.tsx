import React, { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import CategoryPie from "../../components/charts/CategoryPie";
import MonthlyLine from "../../components/charts/MonthlyLine";
import IncomeExpenseBar from "../../components/charts/IncomeExpenseBar";
import {
  CategoryBreakdown,
  MonthlyTrend,
  IncomeExpense,
} from "../../types/analytics";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // React Query hooks for data fetching
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery<CategoryBreakdown[]>({
    queryKey: ["category-breakdown"],
    queryFn: async () => {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        { category: "Food", total: 850 },
        { category: "Transport", total: 450 },
        { category: "Entertainment", total: 320 },
        { category: "Shopping", total: 280 },
        { category: "Bills", total: 1200 },
        { category: "Other", total: 150 },
      ];
    },
  });

  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    error: monthlyError,
  } = useQuery<MonthlyTrend[]>({
    queryKey: ["monthly-trends"],
    queryFn: async () => {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return [
        { month: "2025-01", income: 3500, expense: 2800 },
        { month: "2025-02", income: 3800, expense: 3100 },
        { month: "2025-03", income: 4200, expense: 2900 },
        { month: "2025-04", income: 4000, expense: 3200 },
        { month: "2025-05", income: 4500, expense: 3400 },
        { month: "2025-06", income: 4800, expense: 3600 },
      ];
    },
  });

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useQuery<IncomeExpense[]>({
    queryKey: ["income-expense-trends"],
    queryFn: async () => {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { month: "2025-01", income: 3500, expense: 2800 },
        { month: "2025-02", income: 3800, expense: 3100 },
        { month: "2025-03", income: 4200, expense: 2900 },
        { month: "2025-04", income: 4000, expense: 3200 },
        { month: "2025-05", income: 4500, expense: 3400 },
        { month: "2025-06", income: 4800, expense: 3600 },
      ];
    },
  });

  // Calculate totals using useMemo for performance
  const totals = useMemo(() => {
    if (!monthlyData) return { totalIncome: 0, totalExpense: 0, balance: 0 };

    const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = monthlyData.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [monthlyData]);

  // Refresh handler using useCallback
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
    </div>
  );

  // Error component
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  const hasError = categoryError || monthlyError || trendsError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh Data
        </button>
      </div>

      {/* Error Banner */}
      {hasError && (
        <ErrorBanner message="Failed to load dashboard data. Please try again." />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totals.totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totals.totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              totals.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${totals.balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Pie Chart) */}
        <div>
          {categoryLoading ? (
            <LoadingSkeleton />
          ) : categoryError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load category data
              </div>
            </div>
          ) : (
            <CategoryPie data={categoryData || []} />
          )}
        </div>

        {/* Monthly Trends (Line Chart) */}
        <div>
          {monthlyLoading ? (
            <LoadingSkeleton />
          ) : monthlyError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Trends
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load monthly data
              </div>
            </div>
          ) : (
            <MonthlyLine data={monthlyData || []} />
          )}
        </div>

        {/* Income vs Expense (Bar Chart) - Full Width */}
        <div className="lg:col-span-2">
          {trendsLoading ? (
            <LoadingSkeleton />
          ) : trendsError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Income vs Expense
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load trends data
              </div>
            </div>
          ) : (
            <IncomeExpenseBar data={trendsData || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
