import React, { useState } from "react";
import "styles/ui/List.scss";

const AddTaskForm = ({ addTask }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    value && addTask(value);
    setValue("");
  };

  return (
    <form className="list form" onSubmit={handleSubmit}>
      <input
        className="list input"
        type="text"
        value={value}
        placeholder="Add new entry..."
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="list button" type="submit">
        <i className="list icon">add</i>
      </button>
    </form>
  );
};

export const ToDoList = () => {
  const [tasks, setTasks] = useState([
    {
      text: "Example",
      isCompleted: false,
    },
  ]);

  const addTask = (text) =>
    isMaxReached() ? null : setTasks([...tasks, { text }]);

  const isMaxReached = (_) => {
    return tasks?.length >= 20;
  };
  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="list todo-list">
      {tasks.map((task, index) => (
        <div className="list todo">
          <span className="list todo-text">{task.text}</span>
          <button className="list button" onClick={() => removeTask(index)}>
            <i className="list icon">delete</i>
          </button>
        </div>
      ))}
      {!isMaxReached() && <AddTaskForm addTask={addTask} />}
    </div>
  );
};

export default ToDoList;
