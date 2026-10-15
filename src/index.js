
import React from "react";
import ReactDOM from "react-dom/client";

// =========================================================
// FONTS
// =========================================================

import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";

// =========================================================
// GLOBAL STYLES
// =========================================================

import "./index.css";
import "./styles/theme.css";

// =========================================================
// REDUX
// =========================================================

import { Provider } from "react-redux";
import { store } from "./store";

// =========================================================
// THEME PROVIDER
// =========================================================

import { ThemeProvider } from "./context/ThemeContext";

// =========================================================
// APPLICATION
// =========================================================

import App from "./App";

// =========================================================
// REACT ROOT
// =========================================================

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

// =========================================================
// RENDER
// =========================================================

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
