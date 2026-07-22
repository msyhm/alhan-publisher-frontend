import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";

function BookCard({ book, aspectClass = "aspect-[2/3]" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(book.image) && !imgError;
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book.id);
    toast.success("به سبد خرید اضافه شد");
  };

  return (
    <Link
      to={"/books/" + book.id}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-card hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col relative border border-primary/5">

        {/* ===== تصویر ===== */}
        <div className={`relative overflow-hidden bg-primary-bg w-full shrink-0 ${aspectClass}`}>
          {hasImage ? (
            <>
              {/* پس‌زمینه‌ی محوشده از همان تصویر — فضای خالی احتمالی رو با رنگ/جلوه‌ی هماهنگ با خود تصویر پر می‌کنه */}
              <img
                src={book.image}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/25" />
              {/* تصویر اصلی — کامل و بدون برش (object-contain) */}
              <img
                src={book.image}
                alt={book.title}
                draggable={false}
                loading="lazy"
                onError={() => setImgError(true)}
                className="absolute inset-0 m-auto h-full w-auto max-w-none transition-transform duration-700 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-bg to-primary-bg/60 text-primary/25">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
              <span className="text-[10px] sm:text-xs">بدون تصویر</span>
            </div>
          )}

          {/* Overlay گرادینت */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* نشان‌ها */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {book.category && (
              <span className="bg-accent/90 text-white backdrop-blur-sm shadow-lg text-xs px-2.5 py-1 rounded-full">
                {book.category}
              </span>
            )}
            {book.isAudio && (
              <span className="bg-blue-500/90 text-white backdrop-blur-sm shadow-lg flex items-center gap-1 text-xs px-2.5 py-1 rounded-full">
                <Icon name="headphones" size={12} strokeWidth={1.75} />
                صوتی
              </span>
            )}
          </div>

          {/* ✅ badge چاپ — گوشه چپ بالا */}
          {book.edition && (
            <span className="absolute top-3 left-3 bg-white/90 text-primary backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              چاپ {book.edition}
            </span>
          )}
          {/* ✅ دکمه افزودن سریع به سبد خرید */}
          <button
            onClick={handleAddToCart}
            title="افزودن به سبد خرید"
            className="absolute bottom-2.5 left-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all active:scale-90"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>

        {/* ===== محتوا ===== */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">

          {/* عنوان */}
          <h3 className="text-sm sm:text-base font-bold text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem]">
            {book.title}
          </h3>

          {/* نویسنده */}
          <p className="mt-1 text-xs sm:text-sm text-text-secondary flex items-center gap-1.5">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{book.authorName}</span>
          </p>

          {/* سال و صفحات */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-xs text-text-muted">
            {book.year && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {book.year}
              </span>
            )}
            {book.pages && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {book.pages} صفحه
              </span>
            )}
          </div>

          {/* ✅ قیمت — چسبیده به پایین کارت */}
          <div className="mt-auto pt-2">
            {book.price ? (
              <p className="text-sm font-bold text-accent">
                {Number(book.price).toLocaleString("fa-IR")}
                <span className="text-[10px] font-normal text-text-muted mr-0.5">تومان</span>
              </p>
            ) : (
              <p className="text-xs text-text-muted">تماس برای خرید</p>
            )}
          </div>
        </div>

        {/* خط نورانی در هاور */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent/50 to-accent transition-all duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`} />
      </div>
    </Link>
  );
}

export default BookCard;