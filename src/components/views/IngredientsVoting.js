import React from "react";
import AppContainer from "components/ui/AppContainer";
import BaseContainer from "components/ui/BaseContainer";
import { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Group from "models/Group";
import { api, handleError } from "helpers/api";
import "styles/views/IngredientsVoting.scss";
import "styles/views/GroupFormingHost.scss";
import { useContext } from "react";
import UserContext from "components/contexts/UserContext";

const IngredientsVoting = () => {
  const history = useHistory();

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [userId, setId] = useState(localStorage.getItem("userId"));
  const [guests, setGuests] = useState([]);
  const [group, setGroup] = useState(null);
  const groupId = localStorage.getItem("groupId");
  const { user, setUser } = useContext(UserContext);
  const [ingredients, setIngredients] = useState([]);

  const [votes, setVotes] = useState({});

  const handleVote = (ingredientId, vote) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [ingredientId]: vote,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const guestsResponse = await api.get(`/groups/${groupId}/guests`, {
          headers,
        });
        const ingredientsResponse = await api.get(
          `/groups/${groupId}/ingredients`,
          { headers }
        );
        // Get the returned group and update the state.
        setGroup(new Group(groupResponse.data));
        // Get the returned members and update the state.
        setGuests(guestsResponse.data);

        setIngredients(ingredientsResponse.data);
      } catch (error) {
        alert(
          `Something went wrong while fetching the group and its members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
      }
    }

    fetchData();
  }, []);

  const sendVotes = async () => {
    //se non ho votato tutto dai errore

    try {
      const requestBody = JSON.stringify(votes);
      await api.put(`/groups/${groupId}/ratings/${userId}`, requestBody, {
        headers,
      });
    } catch (error) {
      alert(
        `Something went wrong while sending your preferences: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
    }
    setUser({ ...user, groupState: "INGREDIENTVOTING_LOBBY" });
    console.log("user state:", user.groupState);
    history.push("/ingredientvoting/lobby");
  };

  return (
    <AppContainer>
      <div className="game container">
        <div className="groupforming main-container">
          <div className="groupforming sidebar">
            <div className="groupforming sidebar-buttons">
              <i className="ingredientsvoting icon"> location_home </i> &nbsp;
              Host: {group?.hostName} &nbsp;
            </div>

            <div className="groupforming sidebar-buttons">
              <i className="ingredientsvoting icon majority">bar_chart</i>{" "}
              Voting System: Majority &nbsp;
            </div>

            <ul className="groupforming invite-users">
              <h3 className="player container">
                <i className="material-icons">people_outline</i>
                &nbsp; Guests &nbsp;
              </h3>

              {guests &&
                guests.map((guest) => (
                  <div
                    className={`player container ${guest.status.toLowerCase()}`}
                    key={guest.id}
                  >
                    {guest.username}
                  </div>
                ))}
            </ul>
          </div>
          <BaseContainer>
            <div className="groupforming form">
              <div className="groupforming main">
                <i className="group-icon">groups</i>
                <div className="groupforming text">{group?.groupName}</div>
                <div className="groupforming sections">
                  <div className="groupforming preferences">
                    <div className="groupforming titles">
                      {" "}
                      Overall ingredients{" "}
                    </div>
                    <div className="ingredientsvoting ingredients">
                      {ingredients.map((ingredient) => (
                        <div
                          className="ingredientsvoting item"
                          key={ingredient.id}
                        >
                          {ingredient.name}
                          <div className="ingredientsvoting reactions">
                            <i
                              className="ingredientsvoting icon reaction"
                              onClick={() => handleVote(ingredient.id, 1)}
                              style={{
                                color:
                                  votes[ingredient.id] === 1 ? "#55a630" : "",
                              }}
                            >
                              sentiment_satisfied
                            </i>
                            <i
                              className="ingredientsvoting icon reaction"
                              onClick={() => handleVote(ingredient.id, 0)}
                              style={{
                                color:
                                  votes[ingredient.id] === 0 ? "#ffdd00	" : "",
                              }}
                            >
                              sentiment_neutral
                            </i>
                            <i
                              className="ingredientsvoting icon reaction"
                              onClick={() => handleVote(ingredient.id, -1)}
                              style={{
                                color:
                                  votes[ingredient.id] === -1 ? "#ff0000" : "",
                              }}
                            >
                              sentiment_dissatisfied
                            </i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="ingredientsvoting general-button"
                width="24%"
                disabled={Object.keys(votes).length != ingredients.length}
                onClick={() => {
                  sendVotes();
                }}
              >
                Submit
              </button>
            </div>
          </BaseContainer>
        </div>
      </div>
    </AppContainer>
  );
};

export default IngredientsVoting;
