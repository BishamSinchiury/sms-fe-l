import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import formStyles from "./FormElements.module.css";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import { FiUsers, FiClipboard } from "react-icons/fi";

import {
  listStudents, createStudent, updateStudent, deleteStudent,
  listClaims, approveClaim, rejectClaim,
} from "@/services/student/studentService";

// ── Generic Modal ──────────────────────────────────────────────────────────────

const CrudModal = ({ title, fields, initial, onClose, onSave }) => {
  const [formData, setFormData] = useState(initial);
  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const resolveOptions = (f) =>
    typeof f.options === "function" ? f.options(formData) : (f.options || []);

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

// ── Generic CRUD Table ─────────────────────────────────────────────────────────

const CrudTable = ({
  title, subtitle, columns,
  listFn, createFn, updateFn, deleteFn,
  fields, toFormData, fromFormData,
  filters = [], customActions,
}) => {
  const { notify } = useNotification();
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [modal, setModal]           = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFn();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      notify({ type: "error", title: "Error", message: `Failed to load ${title.toLowerCase()}.` });
    } finally {
      setLoading(false);
    }
  }, [listFn, notify, title]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (formData) => {
    const payload = fromFormData ? fromFormData(formData) : formData;
    try {
      if (modal.item) {
        await updateFn(modal.item.uuid, payload);
        notify({ type: "success", title: "Updated", message: `${title} updated.` });
      } else {
        await createFn(payload);
        notify({ type: "success", title: "Created", message: `${title} created.` });
      }
      setModal(null);
      fetchData();
    } catch (e) {
      const detail = e?.response?.data;
      const msg = typeof detail === "string"
        ? detail
        : detail?.detail || JSON.stringify(detail) || "Save failed.";
      notify({ type: "error", title: "Error", message: msg });
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete this ${title.toLowerCase()}?`)) return;
    try {
      await deleteFn(item.uuid);
      notify({ type: "success", title: "Deleted", message: `${title} deleted.` });
      fetchData();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Delete failed." });
    }
  };

  const filtered = items.filter(item => {
    if (search) {
      const q = search.toLowerCase();
      const match = columns.some(col => {
        const val = typeof col.render === "function" ? "" : String(item[col.key] ?? "");
        return val.toLowerCase().includes(q);
      });
      if (!match) return false;
    }
    for (const f of filters) {
      if (filterValues[f.key] && String(item[f.filterKey ?? f.key]) !== String(filterValues[f.key])) {
        return false;
      }
    }
    return true;
  });

  const openAdd  = () => setModal({ item: null, title: `New ${title}`,  initial: toFormData ? toFormData(null) : {} });
  const openEdit = (item) => setModal({ item, title: `Edit ${title}`, initial: toFormData ? toFormData(item) : item });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{title}</h2>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </div>
        {createFn && (
          <button className={styles.addBtn} onClick={openAdd}>
            <FaPlus size={10} /> Add {title}
          </button>
        )}
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterRow}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="Clear">
                <FaTimes />
              </button>
            )}
          </div>

          {filters.map(f => (
            <select
              key={f.key}
              className={styles.filterSelect}
              value={filterValues[f.key] || ""}
              onChange={e => setFilterValues(p => ({ ...p, [f.key]: e.target.value }))}
            >
              <option value="">{f.label}: All</option>
              {f.options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                {(updateFn || deleteFn || customActions) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (updateFn || deleteFn || customActions ? 1 : 0)} className={styles.empty}>
                    No records found.
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.uuid}>
                  {columns.map(c => (
                    <td key={c.key}>
                      {c.render ? c.render(item) : (item[c.key] ?? "—")}
                    </td>
                  ))}
                  {(updateFn || deleteFn || customActions) && (
                    <td>
                      <div className={styles.actionCell}>
                        {customActions && customActions(item, fetchData)}
                        {updateFn && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            onClick={() => openEdit(item)}
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                        )}
                        {deleteFn && (
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            onClick={() => handleDelete(item)}
                          >
                            <FaTrash size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CrudModal
          title={modal.title}
          fields={fields}
          initial={modal.initial}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// ── Student Section ───────────────────────────────────────────────────────────

const StudentSection = () => {
  const [activeTab, setActiveTab] = useState("students");
  const { notify } = useNotification();

  const TABS = [
    { key: "students", label: "Students", icon: <FiUsers /> },
    { key: "claims", label: "Claims", icon: <FiClipboard /> },
  ];

  const handleApprove = async (item, refresh) => {
    if (!window.confirm("Approve this claim?")) return;
    try {
      await approveClaim(item.uuid);
      notify({ type: "success", title: "Approved", message: "Claim approved successfully." });
      refresh();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Failed to approve claim." });
    }
  };

  const handleReject = async (item, refresh) => {
    if (!window.confirm("Reject this claim?")) return;
    try {
      await rejectClaim(item.uuid);
      notify({ type: "success", title: "Rejected", message: "Claim rejected successfully." });
      refresh();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Failed to reject claim." });
    }
  };

  return (
    <div>
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {activeTab === "students" && (
        <CrudTable
          title="Student"
          subtitle="Manage your institution's students"
          columns={[
            { key: "student_id", label: "Student ID" },
            { key: "first_name", label: "First Name" },
            { key: "last_name",  label: "Last Name" },
            { key: "claim_status", label: "Claim Status", render: r => (
              <span className={`${styles.badge} ${
                r.claim_status === "claimed" ? styles.badgeSuccess : 
                r.claim_status === "pending_claim" ? styles.badgePrimary : styles.badgeDefault
              }`}>
                {(r.claim_status || "unclaimed").replace("_", " ").toUpperCase()}
              </span>
            )},
          ]}
          listFn={listStudents} createFn={createStudent}
          updateFn={updateStudent} deleteFn={deleteStudent}
          fields={[
            { key: "student_id",     label: "Student ID",     required: true, placeholder: "STU-2025-001" },
            { key: "first_name",     label: "First Name",     required: true, placeholder: "John" },
            { key: "last_name",      label: "Last Name",      required: true, placeholder: "Doe" },
            { key: "date_of_birth",  label: "Date of Birth",  type: "date" },
            { key: "guardian_name",  label: "Guardian Name",  placeholder: "Jane Doe" },
            { key: "guardian_phone", label: "Guardian Phone", placeholder: "+1234567890" },
          ]}
          toFormData={item => item
            ? { student_id: item.student_id, first_name: item.first_name, last_name: item.last_name, date_of_birth: item.date_of_birth || "", guardian_name: item.guardian_name || "", guardian_phone: item.guardian_phone || "" }
            : { student_id: "", first_name: "", last_name: "", date_of_birth: "", guardian_name: "", guardian_phone: "" }
          }
          filters={[
            { key: "claim_status", label: "Status", options: [{value: "unclaimed", label: "Unclaimed"}, {value: "pending_claim", label: "Pending"}, {value: "claimed", label: "Claimed"}], filterKey: "claim_status" },
          ]}
        />
      )}

      {activeTab === "claims" && (
        <CrudTable
          title="Claim"
          subtitle="Manage student profile claims"
          columns={[
            { key: "student", label: "Student", render: r => r.student ? `${r.student.student_id} - ${r.student.first_name} ${r.student.last_name}` : "—" },
            { key: "user", label: "User", render: r => r.user ? r.user.email : "—" },
            { key: "status", label: "Status", render: r => (
              <span className={`${styles.badge} ${
                r.status === "approved" ? styles.badgeSuccess : 
                r.status === "pending" ? styles.badgePrimary : 
                r.status === "rejected" ? styles.badgeDanger : styles.badgeDefault
              }`}>
                {(r.status || "").toUpperCase()}
              </span>
            )},
            { key: "created_at", label: "Date", render: r => new Date(r.created_at).toLocaleDateString() },
          ]}
          listFn={listClaims}
          customActions={(item, refresh) => item.status === "pending" && (
            <>
              <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => handleApprove(item, refresh)}>Approve</button>
              <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleReject(item, refresh)}>Reject</button>
            </>
          )}
          filters={[
            { key: "status", label: "Status", options: [{value: "pending", label: "Pending"}, {value: "approved", label: "Approved"}, {value: "rejected", label: "Rejected"}], filterKey: "status" },
          ]}
        />
      )}
    </div>
  );
};

export default StudentSection;
