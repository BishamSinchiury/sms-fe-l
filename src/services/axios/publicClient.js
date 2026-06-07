// src/services/axios/publicClient.js

import axiosBase from "./axiosBase";

// No auth. No cookies. No interceptor complexity.
// Just a clean client for endpoints anyone can call.
const publicClient = axiosBase.create();

publicClient.interceptors.response.use(
  (response) => response,

  (error) => {
    // No response — server is down
    if (!error.response) {
      if (error.code === "ERR_CANCELED") {
        return Promise.reject(error);
      }
          

      if (error.message === "Network Error") {
        window.dispatchEvent(new CustomEvent("network-error", {
          detail: "Request was blocked. This is likely a CORS or network issue."
        }));
        return Promise.reject(error);
      }
    }
    if (error.code === "ECONNABORTED") {
        window.dispatchEvent(new CustomEvent("server-timeout"));
        return Promise.reject(error);
      }
  window.location.href = "/server-down";
  return Promise.reject(error);
  }
);

export default publicClient;