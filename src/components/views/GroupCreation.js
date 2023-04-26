import React from "react";
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import 'styles/views/GroupCreation.scss';
import BaseContainer from "components/ui/BaseContainer";
import AppContainer from "components/ui/AppContainer";
import { api, handleError } from "helpers/api";
import { useHistory, useParams } from "react-router-dom";

const Person = ({ user }) => (
  <div className="person container">
    <div className="person username">{user.username}</div>
    <button><i className="person add">person_add</i></button>
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


  //list of ids of invited users
  const [guests, setGuests] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [votingType, setVotingType] = useState(null);
  const hostId = localStorage.getItem("userId");

  function addGuest(newGuest) {
    setGuests([...guests, newGuest]);
  }

  function removeGuest(guestToRemove) {
    setGuests(guests.filter(guest => guest !== guestToRemove));
  }

  const handleCreation = async () => {
    try {
      const requestBody = JSON.stringify({"groupName" : groupName, "votingType" : votingType, "hostId" : hostId });
      const response = await api.post("/groups", requestBody, {headers});

      //NAVIGATE TO INGREDIENT TYPING
    } catch (error) {
      alert(
        `Something went wrong during the creation of this group: \n${handleError(error)}`
      );
      history.push(`/game`);
    }
  };

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
  });




    return (
      <AppContainer>
        <BaseContainer>
            <div className="group-creation form">
              <h1 className="group-creation title"> Form your group </h1>

              <div className="group-creation field">
                <div className="group-creation label"> Group Name </div>
                <input className="group-creation input"
                        placeholder="enter here.."
                        onChange={() => setGroupName("ciao")}/>
              </div>

              <div className="group-creation field">
                <div className="group-creation label"> Voting Type </div>
                <div className="group-creation voting">
                  <button className="group-creation voting-button" onClick={() => setVotingType("Point Distribution")}>
                    <i className="group-creation icon">timeline</i>
                    Point Distribution
                  </button>
                  <button className="group-creation voting-button majority" onClick={() => setVotingType("Majority")}>
                    <i className="group-creation icon">star</i>
                    Majority
                  </button>
                </div>
              </div>

              <div className="group-creation field">
                <div className="group-creation label"> Who do you want to invite? </div>
                <div className="group-creation people">
                
                  
                { users?.filter(user => user.id != localStorage.getItem("userId")).map((user) => (
                <div className="person container"> 
                  <div className="person username"> {user.username} </div>
                  {!guests.includes(user.id) && <i className="person add" onClick={() => {addGuest(user.id);}}>
                    person_add
                    </i>}
                  {guests.includes(user.id) && <i className="person add"  onClick={() => {removeGuest(user.id);}}>
                    done
                    </i>}
                </div>

                ))}
                </div>

                <div className="group-creation buttons">
                  <div className="group-creation button" onClick={() => history.push("/game")}>Delete group</div>
                  <div className="group-creation button continue" onClick={() => {handleCreation();}}>Continue</div>
                </div>

              </div>



            </div>
          </BaseContainer>
      </AppContainer>
    );
};

export default GroupCreation;