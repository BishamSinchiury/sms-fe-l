import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notification/NotificationContainer";
import { useUserAuth } from "@/context/UserAuthContext";
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

const Login = () => {
  const { notify } = useNotification();
  const { login, isAuthenticated, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Navigate only after render — never during render
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) return null

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        notify({ type: "error", title: "Login Failed", message: detail || "Invalid email or password." });
      } else if (status === 403) {
        notify({ type: "error", title: "Access Denied", message: detail || "You do not have access to this organization." });
      } else if (status === 503) {
        notify({ type: "error", title: "Service Unavailable", message: detail || "Something went wrong. Please try again." });
      } else {
        notify({ type: "error", title: "Error", message: detail || "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => navigate("/forgot-password");

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>👤</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

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
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
              <button type="button" className={styles.forgotBtn} onClick={handleForgot}>
                Forgot password?
              </button>
            </div>
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button
          type="button"
          className={styles.adminBtn}
          onClick={() => navigate("/admin/login")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Sign in as Admin
        </button>

        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <NavLink to="/signup" className={styles.footerLink}>Create one</NavLink>
        </div>

        <NavLink to="/" className={styles.backHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </NavLink>
      </div>
    </div>
  );
};

export default Login;