import React from "react";
import Button from "@/components/Button/Button";
import Notify from "@/components/Modal/Notify";
import { useOrg } from "@/context/OrgContext";
import styles from "./Landing.module.css";
import Navbar from "@/components/HomeNav/HomeNav";
import About from "@/pages/Public/About/About";
import Courses from "@/pages/Public/Courses/Courses";
import Contact from "@/pages/Public/Contact/Contact";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { org, loading, error } = useOrg();
  const navigate = useNavigate();


  if (loading) return <p>Loading...</p>;
  if (error) return <Notify message={error} />;

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
        <h3>{org?.address ?? "Address"}</h3>
        <h4>{org?.motto ?? ""}</h4>
        <Button onClick={() => navigate('/login')}>Get Started</Button>
      </div>

      <div className={styles.pageBody}>
        <About />
        <Courses />
        <Contact />
      </div>
    </div>
  );
};

export default Landing;