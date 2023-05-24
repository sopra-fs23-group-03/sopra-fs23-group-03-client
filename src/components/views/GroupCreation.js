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
import UserContext from "components/contexts/UserContext";
import { useContext } from "react";
import ErrorModal from "components/ui/ErrorModal";

const GroupCreation = () => {
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [users, setUsers] = useState(null);
  const [guests, setGuests] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const votingType = "MAJORITYVOTE";
  const hostId = localStorage.getItem("userId");
  const { user, setUser } = useContext(UserContext);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");

  const createGroup = async () => {
    if (groupName.length < 3 || groupName.length > 9) {
      setError("Group name has to be between 3 and 9 characters");
      setShowErrorModal(true);
      return;
    }

    if (groupName.includes(" ")) {
      setError("Group name cannot include spaces");
      setShowErrorModal(true);
      return;
    }

    try {
      const requestBody = {
        hostId: Number(hostId),
        groupName: groupName,
        votingType: votingType,
      };
      const response = await api.post("/groups", requestBody, { headers });
      const group = new Group(response.data);
      const groupId = group.id;

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
      localStorage.setItem("groupId", group.id);
      <NotificationBar invitedUsers={invitedUsers} />;

      setUser({ ...user, groupState: "GROUPFORMING_HOST", groupId: groupId });
      history.push(`/groupforming/${groupId}/host`);
    } catch (error) {
      setError(
        `Something went wrong while creating the group:  ${error.response.data.message} ${error}`
      );

      setShowErrorModal(true);
      console.error("Details:", error);
    }
  };

  useEffect(() => {
    let fetchDataInterval;
    async function fetchData() {
      // do polling to fetch the users every 2 seconds
      try {
        const response = await api.get("/users", { headers });
        setUsers(response.data);
      } catch (error) {
        setError(
          `Something went wrong while creating the group: <br />${error.response.data.message}<br />${error}`
        );
        setShowErrorModal(true);
        console.error("Details:", error);
      }
      console.log(invitedUsers, groupName);
    }

    fetchData();

    fetchDataInterval = setInterval(fetchData, 3000); // Polling every 3 seconds

    return () => {
      clearInterval(fetchDataInterval); // Clean up the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    setGuests(
      users?.filter(
        (user) =>
          user.id != localStorage.getItem("userId") &&
          user.status === "ONLINE" &&
          !user.groupId
      )
    );

    console.log(users);
    console.log(guests);
  }, [users]);

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
            <div className="group-creation small-text">
              only alphabetic characters allowed
            </div>
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
              {guests?.length === 0 && (
                <div className="group-creation no-users">
                  {" "}
                  No users available{" "}
                </div>
              )}

              {guests?.length !== 0 &&
                guests?.map((user) => (
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
              <button
                className="group-creation button"
                onClick={() => history.push("dashboard")}
              >
                Cancel
              </button>
              <button
                className="group-creation button continue"
                disabled={
                  groupName === "" ||
                  guests.length === 0 ||
                  invitedUsers.length === 0
                }
                onClick={createGroup}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </BaseContainer>
      {showErrorModal && (
        <ErrorModal
          message={error}
          onConfirm={() => setShowErrorModal(false)}
        />
      )}
    </AppContainer>
  );
};

export default GroupCreation;
