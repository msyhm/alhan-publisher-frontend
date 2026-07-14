/**
 * reviewsService.js
 * ⚠️ این سرویس به endpointهایی نیاز دارد که هنوز روی بک‌اند ساخته نشده‌اند:
 *   GET  /api/books/:bookId/reviews
 *   POST /api/books/:bookId/reviews
 * تا وقتی این دو مسیر ساخته نشوند، خطای ۴۰۴ می‌گیرند (که فرانت graceful هندلش می‌کند).
 */
import apiClient from "./apiClient.js";

const reviewsService = {
  async getForBook(bookId) {
    return apiClient.get(`/books/${bookId}/reviews`);
  },
  async create(bookId, data) {
    return apiClient.post(`/books/${bookId}/reviews`, data);
  },
};

export default reviewsService;