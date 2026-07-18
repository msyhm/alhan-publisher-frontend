import userApiClient from "./userApiClient.js";

const favoritesService = {
  async getAll() {
    return userApiClient.get("/favorites");
  },
  async add(bookId) {
    return userApiClient.post(`/favorites/${bookId}`, {});
  },
  async remove(bookId) {
    return userApiClient.delete(`/favorites/${bookId}`);
  },
};

export default favoritesService;