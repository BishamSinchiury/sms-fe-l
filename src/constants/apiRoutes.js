// src/constants/apiRoutes.js

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH = {
  LOGIN:           "/auth/login/",
  CSRF:            "/csrf/",
};

export const ORG = {
  PUBLICDATA: (domain) => `/org/public/organization?domain_name=${domain}`,
};