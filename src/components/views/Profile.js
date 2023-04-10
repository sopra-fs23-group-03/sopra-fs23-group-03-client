import React from "react";
import 'styles/views/Profile.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";

const Profile = () => {

  return (
    <BaseContainer>
      <div className="profile container">
        <div className="profile form">
          <div className="profile main">
            <i class="profile-icon">person</i>
            <div className="profile text"> myusername </div>
            <div className="profile diet"> diet preference </div>
          </div>

          <div className="profile sections">
            <div className="profile preferences">
              <div className="profile titles">
                Allergies
				        <ul id="list">
				        	<li data-new="true">
				        		<span>add another</span>
				        		<input type="text"/>
				        	</li>
				        </ul>
              </div>
            </div>

            <div className="profile preferences">
              <div className="profile titles">
                Favourite cuisine
				        <ul id="list">          
				        	<li data-new="true">
				        		<span>add another</span>
				        		<input type="text"/>
				        	</li>
				        </ul> 
              </div>
            </div>
          </div>

          <Button
          width = "24%">
            Modify profile
          </Button>

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
