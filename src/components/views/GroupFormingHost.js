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

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const GroupFormingHost = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [userId, setId] = useState(localStorage.getItem("userId"));
  const [users, setUsers] = useState(null);
  const [invitationStatus, setInvitationStatus] = useState({});

  const [group, setGroup] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const membersResponse = await api.get(`/groups/${groupId}/members`, {
          headers,
        });
        setGroup(new Group(groupResponse.data));
        setUsers(membersResponse.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    const otherUsers = users.filter((user) => user.id !== userId);
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
                    Members
                    <div className="groupforming group-join-requests">
                      {users.map((member) => (
                        <div
                          className="groupforming group-join-request"
                          key={member.username}
                        >
                          <span className="groupforming player username">
                            {member.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="groupforming buttons">
                  {/* <button
                    className="groupforming cancel-button"
                    width="24%"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Deleting the group will cancel the event for all guests. Are you sure you want to proceed? This action cannot be undone."
                        )
                      ) {
                        history.push("/game");
                      }
                    }}
                    onClick={() => {
                      history.push("/dashboard");
                   
                    }}
                  >
                    Delete Group
                  </button> */}
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      //history.push(`/ingredients/:${groupId}`);
                      history.push(`/final/:${groupId}`);
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
