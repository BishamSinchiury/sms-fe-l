import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import { listClaims, approveClaim, rejectClaim } from "@/services/academic/studentService";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaCheck, FaTimes } from "react-icons/fa";

const StudentClaimsSection = () => {
  const { notify } = useNotification();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listClaims();
      setClaims(res.data || res || []);
    } catch (e) {
      console.error(e);
      notify({ type: "error", title: "Error", message: "Failed to load claims." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (uuid) => {
    try {
      await approveClaim(uuid);
      notify({ type: "success", title: "Approved", message: "Claim approved successfully." });
      fetchData();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Error approving claim." });
    }
  };

  const handleReject = async (uuid) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await rejectClaim(uuid, reason);
      notify({ type: "success", title: "Rejected", message: "Claim rejected." });
      fetchData();
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Error rejecting claim." });
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Student Claims</h2>
            <p className={styles.cardSubtitle}>Pending student account claim requests</p>
          </div>
        </div>

        {loading ? <div className={styles.loading}>Loading claims…</div> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Claiming User</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr><td colSpan="5" className={styles.empty}>No pending claims.</td></tr>
                ) : claims.map(c => (
                  <tr key={c.uuid}>
                    <td style={{ fontWeight: 500 }}>{c.student?.student_id}</td>
                    <td>{c.student?.first_name} {c.student?.last_name}</td>
                    <td>{c.user?.email}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: "none", cursor: "pointer", background: "#10b981" }} onClick={() => handleApprove(c.uuid)}>
                          <FaCheck /> Approve
                        </button>
                        <button className={`${styles.badge} ${styles.badgeDanger}`} style={{ border: "none", cursor: "pointer" }} onClick={() => handleReject(c.uuid)}>
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClaimsSection;
