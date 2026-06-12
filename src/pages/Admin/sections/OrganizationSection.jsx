import React, { useState, useEffect } from "react";
import styles from "./Section.module.css";
import {
  getOrgBasic, updateOrgBasic,
  getOrgContact, updateOrgContact,
  getOrgAddress, updateOrgAddress
} from "@/services/user/Org/orgAdminService";

const OrganizationSection = () => {
  const [basic, setBasic] = useState({});
  const [contact, setContact] = useState({});
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [b, c, a] = await Promise.all([
        getOrgBasic(),
        getOrgContact(),
        getOrgAddress()
      ]);
      setBasic(b.data || {});
      setContact(c.data || {});
      setAddress(a.data || {});
    } catch (error) {
      console.error("Failed to fetch org details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasic = async () => {
    try {
      await updateOrgBasic(basic);
      alert("Basic info updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Error updating basic info.");
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateOrgContact(contact);
      alert("Contact info updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Error updating contact info.");
    }
  };

  const handleSaveAddress = async () => {
    try {
      await updateOrgAddress(address);
      alert("Address updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Error updating address.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Organization Info...</div>;

  return (
    <div>
      {/* Basic Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Basic Information</h2>
            <p className={styles.cardSubtitle}>Manage organization identity and branding</p>
          </div>
          <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={handleSaveBasic}>
            Save Basic Info
          </button>
        </div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Organization Name</label>
            <input value={basic.name || ""} onChange={e => setBasic({ ...basic, name: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Motto</label>
            <input value={basic.motto || ""} onChange={e => setBasic({ ...basic, motto: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Primary Color</label>
            <input type="color" value={basic.primary_color || "#000000"} onChange={e => setBasic({ ...basic, primary_color: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Secondary Color</label>
            <input type="color" value={basic.secondary_color || "#000000"} onChange={e => setBasic({ ...basic, secondary_color: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Contact Details</h2>
            <p className={styles.cardSubtitle}>Primary contact methods for the organization</p>
          </div>
          <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={handleSaveContact}>
            Save Contact Info
          </button>
        </div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Phone Number 1</label>
            <input value={contact.phone_number || ""} onChange={e => setContact({ ...contact, phone_number: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Phone Number 2</label>
            <input value={contact.phone_number2 || ""} onChange={e => setContact({ ...contact, phone_number2: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={contact.email || ""} onChange={e => setContact({ ...contact, email: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Address Details</h2>
            <p className={styles.cardSubtitle}>Physical location of the organization</p>
          </div>
          <button className={`${styles.badge} ${styles.badgePrimary}`} style={{ border: 'none', cursor: 'pointer' }} onClick={handleSaveAddress}>
            Save Address
          </button>
        </div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Country</label>
            <input value={address.country || ""} onChange={e => setAddress({ ...address, country: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Province</label>
            <input value={address.province || ""} onChange={e => setAddress({ ...address, province: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>District</label>
            <input value={address.district || ""} onChange={e => setAddress({ ...address, district: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>City</label>
            <input value={address.city || ""} onChange={e => setAddress({ ...address, city: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSection;
