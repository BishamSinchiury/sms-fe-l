import React, { useState, useEffect, useCallback } from "react";
import styles from "./ClassSubjectConfigs.module.css";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaPlus, FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import ClassSubjectConfigModal from "./ClassSubjectConfigModal";
import { listClassSubjectConfigs } from "@/services/academic/academicService";

const ClassSubjectConfigs = ({ gradeOpts = [], streamOpts = [], subjectOpts = [] }) => {
  const { notify } = useNotification();

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterActive, setFilterActive]   = useState("");
  const [modal, setModal]       = useState(null);   // null | { item }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listClassSubjectConfigs();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      notify({ type: "error", title: "Error", message: "Failed to load class configs." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = () => fetchData();

  const filtered = items.filter(item => {
    const gradeName = item.grade_name || "";
    if (search && !gradeName.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterGrade && gradeName !== filterGrade)
      return false;
    if (filterActive) {
      const val = filterActive === "yes";
      if (item.is_active !== val) return false;
    }
    return true;
  });

  const uniqueGrades = [...new Set(items.map(i => i.grade_name).filter(Boolean))];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Class Subject Configs</h2>
          <p className={styles.cardSub}>Subject blueprints for a grade and its streams</p>
        </div>
        <button className={styles.addBtn} onClick={() => setModal({ item: null })}>
          <FaPlus size={10} /> Add Config
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <FaSearch className={styles.searchIcon} size={12} />
          <input
            className={styles.searchInput}
            placeholder="Search grade…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <FaTimes className={styles.searchClear} size={11} onClick={() => setSearch("")} />
          )}
        </div>

        <select
          className={styles.filterSelect}
          value={filterGrade}
          onChange={e => setFilterGrade(e.target.value)}
        >
          <option value="">Grade: All</option>
          {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
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

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Streams</th>
                <th>Compulsory</th>
                <th>Opt. Groups</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>No configs found.</td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className={styles.nameCell}>{item.grade_name}</td>
                  <td>
                    {item.streams_detail && item.streams_detail.length > 0
                      ? item.streams_detail.map(s => <span key={s.id} className={styles.streamBadge}>{s.name}</span>)
                      : <span className={styles.allStreamsBadge}>All</span>}
                  </td>
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
                      <button className={styles.editBtn} onClick={() => setModal({ item })}>
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

      {modal && (
        <ClassSubjectConfigModal
          item={modal.item}
          gradeOpts={gradeOpts}
          streamOpts={streamOpts}
          subjectOpts={subjectOpts}
          onClose={() => { setModal(null); fetchData(); }}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default ClassSubjectConfigs;
