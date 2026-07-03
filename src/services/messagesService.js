/**
 * messagesService.js — فرانت
 * مسیر فایل: src/services/messagesService.js
 */
import apiClient from "./apiClient.js";

const messagesService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/messages${query ? `?${query}` : ""}`);
    // پاسخ: { success, messages, unreadCount, pagination }
  },

  async getById(id) {
    return apiClient.get(`/messages/${id}`);
    // ✅ بکند خودکار isRead=true می‌کند هنگام باز کردن
  },

  async create(messageData) {
    return apiClient.post("/messages", messageData);
  },

  async markAsRead(id) {
    // ✅ در بکند، getById خودکار خوانده می‌کند
    // این متد برای سازگاری با کد قدیمی نگه داشته شده
    return apiClient.get(`/messages/${id}`);
  },

  async markAllAsRead() {
    return apiClient.patch("/messages/read-all");
    // پاسخ: { success, count, message }
  },

  async remove(id) {
    return apiClient.delete(`/messages/${id}`);
  },

  async setAll() {
    console.warn("messagesService.setAll در نسخه API استفاده نمی‌شود");
  },
};

export default messagesService;
