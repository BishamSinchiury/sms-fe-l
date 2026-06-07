import React from "react";
import styles from "./Courses.module.css";

const courses = [
  { title: "Science & Technology", desc: "Explore biology, chemistry, physics, and cutting-edge computing through hands-on experiments.", tag: "STEM", color: "#e8f4fd" },
  { title: "Arts & Humanities",    desc: "Develop creative and critical thinking through literature, history, philosophy, and the fine arts.", tag: "Arts", color: "#fdf0e8" },
  { title: "Mathematics",          desc: "Build strong analytical foundations from arithmetic to calculus and applied statistics.", tag: "Math", color: "#edf8ee" },
  { title: "Languages",            desc: "Master communication skills in English and other world languages through immersive practice.", tag: "Lang", color: "#f5e8fd" },
  { title: "Commerce & Economics", desc: "Understand markets, finance, and entrepreneurship to prepare for the modern business world.", tag: "Biz", color: "#fdf5e8" },
  { title: "Physical Education",   desc: "Foster discipline, teamwork, and well-being through sports, fitness, and health education.", tag: "PE", color: "#fde8e8" },
];

const Courses = () => {
  return (
    <section id="courses" className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>What We Offer</span>
        <h2 className={styles.heading}>Our Courses</h2>
        <div className={styles.grid}>
          {courses.map((c) => (
            <div key={c.title} className={styles.card} style={{ "--card-bg": c.color }}>
              <span className={styles.tag}>{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;