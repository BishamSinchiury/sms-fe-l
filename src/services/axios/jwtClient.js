// src/services/axios/jwtClient.js

import axiosBase from "./axiosBase";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  isAccessTokenValid,
} from "../auth/tokenService";

// ─── Refresh queue state ─────────────────────────────────────────────────────

// Flag: is a refresh call currently in progress?
let isRefreshing = false;

// Queue of requests that arrived while a refresh was in progress.
// Each item is an object with two functions:
//   resolve(newToken) → retries the request with the new token
//   reject(error)     → fails the request if the refresh itself failed
let refreshQueue = [];

// Called when a refresh completes — notifies everyone waiting in the queue.
const processQueue = (error, newToken = null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newToken);
    }
  });

  // Clear the queue after processing
  refreshQueue = [];
};

// ─── Create the instance ─────────────────────────────────────────────────────

const jwtClient = axiosBase.create();

// ─── Request interceptor ─────────────────────────────────────────────────────

jwtClient.interceptors.request.use(
  (config) => {
    // Before sending, check if we already have a valid token in memory.
    // If it's still valid, attach it. If it has expired, we skip it here
    // and let the 401 response interceptor handle the refresh.
    if (isAccessTokenValid()) {
      config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────

jwtClient.interceptors.response.use(
  // 2xx: pass through untouched
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // ── No response at all: server is down ──────────────────────────────────
    if (!error.response) {
      window.location.href = "/server-down";
      return Promise.reject(error);
    }

    // ── 403 Forbidden: fire event, let UI show the modal ────────────────────
    if (status === 403) {
      window.dispatchEvent(new CustomEvent("forbidden"));
      return Promise.reject(error);
    }

    // ── 401 Unauthorized ─────────────────────────────────────────────────────
    if (status === 401) {
      // _retry is a flag we attach to the request config to prevent
      // infinite loops. If this request has ALREADY been retried once
      // and still gets a 401, the refresh token is also expired.
      // In that case we log the user out immediately — no more retrying.
      if (originalRequest._retry) {
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Special case: if the refresh endpoint itself returns 401,
      // we must not try to refresh again — that would be infinite.
      // Immediately redirect to login.
      if (originalRequest.url?.includes("/token/refresh/")) {
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Mark this request so we know it has been retried once
      originalRequest._retry = true;

      // ── Queue path: a refresh is already in progress ─────────────────────
      if (isRefreshing) {
        // Instead of making another refresh call, we return a promise
        // that will resolve/reject once the in-progress refresh finishes.
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            // Refresh succeeded — update the header and retry
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return jwtClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // ── Refresh path: we are the first 401, start the refresh ────────────
      isRefreshing = true;

      try {
        // Call Django's token refresh endpoint.
        // The refresh token lives in an httpOnly cookie — the browser
        // sends it automatically, we don't touch it in JavaScript at all.
        const response = await axiosBase.post(
          "/auth/token/refresh/",
          {},
          { withCredentials: true } // needed so the httpOnly cookie is sent
        );

        const newToken = response.data.access;

        // Save the new access token in memory
        setAccessToken(newToken);

        // Notify all queued requests that they can retry now
        processQueue(null, newToken);

        // Retry the original request that triggered the 401
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return jwtClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — token is truly expired or revoked.
        // Reject everyone in the queue and send user to login.
        processQueue(refreshError, null);
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        // Always reset the flag, whether refresh succeeded or failed.
        // If we don't do this, future 401s will always think
        // a refresh is in progress and queue forever.
        isRefreshing = false;
      }
    }

    // All other errors (404, 500, etc.) — pass to the service layer
    return Promise.reject(error);
  }
);

export default jwtClient;