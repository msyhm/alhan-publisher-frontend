import userApiClient from "./userApiClient.js";

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
};

export default ordersService;