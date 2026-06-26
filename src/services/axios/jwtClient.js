// /home/bisham/Code/sms-no-ai/fe/src/services/axios/jwtClient.js
import axiosBase from "./axiosBase";
import {
  getUserAccessToken,
  setUserAccessToken,
  clearUserAccessToken,
  isUserTokenValid,
} from "../auth/tokenService";

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, newToken = null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newToken);
    }
  });
  refreshQueue = [];
};

const jwtClient = axiosBase.create();

jwtClient.interceptors.request.use(
  (config) => {
    
    if (isUserTokenValid()) {
      config.headers["Authorization"] = `Bearer ${getUserAccessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

jwtClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (!error.response) {
      window.location.href = "/server-down";
      return Promise.reject(error);
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent("forbidden"));
      return Promise.reject(error);
    }

    if (status === 401) {
      if (originalRequest._retry) {
        clearUserAccessToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/refresh/")) {
        clearUserAccessToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return jwtClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axiosBase.post(
          "/auth/refresh/",
          {},
          { withCredentials: true }
        );

        const newToken = response.data.access;
        setUserAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return jwtClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearUserAccessToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default jwtClient;