export interface CategoryBreakdown {
  category: string;   // Example: "Food"
  amount: number;     // Total expense in this category (matches backend)
  percentage?: number; // Optional percentage for calculations
}

export interface MonthlyTrend {
  month: string;      // Example: "2025-01"
  income: number;     // Total income that month
  expense: number;    // Total expense that month
}

export interface IncomeExpense {
  month: string;      // Example: "2025-01"
  income: number;     // Income for this month
  expense: number;    // Expense for this month
}
