import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useBooks from "../hooks/useBooks";
import booksService from "../services/booksService";
import ImageUploader from "../components/ui/ImageUploader";
import toast from "react-hot-toast";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

const EDITIONS = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم"];

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

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useBooks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ همه useState‌ها قبل از هر شرط — فیلدهای جدید اضافه شدند
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    pages: "",
    year: "",
    image: "",
    isAudio: false,
    price: "",
    isbn: "",
    edition: "اول",
    publisherCity: "قم",
  });

  const book = Array.isArray(books)
    ? books.find((item) => String(item.id) === id)
    : null;

  useEffect(() => {
    if (book) {
      setFormData({
        title:         book.title         || "",
        author:        book.authorName    || "",
        description:   book.description   || "",
        category:      book.category      || "",
        pages:         book.pages         || "",
        year:          book.year          || "",
        image:         book.image         || "",
        isAudio:       book.isAudio       || false,
        // ✅ مقداردهی فیلدهای جدید — با fallback برای کتاب‌های قدیمی
        price:         book.price         ?? "",
        isbn:          book.isbn          ?? "",
        edition:       book.edition       ?? "اول",
        publisherCity: book.publisherCity ?? "قم",
      });
    }
  }, [book?.id]);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center pt-20">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-3xl font-bold text-primary">کتاب پیدا نشد</h1>
        <p className="text-text-muted mt-2">کتاب مورد نظر در سیستم موجود نیست</p>
        <Link to="/admin/books" className="mt-6 inline-block btn-gold">
          بازگشت به مدیریت
        </Link>
      </div>
    );
  }

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

    // اعتبارسنجی شابک — هماهنگ با بک‌اند (۱۰ یا ۱۳ رقم)
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
        // ✅ اگر کاربر لینک تصویر وارد کرده (نه آپلود فایل)، همینجا بفرست
        ...(formData.image && !isUploadedImage ? { image: formData.image } : {}),
      };

      // ✅ ویرایش واقعی در بک‌اند
      await booksService.update(id, payload);

      // ✅ اگر تصویر جدیدی از دستگاه آپلود شده، همین حالا ارسالش کن
      if (isUploadedImage) {
        try {
          const file = dataUrlToFile(formData.image, "cover.jpg");
          await booksService.uploadImage(id, file);
        } catch (imgErr) {
          toast.error("تغییرات ذخیره شد، ولی آپلود تصویر جلد با خطا مواجه شد.");
        }
      }

      toast.success(`کتاب "${formData.title}" با موفقیت ویرایش شد!`);
      navigate("/admin/books");
    } catch (err) {
      console.error("خطا در ویرایش کتاب:", err);
      toast.error(err.message || "خطایی در ویرایش کتاب رخ داد");
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
            <span className="text-primary">ویرایش</span>
            <span className="text-accent"> کتاب</span>
          </h1>
          <div className="w-12 h-1 bg-accent rounded-full mt-1" />
          <p className="mt-1 text-text-secondary text-sm">
            در حال ویرایش: <span className="font-bold text-primary">{book.title}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ─── عنوان + نویسنده ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">عنوان کتاب *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">نام نویسنده *</label>
              <input type="text" name="author" required value={formData.author} onChange={handleChange} className={INPUT_CLS} />
            </div>
          </div>

          {/* ─── دسته‌بندی ─── */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">دسته‌بندی</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className={INPUT_CLS} />
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
              <input type="number" name="pages" value={formData.pages} onChange={handleChange} min="0" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">سال انتشار</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} min="1300" max="1500" className={INPUT_CLS} />
            </div>
            <div className="flex items-center pt-6 col-span-2 sm:col-span-1">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
                <input type="checkbox" name="isAudio" checked={formData.isAudio} onChange={handleChange}
                  className="w-4 h-4 text-accent rounded border-primary-light/30 focus:ring-accent" />
                کتاب صوتی
              </label>
            </div>
          </div>

          {/* ─── بخش جداکننده: اطلاعات نشر ─── */}
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
                <input
                  type="number" name="price" value={formData.price}
                  onChange={handleChange} min="0" placeholder="مثال: 250000"
                  className={INPUT_CLS}
                />
              </div>

              {/* ✅ شابک */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  شابک (ISBN)
                  <span className="text-text-muted font-normal mr-1">— ۱۳ رقم</span>
                </label>
                <input
                  type="text" name="isbn" value={formData.isbn}
                  onChange={handleChange} placeholder="9786001234567"
                  maxLength={13} dir="ltr"
                  className={INPUT_CLS}
                />
              </div>

              {/* ✅ شماره چاپ */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره چاپ</label>
                <select name="edition" value={formData.edition} onChange={handleChange} className={INPUT_CLS}>
                  {EDITIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              {/* ✅ محل نشر */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">محل نشر</label>
                <input
                  type="text" name="publisherCity" value={formData.publisherCity}
                  onChange={handleChange} placeholder="مثال: تهران"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>

          {/* ─── توضیحات ─── */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">توضیحات کتاب</label>
            <textarea
              name="description" rows="5" value={formData.description}
              onChange={handleChange}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          {/* ─── دکمه‌ها ─── */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit" disabled={isSubmitting}
              className="flex-1 btn-gold flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  در حال ذخیره...
                </>
              ) : "ذخیره تغییرات"}
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

export default EditBook;
