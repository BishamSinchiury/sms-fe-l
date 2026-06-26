import React, { useState } from "react";
import styles from "./Levels.module.css";
import { FiBookOpen, FiHome } from "react-icons/fi";
import UniversityLevels from "./UniversityLevels";
import SchoolLevels from "./SchoolLevels";

const SUB_TABS = [
  { key: "university", label: "University Levels", icon: <FiBookOpen /> },
  { key: "school",     label: "School Levels",      icon: <FiHome /> },
];

const Levels = () => {
  const [activeSubTab, setActiveSubTab] = useState("university");

  return (
    <div>
      <div className={styles.subTabBar}>
        {SUB_TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`${styles.subTab} ${activeSubTab === t.key ? styles.subTabActive : ""}`}
            onClick={() => setActiveSubTab(t.key)}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {activeSubTab === "university" && <UniversityLevels />}
      {activeSubTab === "school" && <SchoolLevels />}
    </div>
  );
};

export default Levels;