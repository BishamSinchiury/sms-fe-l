import { get, post, patch, put, del, patchForm } from "@/utils/apiHelpers";

import adminJwtClient from "@/services/axios/adminJwtClient";
import { ORG_ADMIN } from "@/constants/apiRoutes";

export const getOrgCompletion = () => get(ORG_ADMIN.COMPLETION, {}, adminJwtClient);

export const getOrgBasic    = () => get(ORG_ADMIN.BASIC, {}, adminJwtClient);
export const getOrgContact  = () => get(ORG_ADMIN.CONTACT, {}, adminJwtClient);
export const getOrgAddress  = () => get(ORG_ADMIN.ADDRESS, {}, adminJwtClient);
export const getOrgDocuments = () => get(ORG_ADMIN.DOCUMENTS, {}, adminJwtClient);

// Basic info may include file uploads (logo/cover) → use patchForm if FormData
export const updateOrgBasic = (data) =>
  data instanceof FormData
    ? patchForm(ORG_ADMIN.BASIC, data, adminJwtClient)
    : patch(ORG_ADMIN.BASIC, data, adminJwtClient);

export const updateOrgContact   = (data) => patch(ORG_ADMIN.CONTACT, data, adminJwtClient);
export const updateOrgAddress   = (data) => patch(ORG_ADMIN.ADDRESS, data, adminJwtClient);
export const updateOrgDocuments = (data) => patch(ORG_ADMIN.DOCUMENTS, data, adminJwtClient);