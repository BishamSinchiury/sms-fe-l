import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notification/NotificationContainer";
import {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
} from "@/services/user/Auth/forgotPassword";
import styles from "./ForgotPassword.module.css";

// ── Icons ──────────────────────────────────────────────────────────────────────

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

// ── Step indicators ─────────────────────────────────────────────────────────────

const STEPS = ["Email", "Verify", "Reset"];

const StepBar = ({ current }) => (
  <div className={styles.stepBar}>
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className={`${styles.step} ${i <= current ? styles.stepActive : ""}`}>
          <div className={styles.stepDot}>
            {i < current ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className={styles.stepLabel}>{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`${styles.stepLine} ${i < current ? styles.stepLineActive : ""}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── OTP input ───────────────────────────────────────────────────────────────────

const OTPInput = ({ value, onChange, disabled }) => {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.map((d, j) => (j === i ? "" : d)).join("");
      onChange(next);
      if (i > 0) refs[i - 1].current?.focus();
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) { refs[i - 1].current?.focus(); return; }
    if (e.key === "ArrowRight" && i < 5) { refs[i + 1].current?.focus(); return; }
  };

  const handleChange = (e, i) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, j) => (j === i ? char : d)).join("");
    onChange(next);
    if (char && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    const focusIdx = Math.min(pasted.length, 5);
    refs[focusIdx].current?.focus();
  };

  return (
    <div className={styles.otpRow}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          className={`${styles.otpCell} ${d ? styles.otpCellFilled : ""}`}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
};

// ── Countdown ───────────────────────────────────────────────────────────────────

const useCountdown = (seconds) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);
  return [remaining, () => setRemaining(seconds)];
};

// ── Main component ──────────────────────────────────────────────────────────────

const ForgotPassword = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);           // 0 = email, 1 = otp, 2 = new password
  const [loading, setLoading] = useState(false);

  // Step 0
  const [email, setEmail] = useState("");

  // Step 1
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [countdown, restartCountdown] = useCountdown(60);

  // Step 2
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Step 0: request OTP ────────────────────────────────────────────────────

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      // API always returns 200 to avoid enumeration — just advance
      setStep(1);
      restartCountdown();
    } catch (err) {
      notify({
        type: "error",
        title: "Request Failed",
        message: err?.response?.data?.detail || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setOtp("");
      restartCountdown();
      notify({ type: "success", title: "OTP Resent", message: "A new code has been sent to your email." });
    } catch {
      notify({ type: "error", title: "Failed", message: "Could not resend OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: verify OTP ─────────────────────────────────────────────────────

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      notify({ type: "error", title: "Incomplete", message: "Please enter all 6 digits." });
      return;
    }
    setLoading(true);
    try {
      const data = await verifyResetOTP(email, otp);
      setResetToken(data.data.reset_token);
      setStep(2);
    } catch (err) {
      notify({
        type: "error",
        title: "Verification Failed",
        message: err?.response?.data?.detail || "Invalid or expired OTP.",
      });
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: reset password ─────────────────────────────────────────────────

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      notify({ type: "error", title: "Mismatch", message: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, resetToken, passwords.new);
      notify({ type: "success", title: "Password Reset", message: "Your password has been updated. Please sign in." });
      navigate("/login");
    } catch (err) {
      const detail = err?.response?.data?.detail || "Could not reset password. Please start over.";
      notify({ type: "error", title: "Reset Failed", message: detail });
      // Token likely expired — send them back to start
      if (err?.response?.status === 400) {
        setStep(0);
        setOtp("");
        setResetToken("");
        setPasswords({ new: "", confirm: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const headings = [
    { icon: "🔑", title: "Forgot Password?", sub: "Enter your email and we'll send you a verification code." },
    { icon: "📬", title: "Check Your Email", sub: `We sent a 6-digit code to ${email}` },
    { icon: "🔒", title: "Create New Password", sub: "Choose a strong password you haven't used before." },
  ];

  const { icon, title, sub } = headings[step];

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>{icon}</div>
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>

        <StepBar current={step} />

        {/* ── Step 0: Email ── */}
        {step === 0 && (
          <form className={styles.form} onSubmit={handleRequestOTP}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Sending…" : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* ── Step 1: OTP ── */}
        {step === 1 && (
          <form className={styles.form} onSubmit={handleVerifyOTP}>
            <div className={styles.otpHint}>
              Enter the 6-digit code sent to <strong>{email}</strong>
            </div>

            <OTPInput value={otp} onChange={setOtp} disabled={loading} />

            <button type="submit" className={styles.submit} disabled={loading || otp.length < 6}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Verifying…" : "Verify Code"}
            </button>

            <div className={styles.resendRow}>
              {countdown > 0 ? (
                <span className={styles.countdown}>Resend code in {countdown}s</span>
              ) : (
                <button type="button" className={styles.resendBtn} onClick={handleResendOTP} disabled={loading}>
                  Resend code
                </button>
              )}
              <button type="button" className={styles.changeEmail} onClick={() => { setStep(0); setOtp(""); }}>
                Change email
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2: New password ── */}
        {step === 2 && (
          <form className={styles.form} onSubmit={handleResetPassword}>
            <div className={styles.field}>
              <label htmlFor="new-password">New password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={passwords.new}
                  onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowNew((v) => !v)} aria-label="Toggle password visibility">
                  <EyeIcon open={showNew} />
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm-password">Confirm password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle password visibility">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {passwords.confirm && passwords.new !== passwords.confirm && (
                <span className={styles.fieldError}>Passwords do not match</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={loading || !passwords.new || passwords.new !== passwords.confirm}
            >
              {loading && <span className={styles.spinner} />}
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        <NavLink to="/login" className={styles.backHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sign In
        </NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;