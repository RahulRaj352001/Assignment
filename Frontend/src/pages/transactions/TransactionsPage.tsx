import React, { useState } from "react";
import TransactionTable from "../../components/transactions/TransactionTable";
import TransactionForm from "../../components/transactions/TransactionForm";
import DeleteConfirmModal from "../../components/transactions/DeleteConfirmModal";
import { Transaction } from "../../types/transaction";

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-01-15",
      description: "Grocery shopping",
      category: "Food",
      amount: 85.5,
      type: "expense",
    },
    {
      id: "2",
      date: "2024-01-14",
      description: "Salary payment",
      category: "Salary",
      amount: 2500.0,
      type: "income",
    },
    {
      id: "3",
      date: "2024-01-13",
      description: "Gas station",
      category: "Transport",
      amount: 45.0,
      type: "expense",
    },
    {
      id: "4",
      date: "2024-01-12",
      description: "Movie tickets",
      category: "Entertainment",
      amount: 32.0,
      type: "expense",
    },
    {
      id: "5",
      date: "2024-01-11",
      description: "Freelance project",
      category: "Other",
      amount: 500.0,
      type: "income",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (transactionData: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...transactionData, id: t.id } : t
        )
      );
      alert("Transaction updated successfully!");
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      alert("Transaction added successfully!");
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== deletingTransaction.id)
      );
      alert("Transaction deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your income and expenses
          </p>
        </div>
        <button
          onClick={handleAddTransaction}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow border">
        <TransactionTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TransactionsPage;
