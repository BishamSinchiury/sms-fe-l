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
  PUBLICDATA: (domain) => `/org/public/organization?domain_name=${domain}`,
};