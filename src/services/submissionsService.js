/**
 * submissionsService.js — فرانت
 * مسیر فایل: src/services/submissionsService.js
 */
import apiClient from "./apiClient.js";

const submissionsService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/submissions${query ? `?${query}` : ""}`);
    // پاسخ: { success, submissions, pendingCount, pagination }
  },

  async getById(id) {
    return apiClient.get(`/submissions/${id}`);
  },

  // ✅ پیگیری با کد — endpoint عمومی
  async trackByCode(trackingCode) {
    return apiClient.get(`/submissions/track/${trackingCode}`);
  },

  async create(submissionData) {
    return apiClient.post("/submissions", submissionData);
    // پاسخ: { success, message, trackingCode }
  },

  async updateStatus(id, status) {
    return apiClient.patch(`/submissions/${id}/status`, { status });
  },

  async remove(id) {
    return apiClient.delete(`/submissions/${id}`);
  },

  // ✅ آپلود فایل اثر واقعی
  async uploadFile(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.upload(`/upload/submissions/${id}/file`, formData);
  },

  async setAll() {
    console.warn("submissionsService.setAll در نسخه API استفاده نمی‌شود");
  },
};

export default submissionsService;
