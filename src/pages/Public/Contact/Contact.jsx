import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.label}>Get In Touch</span>
          <h2 className={styles.heading}>We'd love to<br />hear from you</h2>
          <p className={styles.sub}>Have questions about admissions, courses, or anything else? Reach out and our team will get back to you shortly.</p>
          <div className={styles.info}>
            <p>📍 123 School Lane, Kathmandu</p>
            <p>📞 +977-1-4XXXXXX</p>
            <p>✉️ info@school.edu.np</p>
          </div>
        </div>

        <div className={styles.right}>
          {sent ? (
            <div className={styles.thanks}>
              <span>✅</span>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input name="name" required placeholder="Your name" value={form.name} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Message</label>
                <textarea name="message" required rows={5} placeholder="Write your message..." value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" className={styles.btn}>Send Message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;