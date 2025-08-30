import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: "success" | "error" | "info",
    message: string
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auto-dismiss notifications after 4 seconds
  useEffect(() => {
    if (notifications.length === 0) return;

    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1)); // Remove oldest notification
    }, 4000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const addNotification = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      const newNotification: Notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => {
        // Keep only the latest 3 notifications
        const updated = [newNotification, ...prev].slice(0, 3);
        return updated;
      });
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
