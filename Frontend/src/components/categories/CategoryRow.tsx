import React from "react";
import { Category } from "../../types/category";
import { useAuth } from "../../hooks/useAuth";

interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canModify = user?.role === "admin" || user?.role === "user";

  const getTypeBadgeColor = (type: "income" | "expense") => {
    return type === "income" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">
        {category.name}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(category.type)}`}>
          {category.type === "income" ? "💰 Income" : "💸 Expense"}
        </span>
      </td>
      {canModify && (
        <td className="px-4 py-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              title="Edit category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(category)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              title="Delete category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default CategoryRow;
