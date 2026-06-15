// src/services/user/Org/subOrgService.js

import { get, post, patch, put, del } from "@/utils/apiHelpers";

import adminJwtClient from "@/services/axios/adminJwtClient";
import { SUBORG } from "@/constants/apiRoutes";

// ─── CRUD ───────────────────────────────────────────────────────────────────

export const listSubOrgs  = () => get(SUBORG.LIST, {}, adminJwtClient);
export const createSubOrg = (data) => post(SUBORG.LIST, data, adminJwtClient);
export const getSubOrg    = (uuid) => get(SUBORG.DETAIL(uuid), {}, adminJwtClient);
export const updateSubOrg = (uuid, data) => patch(SUBORG.DETAIL(uuid), data, adminJwtClient);
export const deleteSubOrg = (uuid) => del(SUBORG.DETAIL(uuid), adminJwtClient);

// ─── Card list (used by SubOrgSection) ───────────────────────────────────────

export const getSubOrgs = () => get(SUBORG.LIST, {}, adminJwtClient);

// ─── Per-section profile (used by OrgProfileEditor) ──────────────────────────

export const getSubOrgBasic    = (uuid) => get(SUBORG.BASIC(uuid), {}, adminJwtClient);
export const updateSubOrgBasic = (uuid, data) => patch(SUBORG.BASIC(uuid), data, adminJwtClient);

export const getSubOrgContact    = (uuid) => get(SUBORG.CONTACT(uuid), {}, adminJwtClient);
export const updateSubOrgContact = (uuid, data) => patch(SUBORG.CONTACT(uuid), data, adminJwtClient);

export const getSubOrgAddress    = (uuid) => get(SUBORG.ADDRESS(uuid), {}, adminJwtClient);
export const updateSubOrgAddress = (uuid, data) => patch(SUBORG.ADDRESS(uuid), data, adminJwtClient);