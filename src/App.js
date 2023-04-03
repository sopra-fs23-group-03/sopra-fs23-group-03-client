import React, { useState, useEffect } from "react";
import AppRouter from "components/routing/routers/AppRouter";
import AuthContext from "components/contexts/AuthContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  console.log(isLoggedIn);

  return (
    <div>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <AppRouter />
      </AuthContext.Provider>
    </div>
  );
};

export default App;
