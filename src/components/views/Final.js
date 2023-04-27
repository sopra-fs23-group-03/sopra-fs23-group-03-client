import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import AppContainer from "components/ui/AppContainer";
import "styles/views/Final.scss";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const InfoField = (props) => {
  return (
    <div className="final field">
      <label className="final label">{props.label}</label>
      <input className="final input" />
    </div>
  );
};

const Final = () => {
  const history = useHistory();
  const [recipe, setRecipe] = useState(null);
  const { groupId } = useParams();
  console.log(groupId + ",groupId");

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/groups/${groupId}/result`, {
          headers,
        });

        // Get the returned users and update the state.
        setRecipe(response.data);

        console.log(response);
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

  return (
    <AppContainer>
      <BaseContainer>
        <div className="final main">
          <i className="final icon">sentiment_satisfied</i>
          <div className="final title">Everything is set!</div>
        </div>

        <div className="final section">
          <InfoField label="Recipe" />
          <InfoField label="Approx. time" />
          <InfoField label="Difficulty" />
        </div>
        <div className="final button" onClick={() => history.push("/game")}>
          Back to main page
        </div>
      </BaseContainer>
    </AppContainer>
  );
};

export default Final;