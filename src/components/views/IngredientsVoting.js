import React from "react";
import AppContainer from "components/ui/AppContainer";
import BaseContainer from "components/ui/BaseContainer";
import { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Group from "models/Group";
import { api, handleError } from "helpers/api";
import "styles/views/IngredientsVoting.scss";
import "styles/views/GroupFormingHost.scss";

const IngredientsVoting = () => {
  const history = useHistory();

  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [userId, setId] = useState(localStorage.getItem("userId"));
  const [users, setUsers] = useState(null);
  const [group, setGroup] = useState(null);
  const groupId = localStorage.getItem("groupId");

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("groupId", groupId);
        const groupResponse = await api.get(`/groups/${groupId}`, { headers });
        const membersResponse = await api.get(`/groups/${groupId}/members`, {
          headers,
        });
        // Get the returned group and update the state.
        setGroup(new Group(groupResponse.data));
        // Get the returned members and update the state.
        setUsers(membersResponse.data);

        console.log("groupresponse", groupResponse);
        console.log("memberresponse", membersResponse);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the group and its members: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the group and its members! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  return (
    <AppContainer>
      <div className="game container">
        <div className="groupforming main-container">
          <div className="groupforming sidebar">
            <div className="groupforming sidebar-buttons">
              <i className="ingredientsvoting icon"> location_home </i> &nbsp;
              Host: {group?.hostName} &nbsp;
            </div>

            <div className="groupforming sidebar-buttons">
              <i className="ingredientsvoting icon majority">bar_chart</i>{" "}
              Voting System: Majority &nbsp;
            </div>
          </div>
          <BaseContainer>
            <div className="groupforming form">
              <div className="groupforming main">
                <i className="group-icon">groups</i>
                <div className="groupforming text">{group?.groupName}</div>
                <div className="groupforming sections">
                  <div className="groupforming preferences">
                    <div className="groupforming titles">
                      {" "}
                      Overall ingredients{" "}
                    </div>
                    <div className="ingredientsvoting ingredients">
                      <div className="ingredientsvoting item">
                        Tofu
                        <div className="ingredientsvoting reactions">
                          <i className="ingredientsvoting icon reaction">
                            sentiment_satisfied
                          </i>
                          <i className="ingredientsvoting icon reaction">
                            sentiment_neutral
                          </i>
                          <i className="ingredientsvoting icon reaction">
                            sentiment_dissatisfied
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="groupforming general-button"
                width="24%"
                onClick={() => {
                  history.push(`/final/:${groupId}`);
                }}
              >
                Submit
              </button>
            </div>
          </BaseContainer>
        </div>
      </div>
    </AppContainer>
  );
};

export default IngredientsVoting;
