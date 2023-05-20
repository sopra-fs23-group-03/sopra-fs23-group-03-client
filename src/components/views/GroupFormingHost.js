import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import { useParams } from "react-router-dom";
import useGroupMembersPolling from "hooks/useGroupMembersPolling";
import UserContext from "components/contexts/UserContext";
import { useContext } from "react";

const GroupFormingHost = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const { group, users } = useGroupMembersPolling(groupId);
  const { user, setUser } = useContext(UserContext);
  const [guestReadyStatus, setGuestReadyStatus] = useState({});
  console.log("user state:", user.groupState);

  const [joinRequests, setJoinRequests] = useState([]);
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const handleDelete = async () => {
    if (Object.values(guestReadyStatus).includes(true)) {
      // If any user is ready, do not proceed with the deletion
      alert("Cannot delete group while users are ready!");
    }
    try {
      await api.delete(`/groups/${groupId}`, { headers });
      // make the groupstate=="NOGROUP" in the user context:
      setUser({ ...user, groupState: "NOGROUP", groupId: null });
      localStorage.removeItem("groupId");
      history.push("/dashboard");
    } catch (error) {
      handleError(error);
    }
  };

  const fetchReady = async () => {
    try {
      console.log("user id: ", user.id);

      const response = await api.get(`/groups/${groupId}/members/ready`, {
        headers,
      });

      setGuestReadyStatus(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const isGuestReady = (guestId) => {
    return guestReadyStatus[guestId] === true;
  };

  let allUsersReady = false;

  if (users && users.length > 0) {
    allUsersReady = true;
    for (const user of users) {
      if (!isGuestReady(user.id)) {
        allUsersReady = false;
        break;
      }
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await api.get(`/groups/${groupId}/requests`, {
        headers,
      });
      setJoinRequests(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Poll for requests every 5 seconds
    const intervalRequests = setInterval(fetchRequests, 3000);
    const intervalReady = setInterval(fetchReady, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalRequests);
      clearInterval(intervalReady);
    };
  }, []);

  const handleAcceptRequest = async (guestId) => {
    try {
      await api.put(
        `/groups/${groupId}/requests/accept`,
        { guestId },
        { headers }
      );
      // Handle success or update the UI accordingly
    } catch (error) {
      handleError(error);
    }
  };

  const handleRejectRequest = async (guestId) => {
    try {
      await api.put(
        `/groups/${groupId}/requests/reject`,
        { guestId },
        { headers }
      );
      fetchRequests();
      // Handle success or update the UI accordingly
    } catch (error) {
      handleError(error);
    }
  };

  const handleContinue = async () => {
    try {
      await api.put(`/users/${user.id}/${groupId}/ready`, null, {
        headers,
      });

      setUser({ ...user, groupState: "GROUPFORMING_HOST_LOBBY" });
      history.push("/groupforming/host/lobby");
    } catch (error) {
      handleError(error);
    }
  };

  let content = [];

  if (group && users) {
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
                            className={`groupforming group-join-request ${
                              isGuestReady(member.id) ? "ready" : ""
                            }`}
                            key={member.username}
                          >
                            <span className="groupforming player username">
                              {member.username}
                            </span>
                          </div>
                        ))}

                      {joinRequests &&
                        joinRequests.map((joinRequest) => (
                          <div
                            className="groupforming group-join-request"
                            key={joinRequest.id} // Assuming the join request has an `id` property
                          >
                            <span className="groupforming player username">
                              {joinRequest.username}{" "}
                              {/* Assuming the username is available */}
                            </span>
                            <button
                              className="material-icons groupforming reply-button"
                              onClick={() =>
                                handleAcceptRequest(joinRequest.id)
                              }
                            >
                              done
                            </button>
                            <button
                              className="material-icons groupforming reply-button"
                              onClick={() =>
                                handleRejectRequest(joinRequest.id)
                              }
                            >
                              delete_outline
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="groupforming buttons">
                  <button
                    className={`groupforming general-button ${
                      Object.values(guestReadyStatus).some(
                        (value) => value === true
                      )
                        ? "disabled-button"
                        : ""
                    }`}
                    width="24%"
                    onClick={handleDelete}
                    disabled={Object.values(guestReadyStatus).some(
                      (value) => value === true
                    )}
                  >
                    Delete Group
                  </button>
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={handleContinue}
                    disabled={!allUsersReady} // Step 3: Disable the button if not all users are ready
                    onMouseOver={() => {
                      if (!allUsersReady) {
                        alert("Cannot continue until all guests are ready!"); // Step 4: Show a tooltip or message when the host hovers over the disabled button
                      }
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
