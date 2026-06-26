// src/constants/apiRoutes.js

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH = {
  LOGIN: "/auth/login/",
  LOGOUT: "/auth/logout/",
  REFRESH: "/auth/refresh/",
  ME: "/auth/me/",
  SIGNUP: "/auth/signup/",
  SIGNUP_VERIFY: "/auth/signup/verify/",
  PUBLIC_ROLES: "/auth/public-roles/",
  FORGOT_PASSWORD: "/auth/forgot-password/",       // ← add
  VERIFY_RESET_OTP: "/auth/verify-reset-otp/",      // ← add
  RESET_PASSWORD: "/auth/reset-password/",
  STUDENT_LOOKUP: "/auth/students/lookup/",
};

export const ADMIN_AUTH = {
  LOGIN: "/auth/admin/login/",
  VERIFY_OTP: "/auth/admin/verify/",
  REFRESH: "/auth/admin/refresh/",
  LOGOUT: "/auth/admin/logout/",
  ME: "/auth/me/",
}

export const ORG = {
  PUBLICDATA: (domain) => {
    const resolved = domain === '127.0.0.1' ? 'localhost' : domain;
    return `/org/public/organization?domain_name=${resolved}`;
  },
  PUBLIC_SUBORGS: (domain) => {
    const resolved = domain === '127.0.0.1' ? 'localhost' : domain;
    return `/org/public/suborgs/?domain_name=${resolved}`;
  },
};

// ─── Org Admin (sysadmin) ──────────────────────────────────────────────────────

export const ORG_ADMIN = {
  COMPLETION: "/org/profile/completion/",
  BASIC: "/org/profile/basic/",
  CONTACT: "/org/profile/contact/",
  ADDRESS: "/org/profile/address/",
  DOCUMENTS: "/org/profile/documents/",
};

// ─── Sub Organizations ──────────────────────────────────────────────────────────

export const SUBORG = {
  LIST: "/org/suborgs/",
  DETAIL: (uuid) => `/org/suborgs/${uuid}/`,
  BASIC: (uuid) => `/org/suborgs/${uuid}/basic/`,
  CONTACT: (uuid) => `/org/suborgs/${uuid}/contact/`,
  ADDRESS: (uuid) => `/org/suborgs/${uuid}/address/`,
};

// ─── Users Management ────────────────────────────────────────────────────────────

export const USERS = {
  LIST: "/auth/users/",
  DETAIL: (uuid) => `/auth/users/${uuid}/`,
  ROLES: "/auth/roles/",
};

// ─── RBAC: Permissions, Roles, Logs ──────────────────────────────────────────────

export const RBAC = {
  PERMISSIONS: "/rbac/permissions/",
  PERMISSION_DETAIL: (uuid) => `/rbac/permissions/${uuid}/`,
  ROLES: "/rbac/roles/",
  ROLE_DETAIL: (uuid) => `/rbac/roles/${uuid}/`,
  USER_PERMISSIONS: (uuid) => `/rbac/users/${uuid}/permissions/`,
  LOGS: "/rbac/logs/",
};

export const STUDENT = {
  LIST: "/students/",
  DETAIL: (uuid) => `/students/${uuid}/`,
  CLAIMS: "/students/claims/",
  CLAIM_APPROVE: (uuid) => `/students/claims/${uuid}/approve/`,
  CLAIM_REJECT: (uuid) => `/students/claims/${uuid}/reject/`,
};

// ─── Academics ────────────────────────────────────────────────────────────────────
export const ACADEMICS = {

  // Academic Years
  ACADEMIC_YEARS: "/academics/academic-years/",
  ACADEMIC_YEAR_DETAIL: (uuid) => `/academics/academic-years/${uuid}/`,

  UNIVERSITY_LEVELS: "/academics/university-levels/",
  UNIVERSITY_LEVEL_DETAIL: (uuid) => `/academics/university-levels/${uuid}/`,

  SCHOOL_LEVELS: "/academics/school-levels/",
  SCHOOL_LEVEL_DETAIL: (uuid) => `/academics/school-levels/${uuid}/`,

  // Programs
  PROGRAMS: "/academics/programs/",
  PROGRAM_DETAIL: (uuid) => `/academics/programs/${uuid}/`,

  GRADES: "/academics/grades/",
  GRADES_DETAIL: (uuid) => `/academics/grades/${uuid}/`,

  // Semesters
  SEMESTERS: "/academics/semesters/",
  SEMESTER_DETAIL: (uuid) => `/academics/semesters/${uuid}/`,
  // Semester optional groups (nested actions)
  SEMESTER_OPTIONAL_GROUPS: (id) => `/academics/semesters/${id}/optional-groups/`,
  SEMESTER_ADD_GROUP:       (id) => `/academics/semesters/${id}/optional-groups/add/`,
  SEMESTER_UPDATE_GROUP:    (id, gid) => `/academics/semesters/${id}/optional-groups/${gid}/update/`,
  SEMESTER_REMOVE_GROUP:    (id, gid) => `/academics/semesters/${id}/optional-groups/${gid}/remove/`,

  // Streams
  STREAMS: "/academics/streams/",
  STREAM_DETAIL: (id) => `/academics/streams/${id}/`,

  // Subjects
  SUBJECTS: "/academics/subjects/",
  SUBJECT_DETAIL: (id) => `/academics/subjects/${id}/`,

  // Class Subject Configs
  CLASS_SUBJECT_CONFIGS: "/academics/class-subject-configs/",
  CLASS_SUBJECT_CONFIG_DETAIL: (id) => `/academics/class-subject-configs/${id}/`,
  CLASS_SUBJECT_CONFIG_OPTIONAL_GROUPS: (id) => `/academics/class-subject-configs/${id}/optional-groups/`,
  CLASS_SUBJECT_CONFIG_ADD_GROUP: (id) => `/academics/class-subject-configs/${id}/optional-groups/add/`,
  CLASS_SUBJECT_CONFIG_UPDATE_GROUP: (id, gid) => `/academics/class-subject-configs/${id}/optional-groups/${gid}/update/`,
  CLASS_SUBJECT_CONFIG_REMOVE_GROUP: (id, gid) => `/academics/class-subject-configs/${id}/optional-groups/${gid}/remove/`,
};

