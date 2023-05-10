import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import AppContainer from "components/ui/AppContainer";
import useGroupMembers from "hooks/useGroupMembers";

const Player = ({ user }) => (
  <div className="player container">
    <div className="status-circle">{user.status}</div>
    <div className="player username">{user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const [userId, setId] = useState(localStorage.getItem("userId"));

  // define state variables for users and groups
  const [users, setUsers] = useState(null);
  const [groups, setGroups] = useState(null);
  const [members, setMembers] = useState({});

  // useEffect hook to fetch data for users
  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const response = await api.get("/users", { headers });
        if (isMounted) {
          setUsers(response.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        history.push("/login");
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect hook to fetch data for group members
  useEffect(() => {
    let isMounted = true;

    async function fetchMembers(groupId) {
      let isMounted = true;
      try {
        const membersResponse = await api.get(`/groups/${groupId}/guests`, {
          headers,
        });
        if (isMounted) {
          const membersData = membersResponse.data;
          setMembers((prevMembers) => {
            return {
              ...prevMembers,
              [groupId]: membersData.length
                ? membersData.map((member) => ({
                    id: member.id,
                    username: member.username,
                  }))
                : [],
            };
          });
        }
      } catch (error) {
        console.error(
          `Something went wrong while fetching the group members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the group members! See the console for details."
        );
      }

      return () => {
        isMounted = false;
      };
    }

    async function fetchGroups() {
      try {
        const groupsResponse = await api.get("/groups", { headers });
        if (isMounted) {
          setGroups(groupsResponse.data);
          console.log(groupsResponse.data);

          // Fetch the members for each group
          groupsResponse.data.forEach((group) => {
            fetchMembers(group.id);
          });
        }
      } catch (error) {
        console.error(
          `Something went wrong while fetching the groups: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the groups! See the console for details."
        );
      }
    }

    fetchGroups();

    return () => {
      isMounted = false;
    };
  }, []);

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

export default Game;
