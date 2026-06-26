import React, { useState, useEffect, useCallback } from "react";
import styles from "./Section.module.css";
import formStyles from "./FormElements.module.css";
import {
  listUsers, createUser, updateUser, deleteUser, listRoles
} from "@/services/user/Org/userManagementService";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { FaThList, FaThLarge, FaSearch, FaTimes, FaTrash, FaEdit, FaUserPlus, FaCheck } from "react-icons/fa";

// ── Constants ──────────────────────────────────────────────────────────────────

const initialFilters = {
  search: "", role: "", status: "", is_active: "", is_staff: "", is_verified: ""
};

const STATUS_OPTIONS = ["pending", "approved", "rejected", "suspended"];

// ── Avatar helpers ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316","#14b8a6","#06b6d4","#84cc16"];
const getInitials  = (u) => {
  const fn = u.first_name || "", ln = u.last_name || "";
  if (fn && ln) return `${fn[0]}${ln[0]}`.toUpperCase();
  return (u.email?.[0] || "?").toUpperCase();
};
const getAvatarColor = (uuid) => AVATAR_COLORS[(uuid?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ── Modal ──────────────────────────────────────────────────────────────────────

const UserModal = ({ user, roles, onClose, onSave }) => {
  const isEdit = Boolean(user?.uuid);
  const [formData, setFormData] = useState(() =>
    isEdit
      ? {
          first_name:  user.first_name  || "",
          last_name:   user.last_name   || "",
          username:    user.username    || "",
          is_staff:    user.is_staff    || false,
          is_active:   user.is_active   !== false,
          role_uuid:   user.role_uuid   || "",
        }
      : {
          email: "", password: "", first_name: "", last_name: "",
          is_staff: false, is_active: true, role_uuid: "",
        }
  );

  const set = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className={formStyles.modalOverlay} onClick={onClose}>
      <div className={formStyles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={formStyles.modalHeader}>
          <div className={formStyles.modalHeaderLeft}>
            <div
              className={formStyles.modalAvatar}
              style={{ background: isEdit ? getAvatarColor(user.uuid) : "#6366f1" }}
            >
              {isEdit ? getInitials(user) : <FaUserPlus />}
            </div>
            <div>
              <h3 className={formStyles.modalTitle}>{isEdit ? "Edit User" : "New User"}</h3>
              <p className={formStyles.modalSub}>
                {isEdit ? user.email : "Fill in details to create a new user"}
              </p>
            </div>
          </div>
          <button className={formStyles.modalClose} onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className={formStyles.modalBody}>

          {/* Create-only fields */}
          {!isEdit && (
            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label>Email <span className={formStyles.required}>*</span></label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={e => set("email", e.target.value)}
                />
              </div>
              <div className={formStyles.field}>
                <label>Password <span className={formStyles.required}>*</span></label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={e => set("password", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Edit-only: username */}
          {isEdit && (
            <div className={formStyles.field}>
              <label>Username</label>
              <input
                placeholder="username"
                value={formData.username}
                onChange={e => set("username", e.target.value)}
              />
            </div>
          )}

          <div className={formStyles.row}>
            <div className={formStyles.field}>
              <label>First Name</label>
              <input
                placeholder="First name"
                value={formData.first_name}
                onChange={e => set("first_name", e.target.value)}
              />
            </div>
            <div className={formStyles.field}>
              <label>Last Name</label>
              <input
                placeholder="Last name"
                value={formData.last_name}
                onChange={e => set("last_name", e.target.value)}
              />
            </div>
          </div>

          <div className={formStyles.field}>
            <label>Role</label>
            <select value={formData.role_uuid} onChange={e => set("role_uuid", e.target.value)}>
              <option value="">— No role —</option>
              {roles.map(r => (
                <option key={r.uuid} value={r.uuid}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className={formStyles.toggleRow}>
            <label className={formStyles.toggle}>
              <input
                type="checkbox"
                checked={formData.is_staff}
                onChange={e => set("is_staff", e.target.checked)}
              />
              <span className={formStyles.toggleTrack}>
                <span className={formStyles.toggleThumb} />
              </span>
              <span className={formStyles.toggleLabel}>Staff member</span>
            </label>

            {isEdit && (
              <label className={formStyles.toggle}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => set("is_active", e.target.checked)}
                />
                <span className={formStyles.toggleTrack}>
                  <span className={formStyles.toggleThumb} />
                </span>
                <span className={formStyles.toggleLabel}>Active account</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={formStyles.modalFooter}>
          <button className={formStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={formStyles.saveBtn} onClick={() => onSave(formData, user?.uuid)}>
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>

      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const UsersManagementSection = () => {
  const { notify } = useNotification();
  const [users,   setUsers]   = useState([]);
  const [roles,   setRoles]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [filters,  setFilters]  = useState(initialFilters);
  const [modalUser, setModalUser] = useState(undefined); // undefined = closed, null = new, object = edit

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      // Strip empty strings so they're not sent as query params
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ""));
      const [usersRes, rolesRes] = await Promise.all([listUsers(clean), listRoles()]);
      setUsers(usersRes || []);
      setRoles(rolesRes || []);
    } catch (e) {
      console.error(e);
      notify({ type: "error", title: "Error", message: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filters ──────────────────────────────────────────────────────────────────

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchData(next);
  };

  const clearFilters = () => { setFilters(initialFilters); fetchData(); };
  const hasActiveFilters = Object.values(filters).some(Boolean);

  // Derive role options from loaded roles list (not user data) for consistency
  const roleOptions = roles.map(r => r.name);

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  const handleSave = async (formData, uuid) => {
    try {
      if (uuid) {
        await updateUser(uuid, formData);
        notify({ type: "success", title: "Updated", message: "User updated successfully." });
      } else {
        await createUser(formData);
        notify({ type: "success", title: "Created", message: "User created successfully." });
      }
      setModalUser(undefined);
      fetchData(filters);
    } catch (e) {
      const msg =
        e?.response?.data?.email?.[0]     ||
        e?.response?.data?.password?.[0]  ||
        e?.response?.data?.detail         ||
        "Error saving user.";
      notify({ type: "error", title: "Error", message: msg });
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(uuid);
      notify({ type: "success", title: "Deleted", message: "User deleted." });
      fetchData(filters);
    } catch (e) {
      notify({ type: "error", title: "Error", message: e?.response?.data?.detail || "Error deleting user." });
    }
  };

  const handleApprove = async (uuid) => {
    try {
      await updateUser(uuid, { is_verified: true, status: "approved" });
      notify({ type: "success", title: "Approved", message: "User has been approved." });
      fetchData(filters);
    } catch {
      notify({ type: "error", title: "Error", message: "Failed to approve user." });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className={styles.card}>

        {/* ── Header ── */}
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>User Management</h2>
            <p className={styles.cardSubtitle}>Manage users, roles and permissions</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={`${styles.iconBtn} ${viewMode === "table" ? styles.iconBtnActive : ""}`}
              onClick={() => setViewMode("table")} title="Table view"
            ><FaThList /></button>
            <button
              className={`${styles.iconBtn} ${viewMode === "cards" ? styles.iconBtnActive : ""}`}
              onClick={() => setViewMode("cards")} title="Card view"
            ><FaThLarge /></button>
            <button
              className={`${styles.badge} ${styles.badgePrimary}`}
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => setModalUser(null)}
            >
              <FaUserPlus /> Add User
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name or email…"
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
            {filters.search && (
              <button className={styles.searchClear} onClick={() => handleFilterChange("search", "")}>
                <FaTimes />
              </button>
            )}
          </div>

          <select className={styles.filterSelect} value={filters.role} onChange={e => handleFilterChange("role", e.target.value)}>
            <option value="">All Roles</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select className={styles.filterSelect} value={filters.status} onChange={e => handleFilterChange("status", e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          <select className={styles.filterSelect} value={filters.is_active} onChange={e => handleFilterChange("is_active", e.target.value)}>
            <option value="">Active Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select className={styles.filterSelect} value={filters.is_staff} onChange={e => handleFilterChange("is_staff", e.target.value)}>
            <option value="">Staff Status</option>
            <option value="true">Staff</option>
            <option value="false">Non-Staff</option>
          </select>

          <select className={styles.filterSelect} value={filters.is_verified} onChange={e => handleFilterChange("is_verified", e.target.value)}>
            <option value="">Verification</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          {hasActiveFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              <FaTimes /> Clear
            </button>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && <div className={styles.loading}>Loading users…</div>}

        {/* ── Table view ── */}
        {!loading && viewMode === "table" && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className={styles.empty}>No users found.</td></tr>
                ) : users.map(u => (
                  <tr key={u.uuid}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: getAvatarColor(u.uuid),
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                          }}
                        >
                          {getInitials(u)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{u.full_name || u.username || "—"}</div>
                          <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.role || "—"}</td>
                    <td>
                      <span className={`${styles.badge} ${u.is_active ? styles.badgeSuccess : styles.badgeDanger}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${u.is_verified ? styles.badgeSuccess : styles.badgeDefault}`}>
                        {u.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>{u.is_staff ? "Yes" : "No"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {!u.is_verified && (
                          <button
                            className={`${styles.badge} ${styles.badgePrimary}`}
                            style={{ border: "none", cursor: "pointer", background: "#10b981" }}
                            onClick={() => handleApprove(u.uuid)}
                          >
                            <FaCheck style={{ marginRight: 4 }} /> Approve
                          </button>
                        )}
                        <button
                          className={`${styles.badge} ${styles.badgeDefault}`}
                          style={{ border: "none", cursor: "pointer" }}
                          onClick={() => setModalUser(u)}
                        >
                          <FaEdit style={{ marginRight: 4 }} /> Edit
                        </button>
                        <button
                          className={`${styles.badge} ${styles.badgeDanger}`}
                          style={{ border: "none", cursor: "pointer" }}
                          onClick={() => handleDelete(u.uuid)}
                        >
                          <FaTrash style={{ marginRight: 4 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Card view ── */}
        {!loading && viewMode === "cards" && (
          <div className={styles.userCardGrid}>
            {users.length === 0 ? (
              <div className={styles.empty}>No users found.</div>
            ) : users.map(u => (
              <div key={u.uuid} className={styles.userCard}>
                <div className={styles.userCardHeader}>
                  <div className={styles.userAvatar} style={{ background: getAvatarColor(u.uuid) }}>
                    {getInitials(u)}
                  </div>
                  <div className={styles.userCardActions}>
                    {!u.is_verified && (
                      <button className={styles.iconBtnSmall} onClick={() => handleApprove(u.uuid)} title="Approve" style={{ color: "#10b981" }}>
                        <FaCheck />
                      </button>
                    )}
                    <button className={styles.iconBtnSmall} onClick={() => setModalUser(u)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className={styles.iconBtnSmall} onClick={() => handleDelete(u.uuid)} title="Delete" style={{ color: "#f87171" }}>
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
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          roles={roles}
          onClose={() => setModalUser(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UsersManagementSection;