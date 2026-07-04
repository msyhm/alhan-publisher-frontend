import PageMeta from "../components/PageMeta";
import Icon from "../components/ui/Icon";
import { useState, useRef } from "react";
import submissionsService from "../services/submissionsService";
import { toast } from "react-hot-toast";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white";

const categories = ["علمی","دانشگاهی","ادبی","شعر","رمان","تاریخی","فلسفی","سیاسی","اجتماعی","سایر"];

// فرمت‌های مجاز فایل
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE_MB = 20;

const EMPTY_FORM = {
  fullName: "", email: "", phone: "", title: "",
  category: categories[0], summary: "", description: "",
  hasPublished: false, agreeTerms: false,
};

// ─── کامپوننت آپلود فایل ────────────────────────────────────────────────────
function FileUploader({ file, onChange }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = (f) => {
    if (!f) return false;
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error("فقط فایل‌های PDF، DOC و DOCX مجاز هستند");
      return false;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`حجم فایل نباید بیشتر از ${MAX_FILE_SIZE_MB} مگابایت باشد`);
      return false;
    }
    return true;
  };

  const handleFile = (f) => {
    if (validate(f)) onChange(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        فایل اثر
        <span className="text-text-muted font-normal mr-1">— PDF، DOC، DOCX (حداکثر ۲۰ مگابایت)</span>
      </label>

      {/* ناحیه drag & drop */}
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all ${
          file
            ? "border-green-300 bg-green-50/50"
            : isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-primary-light/30 bg-primary-bg/20 hover:border-accent hover:bg-accent/5 cursor-pointer"
        }`}
      >
        {file ? (
          /* فایل انتخاب شده */
          <div className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-primary text-sm truncate">{file.name}</p>
              <p className="text-xs text-text-muted mt-0.5">{formatSize(file.size)}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-green-700 font-medium">فایل آماده ارسال است</span>
              </div>
            </div>
            {/* دکمه حذف / تغییر */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="text-xs text-accent font-bold hover:underline"
              >
                تغییر
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="text-xs text-red-500 font-bold hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
        ) : (
          /* حالت خالی */
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all ${
              isDragging ? "bg-accent/20" : "bg-primary-bg"
            }`}>
              <svg className={`w-7 h-7 transition-colors ${isDragging ? "text-accent" : "text-primary/40"}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="font-bold text-primary text-sm">
              {isDragging ? "فایل را اینجا رها کنید" : "فایل را اینجا بکشید یا کلیک کنید"}
            </p>
            <p className="text-xs text-text-muted mt-1">PDF، DOC، DOCX — حداکثر ۲۰ مگابایت</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

// ─── صفحه اصلی ─────────────────────────────────────────────────────────────
function SubmitBook() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error("لطفاً با قوانین و مقررات موافقت کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ ارسال واقعی به بک‌اند (endpoint عمومی — نیاز به لاگین ندارد)
      const { fullName, email, phone, title, category, summary, description, hasPublished } = formData;
      const result = await submissionsService.create({
        fullName, email, phone, title, category, summary, description, hasPublished,
      });

      // ✅ اگر فایلی انتخاب شده، حالا که id اثر را داریم آن را آپلود کن
      if (uploadedFile && result?.id) {
        try {
          await submissionsService.uploadFile(result.id, uploadedFile);
        } catch (uploadErr) {
          toast.error("اثر ثبت شد، ولی آپلود فایل با خطا مواجه شد. لطفاً بعداً با پشتیبانی تماس بگیرید.");
        }
      }

      setTrackingCode(result?.trackingCode || null);
      setSubmitted(true);
      toast.success("اثر شما با موفقیت ثبت شد!");
    } catch (err) {
      toast.error(err.message || "خطا در ثبت اثر. لطفاً دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData(EMPTY_FORM);
    setUploadedFile(null);
    setTrackingCode(null);
  };

  // ─── صفحه موفقیت ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <div className="bg-white rounded-3xl shadow-elegant p-10 sm:p-14 text-center animate-fade-scale">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">اثر شما ثبت شد</h1>
          <div className="divider-gold-center" />

          <div className="mt-6 bg-primary-bg rounded-2xl p-5 inline-block">
            <p className="text-sm text-text-muted">کد پیگیری</p>
            <p className="text-2xl font-bold text-accent">{trackingCode}</p>
          </div>

          {uploadedFile && (
            <div className="mt-4 bg-green-50 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>فایل «{uploadedFile.name}» ثبت شد</span>
            </div>
          )}

          <p className="mt-6 text-text-secondary leading-relaxed max-w-lg mx-auto">
            از ارسال اثر خود متشکریم. کارشناسان ما در اسرع وقت اثر شما را بررسی کرده
            و نتیجه را از طریق ایمیل یا تماس تلفنی اطلاع خواهند داد.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleReset} className="btn-gold inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ارسال اثر دیگر
            </button>
            <a href="/" className="btn-outline inline-flex items-center justify-center gap-2">
              بازگشت به صفحه اصلی
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── فرم ارسال ──────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta title="ارسال اثر" description="اثر خود را برای بررسی و انتشار به انتشارات الحان ارسال کنید" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* هدر */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-full text-primary text-sm mb-4">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          نویسندگان و پژوهشگران
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-primary">ارسال</span>
          <span className="text-accent"> اثر</span>
        </h1>
        <div className="divider-gold-center mt-4" />
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
          اطلاعات اثر خود را برای بررسی به انتشارات الحان ارسال کنید.
          پس از ثبت، کد پیگیری دریافت خواهید کرد.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─── اطلاعات شخصی ─── */}
          <div className="bg-primary-bg/30 rounded-2xl p-6">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full" />
              اطلاعات شخصی
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">نام و نام خانوادگی *</label>
                <input type="text" name="fullName" required value={formData.fullName}
                  onChange={handleChange} placeholder="نام کامل خود را وارد کنید" className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">ایمیل *</label>
                <input type="email" name="email" required value={formData.email}
                  onChange={handleChange} placeholder="ایمیل خود را وارد کنید" className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره تماس *</label>
                <input type="tel" name="phone" required value={formData.phone}
                  onChange={handleChange} placeholder="شماره تماس خود را وارد کنید" className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">وضعیت انتشار قبلی</label>
                <div className="flex items-center gap-3 pt-3">
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" name="hasPublished" checked={formData.hasPublished}
                      onChange={handleChange}
                      className="w-4 h-4 text-accent rounded border-primary-light/30 focus:ring-accent" />
                    تاکنون اثری منتشر کرده‌ام
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ─── اطلاعات اثر ─── */}
          <div className="bg-primary-bg/30 rounded-2xl p-6">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full" />
              اطلاعات اثر
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">عنوان اثر *</label>
                <input type="text" name="title" required value={formData.title}
                  onChange={handleChange} placeholder="عنوان اثر خود را وارد کنید" className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">دسته‌بندی *</label>
                <select name="category" required value={formData.category}
                  onChange={handleChange} className={INPUT_CLS}>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">خلاصه اثر *</label>
              <textarea name="summary" required rows={3} value={formData.summary}
                onChange={handleChange} placeholder="خلاصه‌ای از اثر خود بنویسید (حداکثر ۲۰۰ کلمه)"
                className={`${INPUT_CLS} resize-none`} />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">توضیحات تکمیلی</label>
              <textarea name="description" rows={3} value={formData.description}
                onChange={handleChange} placeholder="اطلاعات بیشتر درباره اثر، ساختار، مخاطبان و ..."
                className={`${INPUT_CLS} resize-none`} />
            </div>
          </div>

          {/* ─── ✅ آپلود فایل ─── */}
          <div className="bg-primary-bg/30 rounded-2xl p-6">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full" />
              فایل اثر
            </h3>
            <FileUploader file={uploadedFile} onChange={setUploadedFile} />
            <p className="text-xs text-text-muted mt-3 flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ارسال فایل اختیاری است. در صورت عدم آپلود، کارشناسان ما با شما تماس خواهند گرفت.
            </p>
          </div>

          {/* ─── قوانین ─── */}
          <div className="bg-primary-bg/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <input type="checkbox" name="agreeTerms" required checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-5 h-5 mt-1 text-accent rounded border-primary-light/30 focus:ring-accent shrink-0" />
              <div>
                <label className="text-sm text-text-secondary cursor-pointer">
                  با <span className="text-primary font-bold">قوانین و مقررات</span> انتشارات الحان موافقت می‌کنم.
                </label>
                <p className="text-xs text-text-muted mt-1">
                  اثر ارسالی باید اصلی و بدون سرقت ادبی باشد. انتشارات الحان حق استفاده
                  از اثر را پس از بررسی و تأیید دارد.
                </p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full btn-gold flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال ثبت...
              </>
            ) : (
              <>
                <span>ارسال اثر</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  </>
  );
}

export default SubmitBook;
