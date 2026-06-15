// src/components/Org/AddSubOrgForm.jsx
import React, { useState } from "react";
import styles from "./ProfileForm.module.css";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";

const NAME_MAX = 100;
const DESC_MAX = 255;
const PHONE_MAX = 20;
const PLACE_MAX = 100;

const initialState = {
  name: "",
  description: "",
  phone_number: "",
  phone_number2: "",
  email: "",
  country: "",
  province: "",
  district: "",
  city: "",
};

const AddSubOrgForm = ({ onCancel, onCreate, creating }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }
    if (name.length > NAME_MAX) {
      setError(`Name must be ${NAME_MAX} characters or fewer.`);
      return;
    }
    if (form.description.length > DESC_MAX) {
      setError(`Description must be ${DESC_MAX} characters or fewer.`);
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");

    // Only send non-empty optional fields — backend treats missing
    // contact/address fields as "no contact/address" on create.
    const payload = { name, description: form.description.trim() };
    [
      "phone_number", "phone_number2", "email",
      "country", "province", "district", "city",
    ].forEach((key) => {
      const value = form[key].trim();
      if (value) payload[key] = value;
    });

    await onCreate(payload);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <button className={styles.backButton} onClick={onCancel} disabled={creating}>
        <FaArrowLeft /> Back to sub-organizations
      </button>

      <div className={styles.profileCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Add sub-organization</h2>
          <p className={styles.cardSubtitle}>
            Create a new sub-organization under your organization. Contact and address details are optional and can be edited later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.cardForm}>
          {/* ── Basic ──────────────────────────────────────────── */}
          <div className={styles.sectionLabel}>Basic information</div>

          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Eastern Branch"
              maxLength={NAME_MAX}
              autoFocus
            />
            <span className={styles.charCount}>{form.name.length}/{NAME_MAX}</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Optional short description"
              maxLength={DESC_MAX}
              rows={3}
            />
            <span className={styles.charCount}>{form.description.length}/{DESC_MAX}</span>
          </div>

          {/* ── Contact ────────────────────────────────────────── */}
          <div className={styles.sectionLabel}>Contact details</div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Phone number</label>
              <input
                className={styles.input}
                value={form.phone_number}
                onChange={handleChange("phone_number")}
                placeholder="e.g. +977-9800000000"
                maxLength={PHONE_MAX}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Alternate phone</label>
              <input
                className={styles.input}
                value={form.phone_number2}
                onChange={handleChange("phone_number2")}
                placeholder="Optional"
                maxLength={PHONE_MAX}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange("email")}
              placeholder="branch@example.com"
            />
          </div>

          {/* ── Address ────────────────────────────────────────── */}
          <div className={styles.sectionLabel}>Address</div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Country</label>
              <input
                className={styles.input}
                value={form.country}
                onChange={handleChange("country")}
                maxLength={PLACE_MAX}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Province</label>
              <input
                className={styles.input}
                value={form.province}
                onChange={handleChange("province")}
                maxLength={PLACE_MAX}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>District</label>
              <input
                className={styles.input}
                value={form.district}
                onChange={handleChange("district")}
                maxLength={PLACE_MAX}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>City</label>
              <input
                className={styles.input}
                value={form.city}
                onChange={handleChange("city")}
                maxLength={PLACE_MAX}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={creating}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={creating}>
              {creating ? <FaSpinner className={styles.spinIcon} /> : "Create sub-organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubOrgForm;