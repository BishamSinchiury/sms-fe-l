import { get, post, patch, del } from "@/utils/apiHelpers";
import jwtClient from "@/services/axios/jwtClient";
import { STUDENT } from "@/constants/apiRoutes";

// ── Students ─────────────────────────────────────────────────────────────────
export const listStudents   = ()         => get(STUDENT.LIST, {}, jwtClient);
export const createStudent  = (data)     => post(STUDENT.CREATE, data, jwtClient);
export const updateStudent  = (id, data) => patch(STUDENT.DETAIL(id), data, jwtClient);

// ── Enrollments ───────────────────────────────────────────────────────────────
export const listEnrollments   = (studentId) =>
  get(STUDENT.ENROLLMENTS + (studentId ? `?student=${studentId}` : ""), {}, jwtClient);
export const createEnrollment  = (data)      => post(STUDENT.ENROLLMENTS, data, jwtClient);
export const updateEnrollment  = (id, data)  => patch(STUDENT.ENROLLMENT_DETAIL(id), data, jwtClient);

// ── Subject Selections ────────────────────────────────────────────────────────
export const listSubjectSelections  = (enrollmentId) =>
  get(STUDENT.SUBJECT_SELECTIONS + (enrollmentId ? `?enrollment=${enrollmentId}` : ""), {}, jwtClient);
export const createSubjectSelection = (data)      => post(STUDENT.SUBJECT_SELECTIONS, data, jwtClient);
export const deleteSubjectSelection = (id)        => del(STUDENT.SUBJECT_SELECTION_DETAIL(id), jwtClient);
