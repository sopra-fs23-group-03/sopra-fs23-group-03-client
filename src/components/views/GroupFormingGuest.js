import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import useInvitationActions from "hooks/useInvitationActions";
import useGroupMembers from "hooks/useGroupMembers";

const GroupFormingGuest = ({ exitbuttonLabel, buttonLabel }) => {
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const { groupId } = useParams();
  const [joinedGroup, setJoinedGroup] = useState(false); // add state variable for tracking if user joined group
  const { group, users } = useGroupMembers(groupId);
  const [confirmExit, setConfirmExit] = useState(false);

  const { handleAcceptInvitation, handleRejectInvitation } =
    useInvitationActions();

  useEffect(() => {
    if (confirmExit) {
      const confirmExitGroup = async () => {
        try {
          // Make a request to the backend to exit the group
          await api.put(`/groups/${groupId}/leave`, null, {
            headers: headers,
          });
          // Exit successful, redirect to the game page or any other desired destination
          history.push("/game");
        } catch (error) {
          // Handle the case when the exit was not successful
          // You can show an error message or perform any other desired action
          console.log("Failed to exit group");

          // Handle any network or server errors
          console.log("Error:", error);
        }
      };

      confirmExitGroup();
    }
  }, [confirmExit, groupId, headers, history]);

  let content = <Spinner />;

  if (users) {
    content = (
      <BaseContainer>
        <div className="groupforming form">
          <div className="groupforming main">
            <i className="group-icon">groups</i>
            <div className="groupforming text"> {group.groupName}</div>

            <div className="groupforming buttons">
              {" "}
              <div className="groupforming sidebar-buttons">
                <i className="material-icons">person</i> &nbsp; Host: &nbsp;{" "}
                {group.hostName}
                &nbsp;{" "}
              </div>
              <div className="groupforming sidebar-buttons">
                <i className="material-icons">bar_chart</i>
                &nbsp; Voting System: Majority &nbsp;{" "}
              </div>
            </div>

            <div className="groupforming sections">
              <div className="groupforming preferences">
                <div className="groupforming titles">
                  Guests
                  <div className="groupforming group-join-requests">
                    {users.map((user) => (
                      <div
                        className="groupforming group-join-request"
                        key={user.username}
                      >
                        <span className="groupforming player username">
                          {user.username}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="game container">
                {content}

                <div className="groupforming buttons">
                  <>
                    <button
                      className="groupforming cancel-button"
                      width="24%"
                      onClick={() => {
                        if (exitbuttonLabel === "Cancel") {
                          if (
                            window.confirm(
                              "By leaving, you'll miss out on the fun! Are you sure you don't want to join?"
                            )
                          ) {
                            handleRejectInvitation(groupId);
                          }
                        } else {
                          if (
                            window.confirm(
                              "By leaving the group, you'll miss out on the fun! Are you sure you want to exit?"
                            )
                          )
                            setConfirmExit(true);
                        }
                      }}
                    >
                      {exitbuttonLabel}
                    </button>
                    <button
                      className="groupforming general-button"
                      width="24%"
                      onClick={() => {
                        if (buttonLabel === "Ready") {
                          history.push(`/ingredients/${groupId}`);
                        } else {
                          setJoinedGroup(true);
                          handleAcceptInvitation(groupId);
                        }
                      }}
                    >
                      {buttonLabel}
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
      // </div>
    );
  }

  return (
    <AppContainer>
      <div className="game container">{content}</div>;
    </AppContainer>
  );
};

GroupFormingGuest.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default GroupFormingGuest;
