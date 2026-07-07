import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { useState } from "react";

function BookCard({ book, onDragClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // جلوگیری از drag بومی مرورگر روی لینک/تصویر
  // (این drag بومی با اسکرول دستی سفارشی اسلایدر تداخل ایجاد می‌کند)
  const handleDragStart = (e) => e.preventDefault();

  // اگر کاربر کارت را «درگ» کرده باشد (نه کلیک ساده)، از navigate شدن جلوگیری می‌شود
  const handleClick = (e) => {
    if (onDragClick && onDragClick()) {
      e.preventDefault();
    }
  };

  return (
    <Link
      to={"/books/" + book.id}
      className="group block h-full"
      draggable={false}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-card hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col relative border border-primary/5">

        {/* ===== تصویر ===== */}
        {/* نسبت تصویر مطابق قطع رقعی (رایج‌ترین قطع کتاب‌های فارسی) تنظیم شده تا جلد کتاب کشیده یا کراپ نامتناسب نشود */}
        <div className="relative overflow-hidden bg-primary-bg aspect-[29/41]">
          <img
            src={book.image}
            alt={book.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            onDragStart={handleDragStart}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

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

          {/* دکمه مشاهده سریع در هاور */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            <span className="bg-white/95 backdrop-blur-md text-primary font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-2xl border border-white/20 hover:bg-primary hover:text-white transition-all transform hover:scale-105">
              مشاهده کتاب
            </span>
          </div>
        </div>

        {/* ===== محتوا ===== */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">

          {/* عنوان */}
          <h3 className="text-sm sm:text-base font-bold text-primary leading-relaxed group-hover:text-accent transition-colors line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
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
          <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-muted">
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
            {/* ✅ شابک کوتاه‌شده */}
            {book.isbn && (
              <span className="flex items-center gap-1 truncate" title={`شابک: ${book.isbn}`}>
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {book.isbn}
              </span>
            )}
          </div>

          {/* ✅ قیمت + دکمه — پایین کارت */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-primary-light/10 flex items-center justify-between gap-2">
            {/* قیمت */}
            <div className="min-w-0">
              {book.price ? (
                <p className="text-sm font-bold text-accent">
                  {Number(book.price).toLocaleString("fa-IR")}
                  <span className="text-[10px] font-normal text-text-muted mr-0.5">تومان</span>
                </p>
              ) : (
                <p className="text-xs text-text-muted">تماس برای خرید</p>
              )}
            </div>

            {/* دکمه جزئیات */}
            <span className="shrink-0 text-center bg-primary-bg text-primary font-medium text-xs px-3 py-2 rounded-xl group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg whitespace-nowrap">
              مشاهده جزئیات
            </span>
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
