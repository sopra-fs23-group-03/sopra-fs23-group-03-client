import { useEffect, useState, useMemo } from "react";
import "styles/ui/List.scss";
import { api, handleError } from "helpers/api";

const ToDoList = ({ ingredients, setIngredients, onIngredientSelect }) => {
  const headers = useMemo(() => {
    return { "X-Token": localStorage.getItem("token") };
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [tasks, setTasks] = useState([
    {
      text: "Example",
      isCompleted: false,
    },
  ]);

  const addTask = (text) => {
    if (!isMaxReached()) {
      const newTasks = [...tasks, { text }];
      setTasks(newTasks);
      const newIngredients = newTasks.map((task) => ({ name: task.text }));
      setIngredients(newIngredients);
    }
  };

  const isMaxReached = () => {
    return tasks.length >= 20;
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const [suggestions, setSuggestions] = useState([]);

  const fetchIngredients = async (text) => {
    try {
      const response = await api.get(`/ingredients?initialString=${text}`, {
        headers,
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error(
        `Something went wrong while fetching ingredients: \n${error}`
      );
      alert(
        "Something went wrong while fetching ingredients! See the console for details."
      );
    }
  };

  const handleIngredientSelect = (ingredient) => {
    addTask(ingredient);
    setSuggestions([]);
    onIngredientSelect(ingredient);
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
                if (debounceTimer) clearTimeout(debounceTimer);
                setDebounceTimer(
                  setTimeout(() => fetchIngredients(e.target.value), 500)
                );
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

export default ToDoList;
