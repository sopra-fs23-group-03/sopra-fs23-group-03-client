import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import "styles/views/Final.scss";
import "styles/views/Final.scss";
import "styles/views/GroupFormingHost.scss";
import "styles/views/Dashboard.scss";
import { useParams } from "react-router-dom";
import { Spinner } from "components/ui/Spinner";

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
  const [recipe, setRecipe] = useState(null);
  const { groupId } = useParams();
  const numericGroupId = groupId.substring(1);
  console.log("groupId,", groupId);

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/groups/${numericGroupId}/result`, {
          headers,
        });

        // Get the returned users and update the state.
        setRecipe(response.data);

        console.log(response.data); // log the response data to the console
        setRecipe(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${
            handleError(error).info
          }`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  if (!recipe) {
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
                Host: &nbsp;
              </div>
              <div className="groupforming sidebar-buttons">
                <i className="ingredientsvoting icon majority">bar_chart</i> Voting System: Majority &nbsp;
              </div>
              <ul className="groupforming invite-users">
                <h3 className="player container">
                  <i className="material-icons">people_outline</i>
                  &nbsp; Guests &nbsp;
                </h3>
              </ul>
            </div>
            <BaseContainer>
              <div className="final main">
                <i className="final icon">sentiment_satisfied</i>
                <div className="final title">Everything is set!</div>
              </div>

              <div className="final section">
                <InfoField label="Recipe" value={recipe?.title} />
                <InfoField
                  label="Approx. time"
                  value={(recipe?.readyInMinutes + " minutes").replace("null", "'")}
                  />
              </div>
              <div className="final button" onClick={() => history.push("/dashboard")}>
                Back to main page
              </div>
            </BaseContainer>
          </div>
        </div>
      </AppContainer>

      
      
    );
  }
};

export default Final;
