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

const Profile = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [allergies, setAllergies] = useState([]);

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userId}`, { headers });
        setUser(response.data);
        setAllergies(user?.allergiesSet);
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
        <div className="profile form">
          <div className="profile main">
            <i className="profile icon">account_circle</i>
            {!isEditable && (
              <div className="profile text"> {user?.username} </div>
            )}
            {!isEditable && (
              <div className="profile diet">{user?.specialDiet}</div>
            )}
          </div>

          {!isEditable && (
            <div className="profile sections">
              <div className="profile preferences">
                <div className="profile titles">Allergies</div>
                <div className="profile items">
                  {user &&
                    user.allergies &&
                    user.allergies.filter(Boolean).map((allergy) => (
                      <div className="profile item" key={allergy}>
                        {" "}
                        {allergy}{" "}
                      </div>
                    ))}
                </div>
              </div>

              <div className="profile preferences">
                <div className="profile titles">Favourite cuisines</div>
                <div className="profile items">
                  {user &&
                    user.favoriteCuisine &&
                    user.favoriteCuisine.filter(Boolean).map((cuisine) => (
                      <div className="profile item" key={cuisine}>
                        {" "}
                        {cuisine}{" "}
                      </div>
                    ))}
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
                    history.push(`/profile/${user?.id}/edit`);
                  }}
                >
                  Edit profile
                </button>
              )}
            </div>
          )}
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
