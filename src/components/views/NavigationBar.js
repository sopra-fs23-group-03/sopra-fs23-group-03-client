import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthContext from "components/contexts/AuthContext";
import NotificationBar from "components/views/NotificationBar";
import { api } from "helpers/api";
import { NotificationContext } from "components/contexts/NotificationContext";

const NavigationBar = () => {
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { notifications, hasNewNotifications } =
    useContext(NotificationContext);
  const [showNotificationBar, setShowNotificationBar] = useState(false); // For displaying the notification bar

  const logout = async () => {
    // try {
    //   await api.post(`/users/${localStorage.getItem("userId")}/logout`, null, {
    //     headers: {
    //       "X-Token": localStorage.getItem("token"),
    //     },
    //   });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      history.push("/login");
    // } catch (error) {
    //   console.error(error);
  };

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
          <Link to={`/profile/${localStorage.getItem("userId")}`}>
            <button className="navbar profile-icon">person</button>
          </Link>

          <button
            // Add the class "has-new-notifications" to the button if there are new notifications
            className={`navbar notification-icon ${
              hasNewNotifications ? "has-new-notifications" : ""
            }`}
            onClick={() => {
              setShowNotificationBar(!showNotificationBar);
            }}
          >
            notifications
          </button>
          {showNotificationBar && (
            // Pass the notification data as a prop to the NotificationBar component
            <NotificationBar notificationData={notifications} />
          )}

          <button
            className="navbar home-icon "
            onClick={() => history.push(`/game`)}
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
