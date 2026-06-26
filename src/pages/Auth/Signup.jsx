import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notification/NotificationContainer";
import styles from "./Login.module.css";
import { getPublicRoles, signup, verifySignupOtp } from "@/services/auth/publicAuthService";
import { lookupStudent } from "@/services/academic/studentService";

const Signup = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_uuid: "",
    student_id: ""
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [studentLookup, setStudentLookup] = useState({ status: 'idle', data: null, error: null });

  useEffect(() => {
    getPublicRoles().then(res => setRoles(res || [])).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleStudentLookup = async (e) => {
    const val = e.target.value;
    setForm(p => ({ ...p, student_id: val }));
    if (!val.trim()) {
      setStudentLookup({ status: 'idle', data: null, error: null });
      return;
    }
    setStudentLookup({ status: 'loading', data: null, error: null });
    try {
      const data = await lookupStudent(val);
      setStudentLookup({ status: 'success', data, error: null });
    } catch (err) {
      setStudentLookup({ status: 'error', data: null, error: err?.response?.data?.detail || "Lookup failed" });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      notify({ type: "error", title: "Validation Error", message: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        role_uuid: form.role_uuid || null,
        student_id: form.student_id || null
      });
      notify({ type: "success", title: "OTP Sent", message: "Please check your email for the verification code." });
      setStep(2);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.email?.[0] || "Signup failed.";
      notify({ type: "error", title: "Error", message: detail });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifySignupOtp(form.email, otp);
      notify({ type: "success", title: "Verified", message: "Your email has been verified. You will receive access once an administrator approves your account." });
      navigate("/login");
    } catch (err) {
      const detail = err?.response?.data?.detail || "Invalid OTP.";
      notify({ type: "error", title: "Error", message: detail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card} style={{ maxWidth: '500px' }}>
        <div className={styles.header}>
          <div className={styles.badge}>👤</div>
          <h1>Create an Account</h1>
          <p>{step === 1 ? "Sign up to request access" : "Enter the OTP sent to your email"}</p>
        </div>

        {step === 1 ? (
          <form className={styles.form} onSubmit={handleSignupSubmit}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className={styles.field} style={{ flex: 1 }}>
                <label htmlFor="firstName">First Name</label>
                <div className={styles.inputWrap}>
                  <input id="firstName" name="firstName" required placeholder="John" value={form.firstName} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.field} style={{ flex: 1 }}>
                <label htmlFor="lastName">Last Name</label>
                <div className={styles.inputWrap}>
                  <input id="lastName" name="lastName" required placeholder="Doe" value={form.lastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <div className={styles.inputWrap}>
                <input id="email" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="role_uuid">Requested Role</label>
              <div className={styles.inputWrap}>
                <select id="role_uuid" name="role_uuid" required value={form.role_uuid} onChange={handleChange} style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', height: '100%', cursor: 'pointer' }}>
                  <option value="" style={{ color: '#000' }}>-- Select a role --</option>
                  {roles.map(r => (
                    <option key={r.uuid} value={r.uuid} style={{ color: '#000' }}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {roles.find(r => r.uuid === form.role_uuid)?.name?.toLowerCase() === 'student' && (
              <div className={styles.field}>
                <label htmlFor="student_id">Student ID (Optional)</label>
                <div className={styles.inputWrap}>
                  <input id="student_id" name="student_id" placeholder="STU-2025-001" value={form.student_id} onChange={handleStudentLookup} />
                  {studentLookup.status === 'loading' && <span style={{position:'absolute', right: '10px', top: '10px'}}>⏳</span>}
                  {studentLookup.status === 'success' && studentLookup.data && (
                    <span style={{position:'absolute', right: '10px', top: '10px'}} title={studentLookup.data.message}>
                      {studentLookup.data.claimable ? '✅' : '❌'}
                    </span>
                  )}
                  {studentLookup.status === 'success' && !studentLookup.data?.exists && (
                    <span style={{position:'absolute', right: '10px', top: '10px'}} title="Not found">❓</span>
                  )}
                </div>
                {studentLookup.status === 'success' && studentLookup.data?.exists && (
                   <div style={{ fontSize: '0.75rem', marginTop: '4px', color: studentLookup.data.claimable ? '#10b981' : '#f43f5e' }}>
                     {studentLookup.data.initials} - {studentLookup.data.message}
                   </div>
                )}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <input id="password" name="password" type="password" required minLength={8} placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.inputWrap}>
                <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Submitting…" : "Sign Up"}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleOtpSubmit}>
            <div className={styles.field}>
              <label htmlFor="otp">6-Digit OTP</label>
              <div className={styles.inputWrap}>
                <input id="otp" name="otp" required maxLength={6} minLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ letterSpacing: '4px', textAlign: 'center' }} />
              </div>
            </div>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Verifying…" : "Verify Email"}
            </button>
          </form>
        )}

        <div className={styles.divider}><span>or</span></div>

        <div className={styles.footer}>
          <span>Already have an account?</span>
          <NavLink to="/login" className={styles.footerLink}>Sign in</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
