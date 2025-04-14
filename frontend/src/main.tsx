import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { App } from "@/app/App.tsx";
import { store } from "@/shared/config/store.ts";

import "./styles/index.scss";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
);
