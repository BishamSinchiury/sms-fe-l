import React, { createContext, useCallback, useContext, useState } from "react";
import ReactDOM from "react-dom";
import Notification from "./Notification";
import styles from "./NotificationContainer.module.css";

const NotifContext = createContext(null);

export const useNotification = () => useContext(NotifContext);

let _id = 0;

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    ({ message, type = "info", duration = 4000, title, action }) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type, duration, title, action }]);
      return id;
    },
    []
  );

  return (
    <NotifContext.Provider value={{ notify, dismiss }}>
      {children}
      {ReactDOM.createPortal(
        <div className={styles.container}>
          {toasts.map((t) => (
            <Notification
              key={t.id}
              {...t}
              onClose={() => dismiss(t.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </NotifContext.Provider>
  );
};