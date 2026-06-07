import React, { useEffect, useRef } from "react";
import styles from "./Notification.module.css";

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
    </svg>
  ),
};

/**
 * Notification
 * @param {string}   message   - Text to show
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number}   duration  - Auto-dismiss ms (0 = never)
 * @param {function} onClose   - Called when dismissed
 * @param {string}   title     - Optional bold title
 * @param {object}   action    - Optional { label, onClick }
 */
const Notification = ({
  message,
  type = "info",
  duration = 4000,
  onClose,
  title,
  action,
}) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (duration > 0 && onClose) {
      timerRef.current = setTimeout(onClose, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <div className={styles.iconWrap}>{ICONS[type]}</div>
      <div className={styles.body}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.message}>{message}</span>
        {action && (
          <button className={styles.action} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Dismiss">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {duration > 0 && (
        <div
          className={styles.progress}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

export default Notification;