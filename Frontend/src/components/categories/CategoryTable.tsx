import React, { useState, useMemo } from "react";
import { Category } from "../../types/category";
import { useAuth } from "../../hooks/useAuth";
import CategoryRow from "./CategoryRow";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<"name" | "type">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const canModify = user?.role === "admin" || user?.role === "user";

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        aValue = a.type;
        bValue = b.type;
      }

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [categories, sortField, sortDirection]);

  const handleSort = (field: "name" | "type") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: "name" | "type") => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-500">Get started by creating your first category.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {getSortIcon("name")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  {getSortIcon("type")}
                </div>
              </th>
              {canModify && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {sortedCategories.map((category) => (
            <div key={category.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${
                    category.type === "income" 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    {category.type === "income" ? "💰 Income" : "💸 Expense"}
                  </span>
                </div>
                {canModify && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(category)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                      title="Edit category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                      title="Delete category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
