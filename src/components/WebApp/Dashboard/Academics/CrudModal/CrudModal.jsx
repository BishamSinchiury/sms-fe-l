import React, { useState, useEffect } from "react";
import formStyles from "./CrudModal.module.css";
import { FaTimes } from "react-icons/fa";

const CrudModal = ({ title, fields, initial, onClose, onSave }) => {
  const [formData, setFormData] = useState(initial);
  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Resolve dynamic options (can be a function of current formData)
  const resolveOptions = (f) =>
    typeof f.options === "function" ? f.options(formData) : (f.options || []);

  // Resolve dynamic visibility
  const isVisible = (f) =>
    typeof f.visible === "function" ? f.visible(formData) : true;

  return (
    <div className={formStyles.modalOverlay} onClick={onClose}>
      <div className={formStyles.modal} onClick={e => e.stopPropagation()}>
        <div className={formStyles.modalHeader}>
          <div className={formStyles.modalHeaderLeft}>
            <h3 className={formStyles.modalTitle}>{title}</h3>
          </div>
          <button className={formStyles.modalClose} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className={formStyles.modalBody}>
          {fields.map(f => {
            if (!isVisible(f)) return null;
            const opts = resolveOptions(f);
            return (
              <div className={formStyles.field} key={f.key}>
                <label htmlFor={`field-${f.key}`}>
                  {f.label}
                  {f.required && <span className={formStyles.required}>*</span>}
                </label>

                {f.type === "select" ? (
                  <select
                    id={`field-${f.key}`}
                    value={formData[f.key] || ""}
                    onChange={e => set(f.key, e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {opts.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === "multi-select" ? (
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "0.35rem",
                    maxHeight: "130px", overflowY: "auto", padding: "0.25rem 0",
                  }}>
                    {opts.map(o => {
                      const selected = Array.isArray(formData[f.key]) && formData[f.key].includes(o.value);
                      return (
                        <label key={o.value} style={{
                          display: "flex", alignItems: "center", gap: "0.3rem",
                          fontSize: "0.79rem", color: "rgba(255,255,255,0.65)",
                          cursor: "pointer", padding: "0.25rem 0.55rem",
                          borderRadius: "5px",
                          border: `1px solid ${selected ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                          background: selected ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                        }}>
                          <input
                            type="checkbox"
                            checked={selected}
                            style={{ accentColor: "#6366f1" }}
                            onChange={() => {
                              const cur = Array.isArray(formData[f.key]) ? formData[f.key] : [];
                              set(f.key, selected ? cur.filter(v => v !== o.value) : [...cur, o.value]);
                            }}
                          />
                          {o.label}
                        </label>
                      );
                    })}
                  </div>
                ) : f.type === "checkbox" ? (
                  <label className={formStyles.toggle}>
                    <input
                      type="checkbox"
                      checked={!!formData[f.key]}
                      onChange={e => set(f.key, e.target.checked)}
                    />
                    <span className={formStyles.toggleTrack}>
                      <span className={formStyles.toggleThumb} />
                    </span>
                    <span className={formStyles.toggleLabel}>
                      {formData[f.key] ? "Yes" : "No"}
                    </span>
                  </label>
                ) : (
                  <input
                    id={`field-${f.key}`}
                    type={f.type || "text"}
                    placeholder={f.placeholder || ""}
                    value={formData[f.key] ?? ""}
                    onChange={e =>
                      set(f.key, f.type === "number"
                        ? (e.target.value === "" ? "" : Number(e.target.value))
                        : e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={formStyles.modalFooter}>
          <button className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={formStyles.saveBtn} onClick={() => onSave(formData)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CrudModal;
