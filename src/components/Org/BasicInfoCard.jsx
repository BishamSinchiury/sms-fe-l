import React, { useState } from "react";
import { FaPen, FaSave, FaTimes, FaBuilding, FaAlignLeft } from "react-icons/fa";
import styles from "./BasicInfoCard.module.css";
import formStyles from "@/pages/Admin/sections/FormElements.module.css";

const BasicInfoCard = ({ basic, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const openEdit = () => {
    setDraft({
      name: basic.name || "",
      description: basic.description || "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    const ok = await onSave(draft);
    if (ok) setEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.iconWrap}>
            <FaBuilding />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Basic Information</h3>
            <p className={styles.cardSubtitle}>Name and description</p>
          </div>
        </div>
        {!editing && (
          <button className={formStyles.iconBtnLabeled} onClick={openEdit}>
            <FaPen /> Edit
          </button>
        )}
      </div>

      {!editing && (
        <div className={styles.displayFields}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Name</span>
            <span className={styles.fieldValue}>{basic.name || "—"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Description</span>
            <span className={styles.fieldValue}>{basic.description || "—"}</span>
          </div>
        </div>
      )}

      {editing && (
        <div className={styles.editPanel}>
          <div className={formStyles.field}>
            <label><FaBuilding /> Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div className={formStyles.field}>
            <label><FaAlignLeft /> Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className={formStyles.actions}>
            <button className={formStyles.saveBtn} onClick={handleSave} disabled={saving}>
              <FaSave /> {saving ? "Saving..." : "Save changes"}
            </button>
            <button className={formStyles.cancelBtn} onClick={() => setEditing(false)}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoCard;