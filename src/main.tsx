/**
 * main.tsx - Application entry point.
 *
 * ReactDOM.createRoot renders the app into #root.
 * Provider makes the Redux store available to every descendant component
 * through React context. This is how React Redux connects to the tree.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
