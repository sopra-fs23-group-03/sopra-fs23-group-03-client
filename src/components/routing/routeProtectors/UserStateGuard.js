import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import UserContext from "components/contexts/UserContext";
import PropTypes from "prop-types";

const UserStateGuard = ({ children, state }) => {
  const { user } = useContext(UserContext);

  console.log("user", user);
  console.log("userstate", user.groupState);
  console.log("state", state);

  if (user.groupState !== state) {
    // The user is not in the correct state. Redirect them to the appropriate page.
    switch (user.groupState) {
      case "NOGROUP":
        return <Redirect to="/dashboard" />;
      case "GROUPFORMING_HOST":
        return (
          <Redirect
            to={`/groupforming/${localStorage.getItem("groupId")}/host`}
          />
        );
      case "GROUPFORMING_GUEST":
        return (
          <Redirect
            to={`/groupforming/${localStorage.getItem("groupId")}/guest`}
          />
        );
      case "GROUPFORMING_LOBBY":
        return <Redirect to={`/groupforming/lobby`} />;
      case "GROUPFORMING_HOST_LOBBY":
        return <Redirect to={`/groupforming/host/lobby`} />;

      case "GROUPFORMING_LOBBY":
        return <Redirect to={`/groupforming/lobby`} />;
      case "INGREDIENTENTERING":
        return (
          <Redirect to={`/ingredients/${localStorage.getItem("groupId")}`} />
        );
      case "INGREDIENTENTERING_LOBBY":
        return <Redirect to={`/ingredients/lobby`} />;
      case "INGREDIENTVOTING":
        return (
          <Redirect
            to={`/ingredientvoting/${localStorage.getItem("groupId")}`}
          />
        );
      case "INGREDIENTVOTING_LOBBY":
        return <Redirect to={`/ingredientvoting/lobby`} />;
      case "FINAL":
        return (
          <Redirect
            to={`/ingredientsfinal/${localStorage.getItem("groupId")}`}
          />
        );
      case "RECIPE":
        return <Redirect to={`/recipe/${localStorage.getItem("groupId")}`} />;

      // Add the rest of your states here...
      default:
        return <Redirect to="/dashboard" />;
    }
  }

  // If the user is in the correct state, render the children.
  console.log("children:", children);
  return children;
};

UserStateGuard.propTypes = {
  children: PropTypes.node,
  state: PropTypes.oneOf([
    "NOGROUP",
    "GROUPFORMING_HOST",
    "GROUPFORMING_GUEST",
    "GROUPFORMING_HOST_LOBBY",
    "GROUPFORMING_LOBBY",
    "INGREDIENTENTERING",
    "INGREDIENTENTERING_LOBBY",
    "INGREDIENTVOTING",
    "INGREDIENTVOTING_LOBBY",
    "FINAL",
    "RECIPE",
  ]).isRequired,
};

export default UserStateGuard;
