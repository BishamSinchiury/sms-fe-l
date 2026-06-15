import React, { useState } from "react";
import { FaPen, FaGlobe, FaFlag, FaMapMarkerAlt, FaCity, FaMap } from "react-icons/fa";
import styles from "@/pages/Admin/sections/Section.module.css";
import formStyles from "@/pages/Admin/sections/FormElements.module.css";
import LocationPicker from "./LocationPicker";
import { InfoRow, SaveCancelActions } from "./shared";
import { isEmpty } from "./utils";

/**
 * Address & location card: country/province/district/city plus a map
 * picker for latitude/longitude (only shown while editing).
 * `onSave(payload)` is called with { country, province, district, city, latitude, longitude }.
 */
const AddressCard = ({ address, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const openEdit = () => {
    setDraft({ ...address });
    setEditing(true);
  };

  const handleSave = async () => {
    const ok = await onSave(draft);
    if (ok) setEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Address & location</h2>
          <p className={styles.cardSubtitle}>Where your organization is based</p>
        </div>
        {!editing && (
          <button className={formStyles.iconBtn} onClick={openEdit} aria-label="Edit address">
            <FaPen />
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          <InfoRow icon={<FaGlobe />} label="Country" value={address.country} />
          <InfoRow icon={<FaFlag />} label="Province" value={address.province} />
          <InfoRow icon={<FaMapMarkerAlt />} label="District" value={address.district} />
          <InfoRow icon={<FaCity />} label="City" value={address.city} />
          <InfoRow
            icon={<FaMap />}
            label="Map coordinates"
            value={
              !isEmpty(address.latitude) && !isEmpty(address.longitude)
                ? `${address.latitude}, ${address.longitude}`
                : null
            }
          />
        </div>
      ) : (
        <div>
            <div className={styles.grid}>
              <div className={formStyles.field}>
                <label><FaGlobe /> Country</label>
              <input
                value={draft.country || ""}
                onChange={(e) => setDraft({ ...draft, country: e.target.value })}
              />
            </div>
              <div className={formStyles.field}>
                <label><FaFlag /> Province</label>
              <input
                value={draft.province || ""}
                onChange={(e) => setDraft({ ...draft, province: e.target.value })}
              />
            </div>
              <div className={formStyles.field}>
                <label><FaMapMarkerAlt /> District</label>
              <input
                value={draft.district || ""}
                onChange={(e) => setDraft({ ...draft, district: e.target.value })}
              />
            </div>
              <div className={formStyles.field}>
                <label><FaCity /> City</label>
              <input
                value={draft.city || ""}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              />
            </div>
          </div>

          <div className={formStyles.mapField}>
            <label><FaMap /> Map location</label>
            <LocationPicker
              latitude={draft.latitude}
              longitude={draft.longitude}
              onChange={(lat, lng) => setDraft((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
            />
          </div>

          <SaveCancelActions onSave={handleSave} onCancel={() => setEditing(false)} saving={saving} />
        </div>
      )}
    </div>
  );
};

export default AddressCard;