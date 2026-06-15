import React, { useState } from "react";
import { FaPen, FaIdCard, FaFileInvoiceDollar, FaCertificate } from "react-icons/fa";
import styles from "@/pages/Admin/sections/Section.module.css";
import formStyles from "@/pages/Admin/sections/FormElements.module.css";
import { DocRow, DocUploadField, SaveCancelActions } from "./shared";

const PDF_FIELDS = [
  {
    field: "id_registration",
    icon: <FaIdCard />,
    label: "ID registration",
  },
  {
    field: "tax_registration",
    icon: <FaFileInvoiceDollar />,
    label: "Tax registration",
  },
  {
    field: "birth_certificate_registration",
    icon: <FaCertificate />,
    label: "Registration",              // ← renamed
  },
];

const isPdf = (file) =>
  file instanceof File &&
  (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

const DocumentsCard = ({ documents, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({});
  const [errors, setErrors]   = useState({});  // per-field PDF errors

  const openEdit = () => {
    setDraft({ ...documents });
    setErrors({});
    setEditing(true);
  };

  const handleSelectFile = (field, file) => {
    if (file && !isPdf(file)) {
      // Reject the file and show an error — don't put it in draft
      setErrors((prev) => ({ ...prev, [field]: "Only PDF files are accepted." }));
      return;
    }
    // Clear any previous error for this field on valid selection
    setErrors((prev) => ({ ...prev, [field]: null }));
    setDraft((prev) => ({ ...prev, [field]: file }));
  };

  const handleSave = async () => {
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;
    const ok = await onSave(draft);
    if (ok) setEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Registration documents</h2>
          <p className={styles.cardSubtitle}>Legal and tax registration records</p>
        </div>
        {!editing && (
          <button className={formStyles.iconBtn} onClick={openEdit} aria-label="Edit registration documents">
            <FaPen />
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          {PDF_FIELDS.map(({ field, icon, label }) => (
            <DocRow
              key={field}
              icon={icon}
              label={label}
              value={documents[field]}
            />
          ))}
        </div>
      ) : (
        <div>
          <div className={styles.grid}>
            {PDF_FIELDS.map(({ field, icon, label }) => (
              <div key={field}>
                <DocUploadField
                  icon={icon}
                  label={label}
                  field={field}
                  accept=".pdf,application/pdf"   // restricts the file picker
                  current={documents[field]}
                  draftValue={draft[field]}
                  onSelectFile={handleSelectFile}
                />
                {errors[field] && (
                  <p className={formStyles.fieldError}>{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
          <SaveCancelActions
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
            disabled={Object.values(errors).some(Boolean)}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentsCard;