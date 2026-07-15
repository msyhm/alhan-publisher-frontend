import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useBooks from "../hooks/useBooks";
import booksService from "../services/booksService";
import ImageUploader from "../components/ui/ImageUploader";
import toast from "react-hot-toast";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

const EDITIONS = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم"];
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

// ✅ گالری تصاویر بیشتر — آپلود/حذف مستقل از فرم اصلی (چون به id کتاب نیاز دارد که در حالت ویرایش موجود است)
function GallerySection({ bookId, images }) {
  const [gallery, setGallery] = useState(Array.isArray(images) ? images : []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setGallery(Array.isArray(images) ? images : []);
  }, [images]);

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await booksService.uploadGalleryImages(bookId, files);
      setGallery(Array.isArray(res?.images) ? res.images : gallery);
      toast.success(`${files.length} تصویر اضافه شد`);
    } catch (err) {
      toast.error(err.message || "خطا در آپلود تصاویر");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (url) => {
    if (!window.confirm("این تصویر از گالری حذف شود؟")) return;
    try {
      const res = await booksService.deleteGalleryImage(bookId, url);
      setGallery(Array.isArray(res?.images) ? res.images : gallery.filter((u) => u !== url));
      toast.success("تصویر حذف شد");
    } catch (err) {
      toast.error(err.message || "خطا در حذف تصویر");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">
        گالری تصاویر بیشتر
        <span className="text-text-muted font-normal mr-1">— علاوه بر تصویر جلد اصلی</span>
      </label>

      {gallery.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {gallery.map((url) => (
            <div key={url} className="relative w-20 h-28 rounded-lg overflow-hidden border-2 border-primary-light/20 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(url)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        className={`inline-flex items-center gap-2 border-2 border-dashed border-primary-light/30 rounded-xl px-4 py-2.5 cursor-pointer hover:border-accent transition-colors text-sm text-text-secondary ${
          uploading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {uploading ? "در حال آپلود..." : "افزودن تصویر"}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
      </label>
    </div>
  );
}

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useBooks();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    coverType: "",
    trimSize: "",
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
        price:         book.price         ?? "",
        isbn:          book.isbn          ?? "",
        edition:       book.edition       ?? "اول",
        publisherCity: book.publisherCity ?? "قم",
        coverType:     book.coverType     ?? "",
        trimSize:      book.trimSize      ?? "",
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
        ...(formData.image && !isUploadedImage ? { image: formData.image } : {}),
      };

      await booksService.update(id, payload);

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

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">دسته‌بندی</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className={INPUT_CLS} />
          </div>

          <ImageUploader
            value={formData.image}
            onChange={(val) => setFormData((prev) => ({ ...prev, image: val }))}
            label="تصویر جلد کتاب"
          />

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

          <div className="border-t-2 border-dashed border-primary-light/20 pt-5">
            <p className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              اطلاعات نشر
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره چاپ</label>
                <select name="edition" value={formData.edition} onChange={handleChange} className={INPUT_CLS}>
                  {EDITIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">محل نشر</label>
                <input
                  type="text" name="publisherCity" value={formData.publisherCity}
                  onChange={handleChange} placeholder="مثال: تهران"
                  className={INPUT_CLS}
                />
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

          <GallerySection bookId={id} images={book.images} />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">توضیحات کتاب</label>
            <textarea
              name="description" rows="5" value={formData.description}
              onChange={handleChange}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

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