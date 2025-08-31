import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";
import axiosClient from "../utils/axiosClient";
import { ProfileFormData } from "../validation/profileSchema";

export const useProfile = () => {
  const { user, refreshUser } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = useCallback(
    async (data: ProfileFormData) => {
      if (!user) {
        addNotification("error", "User not authenticated");
        return false;
      }

      setIsUpdating(true);
      try {
        await axiosClient.put("/users/profile/me", data);
        addNotification("success", "Profile updated successfully!");
        await refreshUser(); // Refresh user data
        return true;
      } catch (error: any) {
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          "Failed to update profile";
        addNotification("error", errorMessage);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, refreshUser, addNotification]
  );

  const resetProfile = useCallback(() => {
    if (user) {
      return {
        name: user.name || "",
        email: user.email || "",
      };
    }
    return {
      name: "",
      email: "",
    };
  }, [user]);

  return {
    user,
    isLoading,
    isUpdating,
    updateProfile,
    resetProfile,
  };
};
