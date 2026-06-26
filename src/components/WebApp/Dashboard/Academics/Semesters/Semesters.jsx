import React, { useState, useEffect, useCallback } from "react";
import styles from "./Semesters.module.css";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaPlus, FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import SemesterModal from "./SemesterModal";
import Notify from "@/components/Modal/Notify.jsx";
import {
  listSemesters,
  deleteSemester,
} from "@/services/academic/academicService";

const Semesters = ({ programOpts = [], subjectOpts = [] }) => {
  const { notify } = useNotification();

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterActive, setFilterActive]   = useState("");
  const [modal, setModal]       = useState(null);   // null | { item }
  const [confirmDel, setConfirmDel] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listSemesters();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      notify({ type: "error", title: "Error", message: "Failed to load semesters." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Called by the modal when a create/update completes in the background
  const handleRefresh = () => fetchData();

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      await deleteSemester(confirmDel.id);
      notify({ type: "success", title: "Deleted", message: "Semester deleted." });
      setConfirmDel(null);
      fetchData();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Delete failed." });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter(item => {
    if (search && !`${item.name} ${item.program_name}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterProgram && item.program_name !== filterProgram)
      return false;
    if (filterActive) {
      const val = filterActive === "yes";
      if (item.is_active !== val) return false;
    }
    return true;
  });

  const uniquePrograms = [...new Set(items.map(i => i.program_name).filter(Boolean))];

  return (
    <div className={styles.card}>

      {/* Card header */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Semesters</h2>
          <p className={styles.cardSub}>Semesters belonging to university programs</p>
        </div>
        <button className={styles.addBtn} onClick={() => setModal({ item: null })}>
          <FaPlus size={10} /> Add Semester
        </button>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <FaSearch className={styles.searchIcon} size={12} />
          <input
            className={styles.searchInput}
            placeholder="Search name or program…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <FaTimes className={styles.searchClear} size={11} onClick={() => setSearch("")} />
          )}
        </div>

        <select
          className={styles.filterSelect}
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
        >
          <option value="">Program: All</option>
          {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className={styles.filterSelect}
          value={filterActive}
          onChange={e => setFilterActive(e.target.value)}
        >
          <option value="">Status: All</option>
          <option value="yes">Active</option>
          <option value="no">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Program</th>
                <th>Duration</th>
                <th>Compulsory</th>
                <th>Opt. Groups</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.empty}>No semesters found.</td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className={styles.orderCell}>{item.order}</td>
                  <td className={styles.nameCell}>{item.name}</td>
                  <td>
                    <span className={styles.programBadge}>{item.program_name}</span>
                  </td>
                  <td>{item.duration} mo</td>
                  <td>
                    <span className={styles.countBadge}>
                      {item.compulsory_count ?? 0}
                      {item.total_compulsory_subjects > 0 && (
                        <span className={styles.countCap}>/{item.total_compulsory_subjects}</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={styles.countBadge}>
                      {item.optional_group_count ?? 0}
                      {item.total_optional_groups > 0 && (
                        <span className={styles.countCap}>/{item.total_optional_groups}</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={item.is_active ? styles.badgeActive : styles.badgeInactive}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setModal({ item })}
                      >
                        <FaEdit size={11} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Semester modal */}
      {modal && (
        <SemesterModal
          item={modal.item}
          programOpts={programOpts}
          subjectOpts={subjectOpts}
          onClose={() => { setModal(null); fetchData(); }}
          onRefresh={handleRefresh}
        />
      )}

      {/* Delete confirm */}
      <Notify
        show={!!confirmDel}
        title="Delete Semester"
        message={`Are you sure you want to delete "${confirmDel?.name}"? This cannot be undone.`}
        okText={deleting ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        okType="Delete"
        onOk={handleDelete}
        onCancel={() => !deleting && setConfirmDel(null)}
      />
    </div>
  );
};

export default Semesters;