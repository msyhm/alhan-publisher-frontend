/**
 * booksService.js — فرانت
 * ─────────────────────────────────────────────────────────────────────────
 * مسیر فایل: src/services/booksService.js
 * جایگزین نسخه localStorage — حالا با apiClient به بکند واقعی وصل است
 */
import apiClient from "./apiClient.js";

const booksService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/books${query ? `?${query}` : ""}`);
    // پاسخ: { success, books, pagination }
  },

  async getById(id) {
    return apiClient.get(`/books/${id}`);
    // پاسخ: { success, book }
  },

  async getCategories() {
    return apiClient.get("/books/categories");
    // پاسخ: { success, categories }
  },

  async create(bookData) {
    return apiClient.post("/books", bookData);
    // پاسخ: { success, message, book }
  },

  async update(id, updates) {
    return apiClient.put(`/books/${id}`, updates);
  },

  async remove(id) {
    return apiClient.delete(`/books/${id}`);
  },

  // ✅ آپلود تصویر جلد — جایگزین Base64 در localStorage
  async uploadImage(id, file) {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.upload(`/upload/books/${id}/image`, formData);
    // پاسخ: { success, imageUrl, book }
  },

  async deleteImage(id) {
    return apiClient.delete(`/upload/books/${id}/image`);
  },

  // ✅ سازگاری با کد قدیمی useBooks — setAll دیگر نیازی نیست
  async setAll() {
    console.warn("booksService.setAll در نسخه API استفاده نمی‌شود");
  },
};

export default booksService;
