/**
 * settingsService.js — فرانت
 * مسیر فایل: src/services/settingsService.js
 */
import apiClient from "./apiClient.js";

const settingsService = {
  // دریافت همه تنظیمات (عمومی)
  async getAll() {
    return apiClient.get("/settings");
    // پاسخ: { success, settings: { general, hero, contact, ... } }
  },

  // دریافت یک بخش خاص
  async getByKey(key) {
    return apiClient.get(`/settings/${key}`);
  },

  // آپدیت یک بخش (ادمین)
  async updateByKey(key, value) {
    return apiClient.put(`/settings/${key}`, value);
  },

  // آپدیت چندین بخش با هم (ادمین)
  async updateMany(updates) {
    return apiClient.put("/settings", updates);
  },

  // ─── سازگاری با کد قدیمی useSiteSettings ────────────────────────────────
  async getSettings(defaults) {
    try {
      const res = await this.getAll();
      // ادغام تنظیمات دریافتی با مقادیر پیش‌فرض
      const merged = { ...defaults };
      Object.values(res.settings || {}).forEach((section) => {
        Object.assign(merged, section);
      });
      return merged;
    } catch {
      return defaults;
    }
  },

  async updateSettings(updates) {
    // تشخیص بخش مناسب و آپدیت آن
    return apiClient.put("/settings", { general: updates });
  },

  async getCredentials(defaults) {
    // credentials در بکند مدیریت می‌شود — از auth/me استفاده کن
    try {
      const res = await apiClient.get("/auth/me");
      return {
        ...defaults,
        adminUsername: res.admin?.username || defaults.adminUsername,
      };
    } catch {
      return defaults;
    }
  },

  async updateCredentials(updates) {
    if (updates.adminPassword) {
      return apiClient.put("/auth/password", {
        newPassword:     updates.adminPassword,
        confirmPassword: updates.adminPassword,
        currentPassword: updates.currentPassword || "",
      });
    }
    if (updates.adminUsername) {
      return apiClient.put("/auth/username", { username: updates.adminUsername });
    }
  },
};

export default settingsService;
