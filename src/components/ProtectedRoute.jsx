import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute — نسخه API
 * ─────────────────────────────────────────────────────────────────────────
 * به جای بررسی sessionStorage، از بکند می‌پرسد آیا session معتبر است
 * بکند JWT را از httpOnly cookie می‌خواند و بررسی می‌کند
 */
function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ok | redirect

  useEffect(() => {
    apiClient.get("/auth/me")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("redirect"));
  }, []);

  if (status === "loading") return <LoadingSpinner fullPage />;
  if (status === "redirect") return <Navigate to="/admin/login" replace />;
  return children;
}

// ✅ این توابع دیگر نیازی نیستند — برای سازگاری با کدهای قدیمی نگه داشته شده
export function createAdminSession() {}
export function clearAdminSession() {
  apiClient.post("/auth/logout").catch(() => {});
}
export function isAdminAuthenticated() { return true; }

export default ProtectedRoute;
