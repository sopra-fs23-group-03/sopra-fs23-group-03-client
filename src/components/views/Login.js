import React, { useState, useContext } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory, Link } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import AuthContext from "components/contexts/AuthContext";

const FormField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login field">
      <label className="login label">{props.label}</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="login input"
          placeholder="enter here.."
          type={
            props.label === "Password"
              ? showPassword
                ? "text"
                : "password"
              : "text"
          }
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {props.label === "Password" && (
          <button
            className="login toggle-password-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post(`/users/${username}/login`, requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token from the response headers into the local storage.
      const token = response.headers.authorization; //response.headers.authorization;
      localStorage.setItem("token", response.headers["x-token"]);

      // Store the user ID in local storage.
      localStorage.setItem("userId", user.id);
      setIsLoggedIn(true);

      // Register successfully worked --> navigate to the route /dashboard in the GameRouter
      history.push(`/dashboard`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
      history.push(`/login`);
    }
  };

  return (
    // <BaseContainer>
    <div className="login container">
      <img className="login image" alt="login background"></img>
      <div className="login form">
        <h1 className="login title"> Welcome back! </h1>
        <FormField
          label="Username"
          value={username}
          onChange={(un) => setUsername(un)}
        />
        <FormField
          label="Password"
          value={password}
          onChange={(n) => setPassword(n)}
        />
        <div>
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="40%"
              onClick={() => doLogin()}
            >
              Sign in
            </Button>
          </div>
          <div>
            <div className="login register-text">
              You don't have an account? Register now{" "}
              <Link to="/register" className="login register-link">
                here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </BaseContainer>
  );
};

export default Login;

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component
 */
