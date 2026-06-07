import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { navLinks } from "@/Routes/PublicRoutes.jsx";
import { useOrg } from "@/context/OrgContext";
import styles from "./HomeNav.module.css";

const Navbar = () => {
  const { org } = useOrg();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (scrolled) setMenuOpen(false);
  }, [scrolled]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${menuOpen ? styles.menuActive : ""}`}>
        <div className={styles.logoSection}>
          {org?.logo && (
            <img src={org.logo} alt={org.name} className={styles.logo} />
          )}
          <span>{org?.name}</span>
        </div>

        {/* Desktop links */}
        <div className={styles.links}>
          {navLinks.map(({ name, href }) =>
            href.startsWith("#") ? (
              <a key={name} href={href} className={styles.link}>
                {name}
              </a>
            ) : (
              <NavLink
                key={name}
                to={href}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {name}
              </NavLink>
            )
          )}
        </div>

        {/* Hamburger button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        {navLinks.map(({ name, href }) =>
          href.startsWith("#") ? (
            <a key={name} href={href} className={styles.drawerLink} onClick={closeMenu}>
              {name}
            </a>
          ) : (
            <NavLink
              key={name}
              to={href}
              className={({ isActive }) =>
                isActive ? `${styles.drawerLink} ${styles.drawerActive}` : styles.drawerLink
              }
              onClick={closeMenu}
            >
              {name}
            </NavLink>
          )
        )}
      </div>

      {/* Backdrop */}
      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </>
  );
};

export default Navbar;