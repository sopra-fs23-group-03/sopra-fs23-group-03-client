import AppContainer from "components/ui/AppContainer";
import BaseContainer from "components/ui/BaseContainer";
import React from "react";
import "styles/views/Final.scss"
import { useHistory } from "react-router-dom";

const InfoField = (props) => {
    return (
      <div className="final field">
        <label className="final label">{props.label}</label>
        <input
          className="final input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    );
  };

const Final = () => {
    const history = useHistory();

    return (
        <AppContainer>
            <BaseContainer>
                <div className="final main">
                    <i className="final icon">sentiment_satisfied</i>
                    <div className="final title">Everything is set!</div>
                </div>

                <div className="final section">
                    <InfoField label="Recipe"/>
                    <InfoField label="Approx. time"/>
                    <InfoField label="Difficulty"/>
                </div>
                <div className="final button" onClick={() => history.push("/game")}>Back to main page</div>
                

            </BaseContainer>
        </AppContainer>
    )
}

export default Final