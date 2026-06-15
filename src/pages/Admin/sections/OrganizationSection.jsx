import React from "react";
import OrgProfileEditor from "@/components/Org/OrganizationProfileEditor.jsx";
import {
  getOrgBasic, updateOrgBasic,
  getOrgContact, updateOrgContact,
  getOrgAddress, updateOrgAddress,
  getOrgDocuments, updateOrgDocuments
} from "@/services/user/Org/orgAdminService";

const OrganizationSection = () => {
  const fetchAll = async () => {
    const [basic, contact, address, documents] = await Promise.all([
      getOrgBasic(), getOrgContact(), getOrgAddress(), getOrgDocuments(),
    ]);
    return { basic, contact, address, documents };
  };

  return (
    <OrgProfileEditor
      showHeader
      showDocuments
      fetchAll={fetchAll}
      onUploadImage={(formData) => updateOrgBasic(formData)}
      onSaveBasic={(payload) => updateOrgBasic(payload)}
      onSaveContact={(payload) => updateOrgContact(payload)}
      onSaveAddress={(payload) => updateOrgAddress(payload)}
      onSaveDocuments={(payload) => updateOrgDocuments(payload)}
    />
  );
};

export default OrganizationSection;