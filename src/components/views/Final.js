import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import "styles/views/Final.scss";
import "styles/views/GroupFormingHost.scss";
import { useParams } from "react-router-dom";
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
  console.log("user state: " + user.groupState);

  const showInstructions = () => {
    setSeeIstructions(true);
  };

  const hideInstructions = () => {
    setSeeIstructions(false);
  };

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const { group, users } = useGroupMembers(groupId);

  useEffect(() => {
    async function fetchData() {
      try {
        const recipesResponse = await api.get(`/groups/${groupId}/result`, {
          headers,
        });

        // Get the returned users and update the state.
        setRecipes(recipesResponse.data);
      } catch (error) {
        alert(
          `Something went wrong while fetching the recipe: \n${
            handleError(error).info
          }`
        );
        console.error("Details:", error);
      }
    }

    fetchData();
  }, []);

  if (!recipes) {
    return (
      <AppContainer>
        <Spinner />
      </AppContainer>
    );}
   
  
  else {
    return (
      <AppContainer>
        <div className="game container">
          <div className="groupforming main-container">
            <div className="groupforming sidebar">
              <div className="groupforming sidebar-buttons">
                <i className="ingredientsvoting icon"> location_home </i> &nbsp;
                Host: {group.hostName} &nbsp;
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
                {users.map((user) => (
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
                  <i className="final icon">sentiment_satisfied</i>
                  <div className="final title">Everything is set!</div>
                </div>
                <div className="final bottom">
                  <img
                    className="final img"
                    alt="recipe"
                    src={recipes[0].image}
                  />
                  <div className="final section">
                    <InfoField label="Recipe" value={recipes[0].title} />

                    <InfoField
                      label="Approx. time"
                      value={(recipes[0].readyInMinutes + " minutes").replace(
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

                <div className="final bottom">
                  <div className="final ingredients">
                    <div className="final ingredients-title">
                      <i className="final icon">kitchen</i>
                      <h3 className="final label"> Bring from home </h3>
                    </div>
                    <ul class="list">
                      {recipes[0].usedIngredients.map((ingredient) => (
                        <li>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="final ingredients">
                    <div className="final ingredients-title">
                      <i className="final icon">shopping_cart</i>
                      <h3 className="final label"> Shopping list </h3>
                    </div>
                    <ul class="list">
                      {recipes[0].missedIngredients.map((ingredient) => (
                        <li>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  className="final button"
                  onClick={() => {
                    // make the user groupState in the user context "NOGROUP"
                    setUser({ ...user, groupState: "NOGROUP" });
                    history.push(`/dashboard`);
                    localStorage.removeItem("groupId");
                  }}
                >

                  Back to home page
                </button>
              </div>
            </BaseContainer>
          </div>
        </div>

        {seeInstructions && 
        <div id="modal-root">
          <div className="modal">
            <div className="modal-form">
              <i className="final icon clickable" onClick={hideInstructions}>close</i>
              <div  className="modal-text" dangerouslySetInnerHTML={{__html: `${recipes[0].instructions}`}} />

              <div  className="modal-text" dangerouslySetInnerHTML={{__html: `${recipes[0].instructions}`}} />
            </div>
          </div>
        </div>}


      </AppContainer>
    );
    
  }
      
};

export default Final;
