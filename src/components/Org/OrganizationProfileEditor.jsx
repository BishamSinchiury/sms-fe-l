import React, { useState, useEffect } from "react";
import styles from "@/pages/Admin/sections/Section.module.css";
import { FaSpinner } from "react-icons/fa";

import ProfileHeader from "@/components/Org/ProfileHeader";
import BasicInfoCard from "@/components/Org/BasicInfoCard";
import CompletionBanner from "@/components/Org/CompletionBanner";
import ContactCard from "@/components/Org/ContactCard";
import AddressCard from "@/components/Org/AddressCard";
import DocumentsCard from "@/components/Org/DocumentsCard";
import { getCompletionPercent, isEmpty } from "@/components/Org/utils";
import { useNotification } from "@/components/Notification/NotificationContainer";
import Notify from "@/components/Modal/Notify";

/**
 * Reusable profile editor for an Organization or SubOrganization.
 *
 * Props:
 * - showHeader      : whether to show the cover/logo header & basic-info form (default true)
 * - showDocuments   : whether to show the registration documents card (default true)
 * - fetchAll()      : async () => { basic, contact, address, documents? }
 * - onUploadImage() : async (field, file) => updatedBasicData   (org only)
 * - onSaveBasic()   : async (payload) => updatedBasicData
 * - onSaveContact() : async (payload) => updatedContactData
 * - onSaveAddress() : async (payload) => updatedAddressData
 * - onSaveDocuments(): async (draft) => updatedDocumentsData    (org only)
 */
const OrgProfileEditor = ({
  showHeader = true,
  showDocuments = true,
  fetchAll,
  onUploadImage,
  onSaveBasic,
  onSaveContact,
  onSaveAddress,
  onSaveDocuments,
}) => {
  const [basic, setBasic] = useState({});
  const [contact, setContact] = useState({});
  const [address, setAddress] = useState({});
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [failedImageField, setFailedImageField] = useState(null);

  const { notify } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAll();
      setBasic(data?.basic || {});
      setContact(data?.contact || {});
      setAddress(data?.address || {});
      setDocuments(data?.documents || {});
    } catch {
      notify({
        type: "error",
        title: "Failed to load",
        message: "Could not fetch profile details. Please refresh the page.",
        duration: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Cover photo / logo (org only) ───────────────────────────────────

  const handleUploadImage = async (field, file) => {
    if (!file || !onUploadImage) return;
    const formData = new FormData();
    formData.append(field, file);

    setBasic((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));

    try {
      setSaving(true);
      const res = await onUploadImage(formData);
      if (res) setBasic((prev) => ({ ...prev, ...res }));
      notify({
        type: "success",
        message: `${field === "cover_picture" ? "Cover photo" : "Logo"} updated.`,
      });
    } catch {
      setFailedImageField(field);
    } finally {
      setSaving(false);
    }
  };

  // ── Basic info ───────────────────────────────────────────────────────

  const extractError = (err) => {
    if (err?.response?.data) {
      const data = err.response.data;
      // DRF field errors: { field_name: ["error msg"] } or { detail: "msg" }
      if (typeof data === 'string') return data;
      if (data.detail) return data.detail;
      // Grab the first field error
      const firstKey = Object.keys(data)[0];
      if (firstKey && Array.isArray(data[firstKey])) return data[firstKey][0];
      if (firstKey && typeof data[firstKey] === 'string') return data[firstKey];
    }
    return null;
  };

  const saveBasic = async (payload) => {
    try {
      setSaving(true);
      const res = await onSaveBasic(payload);
      setBasic((prev) => ({ ...prev, ...(res || payload) }));
      notify({ type: "success", message: "Basic info saved." });
      return true;
    } catch (err) {
      const msg = extractError(err) || "Couldn't save your changes. Please try again.";
      notify({ type: "error", title: "Save failed", message: msg });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Contact ──────────────────────────────────────────────────────────

  const saveContact = async (payload) => {
    try {
      setSaving(true);
      const res = await onSaveContact(payload);
      setContact(res || payload);
      notify({ type: "success", message: "Contact details saved." });
      return true;
    } catch (err) {
      const msg = extractError(err) || "Couldn't save your contact details. Please try again.";
      notify({ type: "error", title: "Save failed", message: msg });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Address ──────────────────────────────────────────────────────────

  const saveAddress = async (payload) => {
    try {
      setSaving(true);
      const res = await onSaveAddress(payload);
      setAddress(res || payload);
      notify({ type: "success", message: "Address saved." });
      return true;
    } catch (err) {
      const msg = extractError(err) || "Couldn't save the address. Please try again.";
      notify({ type: "error", title: "Save failed", message: msg });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Documents (org only) ────────────────────────────────────────────

  const saveDocuments = async (draft) => {
    try {
      setSaving(true);
      let payload = draft;

      if (Object.values(draft).some((v) => v instanceof File)) {
        const formData = new FormData();
        Object.entries(draft).forEach(([key, value]) => {
          if (value instanceof File) formData.append(key, value);
          else if (!isEmpty(value) && key !== "id") formData.append(key, value);
        });
        payload = formData;
      }

      const res = await onSaveDocuments(payload);
      setDocuments(res || documents);
      notify({ type: "success", message: "Registration documents saved." });
      return true;
    } catch {
      notify({ type: "error", title: "Save failed", message: "Couldn't save the registration documents. Please try again." });
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FaSpinner className={styles.spinIcon} /> Loading profile...
      </div>
    );
  }

  const completionPercent = getCompletionPercent(basic, contact, address, documents, {
    countBasic: showHeader,
    countDocuments: showDocuments,
  });
  const failedLabel = failedImageField === "cover_picture" ? "cover photo" : "logo";

  return (
    <div>
      {showHeader ? (
        <ProfileHeader
          basic={basic}
          onUploadImage={onUploadImage ? handleUploadImage : undefined}
          onSaveBasic={saveBasic}
          saving={saving}
        />
      ) : (
        <BasicInfoCard basic={basic} onSave={saveBasic} saving={saving} />
      )}

      <CompletionBanner percent={completionPercent} />
      <ContactCard contact={contact} onSave={saveContact} saving={saving} />
      <AddressCard address={address} onSave={saveAddress} saving={saving} />
      {showDocuments && (
        <DocumentsCard documents={documents} onSave={saveDocuments} saving={saving} />
      )}

      {onUploadImage && (
        <Notify
          show={!!failedImageField}
          title="Upload failed"
          message={`The ${failedLabel} couldn't be saved. Revert to your previous image?`}
          okText="Revert"
          cancelText="Keep preview"
          okType="Delete"
          onOk={() => { fetchData(); setFailedImageField(null); }}
          onCancel={() => setFailedImageField(null)}
        />
      )}
    </div>
  );
};

export default OrgProfileEditor;