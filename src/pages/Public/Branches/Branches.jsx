import React, { useState, useEffect } from "react";
import styles from "./Branches.module.css";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import { getPublicSubOrgs } from "@/services/user/Org/orgService.js";

const Branches = () => {
  const [suborgs, setSuborgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const domain = window.location.hostname;
    const fetchSubOrgs = async () => {
      try {
        const response = await getPublicSubOrgs(domain);
        setSuborgs(response?.data || []);
      } catch (err) {
        // Don't show error if no suborgs — section just stays hidden
        if (err?.response?.status !== 404) {
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSubOrgs();
  }, []);

  if (loading || !suborgs.length) return null;

  return (
    <section id="branches" className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>Our Branches</span>
        <h2 className={styles.heading}>Explore Our<br />Locations</h2>

        <div className={styles.grid}>
          {suborgs.map((sub) => (
            <div key={sub.uuid} className={styles.card}>
              <div className={styles.iconWrap}>
                <FaBuilding />
              </div>
              <h3>{sub.name}</h3>
              {sub.description && <p>{sub.description}</p>}

              <div className={styles.progressRow}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${sub.completion_percent || 0}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  {sub.completion_percent || 0}% complete
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branches;