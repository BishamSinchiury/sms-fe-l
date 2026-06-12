import React, { useState, useEffect } from "react";
import styles from "./Section.module.css";
import { listUsers, createUser, updateUser, deleteUser, listRoles } from "@/services/user/Org/userManagementService";

const UsersManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        listUsers(),
        listRoles()
      ]);
      setUsers(usersRes || []);
      setRoles(rolesRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Error saving user.");
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(uuid);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Error deleting user.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Users...</div>;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>User Management</h2>
            <p className={styles.cardSubtitle}>Manage users, roles and permissions</p>
          </div>
          <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={() => handleOpenDrawer()}>
            + Add User
          </button>
        </div>

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
      </div>

      {drawerOpen && (
        <div className={styles.overlay} onClick={handleCloseDrawer}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>{editingUser ? "Edit User" : "New User"}</h3>
              <button className={styles.closeBtn} onClick={handleCloseDrawer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.grid} style={{ display: 'flex', flexDirection: 'column' }}>
              {!editingUser && (
                <>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>Password</label>
                    <input type="password" value={formData.password || ""} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </>
              )}
              {editingUser && (
                <div className={styles.field}>
                  <label>Username</label>
                  <input value={formData.username || ""} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                </div>
              )}
              <div className={styles.field}>
                <label>First Name</label>
                <input value={formData.first_name || ""} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input value={formData.last_name || ""} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select value={formData.role_uuid || ""} onChange={e => setFormData({ ...formData, role_uuid: e.target.value })}>
                  <option value="">None</option>
                  {roles.map(r => (
                    <option key={r.uuid} value={r.uuid}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={formData.is_staff || false} onChange={e => setFormData({ ...formData, is_staff: e.target.checked })} />
                  Is Staff
                </label>
              </div>
              {editingUser && (
                <div className={styles.field}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" style={{ width: 'auto', margin: 0 }} checked={formData.is_active || false} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                    Is Active
                  </label>
                </div>
              )}
              
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

export default UsersManagementSection;
