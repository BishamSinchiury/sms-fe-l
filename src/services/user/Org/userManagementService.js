import { get, post, patch, del } from "@/utils/apiHelpers";
import adminJwtClient from "@/services/axios/adminJwtClient";
import { USERS } from "@/constants/apiRoutes";

// params are passed directly — apiHelpers.get forwards them as query params
export const listUsers  = (params = {}) => get(USERS.LIST, params, adminJwtClient);
export const createUser = (data)        => post(USERS.LIST, data, adminJwtClient);
export const getUser    = (uuid)        => get(USERS.DETAIL(uuid), {}, adminJwtClient);
export const updateUser = (uuid, data)  => patch(USERS.DETAIL(uuid), data, adminJwtClient);
export const deleteUser = (uuid)        => del(USERS.DETAIL(uuid), adminJwtClient);
export const listRoles  = ()            => get(USERS.ROLES, {}, adminJwtClient);