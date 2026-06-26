import { get, post, patch, del } from "@/utils/apiHelpers";
import jwtClient from "@/services/axios/jwtClient";
import { STUDENT } from "@/constants/apiRoutes";

// ── Students ────────────────────────────────────────────────────────
export const listStudents   = ()           => get(STUDENT.LIST, {}, jwtClient);
export const createStudent  = (data)       => post(STUDENT.LIST, data, jwtClient);
export const updateStudent  = (uuid, data) => patch(STUDENT.DETAIL(uuid), data, jwtClient);
export const deleteStudent  = (uuid)       => del(STUDENT.DETAIL(uuid), jwtClient);

// ── Claims ──────────────────────────────────────────────────────────
export const listClaims     = ()           => get(STUDENT.CLAIMS, {}, jwtClient);
export const approveClaim   = (uuid)       => post(STUDENT.CLAIM_APPROVE(uuid), {}, jwtClient);
export const rejectClaim    = (uuid)       => post(STUDENT.CLAIM_REJECT(uuid), {}, jwtClient);
