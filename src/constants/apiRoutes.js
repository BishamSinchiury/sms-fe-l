// src/constants/apiRoutes.js

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH = {
  LOGIN:           "/auth/login/",
  LOGOUT:          "/auth/logout/",
  REFRESH:         "/auth/refresh/",
  ME:              "/auth/me/",
};

export const ADMIN_AUTH = {
  LOGIN:           "/auth/admin/login/",
  VERIFY_OTP:      "/auth/admin/verify/",
  REFRESH:         "/auth/admin/refresh/",
  LOGOUT:          "/auth/admin/logout/",
  ME:              "/auth/me/",        
}

export const ORG = {
  PUBLICDATA: (domain) => {
    const resolved = domain === '127.0.0.1' ? 'localhost' : domain;
    return `/org/public/organization?domain_name=${resolved}`;
  }
};

// ─── Org Admin (sysadmin) ──────────────────────────────────────────────────────

export const ORG_ADMIN = {
  COMPLETION: "/org/profile/completion/",
  BASIC:      "/org/profile/basic/",
  CONTACT:    "/org/profile/contact/",
  ADDRESS:    "/org/profile/address/",
  DOCUMENTS:  "/org/profile/documents/",
};

// ─── Sub Organizations ──────────────────────────────────────────────────────────

export const SUBORG = {
  LIST:   "/org/suborgs/",
  DETAIL: (uuid) => `/org/suborgs/${uuid}/`,
};

// ─── Users Management ────────────────────────────────────────────────────────────

export const USERS = {
  LIST:   "/auth/users/",
  DETAIL: (uuid) => `/auth/users/${uuid}/`,
  ROLES:  "/auth/roles/",
};

// ─── RBAC: Permissions, Roles, Logs ──────────────────────────────────────────────

export const RBAC = {
  PERMISSIONS:        "/rbac/permissions/",
  PERMISSION_DETAIL:  (uuid) => `/rbac/permissions/${uuid}/`,
  ROLES:              "/rbac/roles/",
  ROLE_DETAIL:        (uuid) => `/rbac/roles/${uuid}/`,
  USER_PERMISSIONS:   (uuid) => `/rbac/users/${uuid}/permissions/`,
  LOGS:               "/rbac/logs/",
};