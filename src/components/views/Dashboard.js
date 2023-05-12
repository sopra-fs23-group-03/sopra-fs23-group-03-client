import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Dashboard.scss";
import AppContainer from "components/ui/AppContainer";
import AuthContext from "components/contexts/AuthContext";
import { useContext } from "react";

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
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  // define state variables for users and groups
  const [users, setUsers] = useState(null);
  const [groups, setGroups] = useState(null);
  const [members, setMembers] = useState({});
  const [joinRequests, setJoinRequests] = useState({});
  const userId = localStorage.getItem("userId");
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch updated data for users
        const usersResponse = await api.get("/users", { headers });
        setUsers(usersResponse.data);

        // Fetch updated data for groups
        const groupsResponse = await api.get("/groups", { headers });
        setGroups(groupsResponse.data);

        // Fetch updated data for group members
        groupsResponse.data.forEach(async (group) => {
          const membersResponse = await api.get(`/groups/${group.id}/guests`, {
            headers,
          });

          const membersData = membersResponse.data;
          setMembers((prevMembers) => {
            return {
              ...prevMembers,
              [group.id]: membersData.length
                ? membersData.map((member) => ({
                    id: member.id,
                    username: member.username,
                  }))
                : [],
            };
          });
        });
      } catch (error) {
        console.error(
          `Something went wrong while fetching the data: \n${handleError(
            error
          )}`
        );

        console.error("Details:", error);
        try {
          await api.get(`/users/${userId}`, {
            headers,
          });
        } catch (error) {
          setIsLoggedIn(false);
          localStorage.clear(); // Clear local storage
        }
        alert(
          "Something went wrong while fetching the data! See the console for details."
        );
      }
    }, 2000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load joinRequests from localStorage on component mount
  useEffect(() => {
    const storedJoinRequests =
      JSON.parse(localStorage.getItem("joinRequests")) || {};
    setJoinRequests(storedJoinRequests);
  }, []);

  // ...

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

  // ...

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

  let content = <Spinner />;

  if (users) {
    //const otherUsers = users.filter((user) => user.id !== userId);
    const sortUsersByStatus = (userA, userB) => {
      if (userA.status === "ONLINE" && userB.status !== "ONLINE") {
        return -1;
      } else if (userA.status !== "ONLINE" && userB.status === "ONLINE") {
        return 1;
      } else {
        return 0;
      }
    };

    content = (
      <div className="game main-container">
        <div className=" game sidebar">
          <Button
            className="game sidebar-buttons"
            onClick={() => history.push("/group-creation")}
          >
            <i className="material-icons">groups</i> &nbsp; Form Group &nbsp;
          </Button>

          <Button
            className="game sidebar-buttons"
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
                onClick={() => history.push(`/profile/${user.id}`)}
              >
                <div className="status-circle" />

                {user.username}
              </Button>
            ))}
          </ul>
        </div>

        <div className=" game  group-container">
          <h2>Groups</h2>

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
                          <li className="game player username" key={member.id}>
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
                    disabled={joinRequests[group.id]}
                  >
                    {joinRequests[group.id] ? (
                      <i className="material-icons done-icon">done</i>
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
      {/* <BaseContainer> */}
      <div className="game container">{content}</div>;{/* </BaseContainer> */}
    </AppContainer>
  );
};

export default Dashboard;
