// src/components/Org/SubOrgSection.jsx
import React, { useState, useEffect } from "react";
import styles from "./Section.module.css";
import formStyles from "@/components/Org/ProfileForm.module.css";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import OrgProfileEditor from "@/components/Org/OrganizationProfileEditor.jsx";
import SubOrgCard from "@/components/Org/SubOrgCard.jsx";
import AddSubOrgCard from "@/components/Org/AddSubOrgCard.jsx";
import AddSubOrgForm from "@/components/Org/AddSubOrgForm.jsx";
import Notify from "@/components/Modal/Notify";
import { useNotification } from "@/components/Notification/NotificationContainer";
import {
  getSubOrgs, createSubOrg, deleteSubOrg,
  getSubOrgBasic, updateSubOrgBasic,
  getSubOrgContact, updateSubOrgContact,
  getSubOrgAddress, updateSubOrgAddress,
} from "@/services/user/Org/suborgService.js";

const SubOrgSection = () => {
  const [subOrgs, setSubOrgs] = useState([]);
  const [selected, setSelected] = useState(null); // uuid or null
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null); // uuid being deleted
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { notify } = useNotification();

  useEffect(() => {
    fetchSubOrgs();
  }, []);

  const fetchSubOrgs = async () => {
    setLoading(true);
    try {
      const data = await getSubOrgs();
      setSubOrgs(data || []);
    } catch {
      notify({
        type: "error",
        title: "Failed to load",
        message: "Could not fetch sub-organizations. Please refresh the page.",
        duration: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      setCreating(true);
      const created = await createSubOrg(payload);
      setSubOrgs((prev) => [...prev, created]);
      notify({ type: "success", message: "Sub-organization created." });
      setAdding(false);
      // Jump straight into the new sub-org's profile to add contact/address
      setSelected(created.uuid);
    } catch (err) {
      const message =
        err?.response?.data?.name?.[0] ||
        err?.response?.data?.detail ||
        "Couldn't create the sub-organization. Please try again.";
      notify({ type: "error", title: "Create failed", message });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(selected);
      await deleteSubOrg(selected);
      setSubOrgs((prev) => prev.filter((s) => s.uuid !== selected));
      setSelected(null);
      setConfirmDelete(false);
      notify({ type: "success", message: "Sub-organization deleted." });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Couldn't delete the sub-organization.";
      notify({ type: "error", title: "Delete failed", message: msg });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FaSpinner className={styles.spinIcon} /> Loading sub-organizations...
      </div>
    );
  }

  if (adding) {
    return (
      <AddSubOrgForm
        onCancel={() => setAdding(false)}
        onCreate={handleCreate}
        creating={creating}
      />
    );
  }

  if (selected) {
    const fetchAll = async () => {
      const [basic, contact, address] = await Promise.all([
        getSubOrgBasic(selected),
        getSubOrgContact(selected),
        getSubOrgAddress(selected),
      ]);
      return { basic, contact, address };
    };

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className={formStyles.backButton} onClick={() => setSelected(null)}>
            <FaArrowLeft /> Back to sub-organizations
          </button>
          <button
            className={formStyles.cancelBtn}
            onClick={() => setConfirmDelete(true)}
            disabled={deleting === selected}
            style={{ color: "var(--color-danger, #f87171)", borderColor: "rgba(248, 113, 113, 0.3)" }}
          >
            {deleting === selected ? <FaSpinner className={formStyles.spinIcon} /> : null}
            {deleting === selected ? "Deleting..." : "Delete"}
          </button>
        </div>

        <Notify
          show={confirmDelete}
          title="Delete sub-organization?"
          message="Are you sure you want to delete this sub-organization? This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          okType="Delete"
          onOk={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />

        <OrgProfileEditor
          showHeader={false}
          showDocuments={false}
          fetchAll={fetchAll}
          onSaveBasic={(payload) => updateSubOrgBasic(selected, payload)}
          onSaveContact={(payload) => updateSubOrgContact(selected, payload)}
          onSaveAddress={(payload) => updateSubOrgAddress(selected, payload)}
        />
      </div>
    );
  }

  return (
    <div className={formStyles.cardGrid}>
      {subOrgs.map((s) => (
        <SubOrgCard
          key={s.uuid}
          subOrg={s}
          onClick={() => setSelected(s.uuid)}
        />
      ))}
      <AddSubOrgCard onClick={() => setAdding(true)} />
    </div>
  );
};

export default SubOrgSection;