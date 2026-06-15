// src/components/Org/AddSubOrgCard.jsx
import React from "react";
import styles from "./SubOrgCard.module.css";
import { FaPlus } from "react-icons/fa";

const AddSubOrgCard = ({ onClick }) => {
  return (
    <div
      className={styles.addCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <div className={styles.addIconWrap}>
        <FaPlus className={styles.addIcon} />
      </div>
      <span className={styles.addLabel}>Add sub-organization</span>
    </div>
  );
};

export default AddSubOrgCard;