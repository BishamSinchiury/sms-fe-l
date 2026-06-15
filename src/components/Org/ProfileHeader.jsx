import React, { useRef, useState } from "react";
import {
  FaCamera, FaPen, FaSave, FaTimes, FaBuilding, FaGlobe, FaPalette, FaQuoteLeft,
} from "react-icons/fa";
import styles from "./ProfileHeader.module.css";
import formStyles from "@/pages/Admin/sections/FormElements.module.css";
import { resolveMedia, isEmpty } from "./utils";

/**
 * Cover photo + avatar + org name/motto/domain/brand colors.
 *
 * - `onUploadImage(field, file)` is called immediately when a new cover
 *   photo or logo is picked (field is "cover_picture" or "logo").
 * - `onSaveBasic(payload)` is called with { name, motto, domain_name,
 *   primary_color, secondary_color } when the "Edit profile" panel is saved.
 */
const ProfileHeader = ({ basic, onUploadImage, onSaveBasic, saving }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const openEdit = () => {
    setDraft({
      name: basic.name || "",
      motto: basic.motto || "",
      domain_name: basic.domain_name || "",
      primary_color: basic.primary_color || "#2563eb",
      secondary_color: basic.secondary_color || "#7c3aed",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    const ok = await onSaveBasic(draft);
    if (ok) setEditing(false);
  };

  return (
    <>
      {/* Cover photo & avatar */}
      <div className={styles.coverContainer}>
        {basic.cover_picture ? (
          <img src={resolveMedia(basic.cover_picture)} alt="Cover" className={styles.coverImage} />
        ) : (
          <div
            className={styles.coverPlaceholder}
            style={{
              background: `linear-gradient(135deg, ${basic.primary_color || "#2563eb"}, ${basic.secondary_color || "#7c3aed"})`,
            }}
          />
        )}

        <button className={styles.coverEditBtn} onClick={() => coverInputRef.current?.click()}>
          <FaCamera /> <span>Edit cover photo</span>
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onUploadImage("cover_picture", e.target.files?.[0])}
        />

        <div className={styles.avatarContainer}>
          {basic.logo ? (
            <img src={resolveMedia(basic.logo)} alt={basic.name || "Organization logo"} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <FaBuilding />
            </div>
          )}
          <button className={styles.avatarEditBtn} onClick={() => logoInputRef.current?.click()}>
            <FaCamera />
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onUploadImage("logo", e.target.files?.[0])}
          />
        </div>
      </div>

      {/* Name, motto, domain & brand colors */}
      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderMain}>
          <div>
            <h1 className={styles.profileName}>{basic.name || "Unnamed organization"}</h1>
            {!isEmpty(basic.motto) && (
              <p className={styles.profileMotto}>
                <FaQuoteLeft className={styles.quoteIcon} /> {basic.motto}
              </p>
            )}
            {!isEmpty(basic.domain_name) && (
              <p className={styles.profileDomain}>
                <FaGlobe /> {basic.domain_name}
              </p>
            )}
            <div className={styles.colorChips}>
              <span className={styles.colorChip}>
                <span className={styles.colorSwatch} style={{ background: basic.primary_color || "#2563eb" }} />
                Primary
              </span>
              <span className={styles.colorChip}>
                <span className={styles.colorSwatch} style={{ background: basic.secondary_color || "#7c3aed" }} />
                Secondary
              </span>
            </div>
          </div>

          {!editing && (
            <button className={formStyles.iconBtnLabeled} onClick={openEdit}>
              <FaPen /> Edit profile
            </button>
          )}
        </div>

        {editing && (
          <div className={styles.editPanel}>
            <div className={formStyles.grid}>
              <div className={formStyles.field}>
                <label><FaBuilding /> Organization name</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className={formStyles.field}>
                <label><FaQuoteLeft /> Motto</label>
                <input
                  value={draft.motto}
                  onChange={(e) => setDraft({ ...draft, motto: e.target.value })}
                />
              </div>
              <div className={formStyles.field}>
                <label><FaGlobe /> Domain name</label>
                <input
                  value={draft.domain_name}
                  onChange={(e) => setDraft({ ...draft, domain_name: e.target.value })}
                />
              </div>
              <div className={formStyles.field}>
                <label><FaPalette /> Primary color</label>
                <input
                  type="color"
                  value={draft.primary_color}
                  onChange={(e) => setDraft({ ...draft, primary_color: e.target.value })}
                />
              </div>
              <div className={formStyles.field}>
                <label><FaPalette /> Secondary color</label>
                <input
                  type="color"
                  value={draft.secondary_color}
                  onChange={(e) => setDraft({ ...draft, secondary_color: e.target.value })}
                />
              </div>
            </div>
            <div className={formStyles.actions}>
              <button className={formStyles.saveBtn} onClick={handleSave} disabled={saving}>
                <FaSave /> {saving ? "Saving..." : "Save changes"}
              </button>
              <button className={formStyles.cancelBtn} onClick={() => setEditing(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileHeader;