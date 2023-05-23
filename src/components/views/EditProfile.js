import React, { useEffect, useState, useMemo } from "react";
import "styles/views/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
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

const EditProfile = () => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [username, setUsername] = useState(user?.username);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [diet, setDiet] = useState(null);
  const [allergies, setAllergies] = useState(user?.allergies || []);
  const [cuisine, setCuisine] = useState(user?.favoriteCuisine || []);

  const options = [
    { value: "", label: "No Specific Preference" },
    { value: "vegan", label: "vegan" },
    { value: "vegetarian", label: "vegetarian" },
    { value: "paleo", label: "paleo" },
    { value: "gluten-free", label: "gluten-free" },
    { value: "ketogenic", label: "ketogenic" },
    { value: "lacto-vegetarian", label: "lacto-vegetarian" },
    { value: "ovo-vegetarian", label: "ovo-vegetarian" },
    { value: "pescetarian", label: "pescetarian" },
    { value: "omnivore", label: "omnivore" },
    { value: "primal", label: "primal" },
  ];

  const allergens = [
    { value: "", label: "No Allergies" },
    { value: "dairy", label: "dairy" },
    { value: "egg", label: "egg" },
    { value: "gluten", label: "gluten" },
    { value: "grain", label: "grain" },
    { value: "peanut", label: "peanut" },
    { value: "seafood", label: "seafood" },
    { value: "sesame", label: "sesame" },
    { value: "shellfish", label: "shellfish" },
    { value: "soy", label: "soy" },
    { value: "sulfite", label: "sulfite" },
    { value: "tree-nut", label: "tree-nut" },
    { value: "wheat", label: "wheat" },
  ];

  const cuisines = [
    { value: "", label: "No Specific Preference" },
    { value: "african", label: "african" },
    { value: "american", label: "american" },
    { value: "british", label: "british" },
    { value: "cajun", label: "cajun" },
    { value: "caribbean", label: "caribbean" },
    { value: "chinese", label: "chinese" },
    { value: "eastern european", label: "eastern european" },
    { value: "european", label: "european" },
    { value: "french", label: "french" },
    { value: "german", label: "german" },
    { value: "greek", label: "greek" },
    { value: "indian", label: "indian" },
    { value: "irish", label: "irish" },
    { value: "italian", label: "italian" },
    { value: "japanese", label: "japanese" },
    { value: "jewish", label: "jewish" },
    { value: "korean", label: "korean" },
    { value: "mediterranean", label: "mediterranean" },
    { value: "mexican", label: "mexican" },
    { value: "middle eastern", label: "middle eastern" },
    { value: "nordic", label: "nordic" },
    { value: "spanish", label: "spanish" },
    { value: "thai", label: "thai" },
    { value: "vietnamese", label: "vietnamese" },
  ];

  const handleCuisineChange = (selectedOptions) => {
    setCuisine(selectedOptions.map((option) => option.value));
  };

  const handleAllergiesChange = (Options) => {
    setAllergies(Options.map((option) => option.value));
  };

  const handleDietChange = (d) => {
    setDiet(d.value);
  };

  console.log(user);
  console.log(user?.allergiesSet);

  const handleUpdate = async () => {
    try {
      const requestBody = JSON.stringify({
        username: username,
        specialDiet: diet,
        password: newPassword,
        currentPassword: currentPassword,
        allergies: allergies,
        favoriteCuisine: cuisine,
      });
      await api.put(`/users/${userId}`, requestBody, { headers });
    } catch (error) {
      alert(
        `Something went wrong while updating the profile: \n${handleError(
          error
        )}`
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
        setAllergies(response.data.allergies || []); // Set user's allergies if available, otherwise default to an empty array
        setCuisine(response.data.favoriteCuisine || []); // Set user's favorite cuisines if available, otherwise default to an empty array
        setDiet(response.data.specialDiet || ""); // Set user's special diet if available, otherwise default to an empty string
      } catch (error) {
        alert(
          `Something went wrong while getting this user: \n ${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        history.push("/dashboard");
      }
    }

    fetchData();
  }, []);

  return (
    <AppContainer>
      <BaseContainer>
        <div className="profile main">
          <div className="profile form">
            <i className="profile icon">account_circle</i>
            <div className="profile modify-section">
              <div className="profile singles">
                <div className="field-info">
                  <InfoField
                    label="Username"
                    value={username}
                    onChange={(u) => setUsername(u)}
                  />
                  <div className="profile small-text">
                    {" "}
                    only alphabetic characters allowed{" "}
                  </div>
                </div>
                <div className="field-info">
                  <InfoField
                    label="Current Password"
                    onChange={(cp) => setCurrentPassword(cp)}
                  />
                  <div className="profile small-text">
                    {" "}
                    username and password must differ{" "}
                  </div>
                </div>

                <div className="profile diet-dropdown">
                  <label className="profile titles"> Diet preference </label>
                  <Dropdown
                    placeHolder="select diet"
                    value={user?.specialDiet?.toString()}
                    options={options}
                    onChange={handleDietChange}
                  />
                </div>

                <InfoField
                  label="New Password"
                  onChange={(np) => setNewPassword(np)}
                />
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
                    onChange={handleCuisineChange}
                  />
                </div>
              </div>
            </div>
            <div className="profile buttons">
              <button
                className="profile cancel-button"
                width="24%"
                onClick={() => {
                  toggleEdit();
                  history.push("/profile/" + userId);
                }}
              >
                Cancel
              </button>
              <button
                className="profile general-button"
                width="24%"
                onClick={() => {
                  handleUpdate();
                  toggleEdit();
                  history.push("/profile/" + userId);
                }}
              >
                Save
              </button>
            </div>
          </div>
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
export default EditProfile;
