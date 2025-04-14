import { useEffect } from "react";

import { useAppSelector } from "@/shared/lib/hooks";
import { AppRouter } from "@/app/providers/router/AppRouter";

import "@/app/styles/index.scss";

export const App = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);
  }, [darkMode]);

  return <AppRouter />;
};
