import React, { useState, useEffect } from "react";
import styles from "./Section.module.css";
import { listSubOrgs, createSubOrg, updateSubOrg, deleteSubOrg } from "@/services/user/Org/suborgService";

const SubOrganizationSection = () => {
  const [subOrgs, setSubOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSubOrg, setEditingSubOrg] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSubOrgs();
  }, []);

  const fetchSubOrgs = async () => {
    setLoading(true);
    try {
      const res = await listSubOrgs();
      setSubOrgs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (subOrg = null) => {
    setEditingSubOrg(subOrg);
    setFormData(subOrg || {
      name: "", description: "", phone_number: "", email: "", country: "", province: "", district: "", city: ""
    });
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingSubOrg(null);
  };

  const handleSave = async () => {
    try {
      if (editingSubOrg?.uuid) {
        await updateSubOrg(editingSubOrg.uuid, formData);
      } else {
        await createSubOrg(formData);
      }
      handleCloseDrawer();
      fetchSubOrgs();
    } catch (e) {
      console.error(e);
      alert("Error saving sub-organization.");
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this sub-organization?")) return;
    try {
      await deleteSubOrg(uuid);
      fetchSubOrgs();
    } catch (e) {
      console.error(e);
      alert("Error deleting sub-organization.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Sub Organizations...</div>;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Sub Organizations</h2>
            <p className={styles.cardSubtitle}>Manage branches or departments</p>
          </div>
          <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer()}>
            + Add Sub Organization
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subOrgs.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>No sub-organizations found.</td>
                </tr>
              ) : (
                subOrgs.map((org) => (
                  <tr key={org.uuid}>
                    <td>{org.name}</td>
                    <td>{org.description || "-"}</td>
                    <td>{org.phone_number || "-"}</td>
                    <td>{org.email || "-"}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer(org)}>Edit</button>
                        <button className={`${styles.badge} ${styles.badgeDanger}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(org.uuid)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen && (
        <div className={styles.overlay} onClick={handleCloseDrawer}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>{editingSubOrg ? "Edit Sub Organization" : "New Sub Organization"}</h3>
              <button className={styles.closeBtn} onClick={handleCloseDrawer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.grid} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.field}>
                <label>Name</label>
                <input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input value={formData.phone_number || ""} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Country</label>
                <input value={formData.country || ""} onChange={e => setFormData({ ...formData, country: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Province</label>
                <input value={formData.province || ""} onChange={e => setFormData({ ...formData, province: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>District</label>
                <input value={formData.district || ""} onChange={e => setFormData({ ...formData, district: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>City</label>
                <input value={formData.city || ""} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              
              <div className={styles.actions} style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer', padding: '0.6rem 1.2rem', fontSize: '1rem', width: '100%', justifyContent: 'center' }} onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubOrganizationSection;
