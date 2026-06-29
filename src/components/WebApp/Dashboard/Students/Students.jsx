import React, { useState, useEffect, useCallback } from "react";
import styles from "../Academics/Semesters/Semesters.module.css"; // Reuse table styles
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaPlus, FaSearch, FaTimes, FaUserEdit } from "react-icons/fa";
import StudentModal from "./StudentModal";
import { listStudents, updateStudent } from "@/services/student/studentService";

const Students = ({ orgId }) => {
  const { notify } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listStudents();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      notify({ type: "error", title: "Error", message: "Failed to load students." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (student) => {
    try {
      const newStatus = student.status === "active" ? "withdrawn" : "active";
      await updateStudent(student.id, { status: newStatus, is_active: newStatus === "active" });
      notify({ type: "success", title: "Status Updated", message: `Student marked as ${newStatus}.` });
      fetchData();
    } catch (e) {
      notify({ type: "error", title: "Error", message: "Failed to update status." });
    }
  };

  const filtered = items.filter(item => {
    const fullName = `${item.first_name || ""} ${item.last_name || ""}`.toLowerCase();
    const email = (item.email || "").toLowerCase();
    const q = search.toLowerCase();
    
    if (search && !fullName.includes(q) && !email.includes(q) && !(item.admission_number || "").toLowerCase().includes(q))
      return false;
    if (filterStatus && item.status !== filterStatus)
      return false;
    return true;
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Students</h2>
          <p className={styles.cardSub}>Manage enrolled students and their guardians</p>
        </div>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          <FaPlus size={10} /> Enrol Student
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <FaSearch className={styles.searchIcon} size={12} />
          <input
            className={styles.searchInput}
            placeholder="Search name, email, or admission no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <FaTimes className={styles.searchClear} size={11} onClick={() => setSearch("")} />
          )}
        </div>

        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Status: All</option>
          <option value="active">Active</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="graduated">Graduated</option>
          <option value="transferred">Transferred</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Adm. No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Guardian Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>No students found.</td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ color: "rgba(255,255,255,0.5)" }}>{item.admission_number || "—"}</td>
                  <td className={styles.nameCell}>
                    {item.first_name || item.last_name ? `${item.first_name} ${item.last_name}` : "—"}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.guardian_email || "—"}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={item.status === "active" ? styles.badgeActive : styles.badgeInactive}>
                      {(item.status || "—").toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => toggleStatus(item)}>
                        <FaUserEdit size={11} /> Toggle Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <StudentModal
          orgId={orgId}
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            notify({ type: "success", title: "Success", message: "Student enrolled. Credentials emailed." });
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Students;
