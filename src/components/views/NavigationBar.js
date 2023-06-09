import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthContext from "components/contexts/AuthContext";
import NotificationBar from "components/views/NotificationBar";
import { api } from "helpers/api";
import { NotificationContext } from "components/contexts/NotificationContext";
import logo from "assets/logo.jpg";
import UserContext from "components/contexts/UserContext";
import User from "models/User";

const NavigationBar = () => {
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const { notifications, hasNewNotifications } =
    useContext(NotificationContext);
  const [showNotificationBar, setShowNotificationBar] = useState(false); // For displaying the notification bar
  const groupId = localStorage.getItem("groupId");

  const logout = async () => {
    try {
      await api.post(`/users/${localStorage.getItem("userId")}/logout`, null, {
        headers: {
          "X-Token": localStorage.getItem("token"),
        },
      });
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(new User());

      history.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar container">
      <div className="logo-container">
        <img className="navbar logo" src={logo} alt="logo" />
      </div>

      {!isLoggedIn && (
        <div className="navbar button-container">
          <Link to="/register">
            <button className="button register">
              <span className="text">Register</span>
            </button>
          </Link>

          <Link to="/login">
            <button className="button login">
              <span className="text">Sign in</span>
            </button>
          </Link>
        </div>
      )}

      {/* {isLoggedIn && ( */}
      {isLoggedIn && !groupId && (
        <div className="navbar button-container">
          <button
            className="navbar profile-icon"
            onClick={() =>
              history.push(`/profile/${localStorage.getItem("userId")}`)
            }
          >
            person
          </button>

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
            onClick={() => history.push(`/dashboard`)}
          >
            home
          </button>
          <button className="button login" onClick={() => logout()}>
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
