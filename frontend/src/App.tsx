import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";
import Navbar from "./components/Navbar/Navbar";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import "./styles/index.scss";

function App() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  return (
    <div>
      <Navbar />
      <div className="layout">
        <AddTodo />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
