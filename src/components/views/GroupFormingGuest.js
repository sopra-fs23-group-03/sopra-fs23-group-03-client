import { useEffect, useState, useMemo } from "react";
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
//http://localhost:3000/groupforming/guest:1

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const GroupFormingGuest = () => {
  const history = useHistory();
  const guestId = localStorage.getItem("userId");
  const { groupId } = useParams();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const [userId, setId] = useState(localStorage.getItem("userId"));
  const [users, setUsers] = useState(null);
  const [group, setGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(false); // add state variable for tracking if user joined group

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const membersResponse = await api.get(`/groups/${groupId}/members`, {
          headers,
        });
        // Get the returned group and update the state.
        setGroup(new Group(groupResponse.data));
        // Get the returned members and update the state.
        setUsers(membersResponse.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the group and its members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the group and its members! See the console for details."
        );
      }
    }
    fetchData();
  }, []);

  const handleAcceptInvitation = async (groupId, guestId) => {
    try {
      console.log(groupId, guestId);
      await api.put(
        `/groups/${groupId}/invitations/accept`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
    } catch (error) {
      console.error(error);
    }
    history.push(`/groupforming/${groupId}/guest`);
  };

  const handleRejectInvitation = async (groupId, guestId) => {
    try {
      console.log(groupId, guestId);
      await api.put(
        `/groups/${groupId}/invitations/reject`,
        JSON.stringify({ guestId }),
        {
          headers,
        }
      );
    } catch (error) {
      console.error(
        `Something went wrong while fetching the group and its members: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the group and its members! See the console for details."
      );
    }
  };

  let content = <Spinner />;

  if (users) {
    const otherUsers = users.filter((user) => user.id !== userId);
    content = (
      <BaseContainer>
        <div className="groupforming form">
          <div className="groupforming main">
            <i className="group-icon">groups</i>
            {/* <i className="group-icon" data-feather="users"></i> */}
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
                      history.push("/dashboard");
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
                      handleRejectInvitation(
                        groupId,
                        localStorage.getItem("userId")
                      );
                      // history.push("/ingredients/:1");
                      history.push(`/final/:${groupId}`);
                    }}
                  >
                    I'm ready
                  </button>
                ) : (
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      // join the group
                      setJoinedGroup(true);
                      handleAcceptInvitation(groupId, guestId);
                    }}
                  >
                    Join Group
                  </button>
                )}
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

export default GroupFormingGuest;
