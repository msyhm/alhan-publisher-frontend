import { useState, useRef } from "react";
import Icon from "./Icon";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * کامپوننت آپلود تصویر با پشتیبانی از دو حالت:
 * ۱. آپلود فایل از دستگاه (تبدیل به Base64 فشرده)
 * ۲. وارد کردن لینک URL
 *
 * Props:
 *  - value: مقدار فعلی (URL یا Base64)
 *  - onChange: callback با مقدار جدید
 *  - label: برچسب فارسی (اختیاری)
 */
function ImageUploader({ value, onChange, label = "تصویر جلد کتاب" }) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // تشخیص حالت اولیه بر اساس مقدار value
  const [imageMode, setImageMode] = useState(() => {
    if (!value) return "upload";
    if (value.startsWith("data:")) return "upload";
    return "url";
  });

  // فشرده‌سازی تصویر
  const compressImage = (base64, maxWidth = 600, quality = 0.82) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = base64;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فقط فایل‌های JPG، PNG و WebP مجاز هستند");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("حجم فایل نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    setIsProcessing(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
        reader.readAsDataURL(file);
      });

      const compressed = await compressImage(base64);
      onChange(compressed); // فقط یک بار، مستقیم به والد
    } catch {
      setError("خطا در پردازش تصویر. لطفاً دوباره امتحان کنید.");
    } finally {
      setIsProcessing(false);
      // ریست input تا بتوان دوباره همان فایل را انتخاب کرد
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (url) => {
    setError("");
    onChange(url);
  };

  const clearImage = () => {
    setError("");
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchMode = (mode) => {
    setImageMode(mode);
    setError("");
    // پاک کردن مقدار فعلی هنگام تغییر حالت
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // مقدار نمایشی در حالت URL (base64 را نشان نده)
  const urlInputValue =
    imageMode === "url" && value && !value.startsWith("data:") ? value : "";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>

      {/* سوئیچ حالت */}
      <div className="flex rounded-xl overflow-hidden border-2 border-primary-light/30 w-fit">
        <button
          type="button"
          onClick={() => switchMode("upload")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            imageMode === "upload"
              ? "bg-primary text-white"
              : "bg-white text-text-secondary hover:bg-primary-bg"
          }`}
        >
          <Icon name="upload" size={15} strokeWidth={1.5} className="inline-block ml-1" />
          آپلود از دستگاه
        </button>
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            imageMode === "url"
              ? "bg-primary text-white"
              : "bg-white text-text-secondary hover:bg-primary-bg"
          }`}
        >
          <Icon name="link" size={15} strokeWidth={1.5} className="inline-block ml-1" />
          لینک اینترنتی
        </button>
      </div>

      {/* ───── حالت آپلود فایل ───── */}
      {imageMode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!value ? (
            /* ناحیه کلیک / کشیدن */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary-light/40 rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <Icon
                name="image"
                size={36}
                strokeWidth={1}
                className="mx-auto mb-3 text-primary/30"
              />
              <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">
                کلیک کنید یا تصویر را اینجا بکشید
              </p>
              <p className="text-xs text-text-muted mt-1">
                JPG، PNG، WebP — حداکثر ۲ مگابایت
              </p>
            </div>
          ) : (
            /* پیش‌نمایش */
            <div className="flex items-start gap-4">
              <img
                src={value}
                alt="پیش‌نمایش جلد"
                className="w-28 h-40 object-cover rounded-xl shadow-lg border-2 border-primary-light/20"
              />
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <Icon name="check" size={14} strokeWidth={2} />
                  تصویر بارگذاری شد
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-lg border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                >
                  تغییر تصویر
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all"
                >
                  حذف تصویر
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <p className="text-xs text-accent mt-2 flex items-center gap-1.5">
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              در حال پردازش تصویر...
            </p>
          )}
        </div>
      )}

      {/* ───── حالت URL ───── */}
      {imageMode === "url" && (
        <div className="space-y-2">
          <input
            type="url"
            value={urlInputValue}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
            placeholder="https://example.com/book-cover.jpg"
            dir="ltr"
          />
          {value && !value.startsWith("data:") && (
            <div className="flex items-start gap-4">
              <img
                src={value}
                alt="پیش‌نمایش جلد"
                className="w-28 h-40 object-cover rounded-xl shadow-lg border-2 border-primary-light/20"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/300x450/1E3A34/ffffff?text=خطا+در+بارگذاری";
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="mt-1 text-xs px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      )}

      {/* پیام خطا */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <Icon name="warning" size={14} strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUploader;
