import PageMeta from "../components/PageMeta";
import Icon from "../components/ui/Icon";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";
import InlineError from "../components/InlineError";

// ─── مودال «تماس برای خرید» ────────────────────────────────────────────────
function BuyModal({ book, onClose }) {
  const { settings } = useSiteSettings();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-scale">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary">خرید کتاب</h2>
          <p className="text-text-muted text-sm mt-1">{book.title}</p>
        </div>

        {/* قیمت */}
        <div className="bg-primary-bg rounded-2xl p-4 text-center mb-6">
          {book.price ? (
            <>
              <p className="text-xs text-text-muted mb-1">قیمت</p>
              <p className="text-2xl font-bold text-accent">
                {Number(book.price).toLocaleString("fa-IR")} تومان
              </p>
            </>
          ) : (
            <p className="text-base font-bold text-primary">برای اطلاع از قیمت تماس بگیرید</p>
          )}
        </div>

        {/* راه‌های تماس */}
        <div className="space-y-3">
          {settings.phone && (
            <a
              href={`tel:${settings.phoneRaw || settings.phone}`}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              تماس تلفنی — {settings.phone}
            </a>
          )}
          {settings.telegram && (
            <a
              href={settings.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.47l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.837.95l-.53-.002z"/>
              </svg>
              سفارش از تلگرام
            </a>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-text-muted hover:text-primary transition-colors py-2"
        >
          بستن
        </button>
      </div>
    </div>
  );
}

// ─── ردیف اطلاعات کتاب ─────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-3 border-b border-primary-light/10 last:border-0">
      <span className="text-sm text-text-muted shrink-0 w-32">{label}</span>
      <span className="text-sm font-medium text-primary text-left">{value}</span>
    </div>
  );
}

// ─── کارت کتاب مرتبط ───────────────────────────────────────────────────────
function RelatedBookCard({ book: rel }) {
  return (
    <Link
      to={`/books/${rel.id}`}
      className="group bg-white rounded-2xl shadow-card hover:shadow-elegant-hover transition-all overflow-hidden hover:-translate-y-2"
    >
      <div className="overflow-hidden h-40">
        <img
          src={rel.image}
          alt={rel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-primary text-sm group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem]">
          {rel.title}
        </h4>
        <p className="text-xs text-text-muted mt-1 truncate">{rel.author}</p>
        <div className="flex items-center justify-between mt-2">
          {rel.edition && (
            <span className="text-[10px] bg-primary-bg text-primary px-2 py-0.5 rounded-full">
              چاپ {rel.edition}
            </span>
          )}
          {rel.price ? (
            <p className="text-xs font-bold text-accent mr-auto">
              {Number(rel.price).toLocaleString("fa-IR")} تومان
            </p>
          ) : (
            <p className="text-[10px] text-text-muted mr-auto">تماس برای خرید</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── صفحه اصلی ─────────────────────────────────────────────────────────────
function BookDetail() {
  const { id } = useParams();
  // ✅ loading واقعی از hook به جای useState ساختگی
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const [book,         setBook]         = useState(null);
  const [sameAuthor,   setSameAuthor]   = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [copied,       setCopied]       = useState(false);

  useEffect(() => {
    // ✅ تا زمانی که hook هنوز در حال لود است، منتظر می‌مانیم
    if (booksLoading) return;

    const found = books.find((item) => String(item.id) === id);
    setBook(found || null);
    if (found) {
      // ✅ جداسازی «همین نویسنده» از «همین دسته»
      const others = books.filter((b) => String(b.id) !== id);

      // اول کتاب‌های همین نویسنده
      const byAuthor = others
        .filter((b) => b.author === found.author)
        .slice(0, 4);

      // بعد کتاب‌های همین دسته (که نویسنده‌شان متفاوت است)
      const byCategory = others
        .filter((b) => b.category === found.category && b.author !== found.author)
        .slice(0, 4);

      setSameAuthor(byAuthor);
      setSameCategory(byCategory);
    }
  }, [id, books, booksLoading]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`کتاب: ${book?.title}`);
    const body = encodeURIComponent(`${book?.title} — ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // ✅ خطای دریافت کتاب‌ها
  if (booksError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <InlineError message={booksError} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (booksLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 bg-gray-200 rounded-3xl h-[500px]" />
            <div className="lg:col-span-3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center">
        <p className="text-6xl mb-4">📚</p>
        <h1 className="text-3xl font-bold text-primary">کتاب پیدا نشد</h1>
        <p className="text-text-muted mt-2">کتاب مورد نظر شما در سیستم موجود نیست</p>
        <Link to="/books" className="mt-6 inline-block btn-gold">بازگشت به کتاب‌ها</Link>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Meta داینامیک بر اساس اطلاعات هر کتاب */}
      <PageMeta
        title={book.title}
        description={book.description ? book.description.slice(0, 160) : `کتاب ${book.title} نوشته ${book.author}`}
        image={book.image}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* ===== Breadcrumb ===== */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link to="/" className="hover:text-accent transition-colors">خانه</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/books" className="hover:text-accent transition-colors">کتاب‌ها</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-secondary truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* ===== جزئیات اصلی ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

        {/* ─── ستون تصویر ─── */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <div className="relative bg-primary-bg rounded-3xl overflow-hidden shadow-elegant-hover">
              <img src={book.image} alt={book.title} className="w-full h-auto object-cover" />
              {book.category && (
                <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {book.category}
                </span>
              )}
              {book.isAudio && (
                <span className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Icon name="headphones" size={16} strokeWidth={1.75} />
                  کتاب صوتی
                </span>
              )}
            </div>

            {/* دکمه‌های اشتراک‌گذاری — حالا عملکردی */}
            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={handleShare}
                title={copied ? "لینک کپی شد!" : "کپی لینک"}
                className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${
                  copied
                    ? "bg-green-100 text-green-600"
                    : "bg-primary-bg hover:bg-primary hover:text-white text-primary"
                }`}
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleEmailShare}
                title="اشتراک‌گذاری ایمیل"
                className="w-12 h-12 rounded-full bg-primary-bg hover:bg-primary hover:text-white transition-all flex items-center justify-center text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ─── ستون اطلاعات ─── */}
        <div className="lg:col-span-3 space-y-6">

          {/* عنوان، نویسنده، سال */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
              {book.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-lg text-text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {book.author}
              </span>
              {book.edition && (
                <span className="text-sm bg-primary-bg text-primary px-3 py-1 rounded-full">
                  چاپ {book.edition}
                </span>
              )}
            </div>
          </div>

          {/* ✅ قیمت — برجسته */}
          <div className="bg-gradient-to-l from-accent/5 to-primary/5 border border-accent/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted mb-1">قیمت کتاب</p>
              {book.price ? (
                <p className="text-2xl font-bold text-accent">
                  {Number(book.price).toLocaleString("fa-IR")}
                  <span className="text-sm font-normal text-text-muted mr-1">تومان</span>
                </p>
              ) : (
                <p className="text-base font-bold text-primary">تماس برای خرید</p>
              )}
            </div>
            <button
              onClick={() => setShowBuyModal(true)}
              className="btn-gold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              خرید کتاب
            </button>
          </div>

          {/* ✅ جدول اطلاعات نشر — شامل فیلدهای جدید */}
          <div className="bg-white rounded-2xl shadow-card border border-primary-light/10 p-5">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              مشخصات نشر
            </h3>
            <InfoRow label="دسته‌بندی"    value={book.category} />
            <InfoRow label="تعداد صفحات"  value={book.pages ? `${book.pages} صفحه` : null} />
            <InfoRow label="سال انتشار"   value={book.year} />
            <InfoRow label="چاپ"          value={book.edition ? `چاپ ${book.edition}` : null} />
            {/* ✅ شابک */}
            <InfoRow label="شابک (ISBN)"  value={book.isbn} />
            {/* ✅ محل نشر */}
            <InfoRow label="محل نشر"      value={book.publisherCity} />
            <InfoRow label="ناشر"         value="انتشارات الحان" />
            <InfoRow label="نوع"          value={book.isAudio ? "کتاب صوتی" : "کتاب چاپی"} />
          </div>

          {/* توضیحات */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-primary-light/10">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              درباره کتاب
            </h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {book.description || "توضیحاتی برای این کتاب ثبت نشده است."}
            </p>
          </div>

          {/* دکمه ارسال اثر */}
          <div className="bg-primary-bg rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-primary text-sm">آیا اثری برای انتشار دارید؟</p>
              <p className="text-xs text-text-muted mt-0.5">اثر خود را برای بررسی ارسال کنید</p>
            </div>
            <Link to="/submit-book" className="btn-outline text-sm shrink-0">
              ارسال اثر
            </Link>
          </div>
        </div>
      </div>

      {/* ===== کتاب‌های همین نویسنده ===== */}
      {sameAuthor.length > 0 && (
        <div className="mt-16 border-t border-primary-light/20 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">سایر آثار نویسنده</h2>
              <p className="text-sm text-text-muted mt-1">
                دیگر کتاب‌های <span className="text-accent font-bold">{book.author}</span>
              </p>
            </div>
            <Link
              to={`/books?search=${encodeURIComponent(book.author)}`}
              className="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>همه آثار</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sameAuthor.map((rel) => (
              <RelatedBookCard key={rel.id} book={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ===== کتاب‌های مرتبط (همین دسته) ===== */}
      {sameCategory.length > 0 && (
        <div className="mt-12 border-t border-primary-light/20 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">کتاب‌های مرتبط</h2>
              <p className="text-sm text-text-muted mt-1">
                سایر کتاب‌های دسته <span className="text-accent font-bold">{book.category}</span>
              </p>
            </div>
            <Link
              to={`/books?category=${encodeURIComponent(book.category)}`}
              className="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>مشاهده همه</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sameCategory.map((rel) => (
              <RelatedBookCard key={rel.id} book={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ===== مودال خرید ===== */}
      {showBuyModal && (
        <BuyModal book={book} onClose={() => setShowBuyModal(false)} />
      )}
    </div>
    </>
  );
}

export default BookDetail;
