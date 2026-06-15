import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import drawerStyles from "./Drawer.module.css";
import formStyles from "./FormElements.module.css";
import {
  listUsers, createUser, updateUser, deleteUser, listRoles
} from "@/services/user/Org/userManagementService";
import { FaThList, FaThLarge, FaSearch, FaTimes, FaTrash, FaEdit, FaUserPlus, FaUser } from "react-icons/fa";

const initialFilters = { search: "", role: "", status: "", is_active: "", is_staff: "" };

const UsersManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [filters, setFilters] = useState(initialFilters);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = useCallback(async (filterParams = {}) => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        listUsers(filterParams),
        listRoles()
      ]);
      setUsers(usersRes || []);
      setRoles(rolesRes || []);
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

  const handleOpenDrawer = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        is_staff: user.is_staff || false,
        is_active: user.is_active !== false,
        role_uuid: user.role_uuid || ""
      });
    } else {
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_staff: false,
        is_active: true,
        role_uuid: ""
      });
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      if (editingUser?.uuid) {
        await updateUser(editingUser.uuid, formData);
      } else {
        await createUser(formData);
      }
      handleCloseDrawer();
      fetchData(filters);
    } catch (e) {
      const msg = e?.response?.data?.email?.[0] || e?.response?.data?.detail || "Error saving user.";
      alert(msg);
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(uuid);
      fetchData(filters);
    } catch (e) {
      alert(e?.response?.data?.detail || "Error deleting user.");
    }
  };

  // ── Avatar generation ──────────────────────────────────────────────────

  const getInitials = (u) => {
    const fn = u.first_name || "";
    const ln = u.last_name || "";
    if (fn && ln) return `${fn[0]}${ln[0]}`.toUpperCase();
    return (u.email?.[0] || "?").toUpperCase();
  };

  const avatarColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#14b8a6", "#06b6d4", "#84cc16"];
  const getAvatarColor = (uuid) => avatarColors[uuid?.charCodeAt(0) % avatarColors.length] || "#6366f1";

  // ── Filter options from loaded data ────────────────────────────────────

  const roleOptions = [...new Set(users.map(u => u.role).filter(Boolean))];
  const statusOptions = [...new Set(users.map(u => u.status).filter(Boolean))];

  if (loading) return <div className={styles.loading}>Loading Users...</div>;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>User Management</h2>
            <p className={styles.cardSubtitle}>Manage users, roles and permissions</p>
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
              <FaUserPlus /> Add User
            </button>
          </div>
        </div>

        {/* ── Filters & Search ─────────────────────────────────────── */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="">All Roles</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className={styles.filterSelect}
            value={filters.is_active}
            onChange={(e) => handleFilterChange("is_active", e.target.value)}
          >
            <option value="">Active Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filters.is_staff}
            onChange={(e) => handleFilterChange("is_staff", e.target.value)}
          >
            <option value="">Staff Status</option>
            <option value="true">Staff</option>
            <option value="false">Non-Staff</option>
          </select>

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
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.empty}>No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.uuid}>
                      <td>{u.email}</td>
                      <td>{u.full_name || u.username || "-"}</td>
                      <td>{u.role || "-"}</td>
                      <td>
                        <span className={`${styles.badge} ${u.is_active ? styles.badgeSuccess : styles.badgeDanger}`}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{u.is_staff ? "Yes" : "No"}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className={`${styles.badge} ${styles.badgeDefault}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer(u)}>Edit</button>
                          <button className={`${styles.badge} ${styles.badgeDanger}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(u.uuid)}>Delete</button>
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
            {users.length === 0 ? (
              <div className={styles.empty}>No users found.</div>
            ) : (
              users.map((u) => (
                <div key={u.uuid} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    <div
                      className={styles.userAvatar}
                      style={{ background: getAvatarColor(u.uuid) }}
                    >
                      {getInitials(u)}
                    </div>
                    <div className={styles.userCardActions}>
                      <button
                        className={styles.iconBtnSmall}
                        onClick={() => handleOpenDrawer(u)}
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.iconBtnSmall}
                        onClick={() => handleDelete(u.uuid)}
                        title="Delete user"
                        style={{ color: "#f87171" }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className={styles.userCardBody}>
                    <h4 className={styles.userCardName}>{u.full_name || u.username || u.email}</h4>
                    <p className={styles.userCardEmail}>{u.email}</p>

                    <div className={styles.userCardMeta}>
                      {u.role && <span className={styles.userCardTag}>{u.role}</span>}
                      <span className={`${styles.badge} ${u.is_active ? styles.badgeSuccess : styles.badgeDanger}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                      {u.is_staff && <span className={styles.userCardStaff}>Staff</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className={drawerStyles.overlay} onClick={handleCloseDrawer}>
          <div className={drawerStyles.drawer} onClick={e => e.stopPropagation()}>
            <div className={drawerStyles.drawerHeader}>
              <h3 className={drawerStyles.drawerTitle}>{editingUser ? "Edit User" : "New User"}</h3>
              <button className={drawerStyles.closeBtn} onClick={handleCloseDrawer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {!editingUser && (
                <>
                  <div className={formStyles.field}>
                    <label>Email</label>
                    <input type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className={formStyles.field}>
                    <label>Password</label>
                    <input type="password" value={formData.password || ""} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </>
              )}
              {editingUser && (
                <div className={formStyles.field}>
                  <label>Username</label>
                  <input value={formData.username || ""} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                </div>
              )}
              <div className={formStyles.field}>
                <label>First Name</label>
                <input value={formData.first_name || ""} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className={formStyles.field}>
                <label>Last Name</label>
                <input value={formData.last_name || ""} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
              <div className={formStyles.field}>
                <label>Role</label>
                <select value={formData.role_uuid || ""} onChange={e => setFormData({ ...formData, role_uuid: e.target.value })}>
                  <option value="">None</option>
                  {roles.map(r => (
                    <option key={r.uuid} value={r.uuid}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className={formStyles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={formData.is_staff || false} onChange={e => setFormData({ ...formData, is_staff: e.target.checked })} />
                  Is Staff
                </label>
              </div>
              {editingUser && (
                <div className={formStyles.field}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={formData.is_active || false} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                    Is Active
                  </label>
                </div>
              )}
              
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

export default UsersManagementSection;