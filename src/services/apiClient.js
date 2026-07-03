/**
 * apiClient.js
 * ─────────────────────────────────────────────────────────────────────────
 * جایگزین storageClient.js — ارتباط با بکند واقعی از طریق fetch
 * مسیر فایل: src/services/apiClient.js
 *
 * ✅ یک نقطه مرکزی برای همه درخواست‌های HTTP
 * تمام service های فرانت از این فایل استفاده می‌کنند
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * درخواست HTTP پایه
 * - به صورت خودکار JSON header اضافه می‌کند
 * - credentials: "include" برای ارسال httpOnly cookie (JWT)
 * - خطاهای HTTP را throw می‌کند
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    credentials: "include", // ✅ برای ارسال cookie JWT
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // اگر body یک FormData است، Content-Type را حذف کن
  // (مرورگر خودکار boundary را تنظیم می‌کند)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const res = await fetch(url, config);

  // ✅ پاسخ را parse کن
  const data = await res.json().catch(() => ({
    success: false,
    message: "خطا در پردازش پاسخ سرور",
  }));

  // اگر HTTP status خطا بود، throw کن
  if (!res.ok) {
    const error = new Error(data.message || `خطای HTTP ${res.status}`);
    error.status = res.status;
    error.data   = data;
    throw error;
  }

  return data;
}

// ─── متدهای کمکی ─────────────────────────────────────────────────────────────
const apiClient = {
  get:    (endpoint)         => request(endpoint, { method: "GET" }),
  post:   (endpoint, body)   => request(endpoint, { method: "POST",   body: JSON.stringify(body) }),
  put:    (endpoint, body)   => request(endpoint, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  (endpoint, body)   => request(endpoint, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: (endpoint)         => request(endpoint, { method: "DELETE" }),

  // ✅ آپلود فایل با FormData
  upload: (endpoint, formData) =>
    request(endpoint, { method: "POST", body: formData }),
};

export default apiClient;
