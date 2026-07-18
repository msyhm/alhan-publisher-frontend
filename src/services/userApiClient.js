const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

import { getUserToken } from "./userAuthToken.js";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getUserToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({ success: false, message: "خطا در پردازش پاسخ سرور" }));

  if (!res.ok) {
    const error = new Error(data.message || `خطای HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

const userApiClient = {
  get:  (endpoint)       => request(endpoint, { method: "GET" }),
  post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export default userApiClient;