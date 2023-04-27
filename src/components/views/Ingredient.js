import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import ToDoList from "components/ui/List";

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const InfoField = (props) => {
  return (
    <div className="profile field">
      <label className="profile titles">{props.label}</label>

      <input
        className="profile input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

InfoField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
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
            <i className="material-icons">groups</i> &nbsp; Group: group_name
            &nbsp;
          </div>
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
              &nbsp; Guests &nbsp;
            </h3>

            {otherUsers.map((user) => (
              <div
                className={`player container ${user.status.toLowerCase()}`}
                key={user.id}
              >
                {user.username}
              </div>
            ))}
          </ul>
        </div>

        <BaseContainer>
          <div className="groupforming form">
            <div className="groupforming main">
              <i className="group-icon">food_bank_outlined</i>
              <div className="groupforming text"> Let's get cooking! </div>

              <div className="groupforming sections">
                <div className="groupforming preferences">
                  <div className="groupforming titles">
                    Which ingredients would you like to add?
                    <div className="groupforming group-join-requests">
                      <ToDoList></ToDoList>
                    </div>
                  </div>
                </div>
                <div className="groupforming buttons">
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      history.push("/final");
                    }}
                  >
                    Submit
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
