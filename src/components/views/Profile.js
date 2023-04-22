import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import ToDoList from "components/ui/List";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import AppContainer from "components/ui/AppContainer";

const InfoField = (props) => {
  return (
    <div className="profile field">
      <label className="profile titles">{props.label}</label>

      <input
        className="profile input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

const Profile = (props) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  //isEditable is a variable that is set to false by defalut and becomes true when the modify profile button is pressed
  const [isEditable, setIsEditable] = useState(false);
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + userId, { headers });

        // Get the returned users and update the state.
        setUser(response.data);

        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(error).info
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

        <div className="profile form">
          <div className="profile main">
            <i className="profile icon">account_circle</i>
            {!isEditable && <div className="profile text"> {user?.username} </div>}
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
                <div className="profile titles">Allergies</div>
                {/* <ul id="list">
                  <li data-new="true">
                    <span>Peanuts</span>
                    <input type="text" />
                  </li>
                </ul> */}
                <ToDoList></ToDoList>
              </div>


              <div className="profile list">
                <div className="profile titles">Favorite cuisine</div>
                {/* <ul id="list">
                  <li data-new="true">
                    <span>add another</span>
                    <input type="text" />
                  </li>
                </ul> */}
                <ToDoList></ToDoList>
              </div>
            </div>
          )}

          {localStorage.getItem("userId") == userId &&
            (<div className="profile buttons">
              {!isEditable && (
                <button
                  className="profile general-button"
                  width="24%"
                  onClick={() => {
                    toggleEdit();
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
                    toggleEdit();
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
                    toggleEdit();
                  }}
                >
                  Save
                </button>
              )}
            </div>
            )
          }
        </div>
      </BaseContainer>
    </AppContainer>
  );

  function toggleEdit() {
    setIsEditable(!isEditable);
  }
  function toggleEditList() {
  }

};
/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Profile;