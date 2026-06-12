import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { useAdminAuth } from "@/context/AdminAuthContext";
import styles from "./Login.module.css";

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Step 1: Credentials Form ─────────────────────────────────────────────────

const CredentialsForm = ({ onSuccess, notify }) => {
  const { adminLogin } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      // adminLogin sets otpStep to "otp" on success
      // parent reads otpStep and switches to OTP form
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        notify({ type: "error", title: "Login Failed", message: detail || "Invalid email or password." });
      } else if (status === 403) {
        notify({ type: "error", title: "Access Denied", message: detail || "You do not have admin access to this organization." });
      } else if (status === 503) {
        notify({ type: "error", title: "Email Failed", message: detail || "Could not send OTP. Please try again." });
      } else {
        notify({ type: "error", title: "Error", message: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="email">Email address</label>
        <div className={styles.inputWrap}>
          <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <div className={styles.inputWrap}>
          <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPass} />
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading && <span className={styles.spinner} />}
        {loading ? "Verifying…" : "Continue"}
      </button>
    </form>
  );
};

// ─── Step 2: OTP Form ─────────────────────────────────────────────────────────

const OtpForm = ({ notify }) => {
  const { adminVerifyOtp, resetOtpFlow, pendingEmail } = useAdminAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminVerifyOtp(otp);
      navigate("/admin/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        notify({ type: "error", title: "Invalid OTP", message: detail || "OTP is invalid or has expired." });
      } else {
        notify({ type: "error", title: "Error", message: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="otp">One-time password</label>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: "0 0 0.5rem" }}>
          Sent to {pendingEmail}
        </p>
        <div className={styles.inputWrap}>
          <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <input
            id="otp"
            name="otp"
            type="text"
            required
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            style={{ letterSpacing: "0.3em", textAlign: "center" }}
          />
        </div>
      </div>

      <button type="submit" className={styles.submit} disabled={loading || otp.length !== 6}>
        {loading && <span className={styles.spinner} />}
        {loading ? "Verifying…" : "Verify OTP"}
      </button>

      {/* Back button — resets OTP flow back to credentials form */}
      <button
        type="button"
        className={styles.adminBtn}
        onClick={resetOtpFlow}
        style={{ marginTop: "0.5rem" }}
      >
        ← Back to login
      </button>
    </form>
  );
};

// ─── Main AdminLogin component ────────────────────────────────────────────────

const AdminLogin = () => {
  const { notify } = useNotification();
  const { isAuthenticated, isLoading, otpStep } = useAdminAuth();
  const navigate = useNavigate();

  // Silent refresh still running
  if (isLoading) return null;

  // Already logged in as admin
  if (isAuthenticated) {
    navigate("/admin/dashboard");
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>🛡️</div>
          <h1>{otpStep === "credentials" ? "Admin Login" : "Verify OTP"}</h1>
          <p>
            {otpStep === "credentials"
              ? "Sign in to your admin account"
              : "Enter the code sent to your email"}
          </p>
        </div>

        {/* Switch between forms based on otpStep */}
        {otpStep === "credentials"
          ? <CredentialsForm notify={notify} />
          : <OtpForm notify={notify} />
        }

        <NavLink to="/login" className={styles.backHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to user login
        </NavLink>
      </div>
    </div>
  );
};

export default AdminLogin;