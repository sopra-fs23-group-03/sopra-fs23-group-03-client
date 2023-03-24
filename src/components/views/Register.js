import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory, Link } from "react-router-dom"; //
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register field">
      <label className="register label">{props.label}</label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="register input"
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
            className="register toggle-password-button"
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

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token from the response headers into the local storage.
      const token = response.headers.authorization;
      localStorage.setItem("token", token);

      // Store the user ID in local storage.
      localStorage.setItem("userId", user.id);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
      history.push(`/register`);
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
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
          <div className="register button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
        <div className="register login-text">
          You already have an account? Sign in{" "}
          <Link to="/login" className="register login-link">
            here
          </Link>
        </div>
      </div>
    </BaseContainer>
  );
};
/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */

export default Register;
