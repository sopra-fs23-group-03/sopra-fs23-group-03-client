import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import ToDoList from "components/ui/List";
import Dropdown from "components/ui/Dropdown";
import MultiDropdown from "components/ui/MultiDropdown";
import { useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
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

const Profile = () => {
  const history = useHistory()
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  //isEditable is a variable that is set to false by defalut and becomes true when the modify profile button is pressed
  const [isEditable, setIsEditable] = useState(false);

  const [username, setUsername] = useState(user?.username);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [diet, setDiet] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [cuisine, setCuisine] = useState([]);

  const options = [
    {value:"vegan", label: "vegan"},
    {value:"vegetarian", label: "vegetarian"},
    {value:"paleo", label: "paleo"},
    {value:"gluten-free", label: "gluten-free"},
    {value:"ketogenic", label: "ketogenic"},
    {value:"lacto-vegetarian", label: "lacto-vegetarian"},
    {value:"ovo-vegetarian", label: "ovo-vegetarian"},
    {value:"pescetarian", label: "pescetarian"},
    {value:"omnivore", label: "omnivore"},
    {value:"primal", label: "primal"}
  ]

  const allergens = [
    {value:"dairy", label: "dairy"},
    {value:"egg", label: "egg"},
    {value:"gluten", label: "gluten"},
    {value:"grain", label: "grain"},
    {value:"peanut", label: "peanut"},
    {value:"seafood", label: "seafood"},
    {value:"sesame", label: "sesame"},
    {value:"shellfish", label: "shellfish"},
    {value:"soy", label: "soy"},
    {value:"sulfite", label: "sulfite"},
    {value:"tree-nut", label: "tree-nut"},
    {value:"wheat", label: "wheat"}
  ]

  const cuisines = [
    {value:"african", label: "african"},
    {value:"american", label: "american"},
    {value:"british", label: "british"},
    {value:"cajun", label: "cajun"},
    {value:"caribbean", label: "caribbean"},
    {value:"chinese", label: "chinese"},
    {value:"eastern european", label: "eastern european"},
    {value:"european", label: "european"},
    {value:"french", label: "french"},
    {value:"german", label: "german"},
    {value:"greek", label: "greek"},
    {value:"indian", label: "indian"},
    {value:"irish", label: "irish"},
    {value:"italian", label: "italian"},
    {value:"japanese", label: "japanese"},
    {value:"jewish", label: "jewish"},
    {value:"korean", label: "korean"},
    {value:"mediterranean", label: "mediterranean"},
    {value:"mexican", label: "mexican"},
    {value:"middle eastern", label: "middle eastern"},
    {value:"nordic", label: "nordic"},
    {value:"spanish", label: "spanish"},
    {value:"thai", label: "thai"},
    {value:"vietnamese", label: "vietnamese"}
  ];

  const handleCuisineChange = (selectedOptions) => {
    setCuisine(selectedOptions.map((option) => option.value));}

    const handleAllergiesChange = (selectedOptions) => {
      setAllergies(selectedOptions.map((option) => option.value));}
  

  const handleUpdate = async () => {
    try {
      const requestBody = JSON.stringify({ username : username, specialDiet : diet, password : newPassword, currentPassword : currentPassword, allergies : allergies, favoriteCuisine : cuisine });
      await api.put(`/users/${userId}`, requestBody, { headers });
      window.location.reload();
      //history.push(`/profile/${userId}`);
    } catch (error) {
      alert(
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

        const response = await api.get(`/users/${userId}`, { headers });

        // Get the returned users and update the state.
        setUser(response.data);
        setAllergies(user?.allergiesSet)

      } catch (error) {
        alert(
          `Something went wrong while getting this user: \n ${ handleError(error).info }`
        );
        console.error("Details:", error);
        history.push("/dashboard")
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
            {!isEditable && (
              <div className="profile text"> {user?.username} </div>
            )}
            {!isEditable && (
              <div className="profile diet">
                {user?.specialDiet}
              </div>
            )}
          </div>

          {!isEditable && (
            <div className="profile sections">
              <div className="profile preferences">
                <div className="profile titles">Allergies</div>
                {user && user.allergies && user.allergies.filter(Boolean).map((allergy) => (<div className="profile item" key={allergy}> {allergy} </div>))}
              </div>

              <div className="profile preferences">
                <div className="profile titles">Favourite cuisines</div>
                {user && user.favoriteCuisine && user.favoriteCuisine.filter(Boolean).map((cuisine) => (<div className="profile item" key={cuisine}> {cuisine} </div>))}
              </div>
            </div>
          )}

          {isEditable && (
            <div className="profile modify-section">
            <div className="profile singles">
              <InfoField label="Username" value={username} onChange={(u)=>setUsername(u)} />
              <InfoField label="Current Password" onChange={(cp)=>setCurrentPassword(cp)}/>
              
              <div className="profile diet-dropdown">
              <label className="profile titles"> Diet preference </label>
              <Dropdown 
              placeHolder="select diet"
              value = {diet} 
              options={options} 
              onChange={(d) => setDiet(d.value)}/>
              </div>

              <InfoField label="New Password" onChange={(np)=>setNewPassword(np)}/>
              </div>
              
              <div className="profile dropdowns">
                <div className="profile list">
                  <div className="profile titles">Allergies</div>
                  <MultiDropdown
                  isSearchable
                  isMulti
                  placeHolder="add allergy"
                  options={allergens}
                  onChange={handleAllergiesChange}
                  />                
                </div>
            
                <div className="profile list">
                  <div className="profile titles">Favorite cuisines</div>
                  <MultiDropdown
                  isSearchable
                  isMulti
                  placeHolder="add cuisine"
                  options={cuisines}
                  value = {cuisine}
                  onChange={handleCuisineChange}/>
                  </div>
                </div>
              </div>
              

          )}

          {localStorage.getItem("userId") == user?.id && (
            <div className="profile buttons">
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
          )}
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
