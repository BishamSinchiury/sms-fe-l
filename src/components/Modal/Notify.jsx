import React from "react";
import styles from "./Notify.module.css";
import Button from "../Button/Button";

const Notify = ({
  show,
  title = "Notification",
  message,
  okText = "OK",
  cancelText = "Cancel",
  okType = "Save",
  onOk,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h4>{title}</h4>
        <p>{message}</p>

        <div className={styles.actions}>
          <Button type={okType} onClick={onOk}>
            {okText}
          </Button>

          <Button type="Default" onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notify;