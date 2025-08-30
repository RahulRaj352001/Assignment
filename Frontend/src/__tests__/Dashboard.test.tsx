import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import DashboardPage from "../pages/dashboard/DashboardPage";

// Mock the useAnalytics hook
const mockUseAnalytics = {
  data: {
    monthlyOverview: {
      income: 5000,
      expenses: 3000,
      balance: 2000,
    },
    categoryBreakdown: [
      { category: "Food", amount: 800, percentage: 26.7 },
      { category: "Transport", amount: 600, percentage: 20.0 },
      { category: "Entertainment", amount: 400, percentage: 13.3 },
    ],
    trends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      income: [4000, 4500, 5000, 4800, 5200, 5000],
      expenses: [3500, 3200, 3000, 3100, 2900, 3000],
    },
    monthlyData: [
      { month: "2024-01", income: 4000, expenses: 3500 },
      { month: "2024-02", income: 4500, expenses: 3200 },
      { month: "2024-03", income: 5000, expenses: 3000 },
    ],
  },
  isLoading: false,
  error: null,
};

jest.mock("../hooks/useAnalytics", () => ({
  useAnalytics: () => mockUseAnalytics,
}));

// Mock the useAuth hook
const mockUseAuth = {
  user: {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
  },
  isAuthenticated: true,
};

jest.mock("../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("Dashboard", () => {
  describe("DashboardPage", () => {
    it("renders dashboard heading and welcome message", () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument();
      expect(
        screen.getByText("Here's an overview of your finances")
      ).toBeInTheDocument();
    });

    it("displays monthly overview cards", () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(screen.getByText("Monthly Overview")).toBeInTheDocument();
      expect(screen.getByText("$5,000.00")).toBeInTheDocument(); // Income
      expect(screen.getByText("$3,000.00")).toBeInTheDocument(); // Expenses
      expect(screen.getByText("$2,000.00")).toBeInTheDocument(); // Balance
    });

    it("shows category breakdown section", () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(screen.getByText("Category Breakdown")).toBeInTheDocument();
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Transport")).toBeInTheDocument();
      expect(screen.getByText("Entertainment")).toBeInTheDocument();
    });

    it("displays trends section", () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(screen.getByText("Income vs Expenses Trends")).toBeInTheDocument();
      expect(screen.getByText("Last 6 Months")).toBeInTheDocument();
    });

    it("shows loading state when data is loading", () => {
      // Temporarily override the mock to show loading state
      jest.doMock("../hooks/useAnalytics", () => ({
        useAnalytics: () => ({ ...mockUseAnalytics, isLoading: true }),
      }));

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Check for loading indicators
      expect(screen.getByText("Loading dashboard data...")).toBeInTheDocument();
    });

    it("displays error state when there's an error", () => {
      // Temporarily override the mock to show error state
      jest.doMock("../hooks/useAnalytics", () => ({
        useAnalytics: () => ({
          ...mockUseAnalytics,
          error: "Failed to load data",
        }),
      }));

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(
        screen.getByText("Error loading dashboard data")
      ).toBeInTheDocument();
      expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    });

    it("shows role-based content for different user types", () => {
      // Test with admin user
      jest.doMock("../hooks/useAuth", () => ({
        useAuth: () => ({
          ...mockUseAuth,
          user: { ...mockUseAuth.user, role: "admin" as const },
        }),
      }));

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });
  });
});
