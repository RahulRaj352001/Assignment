import { useQuery } from "@tanstack/react-query";
import { CategoryBreakdown, MonthlyTrend, IncomeExpense } from "../types/analytics";

// Mock API functions - replace with real API calls when backend is ready
const fetchCategoryBreakdown = async (fromDate?: string, toDate?: string): Promise<CategoryBreakdown[]> => {
  // Simulate API call with realistic data
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const mockData: CategoryBreakdown[] = [
    { category: "Food & Dining", total: 1250 },
    { category: "Transportation", total: 680 },
    { category: "Entertainment", total: 420 },
    { category: "Shopping", total: 890 },
    { category: "Bills & Utilities", total: 1450 },
    { category: "Healthcare", total: 320 },
    { category: "Education", total: 580 },
    { category: "Other", total: 210 },
  ];
  
  return mockData;
};

const fetchMonthlyTrend = async (year: number): Promise<MonthlyTrend[]> => {
  // Simulate API call with realistic monthly data
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const mockData: MonthlyTrend[] = [
    { month: `${year}-01`, income: 4200, expense: 3800 },
    { month: `${year}-02`, income: 4500, expense: 4100 },
    { month: `${year}-03`, income: 4800, expense: 3900 },
    { month: `${year}-04`, income: 4600, expense: 4200 },
    { month: `${year}-05`, income: 5200, expense: 4400 },
    { month: `${year}-06`, income: 5400, expense: 4600 },
    { month: `${year}-07`, income: 5100, expense: 4300 },
    { month: `${year}-08`, income: 5300, expense: 4500 },
    { month: `${year}-09`, income: 5600, expense: 4800 },
    { month: `${year}-10`, income: 5800, expense: 5000 },
    { month: `${year}-11`, income: 6000, expense: 5200 },
    { month: `${year}-12`, income: 6200, expense: 5400 },
  ];
  
  return mockData;
};

const fetchIncomeExpense = async (range: number = 12): Promise<IncomeExpense[]> => {
  // Simulate API call with realistic trend data
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const currentYear = new Date().getFullYear();
  const mockData: IncomeExpense[] = [];
  
  for (let i = 0; i < range; i++) {
    const month = new Date(currentYear, new Date().getMonth() - i, 1);
    const monthStr = month.toISOString().slice(0, 7);
    
    // Generate realistic income/expense data with some variation
    const baseIncome = 4500 + Math.random() * 2000;
    const baseExpense = 3800 + Math.random() * 1500;
    
    mockData.unshift({
      month: monthStr,
      income: Math.round(baseIncome),
      expense: Math.round(baseExpense),
    });
  }
  
  return mockData;
};

// Custom hook for analytics data
export const useAnalytics = (year: number, fromDate?: string, toDate?: string) => {
  // Category breakdown query
  const categoryBreakdown = useQuery({
    queryKey: ["analytics", "category-breakdown", fromDate, toDate],
    queryFn: () => fetchCategoryBreakdown(fromDate, toDate),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
  });

  // Monthly trend query
  const monthlyTrend = useQuery({
    queryKey: ["analytics", "monthly-trend", year],
    queryFn: () => fetchMonthlyTrend(year),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
  });

  // Income vs expense trend query
  const incomeExpense = useQuery({
    queryKey: ["analytics", "income-expense", "range-12"],
    queryFn: () => fetchIncomeExpense(12),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
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
  };
};

// Individual hooks for specific analytics
export const useCategoryBreakdown = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "category-breakdown", fromDate, toDate],
    queryFn: () => fetchCategoryBreakdown(fromDate, toDate),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useMonthlyTrend = (year: number) => {
  return useQuery({
    queryKey: ["analytics", "monthly-trend", year],
    queryFn: () => fetchMonthlyTrend(year),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};

export const useIncomeExpense = (range: number = 12) => {
  return useQuery({
    queryKey: ["analytics", "income-expense", `range-${range}`],
    queryFn: () => fetchIncomeExpense(range),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};
