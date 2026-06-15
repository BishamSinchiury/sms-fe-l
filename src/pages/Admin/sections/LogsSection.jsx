import React, { useState, useEffect } from "react";
import styles from "./Section.module.css";
import drawerStyles from "./Drawer.module.css";
import formStyles from "./FormElements.module.css";
import { listActivityLogs } from "@/services/user/Org/rbacService";

const LogsSection = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const res = await listActivityLogs(params);
      setLogs(res.data?.results || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Activity Logs...</div>;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Activity Logs</h2>
            <p className={styles.cardSubtitle}>Monitor user activities and system events</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Filter by action..." 
              value={actionFilter} 
              onChange={e => setActionFilter(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-color)' }}
            />
            <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: 'none', cursor: 'pointer' }} onClick={fetchLogs}>
              Refresh
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>No logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.uuid}>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.user_email || "System"}</td>
                    <td>{log.action_display}</td>
                    <td>{log.target_type || "-"}</td>
                    <td>{log.ip_address || "-"}</td>
                    <td>
                      <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => setSelectedLog(log)}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className={drawerStyles.overlay} onClick={() => setSelectedLog(null)}>
          <div className={drawerStyles.drawer} onClick={e => e.stopPropagation()}>
            <div className={drawerStyles.drawerHeader}>
              <h3 className={drawerStyles.drawerTitle}>Log Details</h3>
              <button className={drawerStyles.closeBtn} onClick={() => setSelectedLog(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>Time:</span>
                <span className={drawerStyles.detailValue}>{new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>User:</span>
                <span className={drawerStyles.detailValue}>{selectedLog.user_email || "System"}</span>
              </div>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>Action:</span>
                <span className={drawerStyles.detailValue}>{selectedLog.action_display}</span>
              </div>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>Target Type:</span>
                <span className={drawerStyles.detailValue}>{selectedLog.target_type || "-"}</span>
              </div>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>Target UUID:</span>
                <span className={drawerStyles.detailValue}>{selectedLog.object_uuid || "-"}</span>
              </div>
              <div className={drawerStyles.detailRow}>
                <span className={drawerStyles.detailLabel}>IP Address:</span>
                <span className={drawerStyles.detailValue}>{selectedLog.ip_address || "-"}</span>
              </div>
              <div className={formStyles.field} style={{ marginTop: '1rem' }}>
                <label>Metadata</label>
                <pre style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto', color: 'var(--text-color)' }}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsSection;
