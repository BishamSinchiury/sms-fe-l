import React from 'react';
import styles from './Button.module.css';

const Button = ({ type, children, onClick }) => {
  const typeClass =
    type === 'Save'
      ? styles.save
      : type === 'Delete'
      ? styles.delete
      : styles.default;

  return (
    <button
      className={`${styles.button} ${typeClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;