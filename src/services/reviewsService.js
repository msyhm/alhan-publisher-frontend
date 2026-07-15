import apiClient from "./apiClient.js";

const reviewsService = {
  async getForBook(bookId) {
    return apiClient.get(`/books/${bookId}/reviews`);
  },
  async create(bookId, data) {
    return apiClient.post(`/books/${bookId}/reviews`, data);
  },
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/reviews${query ? `?${query}` : ""}`);
  },
  async updateStatus(id, status) {
    return apiClient.patch(`/reviews/${id}/status`, { status });
  },
  async remove(id) {
    return apiClient.delete(`/reviews/${id}`);
  },
};

export default reviewsService;