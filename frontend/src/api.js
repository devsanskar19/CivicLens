
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("civiclens_admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Converts an uploaded image path into a complete browser URL.
export function getImageUrl(imageUrl) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "");

  return `${serverUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

export default api;
