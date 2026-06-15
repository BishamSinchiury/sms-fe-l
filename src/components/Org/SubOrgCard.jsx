// src/components/Org/SubOrgCard.jsx
import React from "react";
import styles from "./SubOrgCard.module.css";
import { FaBuilding, FaChevronRight } from "react-icons/fa";

const SubOrgCard = ({ subOrg, onClick }) => {
  const { name, description, completion_percent = 0 } = subOrg || {};

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <div className={styles.iconWrap}>
        <FaBuilding className={styles.icon} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.progressRow}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${completion_percent}%` }}
            />
          </div>
          <span className={styles.progressText}>{completion_percent}% complete</span>
        </div>
      </div>

      <FaChevronRight className={styles.chevron} />
    </div>
  );
};

export default SubOrgCard;