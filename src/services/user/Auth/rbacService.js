import { get, post, patch, put, del } from "@/utils/apiHelpers";
import adminJwtClient from "@/services/axios/adminJwtClient";
import { RBAC } from "@/constants/apiRoutes";

// Permissions
export const listPermissions  = () => get(RBAC.PERMISSIONS, {}, adminJwtClient);
export const createPermission = (data) => post(RBAC.PERMISSIONS, data, adminJwtClient);
export const updatePermission = (uuid, data) => patch(RBAC.PERMISSION_DETAIL(uuid), data, adminJwtClient);
export const deletePermission = (uuid) => del(RBAC.PERMISSION_DETAIL(uuid), adminJwtClient);

// Roles
export const listRoles  = (params = {}) => get(RBAC.ROLES, params, adminJwtClient);
export const createRole = (data) => post(RBAC.ROLES, data, adminJwtClient);
export const getRole    = (uuid) => get(RBAC.ROLE_DETAIL(uuid), {}, adminJwtClient);
export const updateRole = (uuid, data) => patch(RBAC.ROLE_DETAIL(uuid), data, adminJwtClient);
export const deleteRole = (uuid) => del(RBAC.ROLE_DETAIL(uuid), adminJwtClient);

// User permission overrides
export const getUserPermissions = (uuid) => get(RBAC.USER_PERMISSIONS(uuid), {}, adminJwtClient);
export const setUserPermissions = (uuid, overrides) =>
  put(RBAC.USER_PERMISSIONS(uuid), { overrides }, adminJwtClient);

// Logs
export const listActivityLogs = (params = {}) => get(RBAC.LOGS, params, adminJwtClient);