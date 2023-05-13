import { Spinner } from "components/ui/Spinner";
import { useHistory } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/GroupFormingHost.scss";
import AppContainer from "components/ui/AppContainer";
import useGroupMembers from "hooks/useGroupMembers";
import "styles/ui/List.scss";
import { useParams } from "react-router-dom";

const DrodownList = ({ ingredients, setIngredients, onIngredientSelect }) => {
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {
    if (text && !isMaxReached()) {
      const newTasks = [...tasks, { text }];
      setTasks(newTasks);
      setInputValue("");
    }
  };

  const isMaxReached = () => {
    return tasks.length >= 20;
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    const removedTask = newTasks.splice(index, 1)[0];
    setTasks(newTasks);

    const newIngredients = ingredients.filter(
      (ingredient) => ingredient.name !== removedTask.text
    );
    setIngredients(newIngredients);
  };

  const [suggestions, setSuggestions] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  const fetchIngredients = async (text) => {
    if (text.length === 3) {
      try {
        const response = await api.get(`/ingredients?initialString=${text}`, {
          headers,
        });
        setAllIngredients(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching ingredients: \n${error}`
        );
        alert(
          "Something went wrong while fetching ingredients! See the console for details."
        );
      }
    }

    setSuggestions(
      allIngredients.filter((ingredient) => {
        return (
          ingredient.toLowerCase().startsWith(text.toLowerCase()) &&
          !tasks.some(
            (task) => task.text.toLowerCase() === ingredient.toLowerCase()
          )
        );
      })
    );
  };

  return (
    <div className="list todo-list">
      {tasks.map((task, index) => (
        <div className="list todo" key={index}>
          <span className="list todo-text">{task.text}</span>
          <button className="list button" onClick={() => removeTask(index)}>
            <i className="list icon">delete</i>
          </button>
        </div>
      ))}

      {!isMaxReached() && (
        <div className="list form">
          <div className="list todo">
            <input
              className="list input"
              type="text"
              placeholder="Add new entry..."
              onChange={(e) => {
                setInputValue(e.target.value);
                fetchIngredients(e.target.value);
              }}
              value={inputValue}
            />
            {suggestions.length > 0 && (
              <div className="list suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    className="list suggestion"
                    key={index}
                    onClick={() => {
                      addTask(suggestion);
                      const newIngredients = [
                        ...ingredients,
                        { name: suggestion },
                      ];
                      setIngredients(newIngredients);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DrodownList.propTypes = {
  ingredients: PropTypes.array.isRequired,
  setIngredients: PropTypes.func.isRequired,
  onIngredientSelect: PropTypes.func.isRequired,
};

const Ingredient = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const userId = localStorage.getItem("userId");

  const { group, users } = useGroupMembers(groupId);
  const [ingredients, setIngredients] = useState([]);

  const [allergies, setAllergies] = useState([]);

  useEffect(() => {

    async function fetchData() {
      try {
        const allergiesResponse = await api.get(`/groups/${groupId}/members/allergies `, { headers });

        setAllergies(allergiesResponse.data);

      } catch (error) {
        alert(`Something went wrong while fetching the group allergies: \n${handleError(error)}`);
        console.error("Details:", error);
      }
    }

    fetchData();
  }, []);

  const handleIngredientSelect = (ingredient) => {
    const newIngredients = [...ingredients, { name: ingredient }];
    setIngredients(newIngredients);
  };

  const handleSubmit = async (ingredients) => {
    try {
      const formattedIngredients = ingredients.map((ingredient) => {
        return { name: ingredient.name };
      });
      await api.put(`/user/${userId}/ingredients`, formattedIngredients, {
        headers,
      });
      //history.push(`/final/${userId}`);
      history.push(`/ingredientsvoting/:${groupId}`);
    } catch (error) {
      console.error(
        `Something went wrong while updating user ingredients: \n${error}`
      );
      alert(
        "Something went wrong while updating user ingredients! See the console for details."
      );
    }
  };

  const isSubmitDisabled = ingredients.length === 0;

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="groupforming main-container">
        <div className=" groupforming sidebar">
          <div className="groupforming sidebar-buttons">
            <i className="material-icons">groups</i> &nbsp; Group:{" "}
            {group.groupName}
            &nbsp;
          </div>
          <div className="groupforming sidebar-buttons">
            <i className="material-icons">person</i> &nbsp; Host:{" "}
            {group.hostName}
            &nbsp;
          </div>

          <div className="groupforming sidebar-buttons">
            <i className="material-icons">bar_chart</i>
            &nbsp; Voting System: Majority &nbsp;
          </div>

          <ul className="groupforming invite-users">
            <h3 className="player container">
              <i className="material-icons">people_outline</i>
              &nbsp; Guests &nbsp;
            </h3>

            {users.map((user) => (
              <div
                className={`player container ${user.status.toLowerCase()}`}
                key={user.id}
              >
                {user.username}
              </div>
            ))}
          </ul>
          
          {allergies.length > 0 && (
            <ul className="groupforming invite-users">
              <h3 className="player container">
                <i className="material-icons">no_food</i>
                &nbsp; Allergies &nbsp;
              </h3>

              {allergies.map((allergy) => (
                <div
                  className={`player container`}
                  key={allergy.id}
                >
                  {allergy}
                </div>
              ))}
            </ul>
          )}
            


        </div>

        <BaseContainer>
          <div className="groupforming form">
            <div className="groupforming main">
              <i className="group-icon">food_bank_outlined</i>
              <div className="groupforming text"> Let's get cooking! </div>

              {/* <div className="groupforming sections"> */}
                <div className="groupforming preferences">
                  <div className="groupforming titles">
                    Which ingredients would you like to add?
                    <div className="groupforming group-join-requests">
                      <DrodownList
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        onIngredientSelect={handleIngredientSelect}
                      />
                    </div>
                  </div>
                </div>

                <div className="groupforming buttons" width="80%">
                  <button
                    className="groupforming general-button"
                    width="24%"
                    onClick={() => {
                      handleSubmit(ingredients);
                    }}
                    disabled={isSubmitDisabled} // add disabled prop
                  >
                    Submit
                  </button>
                </div>
                <div className="groupforming info">
                <b>Note:</b> To provide a fitting recipe we recommend you to be as specific as possible (e.g. instead of "cheese" type in "goat cheese"). 
                Additionally, we assume you already have pantry items such as salt, pepper, oil, etc. at home.
                </div>
              {/* </div> */}
            </div>
          </div>
        </BaseContainer>
      </div>
    );
  }

  return (
    <AppContainer>
      <div className="game container">{content}</div>;
    </AppContainer>
  );
};

export default Ingredient;
