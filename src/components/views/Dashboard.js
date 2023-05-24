import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "styles/views/Dashboard.scss";
import AppContainer from "components/ui/AppContainer";
import { useContext } from "react";
import UserContext from "components/contexts/UserContext";
import ConfirmationModal from "components/ui/ConfirmationModal";
import NavigationBar from "./NavigationBar";

const Player = ({ user }) => (
  <div className="player container">
    <div className="status-circle">{user.status}</div>
    <div className="player username">{user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Dashboard = () => {
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  // define state variables for users and groups
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState({});
  const [joinRequests, setJoinRequests] = useState({});
  const { user, setUser } = useContext(UserContext);
  const userId = localStorage.getItem("userId");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userGroupId, setGroupId] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false); // State to track if instructions should be shown

  const handleConfirmation = (userGroupId) => {
    // Perform any necessary actions
    localStorage.setItem("groupId", userGroupId);
    setUser({ ...user, groupState: "GROUPFORMING_GUEST" });
    //localStorage.removeItem("joinRequests");
    localStorage.removeItem("joinRequests");

    setGroupId(userGroupId);
    history.push(`/groupforming/${userGroupId}/guest`);

    // Close the confirmation modal
    setShowConfirmationModal(false);
  };

  const fetchUsers = async () => {
    try {
      const usersResponse = await api.get("/users", { headers });
      setUsers(usersResponse.data);
    } catch (error) {
      //localStorage.clear();
      console.error(`Failed to fetch users data: \n${handleError(error)}`);
    }
  };

  const fetchGroups = async () => {
    try {
      const groupsResponse = await api.get("/groups", { headers });
      setGroups(groupsResponse.data);

      // Fetch group members immediately after fetching the groups
      groupsResponse.data.forEach((group) => {
        fetchGroupMembers(group.id);
      });
    } catch (error) {
      console.error(`Failed to fetch groups data: \n${handleError(error)}`);
    }
  };

  const fetchGroupMembers = async (groupId) => {
    try {
      const membersResponse = await api.get(`/groups/${groupId}/guests`, {
        headers,
      });
      const membersData = membersResponse.data;
      setMembers((prevMembers) => ({
        ...prevMembers,
        [groupId]: membersData.length
          ? membersData.map((member) => ({
              id: member.id,
              username: member.username,
            }))
          : [],
      }));
    } catch (error) {
      console.error(
        `Failed to fetch group members data: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    // Check if the user has registered
    const welcome = localStorage.getItem("welcome");
    if (welcome) {
      // Show the instructions popup
      setShowInstructions(true);
      // Clear the flag from localStorage
      localStorage.removeItem("welcome");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    const usersInterval = setInterval(fetchUsers, 5000);
    const groupsInterval = setInterval(fetchGroups, 5000);

    if (groups) {
      groups.forEach(async (group) => {
        await fetchGroupMembers(group.id);
      });
    }
    const membersIntervals = groups.map((group) =>
      setInterval(() => fetchGroupMembers(group.id), 10000)
    );

    return () => {
      clearInterval(usersInterval);
      clearInterval(groupsInterval);
      membersIntervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Load joinRequests from localStorage on component mount
  useEffect(() => {
    const storedJoinRequests =
      JSON.parse(localStorage.getItem("joinRequests")) || {};
    setJoinRequests(storedJoinRequests);
  }, []);

  // Update joinRequests and save it to localStorage
  const updateJoinRequests = (groupId, value) => {
    setJoinRequests((prevJoinRequests) => {
      const updatedJoinRequests = {
        ...prevJoinRequests,
        [groupId]: value,
      };
      localStorage.setItem("joinRequests", JSON.stringify(updatedJoinRequests));
      return updatedJoinRequests;
    });
  };

  const SendJoinRequest = async (groupId) => {
    try {
      await api.post(
        `/groups/${groupId}/requests`,
        { guestId: userId },
        { headers }
      );
      updateJoinRequests(groupId, true);
    } catch (error) {
      console.error(
        `Failed to send join request for group with id ${groupId}:`,
        error
      );
      alert("Failed to send join request. Please try again.");
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const checkGroupId = async () => {
        try {
          const response = await api.get(`/users/${userId}/groups`, {
            headers,
          });

          const userGroupId = response.data;
          console.log("userGroupId", userGroupId);

          if (Number.isInteger(userGroupId)) {
            //reload the page
            localStorage.setItem("groupId", userGroupId);

            //localStorage.removeItem("joinRequests");

            setGroupId(userGroupId);
            //NavigationBar(showNotificationBar);
            setShowConfirmationModal(true);
          }
        } catch (error) {
          console.error(`Failed to check groupId for user:`, error);
        }
      };

      for (const groupId in joinRequests) {
        if (joinRequests[groupId]) {
          checkGroupId(groupId);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [joinRequests]);

  let content = <Spinner />;

  //set interval 2'' to display the spinner

  if (users) {
    const sortUsersByStatus = (userA, userB) => {
      if (userA.status === "ONLINE" && userB.status !== "ONLINE") {
        return -1;
      } else if (userA.status !== "ONLINE" && userB.status === "ONLINE") {
        return 1;
      } else {
        return 0;
      }
    };

    // if there are users display the content
    if (users.length) {
      content = (
        <div className="game main-container">
          <div className=" game sidebar">
            <Button
              className="game sidebar-buttons create-group"
              onClick={() => history.push("/group-creation")}
            >
              <i className="material-icons">groups</i> &nbsp; Form Group &nbsp;
            </Button>

            <Button
              className="game sidebar-buttons solo"
              onClick={() => history.push("/solo")}
            >
              <i className="material-icons">person</i>
              &nbsp; Go Solo &nbsp;
            </Button>

            <ul className="game user-list">
              <ul className="game user-list-title">
                <i className="material-icons">group</i>
                &nbsp; Users &nbsp;
              </ul>
              {users.sort(sortUsersByStatus).map((user) => (
                <Button
                  className={`player container ${user.status.toLowerCase()}`}
                  key={user.id}
                  onClick={() => history.push(`users/profile/${user.id}`)}
                >
                  <div className="status-circle" />

                  {user.username}
                </Button>
              ))}
            </ul>
          </div>
          
          <div className=" game  group-container">

            <h2 className="title">Groups</h2>

            <div className="game group-container-labels">
              <label className="game label-text">Group</label>
              <label className="game label-text">Host</label>
              <label className="game label-text">Guests</label>
            </div>

            <div className="game group">
              {groups ? (
                groups.map((group) => (
                  <ul className="game group-list" key={group.id}>
                    <li className="game group-text">{group.groupName}</li>
                    <li className="game host-text">{group.hostName}</li>
                    <ul className="game group-members">
                      {members[group.id] &&
                        (members[group.id].length > 0 ? (
                          members[group.id].map((member) => (
                            <li
                              className="game player username"
                              key={member.id}
                            >
                              {member.username}
                            </li>
                          ))
                        ) : (
                          <li className="game no-members">No members yet</li>
                        ))}
                    </ul>
                    <button
                      className={`game join-group-button ${
                        joinRequests[group.id] ? "requested" : ""
                      }`}
                      onClick={() => SendJoinRequest(group.id)}
                      disabled={
                        group.groupState !== "GROUPFORMING" ||
                        joinRequests[group.id]
                      }
                    >
                      {joinRequests[group.id] &&
                      group.groupState === "GROUPFORMING" ? (
                        <i className="material-icons done-icon">done</i>
                      ) : joinRequests[group.id] &&
                        group.groupState !== "GROUPFORMING" ? (
                        <i className="material-icons exit-icon">block</i>
                      ) : (
                        <span>Join</span>
                      )}
                    </button>
                  </ul>
                ))
              ) : (
                <div className="game group ">
                  <h3>No Groups Yet</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <AppContainer>
        <div className="game container">
          {content}

          {showConfirmationModal && (
            <ConfirmationModal
              message="Your join request got accepted. You will be directed to the event."
              onConfirm={() => handleConfirmation(userGroupId)}
            />
          )}
          {showInstructions && (
            <ConfirmationModal
              message=" CollaborEat helps to find a suitable dish for your next planned meal. 
              Refine your profile and set your personal preferences. If you are all alone tonight, 
              try our go solo option to get a recipe suggestion based on your profile. If you feel more sociable, 
              you can start creating/joining a group with your friends. After you typed in the ingredients you want to contribute, 
              you can rate them. Taking also into account the group’s allergies you will recieve the best fitting recipe. Have fun!"
              onConfirm={() => setShowInstructions(false)}
            />
          )}
        </div>
      </AppContainer>
    );
  }
};

export default Dashboard;
