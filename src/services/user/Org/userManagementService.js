import { get, post, patch, put, del } from "@/utils/apiHelpers";

import adminJwtClient from "@/services/axios/adminJwtClient";
import { USERS } from "@/constants/apiRoutes";

export const listUsers   = () => get(USERS.LIST, {}, adminJwtClient);
export const createUser  = (data) => post(USERS.LIST, data, adminJwtClient);
export const getUser     = (uuid) => get(USERS.DETAIL(uuid), {}, adminJwtClient);
export const updateUser  = (uuid, data) => patch(USERS.DETAIL(uuid), data, adminJwtClient);
export const deleteUser  = (uuid) => del(USERS.DETAIL(uuid), adminJwtClient);
export const listRoles   = () => get(USERS.ROLES, {}, adminJwtClient);