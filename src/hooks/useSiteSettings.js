import { useState, useEffect, useCallback } from "react";
import settingsService from "../services/settingsService";

const DEFAULT_UNIVERSITIES = [
  { id: 1, name: "دانشگاه تهران", logo: "" },
  { id: 2, name: "دانشگاه فردوسی مشهد", logo: "" },
  { id: 3, name: "دانشگاه حضرت معصومه (ع)", logo: "" },
  { id: 4, name: "دانشگاه قم", logo: "" },
  { id: 5, name: "دانشگاه حکیم سبزواری", logo: "" },
  { id: 6, name: "مجتمع آموزش عالی فنی و مهندسی اسفراین", logo: "" },
  { id: 7, name: "دانشگاه آزاد اسلامی", logo: "" },
  { id: 8, name: "دانشگاه پیام نور", logo: "" },
];

const DEFAULT_SETTINGS = {
  publisherName: "انتشارات",
  publisherNameAccent: "الحان",
  logoLetter: "آ",
  slogan: "ناشر آثار علمی، دانشگاهی و فرهنگی با هدف ارتقای دانش و فرهنگ در جامعه",
  foundingYear: "۱۳۹۸",
  publishLicense: "۱۴۹۳۳",
  heroSubtitle: "ناشر آثار علمی، دانشگاهی، فرهنگی و ادبی با هدف ارتقای دانش و فرهنگ در جامعه",
  featuredBookId: null,
  universities: DEFAULT_UNIVERSITIES,
  aboutText: "انتشارات الحان با هدف انتشار آثار علمی، دانشگاهی و فرهنگی فعالیت می‌کند و تاکنون ده‌ها اثر ارزشمند را منتشر کرده است.",
  vision:  "تبدیل به یکی از برترین ناشران علمی",
  mission: "انتشار آثار ارزشمند و ارتقای دانش",
  values:  "اصالت، کیفیت و نوآوری",
  address:  "قم، زنبیل‌آباد، ۳۰ متری قائم، پلاک ۱۸۳",
  phone:    "۰۲۵-۳۲۷۰۱۱۲۶",
  phoneRaw: "02532701126",
  email:    "alhannasher@gmail.com",
  instagram: "https://instagram.com/AlhanPublish",
  telegram:  "https://t.me/AlhanPublish",
  shippingCost: 50000,
};

const DEFAULT_CREDENTIALS = {
  adminUsername: "admin",
  adminPassword: "123456",
};

// ─── Hook اصلی تنظیمات ───────────────────────────────────────────────────────
function useSiteSettings() {
  const [settings, setSettingsState] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await settingsService.getSettings(DEFAULT_SETTINGS);
        if (!cancelled) setSettingsState(data && typeof data === 'object' ? data : DEFAULT_SETTINGS);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت تنظیمات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateSettings = useCallback(async (updates) => {
    setSettingsState((prev) => {
      const merged = { ...prev, ...updates };
      // ذخیره async در پس‌زمینه — بدون بلاک کردن UI
      settingsService.updateSettings(updates, prev).catch((err) =>
        setError(err.message || "خطا در ذخیره تنظیمات")
      );
      return merged;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      await settingsService.resetSettings(DEFAULT_SETTINGS);
      setSettingsState(DEFAULT_SETTINGS);
    } catch (err) {
      setError(err.message || "خطا در بازنشانی تنظیمات");
    }
  }, []);

  return { settings, updateSettings, resetSettings, loading, error };
}

// ─── Hook جداگانه برای credentials ──────────────────────────────────────────
export function useAdminCredentials() {
  const [credentials, setCredentialsState] = useState(DEFAULT_CREDENTIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await settingsService.getCredentials(DEFAULT_CREDENTIALS);
        if (!cancelled) setCredentialsState(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ FIX: قبلاً این تابع خطای بک‌اند را با .catch(console.error) قورت
  // می‌داد و همیشه state محلی را به‌روزرسانی می‌کرد — یعنی حتی اگر رمز
  // فعلی اشتباه بود یا سرور خطا می‌داد، فرم موفقیت نشان می‌داد. حالا واقعاً
  // منتظر پاسخ سرور می‌مانیم و فقط در صورت موفقیت state را به‌روز می‌کنیم.
  const updateCredentials = useCallback(async (updates) => {
    const res = await settingsService.updateCredentials(updates, credentials);
    setCredentialsState((prev) => ({ ...prev, ...updates }));
    return res;
  }, [credentials]);

  const verifyPassword = useCallback(
    (password) => credentials.adminPassword === password,
    [credentials]
  );

  return { credentials, updateCredentials, verifyPassword, loading };
}

export default useSiteSettings;
