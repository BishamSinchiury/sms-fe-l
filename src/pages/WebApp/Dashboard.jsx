import React, { useState } from "react";
import { useUserAuth } from "@/context/UserAuthContext";
import { useOrg } from "@/context/OrgContext";
import AcademicSection from "./sections/Academics/AcademicSection";
import Students from "@/components/WebApp/Dashboard/Students/Students";
import styles from "./Dashboard.module.css";
import {
  FiHome, FiBook, FiCalendar, FiUsers, FiBarChart2,
} from "react-icons/fi";

const NAV_ITEMS = [
  { key: "home",      label: "Home",       icon: <FiHome /> },
  { key: "academics", label: "Academics",  icon: <FiBook /> },
  { key: "students",  label: "Students",   icon: <FiUsers /> },
];

const Dashboard = () => {
  const { user, logout } = useUserAuth();
  const { org } = useOrg();
  const [activeSection, setActiveSection] = useState("academics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div style={{ color: "rgba(255,255,255,0.7)", padding: "1rem 0" }}>
            <h2 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "1.3rem" }}>
              Welcome back, {user?.username || user?.email}!
            </h2>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Use the sidebar to manage academic structures, programs, and more.
            </p>
          </div>
        );
      case "academics":
        return <AcademicSection />;
      case "students":
        return <Students orgId={org?.id} />;
      default:
        return null;
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
            <span className={styles.brandName}>{org?.name || "Dashboard"}</span>
            <span className={styles.brandTag}>Student Portal</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Main</div>
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
              <span className={styles.userRole}>User</span>
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

export default Dashboard;