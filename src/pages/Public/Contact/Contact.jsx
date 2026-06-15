import React, { useState } from "react";
import styles from "./Contact.module.css";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Contact = ({ org = {} }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const addressParts = [org.city, org.district, org.province, org.country].filter(Boolean);
  const addressLine  = addressParts.length ? addressParts.join(", ") : null;

  const hasCoords = org.latitude != null && org.longitude != null;
  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${org.latitude},${org.longitude}&z=15&output=embed`
    : null;

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>

        {/* ── Left column ─────────────────────────────────────────── */}
        <div className={styles.left}>
          <span className={styles.label}>Get In Touch</span>
          <h2 className={styles.heading}>We'd love to<br />hear from you</h2>
          <p className={styles.sub}>
            Have questions about admissions, courses, or anything else? Reach out
            and our team will get back to you shortly.
          </p>

          <div className={styles.info}>
            {addressLine && (
              <div className={styles.infoRow}>
                <FaMapMarkerAlt className={styles.icon} />
                <span>{addressLine}</span>
              </div>
            )}
            {org.phone_number && (
              <div className={styles.infoRow}>
                <FaPhone className={styles.icon} />
                <span>
                  {org.phone_number}
                  {org.phone_number2 && ` / ${org.phone_number2}`}
                </span>
              </div>
            )}
            {org.email && (
              <div className={styles.infoRow}>
                <FaEnvelope className={styles.icon} />
                <a href={`mailto:${org.email}`} className={styles.emailLink}>
                  {org.email}
                </a>
              </div>
            )}
          </div>

          {/* ── Google Maps embed ──────────────────────────────────── */}
          {mapSrc && (
            <div className={styles.mapWrapper}>
              <iframe
                title="Organization location"
                src={mapSrc}
                className={styles.map}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {/* ── Right column — contact form ──────────────────────────── */}
        <div className={styles.right}>
          {sent ? (
            <div className={styles.thanks}>
              <FaEnvelope className={styles.thanksIcon} />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={handleChange}
                />
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