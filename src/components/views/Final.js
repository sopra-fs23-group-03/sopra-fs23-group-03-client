import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import "styles/views/Final.scss";
import "styles/views/GroupFormingHost.scss";
import { Spinner } from "components/ui/Spinner";
import useGroupMembers from "hooks/useGroupMembers";
import { useContext } from "react";
import UserContext from "components/contexts/UserContext";
const InfoField = (props) => {
  return (
    <div className="final field">
      <label className="final label">{props.label}</label>
      <span className="final input">{props.value}</span>
    </div>
  );
};
const Final = () => {
  const history = useHistory();
  const [recipes, setRecipes] = useState(null);
  const groupId = localStorage.getItem("groupId");
  const [seeInstructions, setSeeIstructions] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { group, users } = useGroupMembers(groupId);
  console.log("user state: " + user.groupState);
  useEffect(() => {
    // Save the group and users data in localStorage when they are fetched
    if (group && users) {
      localStorage.setItem("group", JSON.stringify(group));
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [group, users]);

  const showInstructions = () => {
    setSeeIstructions(true);
  };
  const hideInstructions = () => {
    setSeeIstructions(false);
  };
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const recipesResponse = await api.get(`/groups/${groupId}/result`, {
          headers,
        });

        // Get the returned users and update the state.
        setRecipes(recipesResponse.data);
        localStorage.setItem("recipes", JSON.stringify(recipesResponse.data));
        await api.put(`/users/${user.id}/${groupId}/ready`, null, {
          headers,
        });
        setUser({
          ...user,
          groupState: "RECIPE_STATIC",
        });
        history.push("/recipe");
      } catch (error) {
        alert(
          `Something went wrong while fetching the recipe: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (recipes && recipes[0]?.isRandomBasedOnIntolerances) {
      alert(
        "All the ingredients provided match with a group's allergy. But no worries, here's a random recipe fitting the group's allergies!"
      );
    }
  }, [recipes]);

  if (!recipes) {
    return (
      <AppContainer>
        <Spinner />
      </AppContainer>
    );
  } else {
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
                {users?.map((user) => (
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
              <div className="final form">
                <div className="final main">
                  <i className="final icon happy">sentiment_satisfied</i>
                  <div className="final title">Everything is set!</div>
                </div>
                <div className="final bottom">
                  <img
                    className="final img"
                    alt="recipe"
                    src={recipes[0]?.image}
                  />
                  <div className="final section">
                    <InfoField label="Recipe" value={recipes[0]?.title} />
                    <InfoField
                      label="Approx. time"
                      value={(recipes[0]?.readyInMinutes + " minutes").replace(
                        "null",
                        "'"
                      )}
                    />
                    <InfoField
                      label="Instructions"
                      value={
                        <i
                          className="final icon clickable"
                          onClick={showInstructions}
                        >
                          read_more
                        </i>
                      }
                    ></InfoField>
                  </div>
                </div>
                {recipes[0]?.usedIngredients.length !== 0 && (
                  <div className="final bottom">
                    <div className="final ingredients">
                      <div className="final ingredients-title">
                        <i className="final icon">kitchen</i>
                        <h3 className="final label"> Bring from home </h3>
                      </div>
                      <ul className="list">
                        {recipes[0]?.usedIngredients.map(
                          (ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="final ingredients">
                      <div className="final ingredients-title">
                        <i className="final icon">shopping_cart</i>
                        <h3 className="final label"> Shopping list </h3>
                      </div>
                      <ul className="list">
                        {recipes[0]?.missedIngredients.map(
                          (ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
                {recipes[0]?.usedIngredients.length === 0 && (
                  <div className="final ingredients solo">
                    <div className="final ingredients-title">
                      <i className="final icon">shopping_cart</i>
                      <h3 className="final label"> Shopping list </h3>
                    </div>
                    <ul className="list solo">
                      {recipes[0]?.missedIngredients.map(
                        (ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <button className="final button">Back to Landing Page</button>
              </div>
            </BaseContainer>
          </div>
        </div>
        {seeInstructions && (
          <div id="modal-root">
            <div className="modal">
              <div className="modal-form">
                <i className="final icon clickable" onClick={hideInstructions}>
                  close
                </i>
                <div
                  className="modal-text"
                  dangerouslySetInnerHTML={{
                    __html: `${recipes[0]?.instructions}`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </AppContainer>
    );
  }
};
export default Final;
