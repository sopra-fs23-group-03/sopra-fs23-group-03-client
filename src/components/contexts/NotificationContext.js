import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "helpers/api";
import AuthContext from "components/contexts/AuthContext";
import UserContext from "./UserContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isLoggedIn && user.groupState === "NOGROUP") {
        const userId = localStorage.getItem("userId");
        const headers = { "X-Token": localStorage.getItem("token") };

        try {
          const response = await api.get(`/users/${userId}/invitations`, {
            headers,
          });
          const data = response.data;
          if (data.length > 0) {
            setHasNewNotifications(true);
            setNotifications(data);
          } else {
            setHasNewNotifications(false);
            setNotifications([]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchNotifications();

    // Fetch notifications every 5 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 2000);

    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [isLoggedIn, user.groupState]);

  return (
    <NotificationContext.Provider
      value={{ notifications, hasNewNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
