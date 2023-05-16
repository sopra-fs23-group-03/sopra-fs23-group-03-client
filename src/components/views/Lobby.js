import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import { Spinner } from "components/ui/Spinner";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";

const Lobby = ({ groupState, message, nextRoute }) => {
  const history = useHistory();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);

  const groupId = localStorage.getItem("groupId");
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    const fetchGroupState = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/state`, { headers });
        const state = response.data;
        setState(state); // Update the groupState
        if (groupState === state) {
          history.push(nextRoute.replace(":groupId", groupId));
        }
      } catch (error) {
        setError(handleError(error));
        console.error("Details:", error);
      }
    };

    const interval = setInterval(fetchGroupState, 4000); // Polling every 3 seconds

    return () => {
      clearInterval(interval);
    };
    // }, [groupId, headers, history, nextRoute, state]);
  }, []);

  let content = <Spinner />;

  if (error) {
    // Display the error message
    content = <p>Error: {error}</p>;
  } else {
    content = (
      <BaseContainer>
        <h3>{message}</h3>
      </BaseContainer>
    );
  }

  return (
    <AppContainer>
      <div className="lobby main-container">
        {content}
        <Spinner /> ]
      </div>
    </AppContainer>
  );
};

export default Lobby;
