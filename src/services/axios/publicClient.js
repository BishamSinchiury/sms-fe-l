// src/services/axios/publicClient.js

import axiosBase from "./axiosBase";

// No auth. No cookies. No interceptor complexity.
// Just a clean client for endpoints anyone can call.
const publicClient = axiosBase.create();



publicClient.interceptors.response.use(
  (response) => response,

  (error) => {
    // Canceled request — ignore silently
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // Timeout
    if (error.code === "ECONNABORTED") {
      window.dispatchEvent(new CustomEvent("server-timeout"));
      return Promise.reject(error);
    }

    // No response at all — server is down or connection refused
    if (!error.response) {
      window.location.href = "/server-down";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default publicClient;