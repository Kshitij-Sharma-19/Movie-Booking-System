import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme } from "./styles/theme.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider>
      <NotificationProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
      </NotificationProvider>
      </AuthProvider>

    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);