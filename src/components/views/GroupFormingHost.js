import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
//http://localhost:x3000/groupforming/host/:1

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
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const [userId, setId] = useState(localStorage.getItem("userId"));

  const [users, setUsers] = useState(null);
  // const [group, setGroup] = useState(null);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users", { headers });
        //const groupsResponse = await api.get("/groups");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        //setGroups(groupsResponse.data);

        // See here to get more data.
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

  let content = <Spinner />;

  if (users) {
    const otherUsers = users.filter((user) => user.id !== userId);

    content = (
      <div className="groupforming main-container">
        <div className=" groupforming sidebar">
          <div className="groupforming sidebar-buttons">
            <i className="material-icons">person</i> &nbsp; Host: host_user
            &nbsp;
          </div>

          <div className="groupforming sidebar-buttons">
            <i className="material-icons">bar_chart</i>
            &nbsp; Voting System: Majority &nbsp;
          </div>

          <ul className="groupforming invite-users">
            <h3 className="player container">
              <i className="material-icons">people_outline</i>
              &nbsp; Invite Users &nbsp;
            </h3>

            {otherUsers.map((user) => (
              <div
                className={`player container ${user.status.toLowerCase()}`}
                key={user.id}
                // onClick={() => history.push(`/users/${user.id}`)}
              >
                <i className="person-icon">person_add</i>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {user.username}
              </div>
            ))}
          </ul>
        </div>

        <BaseContainer>
          <div className="groupforming form">
            <div className="groupforming main">
              <i className="group-icon">groups</i>
              <div className="groupforming text"> Group A </div>

              <div className="groupforming sections">
                <div className="groupforming preferences">
                  <div className="groupforming titles">
                    Guests
                    <div className="groupforming group-join-requests">
                      {users.map((user) => (
                        <div
                          className="groupforming group-join-request"
                          key={user.username}
                        >
                          <span className="groupforming player username">
                            {user.username}
                          </span>
                          {/* <button className="material-icons reply-button">
                            done
                          </button> */}
                          <button className="material-icons reply-button">
                            delete_outline
                          </button>
                        </div>
                      ))}
                      {/* <div className="groupforming group-join-request">
                        <span className=" player username">player B</span>
                        <div className="groupforming button-container"></div>
                        <button className="groupforming material-icons reply-button">
                          delete_outline
                        </button>
                      </div>
                      <div className="groupforming group-join-request">
                        <span className="player username ">player C</span>
                        <div className="groupforming button-container"></div>
                        <button className="groupforming material-icons reply-button">
                          delete_outline
                        </button>
                      </div> */}
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
                        history.push("/game");
                      }
                    }}
                    // onClick={() => {
                    //   history.push("/dashboard");
                    // send notification to all users in group
                    // cancel the notifications for the invites
                    // }}
                  >
                    Delete Group
                  </button>
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      history.push("/ingredients/:1");
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
