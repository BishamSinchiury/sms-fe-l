import React from "react";
import Button from "@/components/Button/Button";
import { useOrg } from "@/context/OrgContext";
import styles from "./Landing.module.css";
import Navbar from "@/components/HomeNav/HomeNav";
import About from "@/pages/Public/About/About";
import Courses from "@/pages/Public/Courses/Courses";
import Branches from "@/pages/Public/Branches/Branches";
import Contact from "@/pages/Public/Contact/Contact";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

const Landing = () => {
  const { org, loading, error } = useOrg();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={styles.stateScreen}>
        <FaSpinner className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateScreen}>
        <FaTriangleExclamation className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  // Build address line from individual fields — no direct `address` field in API
  const addressParts = [org?.city, org?.district, org?.province, org?.country].filter(Boolean);
  const addressLine  = addressParts.length ? addressParts.join(", ") : "Address";

  return (
    <div className={styles.page}>
      <Navbar />
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${org?.cover_picture})` }}
      />
      <div className={styles.heroContent}>
        <div className={styles.logoContainer}>
          {org?.logo && (
            <img src={org.logo} alt={`${org.name} logo`} className={styles.logo} />
          )}
        </div>
        <h1>{org?.name ?? "School Name"}</h1>
        <h3>{addressLine}</h3>
        <h4>{org?.motto ?? ""}</h4>
        <Button onClick={() => navigate('/login')}>Get Started</Button>
      </div>

      <div className={styles.pageBody}>
        <About />
        <Courses />
        <Branches />
        <Contact org={org} />
      </div>
    </div>
  );
};

export default Landing;