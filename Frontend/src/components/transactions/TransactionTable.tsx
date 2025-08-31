import React, { useState } from "react";
import { Transaction } from "../../types/transaction";
import { Category } from "../../types/category";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  canModify?: boolean;
}

type SortField = "date" | "amount";
type SortDirection = "asc" | "desc";

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  canModify = true,
}) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortField === "date") {
      const dateA = a.transaction_date
        ? new Date(a.transaction_date).getTime()
        : 0;
      const dateB = b.transaction_date
        ? new Date(b.transaction_date).getTime()
        : 0;
      comparison = dateA - dateB;
    } else if (sortField === "amount") {
      const amountA = parseFloat(a.amount?.toString() || "0") || 0;
      const amountB = parseFloat(b.amount?.toString() || "0") || 0;
      comparison = amountA - amountB;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount: number | string | null | undefined) => {
    const numAmount = parseFloat(amount?.toString() || "0") || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const getCategoryName = (categoryId: number | string) => {
    // Handle both string and number category IDs
    const categoryIdStr = categoryId?.toString();
    const category = categories.find(
      (cat) => cat.id?.toString() === categoryIdStr
    );
    return category ? category.name : `Category ${categoryId}`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return <span>{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center space-x-1">
                <span>Date</span>
                <SortIcon field="date" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center space-x-1">
                <span>Amount</span>
                <SortIcon field="amount" />
              </div>
            </th>
            {canModify && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatDate(transaction.transaction_date)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {transaction.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getCategoryName(transaction.category_id)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span
                  className={`font-medium ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatAmount(transaction.amount)}
                </span>
              </td>
              {canModify && (
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(transaction)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found. Add your first transaction to get started!
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
