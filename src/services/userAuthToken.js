const TOKEN_KEY = "alhan_user_token";

export function getUserToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setUserToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}
export function clearUserToken() {
  localStorage.removeItem(TOKEN_KEY);
}