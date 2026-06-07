import jwtClient from "../services/axios/jwtClient";
import sessionClient from "../services/axios/sessionClient";

export const get = async (url, params = {}, client = jwtClient) => {
  const response = await client.get(url, { params });
  return response.data;
};


export const post = async (url, data = {}, client = jwtClient) => {
  const response = await client.post(url, data);
  return response.data;
};


export const postForm = async (url, formData, client = jwtClient) => {
  const response = await client.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const put = async (url, data = {}, client = jwtClient) => {
  const response = await client.put(url, data);
  return response.data;
};

export const putForm = async (url, formData, client = jwtClient) => {
  const response = await client.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const patch = async (url, data = {}, client = jwtClient) => {
  const response = await client.patch(url, data);
  return response.data;
};

export const patchForm = async (url, formData, client = jwtClient) => {
  const response = await client.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const del = async (url, client = jwtClient) => {
  const response = await client.delete(url);
  return response.data;
};

export const upload = async (
  url,
  file,
  onProgress = null,
  client = jwtClient
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress
      ? (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      : undefined,
  });

  return response.data;
};