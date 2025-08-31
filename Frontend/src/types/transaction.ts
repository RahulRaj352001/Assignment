export interface Transaction {
  id: string;
  user_id: string;
  category_id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionInput {
  user_id: string;
  category_id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  transaction_date: string;
}

export interface UpdateTransactionInput {
  id: string;
  category_id?: number;
  type?: "income" | "expense";
  amount?: number;
  description?: string;
  transaction_date?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  category_id?: number;
  start_date?: string;
  end_date?: string;
  user_id?: string; // For admin to filter by user
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
