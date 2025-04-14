import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodosPage } from "@/pages/TodosPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodosPage />} />
      </Routes>
    </BrowserRouter>
  );
};
