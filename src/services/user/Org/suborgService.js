import { get, post, patch, put, del } from "@/utils/apiHelpers";

import adminJwtClient from "@/services/axios/adminJwtClient";
import { SUBORG } from "@/constants/apiRoutes";

export const listSubOrgs   = () => get(SUBORG.LIST, {}, adminJwtClient);
export const createSubOrg  = (data) => post(SUBORG.LIST, data, adminJwtClient);
export const getSubOrg     = (uuid) => get(SUBORG.DETAIL(uuid), {}, adminJwtClient);
export const updateSubOrg  = (uuid, data) => patch(SUBORG.DETAIL(uuid), data, adminJwtClient);
export const deleteSubOrg  = (uuid) => del(SUBORG.DETAIL(uuid), adminJwtClient);