/**
 * storageClient.js
 * ─────────────────────────────────────────────────────────────────────────
 * لایه انتزاعی روی localStorage — تنها فایلی که مستقیماً با storage کار می‌کند.
 *
 * هدف: وقتی بکند آماده شد، فقط همین فایل را عوض کنید (یا به fetch وصل کنید)
 * و بقیه پروژه (services و hooks) بدون تغییر کار خواهند کرد.
 *
 * تمام متدها async هستند — حتی روی localStorage — تا رفتار با حالت API یکسان باشد
 * و کامپوننت‌ها از همین حالا برای async/await و loading state آماده شوند.
 */

const SIMULATE_DELAY_MS = 0; // برای تست لودینگ می‌توانید مثلاً 300 بگذارید

function delay(ms = SIMULATE_DELAY_MS) {
  return ms > 0 ? new Promise((res) => setTimeout(res, ms)) : Promise.resolve();
}

const storageClient = {
  /**
   * خواندن یک key از localStorage
   * @param {string} key
   * @param {*} fallback - مقدار پیش‌فرض اگر چیزی ذخیره نشده باشد
   */
  async get(key, fallback = null) {
    await delay();
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error(`[storageClient] خطا در خواندن "${key}":`, err);
      return fallback;
    }
  },

  /**
   * نوشتن یک key در localStorage
   * @param {string} key
   * @param {*} value
   */
  async set(key, value) {
    await delay();
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return { success: true };
    } catch (err) {
      console.error(`[storageClient] خطا در نوشتن "${key}":`, err);
      // احتمالاً quota پر شده (مثلاً تصاویر Base64 زیاد)
      throw new Error("فضای ذخیره‌سازی پر است. لطفاً برخی تصاویر را حذف کنید.");
    }
  },

  /**
   * حذف یک key
   * @param {string} key
   */
  async remove(key) {
    await delay();
    localStorage.removeItem(key);
    return { success: true };
  },

  /**
   * بررسی وجود یک key
   * @param {string} key
   */
  async has(key) {
    await delay();
    return localStorage.getItem(key) !== null;
  },
};

export default storageClient;
