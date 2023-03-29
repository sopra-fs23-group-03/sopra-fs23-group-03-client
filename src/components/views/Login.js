import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory, Link } from "react-router-dom";
import { Button } from "components/ui/Button";
//import ErrorContainer from 'components/ui/ErrorContainer';
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.put(`/users/${username}/login`, requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token from the response headers into the local storage.
      const token = response.headers.authorization; //response.headers.authorization;
      localStorage.setItem("token", token);

      // Store the user ID in local storage.
      localStorage.setItem("userId", user.id);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
      history.push(`/login`);
    }
  };

  return (
    <BaseContainer>
      <div className="login picture">
        <img className="picture" src="login.png" alt="login" />
      </div>
      <div className="login container">
        <div className="login heading">Welcome Back!</div>

        <div className="login form">
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
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>

        <div className="login register-text">
          You don't have an account? Register now
          <Link to="/register" className="login register-link">
            here
          </Link>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component
 */
