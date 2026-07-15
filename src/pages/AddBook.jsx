import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import booksService from "../services/booksService";
import ImageUploader from "../components/ui/ImageUploader";
import toast from "react-hot-toast";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

const EDITIONS = ["اول","دوم","سوم","چهارم","پنجم","ششم","هفتم","هشتم","نهم","دهم"];
const COVER_TYPES = ["شومیز", "گالینگور", "سلفون براق", "سلفون مات"];
const TRIM_SIZES  = ["رقعی", "وزیری", "رحلی", "جیبی", "پالتویی"];
// ✅ تبدیل base64 (خروجی ImageUploader در حالت آپلود) به File برای ارسال multipart
function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

const EMPTY_FORM = {
  title: "", author: "", description: "", category: "",
  pages: "", year: "", image: "", isAudio: false,
  // ✅ فیلدهای جدید
  price: "", isbn: "", edition: "اول", publisherCity: "قم", coverType: "", trimSize: "",
};

function AddBook() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error("عنوان و نویسنده کتاب الزامی است");
      return;
    }

    // ✅ اعتبارسنجی شابک — هماهنگ با بک‌اند (۱۰ یا ۱۳ رقم)
    if (formData.isbn && !/^\d{10,13}$/.test(formData.isbn)) {
      toast.error("شابک باید ۱۰ یا ۱۳ رقم عدد باشد");
      return;
    }

    setIsSubmitting(true);

    try {
      const isUploadedImage = formData.image && formData.image.startsWith("data:");

      const payload = {
        title:         formData.title.trim(),
        authorName:    formData.author.trim(),
        description:   formData.description.trim() || undefined,
        category:      formData.category.trim() || undefined,
        pages:         formData.pages ? Number(formData.pages) : undefined,
        year:          formData.year ? Number(formData.year) : undefined,
        isAudio:       formData.isAudio || false,
        price:         formData.price ? Number(formData.price) : null,
        isbn:          formData.isbn.trim() || undefined,
        edition:       formData.edition || undefined,
        publisherCity: formData.publisherCity.trim() || undefined,
        coverType:     formData.coverType || undefined,
        trimSize:      formData.trimSize || undefined,
        // ✅ اگر کاربر لینک تصویر وارد کرده (نه آپلود فایل)، همینجا بفرست
        ...(formData.image && !isUploadedImage ? { image: formData.image } : {}),
      };

      // ✅ ساخت واقعی کتاب در بک‌اند
      const result = await booksService.create(payload);

      // ✅ اگر تصویری از دستگاه آپلود شده، حالا که id کتاب را داریم آن را ارسال کن
      if (isUploadedImage && result?.book?.id) {
        try {
          const file = dataUrlToFile(formData.image, "cover.jpg");
          await booksService.uploadImage(result.book.id, file);
        } catch (imgErr) {
          toast.error("کتاب ذخیره شد، ولی آپلود تصویر جلد با خطا مواجه شد.");
        }
      }

      toast.success(`کتاب "${payload.title}" با موفقیت اضافه شد!`);
      navigate("/admin/books");
    } catch (err) {
      console.error("خطا در افزودن کتاب:", err);
      toast.error(err.message || "خطایی در ذخیره کتاب رخ داد");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

      {/* هدر */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          to="/admin/books"
          className="w-10 h-10 rounded-xl border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-primary">افزودن</span>
            <span className="text-accent"> کتاب</span>
          </h1>
          <div className="w-12 h-1 bg-accent rounded-full mt-1" />
          <p className="mt-1 text-text-secondary text-sm">اطلاعات کتاب جدید را وارد کنید</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ─── عنوان + نویسنده ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">عنوان کتاب *</label>
              <input type="text" name="title" required value={formData.title}
                onChange={handleChange} placeholder="عنوان کتاب" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">نام نویسنده *</label>
              <input type="text" name="author" required value={formData.author}
                onChange={handleChange} placeholder="نام نویسنده" className={INPUT_CLS} />
            </div>
          </div>

          {/* ─── دسته‌بندی ─── */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">دسته‌بندی</label>
            <input type="text" name="category" value={formData.category}
              onChange={handleChange} placeholder="مثال: حقوق، ادبیات، ..." className={INPUT_CLS} />
          </div>

          {/* ─── تصویر ─── */}
          <ImageUploader
            value={formData.image}
            onChange={(val) => setFormData((prev) => ({ ...prev, image: val }))}
            label="تصویر جلد کتاب"
          />

          {/* ─── صفحات + سال + صوتی ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">تعداد صفحات</label>
              <input type="number" name="pages" value={formData.pages}
                onChange={handleChange} min="0" placeholder="۳۲۰" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">سال انتشار</label>
              <input type="number" name="year" value={formData.year}
                onChange={handleChange} min="1300" max="1500" placeholder="۱۴۰۴" className={INPUT_CLS} />
            </div>
            <div className="flex items-center pt-6 col-span-2 sm:col-span-1">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
                <input type="checkbox" name="isAudio" checked={formData.isAudio}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded border-primary-light/30 focus:ring-accent" />
                کتاب صوتی
              </label>
            </div>
          </div>

          {/* ─── بخش اطلاعات نشر ─── */}
          <div className="border-t-2 border-dashed border-primary-light/20 pt-5">
            <p className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              اطلاعات نشر
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* ✅ قیمت */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  قیمت (تومان)
                  <span className="text-text-muted font-normal mr-1">— خالی = تماس برای خرید</span>
                </label>
                <input type="number" name="price" value={formData.price}
                  onChange={handleChange} min="0" placeholder="مثال: 250000"
                  className={INPUT_CLS} />
              </div>

              {/* ✅ شابک */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  شابک (ISBN)
                  <span className="text-text-muted font-normal mr-1">— ۱۳ رقم</span>
                </label>
                <input type="text" name="isbn" value={formData.isbn}
                  onChange={handleChange} placeholder="9786001234567"
                  maxLength={13} dir="ltr"
                  className={INPUT_CLS} />
              </div>

              {/* ✅ شماره چاپ */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره چاپ</label>
                <select name="edition" value={formData.edition} onChange={handleChange} className={INPUT_CLS}>
                  {EDITIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* ✅ محل نشر */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">محل نشر</label>
                <input type="text" name="publisherCity" value={formData.publisherCity}
                  onChange={handleChange} placeholder="مثال: تهران"
                  className={INPUT_CLS} />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">نوع جلد</label>
                <select name="coverType" value={formData.coverType} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">— انتخاب کنید —</option>
                  {COVER_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">قطع کتاب</label>
                <select name="trimSize" value={formData.trimSize} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">— انتخاب کنید —</option>
                  {TRIM_SIZES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

            </div>
          </div>

          {/* ─── توضیحات ─── */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">توضیحات کتاب</label>
            <textarea name="description" rows="5" value={formData.description}
              onChange={handleChange} placeholder="توضیحات کامل کتاب را وارد کنید..."
              className={`${INPUT_CLS} resize-none`} />
          </div>

          {/* ─── دکمه‌ها ─── */}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 btn-gold flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  در حال ذخیره...
                </>
              ) : "ذخیره کتاب"}
            </button>
            <Link to="/admin/books" className="btn-outline flex items-center justify-center px-8">
              انصراف
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddBook;
