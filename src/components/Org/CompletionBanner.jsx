import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./ProfileHeader.module.css";

/**
 * Shows a "complete your profile" banner with a progress bar.
 * Renders nothing once the profile is 100% complete.
 */
const CompletionBanner = ({ percent }) => {
  if (percent >= 100) return null;

  return (
    <div className={styles.completionBanner}>
      <div className={styles.completionHeader}>
        <span className={styles.completionTitle}>
          <FaCheckCircle /> Complete your profile
        </span>
        <span className={styles.completionPercent}>{percent}% complete</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.completionHint}>
        Your profile is {percent}% complete. Fill in the missing details below
        so partners and visitors can find and trust your organization.
      </p>
    </div>
  );
};

export default CompletionBanner;