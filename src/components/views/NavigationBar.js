import React from "react";
import PropTypes from "prop-types";
import "styles/views/NavigationBar.scss";
import { Link } from "react-router-dom";

const NavigationBar = ({ isLoggedIn }) => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <img className="logo" src="logo.png" alt="logo" />
      </div>
      {!isLoggedIn && (
        <div className="button-container">
          <Link to="/register">
            <button className="register-button">
              <span className="register-text">Register</span>
            </button>
          </Link>
          <Link to="/login">
            <button className="login-button">
              <span className="login-text">Sign in</span>
            </button>
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className="button-container">
          <Link to="/profile" className="profile-button">
            <button>
              <span className="button-label">Profile</span>
            </button>
          </Link>
          <Link to="/notifications" className="notifications-button">
            <button>
              <span className="button-label">Notifications</span>
            </button>
          </Link>
          <Link to="/game" className="home-button">
            <button>
              <span className="button-label">Home</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

NavigationBar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default NavigationBar;
