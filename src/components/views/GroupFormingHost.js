import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import Group from "models/Group";
import { useParams } from "react-router-dom";
import useGroupMembers from "hooks/useGroupMembers";

const GroupFormingHost = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const { group, users } = useGroupMembers(groupId);
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const handleDelete = async () => {
    try {
      await api.delete(`/groups/${groupId}`, { headers });

      history.push("/game");
    } catch (error) {
      handleError(error);
    }
  };

  let content = [];

  if (group) {
    content = (
      <div className="groupforming main-container">
        <div className=" groupforming sidebar">
          <div className="groupforming sidebar-buttons">
            <i className="material-icons">person</i> &nbsp; Host:{" "}
            {group.hostName}&nbsp;
          </div>
          <div className="groupforming sidebar-buttons">
            <i className="material-icons">bar_chart</i>
            &nbsp; Voting System: Majority &nbsp;
          </div>
        </div>

        <BaseContainer>
          <div className="groupforming form">
            <div className="groupforming main">
              <i className="group-icon">groups</i>
              <div className="groupforming text"> {group.groupName}</div>

              <div className="groupforming sections">
                <div className="groupforming preferences">
                  <div className="groupforming titles">
                    Guests
                    <div className="groupforming group-join-requests">
                      {users &&
                        users.map((member) => (
                          <div
                            className="groupforming group-join-request"
                            key={member.username}
                          >
                            <span className="groupforming player username">
                              {member.username}
                            </span>
                            {/* <button className="material-icons reply-button">
      done
    </button> */}
                            <button className="material-icons reply-button">
                              delete_outline
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="groupforming buttons">
                  <button
                    className="groupforming cancel-button"
                    width="24%"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Deleting the group will cancel the event for all guests. Are you sure you want to proceed? This action cannot be undone."
                        )
                      ) {
                        handleDelete();
                      }
                    }}
                  >
                    Delete Group
                  </button>
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      history.push(`/ingredients/${groupId}`);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </BaseContainer>
      </div>
    );
  }

  return (
    <AppContainer>
      <div className="game container">{content}</div>;
    </AppContainer>
  );
};

export default GroupFormingHost;
