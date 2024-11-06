import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import Navbar from "./components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";

function App() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen w-screen pt-16 space-y-4 bg-white dark:bg-dark-theme text-black dark:text-white">
        <AddTodo />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
