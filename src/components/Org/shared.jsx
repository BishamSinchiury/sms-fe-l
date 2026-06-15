import React from "react";
import { FaSave, FaTimes, FaUpload, FaExternalLinkAlt } from "react-icons/fa";
import styles from "@/pages/Admin/sections/FormElements.module.css";
import { resolveMedia, isEmpty } from "./utils";

/** Read-only row used to display a single piece of information. */
export const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoIcon}>{icon}</div>
    <div className={styles.infoContent}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={isEmpty(value) ? styles.infoEmpty : styles.infoValue}>
        {isEmpty(value) ? "Not provided yet" : String(value)}
      </span>
    </div>
  </div>
);

/** Read-only row for a registration document, linking to the uploaded file. */
export const DocRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoIcon}>{icon}</div>
    <div className={styles.infoContent}>
      <span className={styles.infoLabel}>{label}</span>
      {isEmpty(value) ? (
        <span className={styles.infoEmpty}>Not uploaded yet</span>
      ) : (
        <a
          href={resolveMedia(value)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docLink}
        >
          View document <FaExternalLinkAlt size={11} />
        </a>
      )}
    </div>
  </div>
);

/** Editable field for a registration document upload. */
export const DocUploadField = ({ icon, label, field, current, draftValue, onSelectFile }) => {
  const pendingFile = draftValue instanceof File ? draftValue : null;

  return (
    <div className={styles.field}>
      <label>{icon} {label}</label>
      <div className={styles.docUploadRow}>
        {current && !pendingFile && (
          <a
            href={resolveMedia(current)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docLink}
          >
            Current file <FaExternalLinkAlt size={11} />
          </a>
        )}
        {pendingFile && <span className={styles.fileChosen}>{pendingFile.name}</span>}
        <label className={styles.uploadBtn}>
          <FaUpload /> {current || pendingFile ? "Replace file" : "Upload file"}
          <input
            type="file"
            hidden
            onChange={(e) => onSelectFile(field, e.target.files?.[0] || null)}
          />
        </label>
      </div>
    </div>
  );
};

/** Shared Save / Cancel button pair for card edit panels. */
export const SaveCancelActions = ({ onSave, onCancel, saving }) => (
  <div className={styles.actions}>
    <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
      <FaSave /> {saving ? "Saving..." : "Save changes"}
    </button>
    <button className={styles.cancelBtn} onClick={onCancel}>
      <FaTimes /> Cancel
    </button>
  </div>
);