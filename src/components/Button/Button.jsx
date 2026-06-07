import React from "react";
import styles from "./Button.module.css";

const Button = ({
  type = "Default",
  children,
  onClick,
  disabled = false,
}) => {
  const typeClass =
    type === "Save"
      ? styles.save
      : type === "Delete"
      ? styles.delete
      : styles.default;

  return (
    <button
      className={`${styles.button} ${typeClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;