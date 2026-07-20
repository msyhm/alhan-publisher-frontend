/**
 * settingsService.js — فرانت
 * مسیر فایل: src/services/settingsService.js
 */
import apiClient from "./apiClient.js";
import { setToken, clearToken } from "./authToken.js";

// ✅ نقشه‌ی فیلد ↔ بخش، دقیقاً منطبق با VALID_KEYS بک‌اند
// (general/hero/contact/social/about/universities)
const SECTION_FIELDS = {
  general:      ["publisherName", "publisherNameAccent", "logoLetter", "foundingYear", "slogan", "publishLicense"],
  hero:         ["heroSubtitle", "featuredBookId", "heroSlides"],
  about:        ["aboutText", "vision", "mission", "values"],
  contact:      ["address", "phone", "phoneRaw", "email"],
  social:       ["instagram", "telegram"],
  universities: ["universities"],
  shipping:     ["shippingCost"],
};

// تبدیل آبجکت تخت (flat) به بخش‌های جدا برای ذخیره در بک‌اند
function bucketize(flat) {
  const sections = {};
  for (const [section, keys] of Object.entries(SECTION_FIELDS)) {
    const value = {};
    let has = false;
    keys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(flat, k)) {
        value[k] = flat[k];
        has = true;
      }
    });
    if (has) sections[section] = value;
  }
  return sections;
}

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

  // ✅ FIX: قبلاً همه‌چیز را با کلید "general" ذخیره می‌کرد و بخش‌های
  // hero/contact/social/about/universities هیچ‌وقت واقعاً نوشته نمی‌شدند.
  // حالا هر فیلد به بخش درست خودش (مطابق VALID_KEYS بک‌اند) فرستاده می‌شود.
  async updateSettings(updates) {
    const sections = bucketize(updates);
    return apiClient.put("/settings", sections);
  },

  // ✅ FIX: این متد قبلاً اصلاً وجود نداشت — دکمه‌ی «بازنشانی تنظیمات»
  // با خطای «resetSettings is not a function» کرش می‌کرد.
  async resetSettings(defaults) {
    const sections = bucketize(defaults);
    return apiClient.put("/settings", sections);
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
      const res = await apiClient.put("/auth/password", {
        newPassword:     updates.adminPassword,
        confirmPassword: updates.adminPassword,
        currentPassword: updates.currentPassword || "",
      });
      clearToken();
      return res;
    }
    if (updates.adminUsername) {
      const res = await apiClient.put("/auth/username", { username: updates.adminUsername });
      if (res.token) setToken(res.token);
      return res;
    }
  },

};

export default settingsService;
