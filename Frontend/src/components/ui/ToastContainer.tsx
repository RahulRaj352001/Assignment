import React from "react";
import { Notification } from "../../contexts/NotificationContext";
import Toast from "./Toast";

interface ToastContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  removeNotification,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
