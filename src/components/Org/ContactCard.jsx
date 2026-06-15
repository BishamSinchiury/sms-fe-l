import React, { useState } from "react";
import { FaPen, FaPhoneAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import styles from "@/pages/Admin/sections/Section.module.css";
import formStyles from "@/pages/Admin/sections/FormElements.module.css";
import { InfoRow, SaveCancelActions } from "./shared";

/**
 * Contact details card: phone, alternate phone, email.
 * `onSave(payload)` is called with { phone_number, phone_number2, email }.
 */
const ContactCard = ({ contact, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const openEdit = () => {
    setDraft({ ...contact });
    setEditing(true);
  };

  const handleSave = async () => {
    const ok = await onSave(draft);
    if (ok) setEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Contact details</h2>
          <p className={styles.cardSubtitle}>How people can reach your organization</p>
        </div>
        {!editing && (
          <button className={formStyles.iconBtn} onClick={openEdit} aria-label="Edit contact details">
            <FaPen />
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          <InfoRow icon={<FaPhoneAlt />} label="Phone number" value={contact.phone_number} />
          <InfoRow icon={<FaPhone />} label="Alternate phone number" value={contact.phone_number2} />
          <InfoRow icon={<FaEnvelope />} label="Email address" value={contact.email} />
        </div>
      ) : (
        <div>
            <div className={styles.grid}>
              <div className={formStyles.field}>
              <label><FaPhoneAlt /> Phone number</label>
              <input
                value={draft.phone_number || ""}
                onChange={(e) => setDraft({ ...draft, phone_number: e.target.value })}
              />
            </div>
              <div className={formStyles.field}>
                <label><FaPhone /> Alternate phone number</label>
              <input
                value={draft.phone_number2 || ""}
                onChange={(e) => setDraft({ ...draft, phone_number2: e.target.value })}
              />
            </div>
              <div className={formStyles.field}>
                <label><FaEnvelope /> Email address</label>
              <input
                type="email"
                value={draft.email || ""}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
          </div>
          <SaveCancelActions onSave={handleSave} onCancel={() => setEditing(false)} saving={saving} />
        </div>
      )}
    </div>
  );
};

export default ContactCard;