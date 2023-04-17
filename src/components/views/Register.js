import React, { useState, useContext } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory, Link } from "react-router-dom"; //
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import AuthContext from "components/contexts/AuthContext";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
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
            props.name === "Password"
              ? showPassword
                ? "text"
                : "password"
              : "text"
          }
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {props.name === "Password" && (
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

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleRegister = () => {
    if (password !== repeatPassword) {
      alert("The two passwords are not matching");
      return;
    }
    //GATEWAY TO SAVE API CALLS
    // if (!/^[A-Za-z]*$/.test(username)) {
    //   alert("Username can include only letters");
    //   return;
    // }

    // if (username === password) {
    //   alert("Username and password can't be the same")
    //   return;
    // }

    doRegister();
  };

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token from the response headers into the local storage.
      localStorage.setItem("token", response.headers["x-token"]);

      // Store the user ID in local storage.
      localStorage.setItem("userId", user.id);
      setIsLoggedIn(true);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/profile`);
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
      history.push(`/register`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <img className="login image" alt="login background"></img>
        <div className="login form">
          <div>
            <h1 className="login title"> Register </h1>
            <p className="login text">
              Register now to join our community and start planning dinners with
              friends
            </p>
          </div>
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Password"
            name="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <FormField
            label="Repeat password"
            name="Password"
            value={repeatPassword}
            onChange={(n) => setRepeatPassword(n)}
          />
          <div>
            <div className="login button-container">
              <Button
                disabled={!username || !password || !repeatPassword}
                width="40%"
                onClick={() => handleRegister()}
              >
                Register
              </Button>
            </div>

            <div>
              <div className="login register-text">
                You already have an account? Sign in{" "}
                <Link to="/login" className="login register-link">
                  here
                </Link>
              </div>
            </div>
          </div>
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
