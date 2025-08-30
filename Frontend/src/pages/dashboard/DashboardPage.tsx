import React, { useMemo, useCallback, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CategoryPie from "../../components/charts/CategoryPie";
import MonthlyLine from "../../components/charts/MonthlyLine";
import IncomeExpenseBar from "../../components/charts/IncomeExpenseBar";
import { useAnalytics } from "../../hooks/useAnalytics";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // State for filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Generate last 5 years for year selector
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  // Use the new analytics hook
  const { data, isLoading, hasError, refetch } = useAnalytics(
    selectedYear,
    fromDate,
    toDate
  );

  // Calculate totals using useMemo for performance
  const totals = useMemo(() => {
    if (!data.monthlyTrend || data.monthlyTrend.length === 0) {
      return { totalIncome: 0, totalExpense: 0, balance: 0 };
    }

    const totalIncome = data.monthlyTrend.reduce(
      (sum, item) => sum + item.income,
      0
    );
    const totalExpense = data.monthlyTrend.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [data.monthlyTrend]);

  // Refresh handler using useCallback
  const handleRefresh = useCallback(() => {
    refetch.categoryBreakdown();
    refetch.monthlyTrend();
    refetch.incomeExpense();
  }, [refetch]);

  // Filter change handlers
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleDateRangeChange = useCallback(
    (type: "from" | "to", value: string) => {
      if (type === "from") {
        setFromDate(value);
      } else {
        setToDate(value);
      }
    },
    []
  );

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
      <button
        onClick={handleRefresh}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
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
              Refreshing...
            </div>
          ) : (
            "Refresh Data"
          )}
        </button>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Analytics Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Year Selector */}
          <div>
            <label
              htmlFor="year-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label
              htmlFor="from-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              type="date"
              id="from-date"
              value={fromDate}
              onChange={(e) => handleDateRangeChange("from", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label
              htmlFor="to-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              onChange={(e) => handleDateRangeChange("to", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
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
          <p className="text-xs text-gray-400 mt-1">
            {selectedYear} •{" "}
            {fromDate && toDate ? `${fromDate} to ${toDate}` : "Full Year"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totals.totalExpense.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedYear} •{" "}
            {fromDate && toDate ? `${fromDate} to ${toDate}` : "Full Year"}
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
          <p className="text-xs text-gray-400 mt-1">Net position</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Pie Chart) */}
        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : hasError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load category data
              </div>
            </div>
          ) : (
            <CategoryPie data={data.categoryBreakdown} />
          )}
        </div>

        {/* Monthly Trends (Line Chart) */}
        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : hasError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Trends
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load monthly data
              </div>
            </div>
          ) : (
            <MonthlyLine data={data.monthlyTrend} />
          )}
        </div>

        {/* Income vs Expense (Bar Chart) - Full Width */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <LoadingSkeleton />
          ) : hasError ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Income vs Expense
              </h3>
              <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500">
                Failed to load trends data
              </div>
            </div>
          ) : (
            <IncomeExpenseBar data={data.incomeExpense} />
          )}
        </div>
      </div>

      {/* Cache Info */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
            <strong>Analytics Data:</strong> Cached for 15 minutes. Data
            automatically refreshes when transactions are updated.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
