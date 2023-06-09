import React from "react";
import AppContainer from "components/ui/AppContainer";
import BaseContainer from "components/ui/BaseContainer";
import { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Group from "models/Group";
import { api, handleError } from "helpers/api";
import { useContext } from "react";
import UserContext from "components/contexts/UserContext";
import "styles/views/IngredientsVoting.scss";
import "styles/views/GroupFormingHost.scss";

const IngredientsFinal = () => {
  const history = useHistory();

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [userId, setId] = useState(localStorage.getItem("userId"));
  const [guests, setGuests] = useState([]);
  const [group, setGroup] = useState(null);
  const groupId = localStorage.getItem("groupId");
  const { user, setUser } = useContext(UserContext);
  console.log("user state: " + user.state);

  const [finalIngredients, setFinalIngredients] = useState([]);

  const handleContinue = async (groupId, userId) => {
    try {
      await api.put(`/users/${user.id}/${groupId}/ready`, null, {
        headers,
      });

      setUser({ ...user, groupState: "FINAL_LOBBY" });
      console.log("user state: " + user.groupState);
      history.push(`/final/lobby`);
      // history.push(`/recipe/${groupId}`);
    } catch (error) {
      handleError(error);
    }
  };

  const votes = {};

  useEffect(() => {
    async function fetchData() {
      try {
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const guestsResponse = await api.get(`/groups/${groupId}/guests`, {
          headers,
        });

        const finalIngredientsResponse = await api.get(
          `/groups/${groupId}/ingredients/final`,
          { headers }
        );

        // Get the returned group and update the state.
        setGroup(new Group(groupResponse.data));
        // Get the returned members and update the state.
        setGuests(guestsResponse.data);

        setFinalIngredients(finalIngredientsResponse.data);
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
                      Final ingredients{" "}
                    </div>
                    <div className="ingredientsvoting ingredients">
                      {finalIngredients && finalIngredients.length === 0 &&
                      <div className="ingredientsvoting text">All the ingredients have been voted out! You’ll now get a recipe with respect to your allergies and excluding your outvoted ingredients.</div>}

                      {finalIngredients && finalIngredients.length !== 0 &&
                        finalIngredients.map((ingredient) => (
                          <div
                            className="ingredientsvoting item"
                            key={ingredient.id}
                          >
                            {ingredient.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="groupforming buttons">
                <button
                  className="groupforming general-button"
                  width="24%"
                  onClick={() => {
                    handleContinue(groupId, user.id);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </BaseContainer>
        </div>
      </div>
    </AppContainer>
  );
};

export default IngredientsFinal;
