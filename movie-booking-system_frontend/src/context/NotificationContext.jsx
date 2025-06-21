import { Toaster, toast } from "react-hot-toast";
import React, { createContext, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
