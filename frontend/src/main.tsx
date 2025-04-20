import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import { App } from "@/app/App.tsx";
import { store } from "@/shared/todo/config/store";

import "@/app/styles/index.scss";
import { ThemeProvider } from "shared/providers/ThemeProvider";
import { MainProvider } from "./shared/auth/providers";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Provider store={store}>
      <MainProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MainProvider>
    </Provider>
  </HelmetProvider>,
);
