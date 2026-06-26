import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import drawerStyles from "./Drawer.module.css";
import formStyles from "./FormElements.module.css";
import { useNotification } from "@/components/Notification/NotificationContainer";
import {
  listRoles, createRole, updateRole, deleteRole
} from "@/services/user/Auth/rbacService";
import { FaThList, FaThLarge, FaSearch, FaTimes, FaTrash, FaEdit, FaPlus, FaShieldAlt } from "react-icons/fa";

const initialFilters = { search: "" };

const RolesManagementSection = () => {
  const { notify } = useNotification();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState(initialFilters);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = useCallback(async (filterParams = {}) => {
    setLoading(true);
    try {
      const res = await listRoles(filterParams);
      setRoles(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const active = {};
    Object.entries(newFilters).forEach(([k, v]) => { if (v) active[k] = v; });
    fetchData(active);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    fetchData();
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  const handleOpenDrawer = (role = null) => {
    setEditingRole(role);
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || ""
      });
    } else {
      setFormData({
        name: "",
        description: ""
      });
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingRole(null);
  };

  const handleSave = async () => {
    try {
      if (editingRole?.uuid) {
        await updateRole(editingRole.uuid, formData);
        notify({ title: "Success", message: "Role updated successfully", type: "success" });
      } else {
        await createRole(formData);
        notify({ title: "Success", message: "Role created successfully", type: "success" });
      }
      handleCloseDrawer();
      fetchData(filters);
    } catch (e) {
      const msg = e?.response?.data?.name?.[0] || e?.response?.data?.detail || "Error saving role.";
      notify({ title: "Error", message: msg, type: "error" });
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(uuid);
      notify({ title: "Success", message: "Role deleted successfully", type: "success" });
      fetchData(filters);
    } catch (e) {
      notify({ title: "Error", message: e?.response?.data?.detail || "Error deleting role.", type: "error" });
    }
  };

  const avatarColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#14b8a6", "#06b6d4", "#84cc16"];
  const getAvatarColor = (uuid) => avatarColors[uuid?.charCodeAt(0) % avatarColors.length] || "#6366f1";

  if (loading) return <div className={styles.loading}>Loading Roles...</div>;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Role Management</h2>
            <p className={styles.cardSubtitle}>Manage organization roles and their configurations</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={`${styles.iconBtn} ${viewMode === "table" ? styles.iconBtnActive : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <FaThList />
            </button>
            <button
              className={`${styles.iconBtn} ${viewMode === "cards" ? styles.iconBtnActive : ""}`}
              onClick={() => setViewMode("cards")}
              title="Card view"
            >
              <FaThLarge />
            </button>
            <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer()}>
              <FaPlus /> Add Role
            </button>
          </div>
        </div>

        {/* ── Filters & Search ─────────────────────────────────────── */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search roles by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              <FaTimes /> Clear
            </button>
          )}
        </div>

        {/* ── Table View ──────────────────────────────────────────── */}
        {viewMode === "table" && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Users Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.empty}>No roles found.</td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.uuid}>
                      <td>{r.name}</td>
                      <td>{r.description || "-"}</td>
                      <td>{r.user_count || 0}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer(r)}>Edit</button>
                          <button className={`${styles.badge} ${styles.badgeDanger}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(r.uuid)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Card View ───────────────────────────────────────────── */}
        {viewMode === "cards" && (
          <div className={styles.userCardGrid}>
            {roles.length === 0 ? (
              <div className={styles.empty}>No roles found.</div>
            ) : (
              roles.map((r) => (
                <div key={r.uuid} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    <div
                      className={styles.userAvatar}
                      style={{ background: getAvatarColor(r.uuid), display: 'flex', alignItems: 'center', justifyItems: 'center' }}
                    >
                      <span style={{color: 'white', marginTop: '6px', marginLeft: '6px'}}><FaShieldAlt size={20} /></span>
                    </div>
                    <div className={styles.userCardActions}>
                      <button
                        className={styles.iconBtnSmall}
                        onClick={() => handleOpenDrawer(r)}
                        title="Edit role"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.iconBtnSmall}
                        onClick={() => handleDelete(r.uuid)}
                        title="Delete role"
                        style={{ color: "#f87171" }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className={styles.userCardBody}>
                    <h4 className={styles.userCardName}>{r.name}</h4>
                    <p className={styles.userCardEmail}>{r.description || "No description"}</p>

                    <div className={styles.userCardMeta}>
                      <span className={styles.userCardTag}>{r.user_count || 0} Users</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div 
          className={drawerStyles.overlay} 
          onClick={handleCloseDrawer}
          style={{ alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}
        >
          <div 
            className={drawerStyles.drawer} 
            onClick={e => e.stopPropagation()}
            style={{ height: 'auto', maxHeight: '90vh', borderRadius: '12px' }}
          >
            <div className={drawerStyles.drawerHeader}>
              <h3 className={drawerStyles.drawerTitle}>{editingRole ? "Edit Role" : "New Role"}</h3>
              <button className={drawerStyles.closeBtn} onClick={handleCloseDrawer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={formStyles.field}>
                <label>Name</label>
                <input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className={formStyles.field}>
                <label>Description</label>
                <textarea 
                  rows={3} 
                  style={{ width: '100%', resize: 'vertical' }}
                  value={formData.description || ""} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>
              
              <div className={formStyles.actions} style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <button className={formStyles.saveBtn} style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave}>
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

export default RolesManagementSection;
