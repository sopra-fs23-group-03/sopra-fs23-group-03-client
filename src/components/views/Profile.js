import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import ToDoList from "components/ui/List";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import AppContainer from "components/ui/AppContainer";
import PropTypes from "prop-types";

const InfoField = (props) => {
  return (
    <div className="profile field">
      <label className="profile titles">{props.label}</label>

      <input
        className="profile input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

InfoField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Profile = (props) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  //isEditable is a variable that is set to false by defalut and becomes true when the modify profile button is pressed
  const [isEditable, setIsEditable] = useState(false);


  const [username, setUsername] = useState(user?.username);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [diet, setDiet] = useState(null);
  const [allergies, setAllergies] = ([]);
  const [favcuisine, setFavcuisine] = ([]);

  const handleUpdate = async () => {
    try {
      const response = await api.put('/users/' + userId, { username : username, specialDiet : diet, password : newPassword  }, { headers});
    } catch (error) {
      console.error(
        `Something went wrong while updating the profile: \n${handleError(error).info
        }`
      );
    }
  };

    
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
              <div className="profile diet"> {user?.specialDiet===null? "diet preference" : user?.specialDiet} </div>
            )}
          </div>

          {!isEditable && (
            <div className="profile sections">
              <div className="profile preferences">
                <div className="profile titles">
                  Allergies
                </div>
                
                <div className="profile item">Wheat</div>
                <div className="profile item">Milk</div>
                
              </div>

              <div className="profile preferences">
                <div className="profile titles">
                  Favourite cuisine
                </div>

                <div className="profile item">Pizza</div>
                <div className="profile item">Mexican</div>

              </div>
            </div>
          )}

          {isEditable && (
            <div className="profile modify-section">
              <InfoField label="Username" value={username} onChange={(u)=>setUsername(u)} />
              <InfoField label="Current Password" onChange={(cp)=>setCurrentPassword(cp)}/>
              <InfoField label="New Password" onChange={(np)=>setNewPassword(np)}/>
              <InfoField label="Diet preference" onChange={(d)=>setDiet(d)}/>

              <div className="profile list">
                <div className="profile titles">Allergies</div>

                <ToDoList></ToDoList>
              </div>


              <div className="profile list">
                <div className="profile titles">Favorite cuisine</div>
                
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
                    handleUpdate();
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
    setDefaultValues();
  }
  function setDefaultValues() {
    setUsername(user?.username);
  }

};
/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Profile;