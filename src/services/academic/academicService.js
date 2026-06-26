import { get, post, patch, del } from "@/utils/apiHelpers";
import jwtClient from "@/services/axios/jwtClient";
import { ACADEMICS } from "@/constants/apiRoutes";

// ── Academic Year ────────────────────────────────────────────────────
export const listAcademicYears = () => get(ACADEMICS.ACADEMIC_YEARS, {}, jwtClient);
export const createAcademicYear = (data) => post(ACADEMICS.ACADEMIC_YEARS, data, jwtClient);
export const updateAcademicYear = (uuid, data) => patch(ACADEMICS.ACADEMIC_YEAR_DETAIL(uuid), data, jwtClient);
export const deleteAcademicYear = (uuid) => del(ACADEMICS.ACADEMIC_YEAR_DETAIL(uuid), jwtClient);

// ── Program ──────────────────────────────────────────────────────────
export const listPrograms = () => get(ACADEMICS.PROGRAMS, {}, jwtClient);
export const createProgram = (data) => post(ACADEMICS.PROGRAMS, data, jwtClient);
export const updateProgram = (uuid, data) => patch(ACADEMICS.PROGRAM_DETAIL(uuid), data, jwtClient);
export const deleteProgram = (uuid) => del(ACADEMICS.PROGRAM_DETAIL(uuid), jwtClient);

// ── Grade Level ──────────────────────────────────────────────────────
export const listGrade = () => get(ACADEMICS.GRADES, {}, jwtClient);
export const createGrade = (data) => post(ACADEMICS.GRADES, data, jwtClient);
export const updateGrade = (uuid, data) => patch(ACADEMICS.GRADES_DETAIL(uuid), data, jwtClient);
export const deleteGrade = (uuid) => del(ACADEMICS.GRADES_DETAIL(uuid), jwtClient);

// ── Semester ─────────────────────────────────────────────────────────
export const listSemesters   = () =>         get(ACADEMICS.SEMESTERS, {}, jwtClient);
export const createSemester  = (data) =>     post(ACADEMICS.SEMESTERS, data, jwtClient);
export const updateSemester  = (uuid, data) => patch(ACADEMICS.SEMESTER_DETAIL(uuid), data, jwtClient);
export const deleteSemester  = (uuid) =>     del(ACADEMICS.SEMESTER_DETAIL(uuid), jwtClient);

// Semester optional groups (nested actions)
export const addSemOptionalGroup    = (semId, data)        => post(ACADEMICS.SEMESTER_ADD_GROUP(semId), data, jwtClient);
export const updateSemOptionalGroup = (semId, gid, data)   => patch(ACADEMICS.SEMESTER_UPDATE_GROUP(semId, gid), data, jwtClient);
export const removeSemOptionalGroup = (semId, gid)         => del(ACADEMICS.SEMESTER_REMOVE_GROUP(semId, gid), jwtClient);

// ── Stream ───────────────────────────────────────────────────────────
export const listStreams = () => get(ACADEMICS.STREAMS, {}, jwtClient);
export const createStream = (data) => post(ACADEMICS.STREAMS, data, jwtClient);
export const updateStream = (uuid, data) => patch(ACADEMICS.STREAM_DETAIL(uuid), data, jwtClient);
export const deleteStream = (uuid) => del(ACADEMICS.STREAM_DETAIL(uuid), jwtClient);
// ── Levels ─────────────────────────────────────────────────────────────────────
// University Levels — seed data managed by superusers. No create/delete.
// Editable fields: order, is_active.
export const listUniversityLevels = () => get("/academics/university-levels/").then(r => r);
export const getUniversityLevel = (uuid) => get(`/academics/university-levels/${uuid}/`).then(r => r);
export const updateUniversityLevel = (uuid, data) => patch(`/academics/university-levels/${uuid}/`, data).then(r => r);

// School Levels — seed data managed by superusers. No create/delete.
// Editable fields: order, is_active.
export const listSchoolLevels = () => get("/academics/school-levels/").then(r => r);
export const getSchoolLevel = (uuid) => get(`/academics/school-levels/${uuid}/`).then(r => r);
export const updateSchoolLevel = (uuid, data) => patch(`/academics/school-levels/${uuid}/`, data).then(r => r);

// ── Subjects ──────────────────────────────────────────────────────────
export const listSubjects    = ()         => get(ACADEMICS.SUBJECTS, {}, jwtClient);
export const createSubject   = (data)     => post(ACADEMICS.SUBJECTS, data, jwtClient);
export const updateSubject   = (id, data) => patch(ACADEMICS.SUBJECT_DETAIL(id), data, jwtClient);


// ── Class Subject Configs ─────────────────────────────────────────────
export const listClassSubjectConfigs   = ()         => get(ACADEMICS.CLASS_SUBJECT_CONFIGS, {}, jwtClient);
export const createClassSubjectConfig  = (data)     => post(ACADEMICS.CLASS_SUBJECT_CONFIGS, data, jwtClient);
export const updateClassSubjectConfig  = (id, data) => patch(ACADEMICS.CLASS_SUBJECT_CONFIG_DETAIL(id), data, jwtClient);

// Optional groups (nested under ClassSubjectConfig)
export const listOptionalGroups   = (configId)              => get(ACADEMICS.CLASS_SUBJECT_CONFIG_OPTIONAL_GROUPS(configId), {}, jwtClient);
export const addOptionalGroup     = (configId, data)        => post(ACADEMICS.CLASS_SUBJECT_CONFIG_ADD_GROUP(configId), data, jwtClient);
export const updateOptionalGroup  = (configId, gid, data)   => patch(ACADEMICS.CLASS_SUBJECT_CONFIG_UPDATE_GROUP(configId, gid), data, jwtClient);
export const removeOptionalGroup  = (configId, gid)         => del(ACADEMICS.CLASS_SUBJECT_CONFIG_REMOVE_GROUP(configId, gid), jwtClient);