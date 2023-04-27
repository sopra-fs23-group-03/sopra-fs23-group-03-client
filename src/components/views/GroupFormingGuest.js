import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
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
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const [userId, setId] = useState(localStorage.getItem("userId"));

  const [users, setUsers] = useState(null);
  // const [group, setGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(false); // add state variable for tracking if user joined group

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
      // <div className="groupforming main-container">
      //   <div className=" groupforming sidebar">
      //     <div className="groupforming sidebar-buttons">
      //       <i className="material-icons">person</i> &nbsp; Host: host_user
      //       &nbsp;
      //     </div>

      //     <div className="groupforming sidebar-buttons">
      //       <i className="material-icons">bar_chart</i>
      //       &nbsp; Voting System: Majority &nbsp;
      //     </div>
      //   </div>

      <BaseContainer>
        <div className="groupforming form">
          <div className="groupforming main">
            <i className="group-icon">groups</i>
            {/* <i className="group-icon" data-feather="users"></i> */}
            <div className="groupforming text"> Group A </div>

            <div className="groupforming buttons">
              {" "}
              <div className="groupforming sidebar-buttons">
                <i className="material-icons">person</i> &nbsp; Host: host_user
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
                      </div>
                    ))}
                    <div className="groupforming group-join-request">
                      <span className=" player username">player B</span>
                    </div>
                    <div className="groupforming group-join-request">
                      <span className="player username ">player C</span>
                    </div>
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
                      history.push("/game");
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
                      history.push("/ingredients/:1");
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
