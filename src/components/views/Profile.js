import React from "react";
import { useState } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import AppContainer from "components/ui/AppContainer";

const InfoField = (props) => {
  return (
    <div className="profile field">
      <label className="profile titles">{props.label}</label>

      {/* <div style={{ display: "flex", alignItems: "center" }}> */}
      <input
        className="profile input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {/* </div> */}
    </div>
  );
};

const Profile = () => {
  //isEditable is a variable that is set to false by defalut and becomes true when the modify profile button is pressed
  const [isEditable, setIsEditable] = useState(false);

  return (
    <AppContainer>
      <BaseContainer>
        <div className="profile container">
          <div className="profile form">
            <div className="profile main">
              <i class="profile-icon">person</i>
              {!isEditable && <div className="profile text"> myusername </div>}
              {!isEditable && (
                <div className="profile diet"> diet preference </div>
              )}
            </div>

            {!isEditable && (
              <div className="profile sections">
                <div className="profile preferences">
                  <div className="profile titles">
                    Allergies
                    <ul id="list">
                      <li data-new="true">
                        <span>Peanuts</span>
                        <input type="text" />
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="profile preferences">
                  <div className="profile titles">
                    Favourite cuisine
                    <ul id="list">
                      <li data-new="true">
                        <span>Italian</span>
                        <input type="text" />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isEditable && (
              <div className="profile modify-section">
                <InfoField label="Username" />
                <InfoField label="Current Password" />
                <InfoField label="Diet preference" />
                <InfoField label="New Password" />

                <div className="profile list">
                  <div className="profile titles"> Allergies </div>
                  <ul id="list">
                    <li data-new="true">
                      <span>add another</span>
                      <input type="text" />
                    </li>
                  </ul>
                </div>

                <div className="profile list">
                  <div className="profile titles">Favorite cuisine</div>
                  <ul id="list">
                    <li data-new="true">
                      <span>add another</span>
                      <input type="text" />
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="profile buttons">
              {!isEditable && (
                <button
                  className="profile general-button"
                  width="24%"
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                >
                  Edit profile
                </button>
              )}

              {isEditable && (
                <button
                  className="profile cancel-button"
                  width="24%"
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                >
                  Cancel
                </button>
              )}

              {isEditable && (
                <button
                  className="profile general-button"
                  width="24%"
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </BaseContainer>
    </AppContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Profile;
