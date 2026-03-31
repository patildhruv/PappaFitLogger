import React from "react";
import ReactDOM from "react-dom/client";
import { ActivitiesProvider } from "./hooks/useActivities";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ActivitiesProvider>
      <App />
    </ActivitiesProvider>
  </React.StrictMode>
);
