import { Toaster, toast } from "react-hot-toast";
import React, { createContext, useContext } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notifySuccess = (msg) =>
    toast.custom((t) => (
      <ToastContent t={t} message={msg} type="success" />
    ));

  const notifyError = (msg) =>
    toast.custom((t) => (
      <ToastContent t={t} message={msg} type="error" />
    ));

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </NotificationContext.Provider>
  );
};

const ToastContent = ({ t, message, type }) => {
  const bgColor = type === "success" ? "#4caf50" : "#f44336";

  return (
    <Box
      sx={{
        background: "#333",
        color: "#fff",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        minWidth: "280px",
        marginTop: "40px",
        borderLeft: `6px solid ${bgColor}`,
        boxShadow: 4,
      }}
    >
      <Typography sx={{ flex: 1 }}>{message}</Typography>
      <IconButton size="small" onClick={() => toast.dismiss(t.id)}>
        <CloseIcon sx={{ color: "#fff", fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export const useNotify = () => useContext(NotificationContext);
