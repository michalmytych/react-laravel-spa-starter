import axios from "axios";

export const API_BASE_URL = "http://localhost:8000";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Accept": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  config.headers["X-Requested-With"] = "XMLHttpRequest";
  config.headers["Accept"] = "application/json";

  return config;
});
