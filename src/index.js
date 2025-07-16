import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ThemeProvider } from "@material-tailwind/react";
import { loadConfig } from "./cfg/ConfigLoader";


loadConfig().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,);
}).catch((err) => {
  console.error('Error cargando configuración', err);
});
