import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>Who We Are</span>
        <h2 className={styles.heading}>Shaping Minds,<br />Building Futures</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.icon}>🎓</span>
            <h3>Our Mission</h3>
            <p>We are dedicated to providing world-class education that empowers students to reach their fullest potential through innovation, integrity, and excellence.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🌱</span>
            <h3>Our Vision</h3>
            <p>To be a leading institution that nurtures critical thinkers, compassionate leaders, and lifelong learners ready to make a positive impact on the world.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>⭐</span>
            <h3>Our Values</h3>
            <p>Excellence, integrity, inclusivity, and community are the pillars that guide everything we do — from the classroom to beyond.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;