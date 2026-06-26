import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import formStyles from "./FormElements.module.css";
import { listStudents, createStudent, updateStudent, deleteStudent } from "@/services/academic/studentService";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaThList, FaThLarge, FaSearch, FaTimes, FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";

const initialFilters = { search: "", claim_status: "" };
const STATUS_OPTIONS = ["unclaimed", "pending_claim", "claimed"];

const StudentModal = ({ student, onClose, onSave }) => {
  const isEdit = Boolean(student?.uuid);
  const [formData, setFormData] = useState(() =>
    isEdit
      ? {
          student_id: student.student_id || "",
          first_name: student.first_name || "",
          last_name: student.last_name || "",
        }
      : {
          student_id: "", first_name: "", last_name: "",
        }
  );

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className={formStyles.modalOverlay} onClick={onClose}>
      <div className={formStyles.modal} onClick={e => e.stopPropagation()}>
        <div className={formStyles.modalHeader}>
          <div className={formStyles.modalHeaderLeft}>
            <div>
              <h3 className={formStyles.modalTitle}>{isEdit ? "Edit Student" : "New Student"}</h3>
            </div>
          </div>
          <button className={formStyles.modalClose} onClick={onClose}><FaTimes /></button>
        </div>
        <div className={formStyles.modalBody}>
          <div className={formStyles.field}>
            <label>Student ID <span className={formStyles.required}>*</span></label>
            <input placeholder="STU-2025-001" value={formData.student_id} onChange={e => set("student_id", e.target.value)} />
          </div>
          <div className={formStyles.row}>
            <div className={formStyles.field}>
              <label>First Name <span className={formStyles.required}>*</span></label>
              <input placeholder="First name" value={formData.first_name} onChange={e => set("first_name", e.target.value)} />
            </div>
            <div className={formStyles.field}>
              <label>Last Name <span className={formStyles.required}>*</span></label>
              <input placeholder="Last name" value={formData.last_name} onChange={e => set("last_name", e.target.value)} />
            </div>
          </div>
        </div>
        <div className={formStyles.modalFooter}>
          <button className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={formStyles.saveBtn} onClick={() => onSave(formData, student?.uuid)}>
            {isEdit ? "Save Changes" : "Create Student"}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentManagementSection = () => {
  const { notify } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [modalStudent, setModalStudent] = useState(undefined);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
      const res = await listStudents(clean);
      setStudents(res.data || res || []);
    } catch (e) {
      console.error(e);
      notify({ type: "error", title: "Error", message: "Failed to load students." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchData(next);
  };

  const clearFilters = () => { setFilters(initialFilters); fetchData(); };
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleSave = async (formData, uuid) => {
    try {
      if (uuid) {
        await updateStudent(uuid, formData);
        notify({ type: "success", title: "Updated", message: "Student updated successfully." });
      } else {
        await createStudent(formData);
        notify({ type: "success", title: "Created", message: "Student created successfully." });
      }
      setModalStudent(undefined);
      fetchData(filters);
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Error saving student." });
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await deleteStudent(uuid);
      notify({ type: "success", title: "Deleted", message: "Student deleted." });
      fetchData(filters);
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Error deleting student." });
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Student Management</h2>
            <p className={styles.cardSubtitle}>Manage student records and claiming</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: "none", cursor: "pointer" }} onClick={() => setModalStudent(null)}>
              <FaUserPlus /> Add Student
            </button>
          </div>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search by name or ID…" value={filters.search} onChange={e => handleFilterChange("search", e.target.value)} />
            {filters.search && <button className={styles.searchClear} onClick={() => handleFilterChange("search", "")}><FaTimes /></button>}
          </div>
          <select className={styles.filterSelect} value={filters.claim_status} onChange={e => handleFilterChange("claim_status", e.target.value)}>
            <option value="">All Claim Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
          </select>
          {hasActiveFilters && <button className={styles.clearBtn} onClick={clearFilters}><FaTimes /> Clear</button>}
        </div>

        {loading ? <div className={styles.loading}>Loading students…</div> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Claim Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="4" className={styles.empty}>No students found.</td></tr>
                ) : students.map(s => (
                  <tr key={s.uuid}>
                    <td style={{ fontWeight: 500 }}>{s.student_id}</td>
                    <td>{s.first_name} {s.last_name}</td>
                    <td>
                      <span className={`${styles.badge} ${s.claim_status === 'claimed' ? styles.badgeSuccess : s.claim_status === 'pending_claim' ? styles.badgeWarning : styles.badgeDefault}`}>
                        {s.claim_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: "none", cursor: "pointer" }} onClick={() => setModalStudent(s)}><FaEdit /> Edit</button>
                        <button className={`${styles.badge} ${styles.badgeDanger}`} style={{ border: "none", cursor: "pointer" }} onClick={() => handleDelete(s.uuid)}><FaTrash /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modalStudent !== undefined && <StudentModal student={modalStudent} onClose={() => setModalStudent(undefined)} onSave={handleSave} />}
    </div>
  );
};

export default StudentManagementSection;
