import PageMeta from "../components/PageMeta";
import Icon from "../components/ui/Icon";
import BookCard from "../components/books/BookCard";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";
import reviewsService from "../services/reviewsService";
import InlineError from "../components/InlineError";
import authService from "../services/authService";
import favoritesService from "../services/favoritesService";

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

// ─── ستاره‌های امتیاز (نمایش) ───────────────────────────────────────────────
function StarsDisplay({ value, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`${size} ${n <= Math.round(value) ? "text-accent" : "text-primary-light/30"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

// ─── ستاره‌های امتیاز (ورودی/انتخاب) ────────────────────────────────────────
function StarsInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`${n} ستاره`}
        >
          <svg
            className={`w-6 h-6 transition-colors ${n <= value ? "text-accent" : "text-primary-light/30 hover:text-accent/50"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── ردیف افقی کارت‌های مرتبط (موبایل: اسکرول افقی، دسکتاپ: گرید) ──────────
function RelatedBooksRow({ books }) {
  return (
    <div
      className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible
        pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {books.map((rel) => (
        <div key={rel.id} className="w-[45%] xs:w-[38%] sm:w-auto shrink-0 sm:shrink">
          <BookCard book={rel} aspectClass="aspect-[5/6]" />
        </div>
      ))}
    </div>
  );
}

// ─── صفحه اصلی ─────────────────────────────────────────────────────────────
function BookDetail() {
  const { id } = useParams();
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const [book,         setBook]         = useState(null);
  const [sameAuthor,   setSameAuthor]   = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [activeImage,  setActiveImage]  = useState(0);

  const [reviews,         setReviews]         = useState([]);
  const [reviewRating,    setReviewRating]    = useState(0);
  const [reviewComment,   setReviewComment]   = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentUser,     setCurrentUser]     = useState(null);
  const [checkingAuth,    setCheckingAuth]    = useState(true);
  const [isFavorite,      setIsFavorite]      = useState(false);
  const [favBusy,         setFavBusy]         = useState(false);

  useEffect(() => {
    if (booksLoading) return;

    const found = books.find((item) => String(item.id) === id);
    setBook(found || null);
    setActiveImage(0);

    if (found) {
      const others = books.filter((b) => String(b.id) !== id);
      const byAuthor = others.filter((b) => b.authorName === found.authorName).slice(0, 8);
      const byCategory = others
        .filter((b) => b.category === found.category && b.authorName !== found.authorName)
        .slice(0, 8);
      setSameAuthor(byAuthor);
      setSameCategory(byCategory);
    }
  }, [id, books, booksLoading]);

  useEffect(() => {
    if (!book) return;
    reviewsService
      .getForBook(book.id)
      .then((res) => setReviews(Array.isArray(res?.reviews) ? res.reviews : []))
      .catch(() => setReviews([]));
  }, [book]);

  useEffect(() => {
    authService.me()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (!currentUser || !book) {
      setIsFavorite(false);
      return;
    }
    favoritesService
      .getAll()
      .then((res) => {
        const ids = Array.isArray(res?.books) ? res.books.map((b) => b.id) : [];
        setIsFavorite(ids.includes(book.id));
      })
      .catch(() => setIsFavorite(false));
  }, [currentUser, book]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    setFavBusy(true);
    try {
      if (isFavorite) {
        await favoritesService.remove(book.id);
        setIsFavorite(false);
        toast.success("از علاقه‌مندی‌ها حذف شد");
      } else {
        await favoritesService.add(book.id);
        setIsFavorite(true);
        toast.success("به علاقه‌مندی‌ها اضافه شد");
      }
    } catch (err) {
      toast.error(err.message || "خطا در به‌روزرسانی علاقه‌مندی‌ها");
    } finally {
      setFavBusy(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

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

const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("متن نظر الزامی است");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewsService.create(book.id, {
        rating:  reviewRating || undefined,
        comment: reviewComment.trim(),
      });
      toast.success("نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود");
      setReviewComment("");
      setReviewRating(0);
    } catch (err) {
      toast.error(err.message || "ثبت نظر آنلاین هنوز فعال نشده — به‌زودی");
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const gallery = Array.isArray(book.images) && book.images.length > 0
    ? book.images
    : (book.image ? [book.image] : []);

  return (
    <>
      <PageMeta
        title={book.title}
        description={book.description ? book.description.slice(0, 160) : `کتاب ${book.title} نوشته ${book.authorName}`}
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

        {/* ─── ستون تصویر / گالری ─── */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <div className="relative bg-primary-bg rounded-3xl overflow-hidden shadow-elegant-hover aspect-[2/3]">
              {gallery.length > 0 ? (
                <img
                  src={gallery[activeImage]}
                  alt={book.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </div>
              )}
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

            {gallery.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 aspect-[2/3] rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt={`${book.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={handleToggleFavorite}
                disabled={favBusy}
                title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                className={`w-12 h-12 rounded-full transition-all flex items-center justify-center disabled:opacity-60 ${
                  isFavorite ? "bg-red-100 text-red-500" : "bg-primary-bg hover:bg-red-100 hover:text-red-500 text-primary"
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              <button
                onClick={handleShare}
                title={copied ? "لینک کپی شد!" : "کپی لینک"}
                className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${
                  copied ? "bg-green-100 text-green-600" : "bg-primary-bg hover:bg-primary hover:text-white text-primary"
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

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
              {book.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-lg text-text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {book.authorName}
              </span>
              {book.edition && (
                <span className="text-sm bg-primary-bg text-primary px-3 py-1 rounded-full">
                  چاپ {book.edition}
                </span>
              )}
              {reviews.length > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <StarsDisplay value={avgRating} />
                  <span className="font-bold text-primary">{avgRating.toFixed(1)}</span>
                  <span className="text-text-muted">({reviews.length} نظر)</span>
                </span>
              )}
            </div>
          </div>

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
            <button onClick={() => setShowBuyModal(true)} className="btn-gold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              خرید کتاب
            </button>
          </div>

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
            <InfoRow label="نوع جلد"      value={book.coverType} />
            <InfoRow label="قطع کتاب"     value={book.trimSize} />
            <InfoRow label="شابک (ISBN)"  value={book.isbn} />
            <InfoRow label="محل نشر"      value={book.publisherCity} />
            <InfoRow label="ناشر"         value="انتشارات الحان" />
            <InfoRow label="نوع"          value={book.isAudio ? "کتاب صوتی" : "کتاب چاپی"} />
          </div>

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

      {/* ===== نظرات کاربران ===== */}
      <div className="mt-16 border-t border-primary-light/20 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-primary">نظرات خوانندگان</h2>
            {reviews.length > 0 && (
              <span className="bg-primary-bg text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                {reviews.length}
              </span>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4 mb-10">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow-card border border-primary-light/10 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {r.user?.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-bold text-primary text-sm">{r.user?.name}</span>
                    </div>
                    {r.rating ? <StarsDisplay value={r.rating} /> : null}
                  </div>
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm mb-10">
              هنوز نظری برای این کتاب ثبت نشده — اولین نفر باشید!
            </p>
          )}

          {checkingAuth ? null : currentUser ? (
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl shadow-card border border-primary-light/10 p-6">
              <h3 className="font-bold text-primary mb-4">
                ثبت نظر شما <span className="text-text-muted font-normal text-sm">(با نام {currentUser.name})</span>
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-text-muted shrink-0">امتیاز:</span>
                <StarsInput value={reviewRating} onChange={setReviewRating} />
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="نظر شما درباره این کتاب..."
                rows={4}
                className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
              />
              <button type="submit" disabled={submittingReview} className="btn-gold mt-4 disabled:opacity-60">
                {submittingReview ? "در حال ارسال..." : "ثبت نظر"}
              </button>
            </form>
          ) : (
            <div className="bg-primary-bg rounded-2xl p-6 text-center">
              <p className="text-text-secondary text-sm mb-3">برای ثبت نظر ابتدا وارد حساب کاربری خود شوید</p>
              <Link to="/login" state={{ from: `/books/${book.id}` }} className="btn-gold inline-block">
                ورود / ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ===== کتاب‌های همین نویسنده ===== */}
      {sameAuthor.length > 0 && (
        <div className="mt-16 border-t border-primary-light/20 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">سایر آثار نویسنده</h2>
              <p className="text-sm text-text-muted mt-1">
                دیگر کتاب‌های <span className="text-accent font-bold">{book.authorName}</span>
              </p>
            </div>
            <Link
              to={`/books?search=${encodeURIComponent(book.authorName)}`}
              className="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0"
            >
              <span>همه آثار</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <RelatedBooksRow books={sameAuthor} />
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
              className="text-accent font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0"
            >
              <span>مشاهده همه</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <RelatedBooksRow books={sameCategory} />
        </div>
      )}

      {showBuyModal && <BuyModal book={book} onClose={() => setShowBuyModal(false)} />}
    </div>
    </>
  );
}

export default BookDetail;
