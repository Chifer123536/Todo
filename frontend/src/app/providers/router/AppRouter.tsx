import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodosPage } from "@/pages/TodosPage";
// import {
//   LoginPage,
//   RegisterPage,
//   ResetPasswordPage,
//   NewPasswordPage,
//   NewVerificationPage,
// } from "@/pages/auth";
// import { SettingsPage } from "@/pages/Dashboard";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodosPage />} />
      </Routes>
    </BrowserRouter>
  );
};
