import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthContext from "components/contexts/AuthContext";
import NotificationBar from "components/views/NotificationBar";

const NavigationBar = () => {
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    history.push("/login");
  };

  // Code to update the indicator based on the presence of new notifications
  //For Future Use
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/notifications");
      const data = await response.json();
      if (data.notifications.length > 0) {
        setHasNewNotifications(true);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="navbar container">
      <div className="logo-container">
        <img className="navbar logo" src="/logo.png" alt="logo" />
      </div>

      {!isLoggedIn && (
        <div className="navbar button-container">
          <Link to="/register">
            <button className="register-button button">
              <span className="text">Register</span>
            </button>
          </Link>

          <Link to="/login">
            <button className="login-button button">
              <span className="text">Sign in</span>
            </button>
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className="navbar button-container">
          <Link to="/profile">
            <button className="navbar profile-icon">person</button>
          </Link>

          <button
            // className="navbar notification-icon"
            className={`navbar notification-icon ${
              hasNewNotifications ? "has-new-notifications" : ""
            }`}
            onClick={() => setShowNotificationBar(!showNotificationBar)}
          >
            notifications
          </button>
          {showNotificationBar && <NotificationBar />}

          <button
            className="navbar home-icon "
            onClick={() => history.push(`/game`)} //for future use
          >
            home
          </button>

          <button className="login-button button" onClick={() => logout()}>
            <span className="text">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

NavigationBar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default NavigationBar;
