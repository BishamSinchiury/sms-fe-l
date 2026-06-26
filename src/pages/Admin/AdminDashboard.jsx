import React, { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useOrg } from "@/context/OrgContext";
import OrganizationSection from "./sections/OrganizationSection";
import SubOrganizationSection from "./sections/SubOrganizationSection";
import UsersManagementSection from "./sections/UsersManagementSection";
import RolesManagementSection from "./sections/RolesManagementSection";
import LogsSection from "./sections/LogsSection";
import StudentManagementSection from "./sections/StudentManagementSection";
import StudentClaimsSection from "./sections/StudentClaimsSection";
import styles from "./AdminDashboard.module.css";
import { FiBriefcase, FiLayers, FiUsers, FiActivity, FiShield, FiUserCheck, FiBook } from "react-icons/fi";

const NAV_ITEMS = [
  { key: "organization", label: "Organization", icon: <FiBriefcase /> },
  { key: "suborg",       label: "Sub Organization", icon: <FiLayers /> },
  { key: "users",        label: "Users Management", icon: <FiUsers /> },
  { key: "roles",        label: "Roles Management", icon: <FiShield /> },
  { key: "students",     label: "Students", icon: <FiBook /> },
  { key: "claims",       label: "Student Claims", icon: <FiUserCheck /> },
  { key: "logs",         label: "Logs", icon: <FiActivity /> },
];

const AdminDashboard = () => {
  const { user, logout } = useAdminAuth();
  const { org } = useOrg();
  const [activeSection, setActiveSection] = useState("organization");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "organization": return <OrganizationSection />;
      case "suborg":       return <SubOrganizationSection />;
      case "users":        return <UsersManagementSection />;
      case "roles":        return <RolesManagementSection />;
      case "students":     return <StudentManagementSection />;
      case "claims":       return <StudentClaimsSection />;
      case "logs":         return <LogsSection />;
      default:             return null;
    }
  };

  const currentLabel = NAV_ITEMS.find((n) => n.key === activeSection)?.label;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          {org?.logo && <img src={org.logo} alt={org.name} className={styles.brandLogo} />}
          <div className={styles.brandText}>
            <span className={styles.brandName}>{org?.name || "Admin"}</span>
            <span className={styles.brandTag}>Admin Panel</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`${styles.navItem} ${activeSection === item.key ? styles.navItemActive : ""}`}
              onClick={() => {
                setActiveSection(item.key);
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>{user?.email?.[0]?.toUpperCase()}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.username || user?.email}</span>
              <span className={styles.userRole}>{user?.isSysadmin ? "Sysadmin" : "Admin"}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <h1 className={styles.pageTitle}>{currentLabel}</h1>
        </header>

        <main className={styles.content}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;