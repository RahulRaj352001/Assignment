import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* App Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">
            💰 Finance Tracker
          </h1>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* User Role Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-gray-900">{user?.name || "User"}</span>
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user?.role === "admin" 
                ? "bg-purple-100 text-purple-800" 
                : user?.role === "user"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {user?.role === "admin" ? "👑 Admin" : user?.role === "user" ? "👤 User" : "👁️ Read-only"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
