// src/services/auth/tokenService.js

let userAccessToken  = null;
let adminAccessToken = null;

const parseTokenPayload = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;
  const payload = parseTokenPayload(token);
  if (!payload) return false;
  const tenSecondsFromNow = Date.now() / 1000 + 10;
  return payload.exp > tenSecondsFromNow;
};

export const getUserAccessToken    = ()      => userAccessToken;
export const setUserAccessToken    = (token) => { userAccessToken = token; };
export const clearUserAccessToken  = ()      => { userAccessToken = null; };
export const isUserTokenValid      = ()      => isTokenValid(userAccessToken);

export const getAdminAccessToken   = ()      => adminAccessToken;
export const setAdminAccessToken   = (token) => { adminAccessToken = token; };
export const clearAdminAccessToken = ()      => { adminAccessToken = null; };
export const isAdminTokenValid     = ()      => isTokenValid(adminAccessToken);

export const getTokenClaims        = (token) => parseTokenPayload(token);