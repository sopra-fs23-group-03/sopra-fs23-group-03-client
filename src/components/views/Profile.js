import React from "react";
import 'styles/views/Profile.scss';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Profile = () => {
//   const history = useHistory();


//   const goToLanding = async () => {
//     history.push('/game')}




  return (
    <BaseContainer>
      <div className="profile container">
        <div className="profile form">
          <img src="profile.png" alt="Profile icon" width="120" />
          myusername
          </div>
        </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Profile;
