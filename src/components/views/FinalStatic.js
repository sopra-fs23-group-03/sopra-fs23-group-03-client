import React, { useState } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import "styles/views/Final.scss";
import "styles/views/GroupFormingHost.scss";
import { Spinner } from "components/ui/Spinner";
import { useContext } from "react";
import UserContext from "components/contexts/UserContext";
import ErrorModal from "components/ui/ErrorModal";
import { useEffect } from "react";

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
  const recipes = JSON.parse(localStorage.getItem("recipes"));
  const groupId = localStorage.getItem("groupId");
  const [seeInstructions, setSeeIstructions] = useState(false);
  const { user, setUser } = useContext(UserContext);
  console.log("user state: " + user.groupState);
  const group = JSON.parse(localStorage.getItem("group"));
  const users = JSON.parse(localStorage.getItem("users"));
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [hasDisplayedErrorMessage, setHasDisplayedErrorMessage] =
    useState(false);

  const showInstructions = () => {
    setSeeIstructions(true);
  };

  const hideInstructions = () => {
    setSeeIstructions(false);
  };

  const handleContinue = async () => {
    try {
      localStorage.removeItem("groupId");
      localStorage.removeItem("group");
      localStorage.removeItem("users");
      localStorage.removeItem("recipes");
      localStorage.removeItem("hasDisplayedErrorMessage");
      setUser({
        ...user,
        groupState: "NOGROUP",
        groupId: null,
      });
      history.push("/dashboard");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const storedHasDisplayedErrorMessage = localStorage.getItem(
      "hasDisplayedErrorMessage"
    );
    if (
      !storedHasDisplayedErrorMessage &&
      recipes &&
      recipes[0]?.isRandomBasedOnIntolerances
    ) {
      setError(
        "All the ingredients provided match with a group's allergy. But no worries, here's a random recipe fitting the group's allergies!"
      );
      setShowErrorModal(true);
      setHasDisplayedErrorMessage(true);
      localStorage.setItem("hasDisplayedErrorMessage", true);
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

                <button
                  className="final button"
                  onClick={() => {
                    handleContinue(groupId, user.id);
                  }}
                >
                  Back to Landing Page
                </button>
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
        {showErrorModal && (
          <ErrorModal
            message={error}
            onConfirm={() => setShowErrorModal(false)}
          />
        )}
      </AppContainer>
    );
  }
};

export default Final;
