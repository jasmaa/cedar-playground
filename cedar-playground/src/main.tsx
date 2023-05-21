import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@cloudscape-design/global-styles/index.css";
import "ace-builds/css/ace.css";
import "ace-builds/css/theme/dawn.css";
import "ace-builds/css/theme/tomorrow_night_bright.css";
import "ace-builds/src-noconflict/mode-json";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
