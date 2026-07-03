/**
 * authorsService.js — فرانت
 * مسیر فایل: src/services/authorsService.js
 */
import apiClient from "./apiClient.js";

const authorsService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/authors${query ? `?${query}` : ""}`);
    // پاسخ: { success, authors, pagination }
  },

  async getById(id) {
    return apiClient.get(`/authors/${id}`);
    // پاسخ: { success, author } — شامل books[]
  },

  async create(data) {
    return apiClient.post("/authors", data);
  },

  async update(id, data) {
    return apiClient.put(`/authors/${id}`, data);
  },

  async remove(id) {
    return apiClient.delete(`/authors/${id}`);
  },

  async toggleStatus(id, status) {
    return apiClient.patch(`/authors/${id}/status`, { status });
  },

  // ✅ آپلود آواتار
  async uploadAvatar(id, file) {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.upload(`/upload/authors/${id}/avatar`, formData);
  },
};

export default authorsService;
