import { useState, useEffect, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import { useParams } from "react-router-dom";
import useGroupMembers from "hooks/useGroupMembers";
import UserContext from "components/contexts/UserContext";
import { useContext } from "react";

const GroupFormingHost = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const { group, users } = useGroupMembers(groupId);
  const { user, setUser } = useContext(UserContext);
  console.log("user state:", user.groupState);

  const [joinRequests, setJoinRequests] = useState([]);
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const handleDelete = async () => {
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
    const interval = setInterval(fetchRequests, 5000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
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
                            className="groupforming group-join-request"
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
                    // disable the button continue if there are no guests in the group
                    onClick={() => {
                      handleContinue();
                    }}
                    disabled={users.length == 0}
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
