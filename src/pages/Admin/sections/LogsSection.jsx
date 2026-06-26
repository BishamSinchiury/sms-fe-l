import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Section.module.css";
import formStyles from "./FormElements.module.css";
import { listActivityLogs } from "@/services/user/Auth/rbacService";
import { FaSearch, FaTimes, FaSync, FaFilter } from "react-icons/fa";

// ── Constants ──────────────────────────────────────────────────────────────────

const ACTION_OPTIONS = [
  "user_created", "user_updated", "user_deleted",
  "user_activated", "user_deactivated",
  "role_assigned", "role_created", "role_updated", "role_deleted",
  "login", "logout",
];

const initialFilters = {
  search: "",       // searches user_email
  action: "",
  target_type: "",
  ip_address: "",
  date_from: "",
  date_to: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const actionColor = (action = "") => {
  if (action.includes("delet") || action.includes("deactivat")) return "#f87171";
  if (action.includes("creat") || action.includes("activat"))   return "#34d399";
  if (action.includes("login") || action.includes("logout"))    return "#60a5fa";
  return "#a78bfa";
};

// ── Log detail modal ───────────────────────────────────────────────────────────

const LogModal = ({ log, onClose }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const rows = [
    { label: "Time",        value: fmt(log.created_at) },
    { label: "User",        value: log.user_email || "System" },
    { label: "Action",      value: log.action_display },
    { label: "Target Type", value: log.target_type || "—" },
    { label: "Target UUID", value: log.object_uuid  || "—" },
    { label: "IP Address",  value: log.ip_address   || "—" },
  ];

  return (
    <div className={formStyles.modalOverlay} onClick={onClose}>
      <div className={formStyles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

        <div className={formStyles.modalHeader}>
          <div className={formStyles.modalHeaderLeft}>
            <div
              className={formStyles.modalAvatar}
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", fontSize: "1.1rem" }}
            >
              📋
            </div>
            <div>
              <h3 className={formStyles.modalTitle}>Log Details</h3>
              <p className={formStyles.modalSub}>{log.action_display}</p>
            </div>
          </div>
          <button className={formStyles.modalClose} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className={formStyles.modalBody}>
          <div className={formStyles.detailGrid}>
            {rows.map(({ label, value }) => (
              <div key={label} className={formStyles.detailCell}>
                <span className={formStyles.detailCellLabel}>{label}</span>
                <span className={formStyles.detailCellValue}>{value}</span>
              </div>
            ))}
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className={formStyles.field} style={{ marginTop: "0.5rem" }}>
              <label>Metadata</label>
              <pre className={formStyles.metaPre}>
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className={formStyles.modalFooter}>
          <button className={formStyles.cancelBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const LogsSection = () => {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState(initialFilters);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchLogs = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
      const res = await listActivityLogs(clean);
      setLogs(res?.results || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // ── Filter handling ────────────────────────────────────────────────────────

  const applyFilters = useCallback((next) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchLogs(next), 300);
  }, [fetchLogs]);

  const handleChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    applyFilters(next);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    fetchLogs();
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  // Unique target types from loaded data for the dropdown
  const targetTypes = [...new Set(logs.map(l => l.target_type).filter(Boolean))];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className={styles.card}>

        {/* ── Header ── */}
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Activity Logs</h2>
            <p className={styles.cardSubtitle}>Monitor user activities and system events</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={`${styles.iconBtn} ${showFilters ? styles.iconBtnActive : ""}`}
              onClick={() => setShowFilters(v => !v)}
              title="Toggle filters"
            >
              <FaFilter />
            </button>
            <button
              className={styles.iconBtn}
              onClick={() => fetchLogs(filters)}
              title="Refresh"
              disabled={loading}
            >
              <FaSync className={loading ? styles.spinning : ""} />
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        {showFilters && (
          <div className={styles.filterBar}>
            {/* Search (user email) */}
            <div className={styles.searchWrap}>
              <FaSearch className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search by email…"
                value={filters.search}
                onChange={e => handleChange("search", e.target.value)}
              />
              {filters.search && (
                <button className={styles.searchClear} onClick={() => handleChange("search", "")}>
                  <FaTimes />
                </button>
              )}
            </div>

            <select
              className={styles.filterSelect}
              value={filters.action}
              onChange={e => handleChange("action", e.target.value)}
            >
              <option value="">All Actions</option>
              {ACTION_OPTIONS.map(a => (
                <option key={a} value={a}>
                  {a.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={filters.target_type}
              onChange={e => handleChange("target_type", e.target.value)}
            >
              <option value="">All Targets</option>
              {targetTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
              className={styles.filterSelect}
              placeholder="IP address…"
              value={filters.ip_address}
              onChange={e => handleChange("ip_address", e.target.value)}
              style={{ fontFamily: "monospace" }}
            />

            <input
              className={styles.filterSelect}
              type="date"
              title="From date"
              value={filters.date_from}
              onChange={e => handleChange("date_from", e.target.value)}
            />

            <input
              className={styles.filterSelect}
              type="date"
              title="To date"
              value={filters.date_to}
              onChange={e => handleChange("date_to", e.target.value)}
            />

            {hasActiveFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>
                <FaTimes /> Clear
              </button>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
                <th>IP Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className={styles.empty}>Loading…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>No logs found.</td></tr>
              ) : logs.map(log => (
                <tr key={log.uuid} className={styles.clickableRow} onClick={() => setSelectedLog(log)}>
                  <td style={{ whiteSpace: "nowrap", opacity: 0.65, fontSize: "0.82rem" }}>
                    {fmt(log.created_at)}
                  </td>
                  <td style={{ fontSize: "0.875rem" }}>{log.user_email || "System"}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        background: `${actionColor(log.action)}22`,
                        color: actionColor(log.action),
                        border: `1px solid ${actionColor(log.action)}44`,
                      }}
                    >
                      {log.action_display}
                    </span>
                  </td>
                  <td style={{ opacity: 0.6, fontSize: "0.82rem" }}>{log.target_type || "—"}</td>
                  <td style={{ fontFamily: "monospace", opacity: 0.55, fontSize: "0.8rem" }}>
                    {log.ip_address || "—"}
                  </td>
                  <td>
                    <button
                      className={`${styles.badge} ${styles.badgeDefault}`}
                      style={{ border: "none", cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); setSelectedLog(log); }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {selectedLog && (
        <LogModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};

export default LogsSection;