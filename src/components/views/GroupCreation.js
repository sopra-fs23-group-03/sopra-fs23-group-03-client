import React from "react";
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import 'styles/views/GroupCreation.scss';
import BaseContainer from "components/ui/BaseContainer";
import AppContainer from "components/ui/AppContainer";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";

const Person = ({ user }) => (
  <div className="person container">
    <div className="person username">{user.username}</div>
    <button><i class="person add">person_add</i></button>
  </div>
);

Person.propTypes = {
  user: PropTypes.object,
};


const GroupCreation = (props) => {
  const history = useHistory();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  
  const [users, setUsers] = useState(null);
  const [isInvited, setIsInvited] = useState(false);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users", { headers });
        //const groupsResponse = await api.get("/groups");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        //setGroups(groupsResponse.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
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
            <div className="group-creation form">
              <h1 className="group-creation title"> Form your group </h1>

              <div className="group-creation field">
                <div className="group-creation label"> Group Name </div>
                <input className="group-creation input"
                        placeholder="enter here.."
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}/>
              </div>

              <div className="group-creation field">
                <div className="group-creation label"> Voting Type </div>
                <div className="group-creation voting">
                  <button className="group-creation voting-button">
                    <i className="group-creation icon">timeline</i>
                    Point Distribution
                  </button>
                  <button className="group-creation voting-button majority">
                    <i className="group-creation icon">star</i>
                    Majority
                  </button>
                </div>
              </div>

              <div className="group-creation field">
                <div className="group-creation label"> Who do you want to invite? </div>
                <div className="group-creation people">
                
                  
                {users?.map((user) => (
                <div className="person container"> 
                  <div className="person username"> {user.status === "ONLINE" && user.username} </div>
                  {!isInvited && <i className="person add" onClick={() => {setIsInvited(!isInvited);}}>
                    person_add
                    </i>}
                  {isInvited && <i className="person add"  onClick={() => {setIsInvited(!isInvited);}}>
                    done
                    </i>}
                </div>

                ))}
                </div>

                <div className="group-creation buttons">
                  <div className="group-creation button" onClick={() => history.push("/game")}>Delete group</div>
                  <div className="group-creation button continue">Continue</div>
                </div>

              </div>



            </div>
          </BaseContainer>
      </AppContainer>
    );
};

export default GroupCreation;