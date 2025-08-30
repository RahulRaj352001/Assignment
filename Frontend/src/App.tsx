import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ToastContainer from "./components/ui/ToastContainer";
import { useNotification } from "./hooks/useNotification";

const Login = lazy(() => import("./pages/auth/LoginPage"));
const Signup = lazy(() => import("./pages/auth/SignupPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const TransactionsPage = lazy(
  () => import("./pages/transactions/TransactionsPage")
);
const TransactionDetailPage = lazy(
  () => import("./pages/TransactionDetailPage")
);
const CategoriesPage = lazy(() => import("./pages/categories/CategoriesPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <ToastContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes with AppLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TransactionsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TransactionDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CategoriesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
