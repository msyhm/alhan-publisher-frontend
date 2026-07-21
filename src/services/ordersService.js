import userApiClient from "./userApiClient.js";
import apiClient from "./apiClient.js";

const ordersService = {
  async create(orderData) {
    return userApiClient.post("/orders", orderData);
  },
  async getById(id) {
    return userApiClient.get(`/orders/${id}`);
  },
  async getMine() {
    return userApiClient.get("/orders");
  },
  async getAllAdmin(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/orders/admin/all${query ? `?${query}` : ""}`);
  },
  async updateStatusAdmin(id, status) {
    return apiClient.patch(`/orders/admin/${id}/status`, { status });
  },
};

export default ordersService;