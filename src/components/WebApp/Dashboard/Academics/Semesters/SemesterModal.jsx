import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaSearch, FaCheck, FaChevronRight, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./SemesterModal.module.css";
import {
  createSemester,
  updateSemester,
  addSemOptionalGroup,
  updateSemOptionalGroup,
  removeSemOptionalGroup,
} from "@/services/academic/academicService";

const STEPS = ["Details", "Compulsory Subjects", "Optional Groups"];

// ── Dual-panel subject picker (unchanged) ─────────────────────────────────────
const SubjectPicker = ({ options = [], selected = [], onChange, excludeIds = [] }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const available    = options.filter(o =>
    !selected.includes(o.value) &&
    !excludeIds.includes(o.value) &&
    o.label.toLowerCase().includes(query.toLowerCase())
  );
  const selectedOpts = options.filter(o => selected.includes(o.value));

  const add    = (val) => onChange([...selected, val]);
  const remove = (val) => onChange(selected.filter(v => v !== val));
  const clear  = ()    => onChange([]);

  return (
    <div className={styles.picker}>
      <div className={styles.pickerCols}>

        {/* Left — available */}
        <div className={styles.pickerPanel}>
          <div className={styles.pickerHead}>
            <span>Available</span>
            <span className={styles.pickerMeta}>{available.length} subjects</span>
          </div>
          <div className={styles.pickerSearchRow}>
            <FaSearch size={11} className={styles.pickerSearchIcon} />
            <input
              ref={inputRef}
              className={styles.pickerSearchInput}
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <FaTimes
                size={10}
                className={styles.pickerSearchClear}
                onClick={() => setQuery("")}
              />
            )}
          </div>
          <div className={styles.pickerList}>
            {available.length === 0 ? (
              <div className={styles.pickerEmpty}>
                {query ? "No matches" : excludeIds.length > 0 ? "All subjects assigned or excluded" : "No subjects available"}
              </div>
            ) : available.map(o => (
              <div
                key={o.value}
                className={styles.pickerAvailableItem}
                onClick={() => add(o.value)}
              >
                <span className={styles.pickerItemLabel}>{o.label}</span>
                <span className={styles.pickerAddHint}>click to add</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — selected */}
        <div className={styles.pickerPanel}>
          <div className={styles.pickerHead}>
            <span>Selected</span>
            {selectedOpts.length > 0 && (
              <button className={styles.pickerClearBtn} onClick={clear}>
                Clear all
              </button>
            )}
          </div>
          <div className={styles.pickerList} style={{ paddingTop: "4px" }}>
            {selectedOpts.length === 0 ? (
              <div className={styles.pickerEmpty}>None selected yet</div>
            ) : selectedOpts.map((o, idx) => (
              <div key={o.value} className={styles.pickerSelectedItem}>
                <span className={styles.pickerItemIndex}>{idx + 1}</span>
                <span className={styles.pickerItemLabel}>{o.label}</span>
                <FaTimes
                  size={10}
                  className={styles.pickerRemoveIcon}
                  onClick={() => remove(o.value)}
                />
              </div>
            ))}
          </div>
          {selectedOpts.length > 0 && (
            <div className={styles.pickerFooter}>
              <FaCheck size={10} style={{ color: "#6ee7b7" }} />
              <span>{selectedOpts.length} subject{selectedOpts.length !== 1 ? "s" : ""} selected</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ── Step indicator ────────────────────────────────────────────────────────────
const StepBar = ({ step, onStep, step0Valid, semId }) => (
  <div className={styles.stepBar}>
    {STEPS.map((label, i) => {
      const done     = i < step;
      const active   = i === step;
      // Step 2 is locked until a semId exists (semester must be saved first)
      const canClick = i < step || (i === 1 && step0Valid) || (i === 2 && !!semId);
      return (
        <React.Fragment key={label}>
          <div
            className={`${styles.stepItem} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}
            onClick={() => canClick && onStep(i)}
            style={{ cursor: canClick ? "pointer" : "default" }}
          >
            <div className={styles.stepDot}>
              {done ? <FaCheck size={8} /> : <span>{i + 1}</span>}
            </div>
            <span className={styles.stepLabel}>{label}</span>
            {i === 2 && !semId && (
              <span className={styles.stepLock} title="Save the semester first to manage optional groups">🔒</span>
            )}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`${styles.stepConnector} ${i < step ? styles.stepConnectorDone : ""}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Optional Group Editor (inline) ────────────────────────────────────────────
const GroupEditor = ({ subjectOpts, compulsoryIds, otherGroupSubjectIds, editor, onChange, onSave, onCancel }) => {
  const excludeIds = [...compulsoryIds, ...otherGroupSubjectIds];
  const canSave    = editor.name.trim().length > 0 && editor.subjectIds.length >= 2;

  return (
    <div className={styles.groupEditor}>
      <div className={styles.groupEditorTitle}>
        {editor.mode === "create" ? "New Optional Group" : "Edit Group"}
      </div>

      {/* Group name */}
      <div className={styles.groupEditorField}>
        <label className={styles.groupEditorLabel}>Group Name <span className={styles.req}>*</span></label>
        <input
          className={styles.groupEditorInput}
          placeholder="e.g. Mathematics Group"
          value={editor.name}
          onChange={e => onChange({ ...editor, name: e.target.value })}
        />
      </div>

      {/* Subject picker */}
      <div className={styles.groupEditorField}>
        <label className={styles.groupEditorLabel}>
          Subjects <span className={styles.req}>*</span>
          <span className={styles.groupEditorHint}> — select at least 2</span>
        </label>
        <SubjectPicker
          options={subjectOpts}
          selected={editor.subjectIds}
          onChange={ids => onChange({ ...editor, subjectIds: ids })}
          excludeIds={excludeIds}
        />
      </div>

      {/* Inline error */}
      {editor.error && (
        <div className={styles.groupEditorError}>{editor.error}</div>
      )}

      {/* Actions */}
      <div className={styles.groupEditorActions}>
        <button className={styles.cancelBtn} onClick={onCancel} disabled={editor.saving}>
          Cancel
        </button>
        <button
          className={styles.primaryBtn}
          onClick={onSave}
          disabled={!canSave || editor.saving}
        >
          {editor.saving
            ? "Saving…"
            : editor.mode === "create" ? "Add Group" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

// ── Optional Groups Manager (Step 2) ──────────────────────────────────────────
const OptionalGroupsManager = ({
  semId,
  groups,
  subjectOpts,
  compulsoryIds,
  onGroupsChange,
}) => {
  const [editor, setEditor] = useState(null);   // null | GroupEditor state
  const [confirmRemove, setConfirmRemove] = useState(null); // null | { id, name }

  // IDs that are in OTHER groups (not the one currently being edited)
  const otherGroupSubjectIds = groups
    .filter(g => g.id !== editor?.groupId)
    .flatMap(g => (g.subjects_detail || []).map(s => s.id));

  const openCreate = () => setEditor({
    mode: "create", groupId: null, name: "", subjectIds: [], saving: false, error: null,
  });

  const openEdit = (g) => setEditor({
    mode: "edit",
    groupId: g.id,
    name: g.name,
    subjectIds: (g.subjects_detail || []).map(s => s.id),
    saving: false,
    error: null,
  });

  const handleSave = async () => {
    setEditor(e => ({ ...e, saving: true, error: null }));
    try {
      const payload = { name: editor.name.trim(), subject_ids: editor.subjectIds };
      if (editor.mode === "create") {
        const created = await addSemOptionalGroup(semId, payload);
        onGroupsChange([...groups, created]);
      } else {
        const updated = await updateSemOptionalGroup(semId, editor.groupId, payload);
        onGroupsChange(groups.map(g => g.id === editor.groupId ? updated : g));
      }
      setEditor(null);
    } catch (e) {
      const raw = e?.response?.data;
      const msg = typeof raw === "string"
        ? raw
        : raw?.detail || raw?.name?.[0] || raw?.subject_ids?.[0] || JSON.stringify(raw) || "Save failed.";
      setEditor(prev => ({ ...prev, saving: false, error: msg }));
    }
  };

  const handleRemove = async (g) => {
    setConfirmRemove({ ...g, removing: true });
    try {
      await removeSemOptionalGroup(semId, g.id);
      onGroupsChange(groups.filter(x => x.id !== g.id));
      setConfirmRemove(null);
    } catch {
      setConfirmRemove(prev => ({ ...prev, removing: false }));
    }
  };

  if (!semId) {
    return (
      <div className={styles.groupsLocked}>
        <div className={styles.groupsLockedIcon}>🔒</div>
        <div className={styles.groupsLockedText}>
          Save the semester details first, then come back here to manage optional groups.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.groupsManager}>

      {/* Header row */}
      <div className={styles.groupsHeader}>
        <span className={styles.groupsTitle}>
          Optional Groups
          {groups.length > 0 && (
            <span className={styles.groupsCount}>{groups.length}</span>
          )}
        </span>
        <button
          className={styles.addGroupBtn}
          onClick={openCreate}
          disabled={!!editor}
        >
          <FaPlus size={9} /> New Group
        </button>
      </div>

      {/* Group cards */}
      {groups.length === 0 && !editor && (
        <div className={styles.groupsEmpty}>
          <div className={styles.groupsEmptyIcon}>⊕</div>
          <div>No optional groups defined yet.</div>
          <div className={styles.groupsEmptyHint}>
            Click "New Group" to add one. Students will pick exactly one subject per group.
          </div>
        </div>
      )}

      {groups.map(g => {
        const isEditing = editor?.groupId === g.id;
        return (
          <div key={g.id} className={`${styles.groupCard} ${isEditing ? styles.groupCardEditing : ""}`}>
            {/* Card header */}
            <div className={styles.groupCardHeader}>
              <span className={styles.groupCardName}>{g.name}</span>
              <span className={styles.groupCardCount}>
                {(g.subjects_detail || []).length} subjects
              </span>
              <div className={styles.groupCardActions}>
                <button
                  className={styles.groupEditBtn}
                  onClick={() => openEdit(g)}
                  disabled={!!editor}
                  title="Edit group"
                >
                  <FaEdit size={10} />
                </button>
                {confirmRemove?.id === g.id ? (
                  <span className={styles.groupRemoveConfirm}>
                    <span className={styles.groupRemoveConfirmText}>Remove?</span>
                    <button
                      className={styles.groupRemoveConfirmYes}
                      onClick={() => handleRemove(g)}
                      disabled={confirmRemove.removing}
                    >
                      {confirmRemove.removing ? "…" : "Yes"}
                    </button>
                    <button
                      className={styles.groupRemoveConfirmNo}
                      onClick={() => setConfirmRemove(null)}
                      disabled={confirmRemove.removing}
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    className={styles.groupRemoveBtn}
                    onClick={() => setConfirmRemove({ id: g.id, name: g.name, removing: false })}
                    disabled={!!editor}
                    title="Remove group"
                  >
                    <FaTrash size={10} />
                  </button>
                )}
              </div>
            </div>

            {/* Subject chips */}
            <div className={styles.groupCardSubjects}>
              {(g.subjects_detail || []).map(s => (
                <span key={s.id} className={styles.subjectChip}>{s.name}</span>
              ))}
            </div>

            {/* Inline editor for this group */}
            {isEditing && (
              <GroupEditor
                subjectOpts={subjectOpts}
                compulsoryIds={compulsoryIds}
                otherGroupSubjectIds={otherGroupSubjectIds}
                editor={editor}
                onChange={setEditor}
                onSave={handleSave}
                onCancel={() => setEditor(null)}
              />
            )}
          </div>
        );
      })}

      {/* Inline editor for a new group (appears below all cards) */}
      {editor?.mode === "create" && (
        <GroupEditor
          subjectOpts={subjectOpts}
          compulsoryIds={compulsoryIds}
          otherGroupSubjectIds={otherGroupSubjectIds}
          editor={editor}
          onChange={setEditor}
          onSave={handleSave}
          onCancel={() => setEditor(null)}
        />
      )}
    </div>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
const SemesterModal = ({ item, programOpts, subjectOpts, onClose, onRefresh, saving: externalSaving }) => {
  // ── Core form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    program_id:                item?.program_id                ?? "",
    name:                      item?.name                     ?? "",
    order:                     item?.order                    ?? "",
    duration:                  item?.duration                 ?? 6,
    total_compulsory_subjects: item?.total_compulsory_subjects ?? 0,
    total_optional_groups:     item?.total_optional_groups    ?? 0,
    compulsory_subject_ids:    item?.compulsory_subjects_detail?.map(s => s.id) ?? [],
    is_active:                 item?.is_active                ?? true,
  });

  // ── Semester identity — set after create, or pre-set when editing ────────────
  const [semId,   setSemId]   = useState(item?.id ?? null);
  const [semName, setSemName] = useState(item?.name ?? "");

  // ── Optional groups — initialized from API response, updated locally ─────────
  const [optionalGroups, setOptionalGroups] = useState(item?.optional_groups ?? []);

  // ── Step + save state ────────────────────────────────────────────────────────
  const [step,   setStep]   = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const step0Valid = !!form.program_id && !!form.name && form.order !== "";

  // The footer's primary action for steps 0 and 1 ("Next" / "Save") 
  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        program_id:                Number(form.program_id),
        name:                      form.name.trim(),
        order:                     Number(form.order),
        duration:                  Number(form.duration),
        total_compulsory_subjects: Number(form.total_compulsory_subjects),
        total_optional_groups:     Number(form.total_optional_groups),
        compulsory_subject_ids:    form.compulsory_subject_ids,
        is_active:                 form.is_active,
      };

      let result;
      if (semId) {
        // Editing an existing semester (or updating after initial create)
        result = await updateSemester(semId, payload);
      } else {
        // First save — creating a brand new semester
        result = await createSemester(payload);
        setSemId(result.id);
        setSemName(result.name);
      }

      // After a successful save, move to Step 2 (optional groups) if on Step 1
      // Otherwise stay on current step
      if (step < 2) setStep(2);

      // Notify the parent list to refresh in the background
      if (onRefresh) onRefresh();

    } catch (e) {
      const raw = e?.response?.data;
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        setErrors(raw);
      } else {
        setErrors({ __all__: typeof raw === "string" ? raw : "Save failed." });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => { if (step < 2) setStep(s => s + 1); };
  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  // compulsory subject IDs — used to exclude them from the group editor picker
  const compulsoryIds = form.compulsory_subject_ids;

  const isEditingExisting = !!item;   // was this modal opened for an existing semester?

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>
              {isEditingExisting ? "Edit Semester" : semId ? "Semester Created" : "New Semester"}
            </div>
            <div className={styles.headerSub}>
              {isEditingExisting
                ? `${item.program_name ?? ""} — ${item.name}`
                : semId
                ? `${semName} — now configure optional groups below`
                : "Configure this semester in 3 steps"}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FaTimes size={13} />
          </button>
        </div>

        {/* Step bar */}
        <StepBar step={step} onStep={setStep} step0Valid={step0Valid} semId={semId} />

        {/* Body */}
        <div className={styles.body}>

          {/* ── Step 0: Details ── */}
          {step === 0 && (
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>Program <span className={styles.req}>*</span></label>
                <select
                  value={form.program_id}
                  onChange={e => set("program_id", e.target.value)}
                >
                  <option value="">— Select program —</option>
                  {programOpts.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.program_id && <span className={styles.fieldError}>{errors.program_id}</span>}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Name <span className={styles.req}>*</span></label>
                  <input
                    placeholder="Semester 1"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label>Order <span className={styles.req}>*</span></label>
                  <input
                    type="number" min="1" placeholder="1"
                    value={form.order}
                    onChange={e => set("order", e.target.value === "" ? "" : Number(e.target.value))}
                  />
                  {errors.order && <span className={styles.fieldError}>{errors.order}</span>}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Duration (months)</label>
                  <input
                    type="number" min="1" placeholder="6"
                    value={form.duration}
                    onChange={e => set("duration", Number(e.target.value) || 6)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Max Compulsory Subjects</label>
                  <input
                    type="number" min="0" placeholder="0"
                    value={form.total_compulsory_subjects}
                    onChange={e => set("total_compulsory_subjects", Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Max Optional Groups</label>
                  <input
                    type="number" min="0" placeholder="0"
                    value={form.total_optional_groups}
                    onChange={e => set("total_optional_groups", Number(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.field} style={{ justifyContent: "flex-end", paddingBottom: "2px" }}>
                  <label className={styles.toggleRow}>
                    <span>Active</span>
                    <div
                      className={`${styles.toggle} ${form.is_active ? styles.toggleOn : ""}`}
                      onClick={() => set("is_active", !form.is_active)}
                    >
                      <div className={styles.toggleThumb} />
                    </div>
                    <span className={styles.toggleVal}>{form.is_active ? "Yes" : "No"}</span>
                  </label>
                </div>
              </div>

              {/* Capacity hint */}
              {(form.total_compulsory_subjects > 0 || form.total_optional_groups > 0) && (
                <div className={styles.capacityHint}>
                  <FaCheck size={9} style={{ color: "#6ee7b7", flexShrink: 0 }} />
                  Capacity: {form.total_compulsory_subjects} compulsory
                  {form.total_optional_groups > 0 && ` · ${form.total_optional_groups} optional group(s)`}
                </div>
              )}

              {errors.__all__ && (
                <div className={styles.fieldError}>{errors.__all__}</div>
              )}
            </div>
          )}

          {/* ── Step 1: Compulsory subjects ── */}
          {step === 1 && (
            <SubjectPicker
              options={subjectOpts}
              selected={form.compulsory_subject_ids}
              onChange={val => set("compulsory_subject_ids", val)}
              excludeIds={[]}
            />
          )}

          {/* ── Step 2: Optional groups ── */}
          {step === 2 && (
            <OptionalGroupsManager
              semId={semId}
              groups={optionalGroups}
              subjectOpts={subjectOpts}
              compulsoryIds={compulsoryIds}
              onGroupsChange={setOptionalGroups}
            />
          )}

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {step === 2 && semId ? "Done" : "Cancel"}
          </button>
          <div className={styles.footerRight}>
            {step > 0 && (
              <button className={styles.secondaryBtn} onClick={handleBack}>
                ← Back
              </button>
            )}
            {step === 2 ? (
              // On Step 2 the footer just shows "Done" (groups are saved inline per-action)
              null
            ) : step < 1 ? (
              <button
                className={styles.primaryBtn}
                disabled={step === 0 && !step0Valid}
                onClick={handleNext}
              >
                Next <FaChevronRight size={10} />
              </button>
            ) : (
              // Step 1 — save the semester (create or update), then advance to Step 2
              <button
                className={styles.primaryBtn}
                disabled={!!saving}
                onClick={handleSave}
              >
                {saving
                  ? "Saving…"
                  : semId
                  ? "Save & Continue"
                  : isEditingExisting ? "Save changes" : "Create Semester"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SemesterModal;