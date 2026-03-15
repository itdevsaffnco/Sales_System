import axios from "axios";
const defaultBase = import.meta.env.VITE_API_BASE_URL || "127.0.0.1:8080/api";
const storedBase = (typeof localStorage !== "undefined" && localStorage.getItem("api_base_url")) || defaultBase;
const api = axios.create({
  baseURL: storedBase,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const setApiBaseURL = (url) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("api_base_url", url);
  }
  api.defaults.baseURL = url;
};
export default api;
