import React from "react";
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import "styles/views/GroupCreation.scss";
import BaseContainer from "components/ui/BaseContainer";
import AppContainer from "components/ui/AppContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import Group from "models/Group"; //added
import NotificationBar from "components/views/NotificationBar";

const GroupCreation = (props) => {
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [users, setUsers] = useState(null);
  const [isInvited, setIsInvited] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [votingType, setVotingType] = useState("MAJORITYVOTE");
  const [hostId, setHostId] = useState(localStorage.getItem("userId"));
  //const [group, setGroup] = useState(null);

  const createGroup = async () => {
    try {
      const requestBody = {
        hostId: Number(hostId),
        groupName: groupName,
        votingType: votingType,
      };
      const response = await api.post("/groups", requestBody, { headers });
      const group = new Group(response.data); //added
      const groupId = group.id;
      console.log(invitedUsers);

      if (
        !Array.isArray(invitedUsers) ||
        invitedUsers.some((id) => typeof id !== "number")
      ) {
        throw new Error("invitedUsers must be an array of Long values");
      }
      await api.post(`/groups/${groupId}/invitations`, invitedUsers, {
        headers,
      });
      setInvitedUsers(invitedUsers);
      <NotificationBar invitedUsers={invitedUsers} />;

      history.push(`/groupforming/${groupId}/host`);
    } catch (error) {
      console.error(
        `Something went wrong while creating the group: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while creating the group! See the console for details."
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users", { headers });
        setUsers(response.data);
        console.log(response);
      } catch (error) {
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

    fetchData();
  }, []);

  const toggleInvitation = (user) => {
    if (invitedUsers.includes(user.id)) {
      setInvitedUsers(invitedUsers.filter((id) => id !== user.id));
    } else {
      setInvitedUsers([...invitedUsers, user.id]);
    }
  };

  const Person = ({ user }) => (
    <div key={user.id} className="person container">
      <div className="person username">{user.username}</div>
      <button onClick={() => toggleInvitation(user)}>
        <i className="person add">person_add</i>
      </button>
    </div>
  );

  Person.propTypes = {
    user: PropTypes.object,
  };

    return (
      <AppContainer>
        <BaseContainer>
            <div className="group-creation form">
              <h1 className="group-creation title"> Form your group </h1>

          <div className="group-creation field">
            <div className="group-creation label"> Group Name </div>
            <input
              className="group-creation input"
              placeholder="enter here.."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="group-creation field">
            <div className="group-creation label"> Voting Type </div>
            <div className="group-creation voting">
              <button className="group-creation voting-button">
                <i className="group-creation icon">timeline</i>
                Point Distribution
              </button>
              <button className="group-creation voting-button majority">
                <i className="group-creation icon">star</i>
                Majority
              </button>
            </div>
          </div>

          <div className="group-creation field">
            <div className="group-creation label">
              Who do you want to invite?
            </div>
            <div className="group-creation people">
              {users
                ?.filter(
                  (user) =>
                    user.id != localStorage.getItem("userId") &&
                    user.status === "ONLINE" &&
                    !user.groupId
                )
                .map((user) => (
                  <div className="person container" key={user.id}>
                    <div className="person username">{user.username}</div>
                    <button
                      className="person add"
                      onClick={() => toggleInvitation(user)}
                    >
                      {invitedUsers.includes(user.id) ? "done" : "person_add"}
                    </button>
                  </div>
                ))}
            </div>

            <div className="group-creation buttons">
              <div
                className="group-creation button"
                onClick={() => history.push("/game")}
              >
                Delete group
              </div>
              <div
                className="group-creation button continue"
                onClick={createGroup}
              >
                Continue
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </AppContainer>
  );
};

export default GroupCreation;
