import { Redirect } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";

const GroupGuard = ({ children, state }) => {
  const [groupState, setGroupState] = useState(state);
  const [error, setError] = useState(null);
  const groupId = localStorage.getItem("groupId");
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    const fetchGroupState = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/state`, {
          headers,
        });
        const fetchedState = response.data;
        console.log("API response:", response);
        console.log("fetchedState:", fetchedState);
        setGroupState(fetchedState);
        // }
      } catch (error) {
        setError(handleError(error));
        console.error("API error:", error);
      }
    };

    fetchGroupState();
  }, []);

  if (error) {
    console.log("error", error);
    console.log("groupState", groupState);
    {
    }
    return <Redirect to="/dashboard" />;
  }

  if (groupState !== state) {
    return <Redirect to="/dashboard" />;
  }
  console.log("yeah!!!state is correct", state);
  return children;
};

GroupGuard.propTypes = {
  children: PropTypes.node,
  state: PropTypes.oneOf([
    "GROUPFORMING",
    "INGREDIENTENTERING",
    "INGREDIENTVOTING",
    "FINAL",
  ]).isRequired,
};

export default GroupGuard;
