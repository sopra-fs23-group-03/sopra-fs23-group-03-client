import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import "styles/views/Final.scss";
import AppContainer from "components/ui/AppContainer";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";
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

const GoSoloFinal = () => {
  const history = useHistory();
  const [recipe, setRecipe] = useState(null);
  const [seeInstructions, setSeeIstructions] = useState(false);
  const userId = localStorage.getItem("userId")

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
         const recipeResponse = await api.get(`/users/${userId}/solo/result`, {
           headers,
         });

         // Get the returned users and update the state.
         setRecipe(recipeResponse.data);
         console.log(recipe)
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

  if (!recipe) {
    return (
      <AppContainer>
        <Spinner />
      </AppContainer>
    );}
   
  
  else {
    return (
      <AppContainer>
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
                    src={recipe.image}
                  />
                  <div className="final section">
                    <InfoField label="Recipe" value={recipe[0].title} />

                    <InfoField
                      label="Approx. time"
                      value={(recipe[0].readyInMinutes + " minutes").replace(
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
                      <i className="final icon">shopping_cart</i>
                      <h3 className="final label"> Shopping list </h3>
                    </div>
                    <ul class="list">
                      {recipe[0].missedIngredients.map((ingredient) => (
                        <li>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  className="final button"
                //   onClick={() => {
                //     // make the user groupState in the user context "NOGROUP"
                //     setUser({ ...user, groupState: "NOGROUP" });
                //     history.push(`/dashboard`);
                //     localStorage.removeItem("groupId");
                //   }}
                >

                  Back to home page
                </button>
               </div>
            </BaseContainer>

        {seeInstructions && 
        <div id="modal-root">
          <div className="modal">
            <div className="modal-form">
              <i className="final icon clickable" onClick={hideInstructions}>close</i>
              <div  className="modal-text" dangerouslySetInnerHTML={{__html: `${recipe[0].instructions}`}} />

              <div  className="modal-text" dangerouslySetInnerHTML={{__html: `${recipe[0].instructions}`}} />
            </div>
          </div>

        </div>}

      </AppContainer>
    );
    
  }
      
};

export default GoSoloFinal;
