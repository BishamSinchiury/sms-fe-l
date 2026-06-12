import axiosBase from "./axiosBase";
import {
  getAdminAccessToken,
  setAdminAccessToken,
  clearAdminAccessToken,
  isAdminTokenValid,
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

const adminJwtClient = axiosBase.create();

adminJwtClient.interceptors.request.use(
  (config) => {
    if (isAdminTokenValid()) {
      config.headers["Authorization"] = `Bearer ${getAdminAccessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminJwtClient.interceptors.response.use(
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
        clearAdminAccessToken();
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/admin/refresh/")) {
        clearAdminAccessToken();
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return adminJwtClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axiosBase.post(
          "/auth/admin/refresh/",
          {},
          { withCredentials: true }
        );

        const newToken = response.data.access;
        setAdminAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return adminJwtClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAdminAccessToken();
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default adminJwtClient;