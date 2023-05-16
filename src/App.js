import React from "react";
import AppRouter from "components/routing/routers/AppRouter";
import AuthContext from "components/contexts/AuthContext";
import { useState, useEffect } from "react";
import { NotificationProvider } from "components/contexts/NotificationContext";
import User from "models/User";
import UserContext from "components/contexts/UserContext";

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser !== null ? new User(JSON.parse(storedUser)) : new User();
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, []);

  // Example: Load user from local storage on app mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(new User(JSON.parse(storedUser)));
    }
  }, []);

  // Example: Save user to local storage on user state change
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  console.log("isloggedin", isLoggedIn);

  return (
    <div>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <UserContext.Provider value={{ user, setUser }}>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
