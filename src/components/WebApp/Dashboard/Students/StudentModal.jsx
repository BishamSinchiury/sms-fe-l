import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaCheck, FaChevronRight, FaUser, FaUserShield } from "react-icons/fa";
import styles from "./StudentModal.module.css";
import { createStudent } from "@/services/student/studentService";

const STEPS = ["Student Info", "Guardian Info", "Review"];

// ── Field component ───────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className={styles.field}>
    <label className={styles.label}>
      {label}
      {required && <span className={styles.req}>*</span>}
    </label>
    {children}
    {error && <span className={styles.fieldError}>{error}</span>}
  </div>
);

// ── Step bar ──────────────────────────────────────────────────────────────────
const StepBar = ({ step }) => (
  <div className={styles.stepBar}>
    {STEPS.map((label, i) => {
      const done   = i < step;
      const active = i === step;
      return (
        <React.Fragment key={label}>
          <div className={`${styles.stepItem} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}>
            <div className={styles.stepDot}>
              {done ? <FaCheck size={8} /> : <span>{i + 1}</span>}
            </div>
            <span className={styles.stepLabel}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`${styles.stepConnector} ${i < step ? styles.stepConnectorDone : ""}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Personal info form (shared for student + guardian) ────────────────────────
const PersonalForm = ({ data, onChange, errors = {}, prefix }) => {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className={styles.formGrid}>
      <Field label="First Name" required error={errors[`${prefix}_personal.first_name`] || errors["first_name"]}>
        <input className={styles.input} placeholder="First name"
          value={data.first_name} onChange={e => set("first_name", e.target.value)} />
      </Field>
      <Field label="Last Name" required error={errors[`${prefix}_personal.last_name`] || errors["last_name"]}>
        <input className={styles.input} placeholder="Last name"
          value={data.last_name} onChange={e => set("last_name", e.target.value)} />
      </Field>
      <Field label="Gender" error={errors["gender"]}>
        <select className={styles.input} value={data.gender} onChange={e => set("gender", e.target.value)}>
          <option value="">— Select —</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </Field>
      <Field label="Date of Birth" error={errors["date_of_birth"]}>
        <input className={styles.input} type="date"
          value={data.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} />
      </Field>
    </div>
  );
};

// ── Step 0: Student info ──────────────────────────────────────────────────────
const StudentInfoStep = ({ form, onChange, errors }) => {
  const set = (k, v) => onChange({ ...form, [k]: v });
  const setPersonal = (v) => onChange({ ...form, student_personal: v });

  return (
    <div className={styles.stepBody}>
      <div className={styles.sectionTitle}><FaUser size={12} /> Student Details</div>

      <Field label="Student Email" required
        error={errors.student_email || (Array.isArray(errors.student_email) ? errors.student_email[0] : null)}>
        <input className={styles.input} type="email" placeholder="student@example.com"
          value={form.student_email} onChange={e => set("student_email", e.target.value)} />
      </Field>

      <Field label="Admission Number" required
        error={errors.admission_number || (Array.isArray(errors.admission_number) ? errors.admission_number[0] : null)}>
        <input className={styles.input} placeholder="e.g. ADM-2025-001"
          value={form.admission_number} onChange={e => set("admission_number", e.target.value)} />
      </Field>

      <div className={styles.divider}>Personal Information</div>
      <PersonalForm data={form.student_personal} onChange={setPersonal} errors={errors} prefix="student" />
    </div>
  );
};

// ── Step 1: Guardian info ─────────────────────────────────────────────────────
const GuardianInfoStep = ({ form, onChange, errors }) => {
  const set = (k, v) => onChange({ ...form, [k]: v });
  const setPersonal = (v) => onChange({ ...form, guardian_personal: v });

  return (
    <div className={styles.stepBody}>
      <div className={styles.sectionTitle}><FaUserShield size={12} /> Guardian Details</div>

      <Field label="Guardian Email" required error={errors.guardian_email}>
        <input className={styles.input} type="email" placeholder="guardian@example.com"
          value={form.guardian_email} onChange={e => set("guardian_email", e.target.value)} />
      </Field>

      <Field label="Relation to Student" required error={errors.guardian_relation}>
        <select className={styles.input} value={form.guardian_relation}
          onChange={e => set("guardian_relation", e.target.value)}>
          <option value="">— Select relation —</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="guardian">Guardian</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <div className={styles.divider}>Personal Information</div>
      <PersonalForm data={form.guardian_personal} onChange={setPersonal} errors={errors} prefix="guardian" />
    </div>
  );
};

// ── Step 2: Review ────────────────────────────────────────────────────────────
const ReviewStep = ({ form }) => {
  const Row = ({ label, value }) => (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value || "—"}</span>
    </div>
  );

  const gender = { M: "Male", F: "Female", O: "Other" };
  const relation = { father: "Father", mother: "Mother", guardian: "Guardian", other: "Other" };

  return (
    <div className={styles.stepBody}>
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}><FaUser size={11} /> Student</div>
        <Row label="Email"            value={form.student_email} />
        <Row label="Admission No."    value={form.admission_number} />
        <Row label="Name"             value={`${form.student_personal.first_name} ${form.student_personal.last_name}`.trim()} />
        <Row label="Gender"           value={gender[form.student_personal.gender]} />
        <Row label="Date of Birth"    value={form.student_personal.date_of_birth} />
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}><FaUserShield size={11} /> Guardian</div>
        <Row label="Email"    value={form.guardian_email} />
        <Row label="Relation" value={relation[form.guardian_relation]} />
        <Row label="Name"     value={`${form.guardian_personal.first_name} ${form.guardian_personal.last_name}`.trim()} />
        <Row label="Gender"   value={gender[form.guardian_personal.gender]} />
      </div>

      <div className={styles.reviewNote}>
        Two accounts will be provisioned and login credentials emailed to each address above.
      </div>
    </div>
  );
};

// ── Validate each step ────────────────────────────────────────────────────────
function validateStep0(form) {
  const errs = {};
  if (!form.student_email.trim())       errs.student_email = "Required";
  else if (!/\S+@\S+\.\S+/.test(form.student_email)) errs.student_email = "Enter a valid email";
  if (!form.admission_number.trim())    errs.admission_number = "Required";
  if (!form.student_personal.first_name.trim()) errs["student_personal.first_name"] = "Required";
  if (!form.student_personal.last_name.trim())  errs["student_personal.last_name"] = "Required";
  return errs;
}
function validateStep1(form) {
  const errs = {};
  if (!form.guardian_email.trim())      errs.guardian_email = "Required";
  else if (!/\S+@\S+\.\S+/.test(form.guardian_email)) errs.guardian_email = "Enter a valid email";
  else if (form.guardian_email === form.student_email) errs.guardian_email = "Must differ from student email";
  if (!form.guardian_relation)          errs.guardian_relation = "Required";
  if (!form.guardian_personal.first_name.trim()) errs["guardian_personal.first_name"] = "Required";
  if (!form.guardian_personal.last_name.trim())  errs["guardian_personal.last_name"] = "Required";
  return errs;
}

// ── Main modal ────────────────────────────────────────────────────────────────
const EMPTY_PERSONAL = { first_name: "", last_name: "", gender: "", date_of_birth: "" };

const StudentModal = ({ orgId, onClose, onCreated }) => {
  const [step, setStep]     = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm]     = useState({
    student_email:    "",
    admission_number: "",
    student_personal: { ...EMPTY_PERSONAL },
    guardian_email:   "",
    guardian_relation: "",
    guardian_personal: { ...EMPTY_PERSONAL },
  });

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const goNext = () => {
    let errs = {};
    if (step === 0) errs = validateStep0(form);
    if (step === 1) errs = validateStep1(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        org:              orgId,
        student_email:    form.student_email.trim(),
        admission_number: form.admission_number.trim(),
        student_personal: {
          first_name:    form.student_personal.first_name.trim(),
          last_name:     form.student_personal.last_name.trim(),
          gender:        form.student_personal.gender || null,
          date_of_birth: form.student_personal.date_of_birth || null,
        },
        guardian_email:    form.guardian_email.trim(),
        guardian_relation: form.guardian_relation,
        guardian_personal: {
          first_name: form.guardian_personal.first_name.trim(),
          last_name:  form.guardian_personal.last_name.trim(),
          gender:     form.guardian_personal.gender || null,
          date_of_birth: form.guardian_personal.date_of_birth || null,
        },
      };
      const student = await createStudent(payload);
      onCreated(student);
    } catch (e) {
      const raw = e?.response?.data;
      if (raw && typeof raw === "object") {
        // Flatten field-level server errors so they display inline
        const flat = {};
        Object.entries(raw).forEach(([k, v]) => {
          flat[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(flat);
        // If errors are on Step 0 fields, go back
        const step0Fields = ["student_email", "admission_number", "student_personal"];
        if (step0Fields.some(f => flat[f])) setStep(0);
        else setStep(1);
      } else {
        setErrors({ __all__: typeof raw === "string" ? raw : "Failed to create student." });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>Enrol New Student</div>
            <div className={styles.headerSub}>
              Provisions student and guardian accounts with auto-generated credentials
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><FaTimes size={13} /></button>
        </div>

        <StepBar step={step} />

        {/* Body */}
        <div className={styles.body}>
          {errors.__all__ && (
            <div className={styles.globalError}>{errors.__all__}</div>
          )}
          {step === 0 && <StudentInfoStep  form={form} onChange={setForm} errors={errors} />}
          {step === 1 && <GuardianInfoStep form={form} onChange={setForm} errors={errors} />}
          {step === 2 && <ReviewStep form={form} />}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <div className={styles.footerRight}>
            {step > 0 && (
              <button className={styles.secondaryBtn} onClick={() => { setErrors({}); setStep(s => s - 1); }}>
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button className={styles.primaryBtn} onClick={goNext}>
                Next <FaChevronRight size={10} />
              </button>
            ) : (
              <button className={styles.primaryBtn} disabled={saving} onClick={handleSubmit}>
                {saving ? "Creating…" : "Create Student"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentModal;
