import React from "react";
import AppRouter from "components/routing/routers/AppRouter";
import AuthContext from "components/contexts/AuthContext";
import { useState, useEffect } from "react";
import { NotificationProvider } from "components/contexts/NotificationContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, []);

  console.log("isloggedin", isLoggedIn);

  return (
    <div>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
