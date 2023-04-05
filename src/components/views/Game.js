import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

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
  const [userId, setId] = useState(localStorage.getItem("userId"));

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const [groups, setGroups] = useState(null);

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");
        //const groupsResponse = await api.get("/groups");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        //setGroups(groupsResponse.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

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
      <div className="game main-container">
        <div className=" game sidebar">
          <Button
            className="game sidebar-buttons"
            onClick={() => history.push("/groups")}
          >
            <i class="material-icons">groups</i> &nbsp; Form Group &nbsp;
          </Button>

          <Button
            className="game sidebar-buttons"
            onClick={() => history.push("/solo")}
          >
            <i className="material-icons">person</i>
            &nbsp; Go Solo &nbsp;
          </Button>

          <ul className="game user-list">
            <h3 className="player container">
              <i className="material-icons">group</i>
              &nbsp; Users &nbsp;
            </h3>

            {otherUsers.map((user) => (
              <Button
                className={`player container ${user.status.toLowerCase()}`}
                key={user.id}
                onClick={() => history.push(`/users/${user.id}`)}
              >
                <div className="status-circle" />

                {user.username}
              </Button>
            ))}
          </ul>
        </div>

        <div className=" game  group-container">
          <h2>GROUPS</h2>

          <div className="game group-container-labels">
            <label className="game label-text"> Group Name</label>
            <label className="game label-text"> Host</label>
            <label className="game label-text"> Members</label>
          </div>
          <div className="game group-list">
            {groups ? (
              groups.map((group) => (
                <div className="group" key={group.id}>
                  <h2>{group.name}</h2>
                  <ul className="game group user-list">
                    {group.users.map((userId) => {
                      const user = users.find((user) => user.id === userId);
                      if (user) {
                        return (
                          <li key={user.id}>
                            <Player user={user} />
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <div className="game group list">
                <h3>No Groups Yet</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div className="game container">{content}</div>;
};

export default Game;
