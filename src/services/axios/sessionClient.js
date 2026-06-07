import axiosBase from "./axiosBase";


const sessionClient = axiosBase.create({
    withCredentials: true,
});

const getCsrfTokenFromCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  return cookie ? cookie.split("=")[1] : null;
};

sessionClient.interceptors.request.use(
  (config) => {
    const methodsRequiringCsrf = ["post", "put", "patch", "delete"];
    const method = config.method?.toLowerCase();
    if (methodsRequiringCsrf.includes(method)) {
      const csrfToken = getCsrfTokenFromCookie();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }
      return config; 
    },
    (error) => {
    return Promise.reject(error);
  }
)

sessionClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (!error.response) {
      window.location.href = "/server-down";
      return Promise.reject(error);
    }

    if (status === 401) {
      window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent("forbidden"));
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default sessionClient;
