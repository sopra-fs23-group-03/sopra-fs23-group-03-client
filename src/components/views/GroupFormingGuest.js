import { useState } from "react";
import { Spinner } from "components/ui/Spinner";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import useInvitationActions from "hooks/useInvitationActions";
import useGroupMembers from "hooks/useGroupMembers";

const GroupFormingGuest = ({ buttonLabel }) => {
  const history = useHistory();
  const { groupId } = useParams();
  const [joinedGroup, setJoinedGroup] = useState(false); // add state variable for tracking if user joined group
  const { group, users } = useGroupMembers(groupId);

  const { handleAcceptInvitation, handleRejectInvitation } =
    useInvitationActions();

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
                  Members
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
                  <button
                    className="groupforming cancel-button"
                    width="24%"
                    onClick={() => {
                      if (
                        window.confirm(
                          "By leaving the group, you'll miss out on the fun! Are you sure you want to exit?"
                        )
                      ) {
                        history.push("/game");
                      }
                    }}
                  >
                    Exit Group
                  </button>
                  {joinedGroup ? (
                    <button
                      className="groupforming general-button"
                      width="24%"
                      onClick={() => {
                        handleRejectInvitation(groupId);
                      }}
                    >
                      {buttonLabel}
                    </button>
                  ) : (
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
                  )}
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
