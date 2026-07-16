import userApiClient from "./userApiClient.js";
import { setUserToken, clearUserToken } from "./userAuthToken.js";

const authService = {
  async register({ name, email, phone, password }) {
    const res = await userApiClient.post("/users/register", { name, email, phone, password });
    setUserToken(res.token);
    return res.user;
  },
  async login({ email, password }) {
    const res = await userApiClient.post("/users/login", { email, password });
    setUserToken(res.token);
    return res.user;
  },
  logout() {
    clearUserToken();
  },
  async me() {
    const res = await userApiClient.get("/users/me");
    return res.user;
  },
};

export default authService;