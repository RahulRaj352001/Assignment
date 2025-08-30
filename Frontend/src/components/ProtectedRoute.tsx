import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, user, token } = useAuth();

  // Debug logging
  console.log("ProtectedRoute check:", { isAuthenticated, user, token });

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
