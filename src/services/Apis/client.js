import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_recommendServiceURL;

let accessToken = null;
let refreshPromise = null;
let sessionExpiredHandler = () => {};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const setSessionExpiredHandler = (handler) => {
  sessionExpiredHandler = typeof handler === 'function' ? handler : () => {};
};

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient.post('/auth/refresh')
      .then((response) => {
        const data = response?.data?.data;
        if (!data?.accessToken) throw new Error('Refresh response did not contain an access token');
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const handleResponseError = async (error) => {
  const request = error?.config;
  const isAuthEndpoint = String(request?.url || '').includes('/auth/');
  if (error?.response?.status === 401 && request && !request.__authRetried && !isAuthEndpoint) {
    request.__authRetried = true;
    try {
      const data = await refreshAccessToken();
      request.headers = request.headers || {};
      request.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(request);
    } catch (refreshError) {
      clearAccessToken();
      sessionExpiredHandler();
    }
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use((response) => response, handleResponseError);

export const getSafeApiMessage = (error, fallback) =>
  error?.response?.data?.error?.message || fallback;

export default apiClient;
