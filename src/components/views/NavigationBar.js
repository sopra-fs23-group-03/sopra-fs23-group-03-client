import React, { useContext } from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthContext from "components/contexts/AuthContext";

const NavigationBar = () => {
  const history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    history.push("/login");
  };

  return (
    <div className="navbar container">
      <div className="logo-container">
        <img className="navbar logo" src="logo.png" alt="logo" />
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
            className="navbar notification-icon "
            // onClick={() => notificationbar()}       //for future use
          >
            notifications
          </button>

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
