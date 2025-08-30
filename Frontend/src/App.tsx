import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/auth/LoginPage"));
const Register = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const TransactionsPage = lazy(
  () => import("./pages/transactions/TransactionsPage")
);
const TransactionDetailPage = lazy(
  () => import("./pages/TransactionDetailPage")
);
const CategoriesPage = lazy(() => import("./pages/categories/CategoriesPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with GlobalLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <DashboardPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <DashboardPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <TransactionsPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:id"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <TransactionDetailPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <CategoriesPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <GlobalLayout>
                <AdminUsersPage />
              </GlobalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
