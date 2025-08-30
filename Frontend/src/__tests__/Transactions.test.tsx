import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import TransactionsPage from "../pages/transactions/TransactionsPage";

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

// Mock the useDebounce hook
jest.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: any) => value,
}));

// Mock the fetchTransactions function at module level
jest.mock("../pages/transactions/TransactionsPage", () => {
  const originalModule = jest.requireActual(
    "../pages/transactions/TransactionsPage"
  );
  return {
    ...originalModule,
    fetchTransactions: jest.fn(() => Promise.resolve({
      transactions: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    })),
  };
});

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

describe("Transactions", () => {
  beforeEach(() => {
    mockFetchTransactions.mockClear();
  });

  describe("TransactionsPage", () => {
    it("renders transactions page with header", () => {
      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      expect(screen.getByText("Transactions")).toBeInTheDocument();
      expect(
        screen.getByText("Manage your income and expenses")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Add Transaction" })
      ).toBeInTheDocument();
    });

    it("shows loading skeleton when fetching data", async () => {
      // Mock loading state
      mockFetchTransactions.mockImplementation(() => new Promise(() => {}));

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      // Check for loading skeleton
      await waitFor(() => {
        expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
      });
    });

    it("displays empty state when no transactions exist", async () => {
      // Mock empty data
      mockFetchTransactions.mockResolvedValue({
        transactions: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("No transactions yet")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Get started by adding your first transaction to track your finances."
          )
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add Your First Transaction" })
        ).toBeInTheDocument();
      });
    });

    it("shows transactions table when data exists", async () => {
      // Mock transaction data
      const mockTransactions = [
        {
          id: "1",
          date: "2024-01-01",
          description: "Test Transaction",
          category: "Food",
          amount: 50.0,
          type: "expense" as const,
        },
      ];

      mockFetchTransactions.mockResolvedValue({
        transactions: mockTransactions,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Transaction")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("$50.00")).toBeInTheDocument();
      });
    });

    it("displays error banner when API call fails", async () => {
      // Mock error
      mockFetchTransactions.mockRejectedValue(
        new Error("Failed to fetch transactions")
      );

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Error: Failed to fetch transactions")
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Try again" })
        ).toBeInTheDocument();
      });
    });

    it("shows role-based restrictions for read-only users", async () => {
      // Mock read-only user
      jest.doMock("../hooks/useAuth", () => ({
        useAuth: () => ({
          ...mockUseAuth,
          user: { ...mockUseAuth.user, role: "read-only" as const },
        }),
      }));

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      expect(screen.getByText("Read-only mode:")).toBeInTheDocument();
      expect(
        screen.getByText(
          "You can view transactions but cannot create, edit, or delete them."
        )
      ).toBeInTheDocument();

      // Add Transaction button should not be visible for read-only users
      expect(
        screen.queryByRole("button", { name: "Add Transaction" })
      ).not.toBeInTheDocument();
    });

    it("handles search functionality", async () => {
      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by description or category..."
      );
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: "food" } });

      await waitFor(() => {
        expect(searchInput).toHaveValue("food");
      });
    });

    it("displays summary cards with financial data", async () => {
      // Mock transaction data for summary calculation
      const mockTransactions = [
        { id: "1", amount: 100, type: "income" as const },
        { id: "2", amount: 50, type: "expense" as const },
      ];

      mockFetchTransactions.mockResolvedValue({
        transactions: mockTransactions,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Income")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Total Expenses")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Balance")).toBeInTheDocument();
      });
    });

    it("shows pagination controls when multiple pages exist", async () => {
      // Mock data with multiple pages
      mockFetchTransactions.mockResolvedValue({
        transactions: [],
        total: 100,
        page: 1,
        limit: 20,
        totalPages: 5,
      });

      render(
        <TestWrapper>
          <TransactionsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Previous" })
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Next" })
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      });
    });
  });
});
