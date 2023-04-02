import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";



export const ProfileGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to="/register"/>;
};

ProfileGuard.propTypes = {
  children: PropTypes.node
};