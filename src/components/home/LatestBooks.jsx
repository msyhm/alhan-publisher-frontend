// LatestBooks.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useBooks from "../../hooks/useBooks";
import BookCard from "../books/BookCard";

// آیکون‌های SVG
const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const AUTOPLAY_SPEED = 45; // پیکسل بر ثانیه — سرعت اسکرول خودکار پیوسته

function LatestBooks() {
  const { books } = useBooks();
  const sliderRef = useRef(null);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const pausedRef = useRef(false); // true حین درگ یا هاور یا کلیک روی فلش‌ها
  const rafRef = useRef(null);
  const DRAG_THRESHOLD = 6; // px — کمتر از این یعنی کلیک، بیشتر یعنی درگ واقعی

  const latestBooks = books.slice(0, 10);
  const totalItems = latestBooks.length;

  // فقط وقتی کتاب‌ها از عرض دید بیشترند، اسکرول پیوسته/بی‌نهایت لازم است
  const shouldLoop = totalItems > Math.ceil(itemsPerView);
  // ✅ برای لوپ بی‌درز، لیست را دوبار پشت‌سرهم رندر می‌کنیم
  const displayBooks = shouldLoop ? [...latestBooks, ...latestBooks] : latestBooks;

  // محاسبه تعداد آیتم با عرض متناسب
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 480) setItemsPerView(1);
      else if (width < 640) setItemsPerView(1.5);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(2.5);
      else if (width < 1280) setItemsPerView(3);
      else setItemsPerView(3.5);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // فاصله‌ی واقعی بین کارت‌ها (از CSS خوانده می‌شود، نه عدد ثابت)
  const getGap = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return 20;
    return parseFloat(getComputedStyle(slider).columnGap) || 20;
  }, []);

  // عرض یک «دور کامل» (یعنی عرض یک‌بار کل latestBooks، نه دو نسخه‌ی تکراری‌اش)
  const getSetWidth = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider || !totalItems) return 0;
    const cards = slider.querySelectorAll(".book-card-wrapper");
    if (!cards.length) return 0;
    const cardWidth = cards[0].offsetWidth;
    return totalItems * (cardWidth + getGap());
  }, [totalItems, getGap]);

  // ───────────────────────────────────────────────────────────────────────
  // ✅ اسکرول خودکار پیوسته (requestAnimationFrame) — بدون توقف/پرش
  // ───────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !shouldLoop) return;

    let lastTs = null;

    const tick = (ts) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (!dragRef.current.active && !pausedRef.current) {
        const setWidth = getSetWidth();
        if (setWidth > 0) {
          // محتوا RTL است؛ scrollLeft در مرورگرهای مدرن برای RTL منفی می‌شود
          slider.scrollLeft -= (AUTOPLAY_SPEED * dt) / 1000;
          // ✅ به‌محض رسیدن به انتهای نسخه‌ی اول، بی‌درز (بدون انیمیشن) به همان موقعیت
          // در نسخه‌ی دوم برمی‌گردیم — چون محتوا یکسان است، هیچ پرشی دیده نمی‌شود
          if (Math.abs(slider.scrollLeft) >= setWidth) {
            slider.scrollLeft += setWidth;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldLoop, getSetWidth]);

  // بعد از درگ دستی هم اگر از محدوده‌ی یک «دور» بیرون رفتیم، بی‌درز برگردیم داخل محدوده
  const normalizeLoopPosition = useCallback(() => {
    if (!shouldLoop) return;
    const slider = sliderRef.current;
    if (!slider) return;
    const setWidth = getSetWidth();
    if (setWidth <= 0) return;
    if (Math.abs(slider.scrollLeft) >= setWidth) {
      slider.scrollLeft += setWidth;
    } else if (slider.scrollLeft > 0) {
      slider.scrollLeft -= setWidth;
    }
  }, [shouldLoop, getSetWidth]);

  // حرکت دستی با دکمه‌های فلش (یک کارت در هر کلیک، بدون پرش)
  const nudge = useCallback(
    (direction) => {
      const slider = sliderRef.current;
      if (!slider) return;
      const cards = slider.querySelectorAll(".book-card-wrapper");
      if (!cards.length) return;

      const cardWidth = cards[0].offsetWidth;
      const amount = cardWidth + getGap();

      pausedRef.current = true;
      slider.scrollBy({ left: -amount * direction, behavior: "smooth" });
      window.clearTimeout(nudge._t);
      nudge._t = window.setTimeout(() => {
        pausedRef.current = false;
      }, 600);
    },
    [getGap]
  );

  const slideRight = () => nudge(1);
  const slideLeft = () => nudge(-1);

  // ✅ اگر واقعاً درگ اتفاق افتاده، از رفتن به لینک کتاب (ناوبری ناخواسته) جلوگیری کن
  const handleSliderClickCapture = useCallback((e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }, []);

  // ✅ جلوگیری از drag-ghost بومی مرورگر روی تصویر/لینک — علت اصلی
  // «هایلایت‌شدن لینک‌ها» هنگام اسکرول با ماوس
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
  }, []);

  // هندل درگ با ماوس
  const handleMouseDown = useCallback((e) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();

    dragRef.current = {
      active: true,
      startX: e.clientX - rect.left,
      scrollLeft: slider.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active || !sliderRef.current) return;
    e.preventDefault();

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const walk = (x - dragRef.current.startX) * 1.5;

    if (Math.abs(walk) > DRAG_THRESHOLD) dragRef.current.moved = true;

    slider.scrollLeft = dragRef.current.scrollLeft + walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    normalizeLoopPosition();
  }, [normalizeLoopPosition]);

  // هندل تاچ برای موبایل
  const handleTouchStart = useCallback((e) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const touch = e.touches[0];

    dragRef.current = {
      active: true,
      startX: touch.clientX - rect.left,
      scrollLeft: slider.scrollLeft,
      moved: false,
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragRef.current.active || !sliderRef.current) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const walk = (x - dragRef.current.startX) * 1.5;

    if (Math.abs(walk) > DRAG_THRESHOLD) dragRef.current.moved = true;

    slider.scrollLeft = dragRef.current.scrollLeft + walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.active = false;
    normalizeLoopPosition();
  }, [normalizeLoopPosition]);

  const handleMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const handleMouseLeaveContainer = useCallback(() => {
    pausedRef.current = false;
    handleMouseUp();
  }, [handleMouseUp]);

  if (!latestBooks.length) {
    return (
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-text-muted">کتابی برای نمایش وجود ندارد.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ===== هدر ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full text-primary text-xs sm:text-sm mb-2 border border-primary/10 backdrop-blur-sm">
              <BookOpenIcon />
              <span>جدیدترین آثار</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              <span className="bg-accent/20 text-accent text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                {totalItems} کتاب
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="text-primary">کتاب‌های</span>
              <span className="text-accent"> جدید</span>
            </h2>
            <p className="mt-1 text-text-muted text-xs sm:text-sm max-w-xl">
              آخرین کتاب‌های منتشر شده انتشارات الحان
            </p>
          </div>

          {/* ✅ self-end: در حالت flex-col موبایل دیگر کش نمی‌آید تمام عرض را بگیرد،
              فقط به‌اندازه‌ی متنش عریض می‌شود و به سمت انتهای محور عرضی (چپ، چون RTL) می‌چسبد */}
          <Link
            to="/books"
            className="self-end shrink-0 text-xs sm:text-sm text-primary font-bold border-2 border-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            همه کتاب‌ها
          </Link>
        </div>

        {/* ===== اسلایدر ===== */}
        <div className="relative py-4">
          {/* دکمه چپ - با آیکون فلش چپ */}
          <button
            onClick={slideRight}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95"
            aria-label="حرکت به راست"
            style={{ marginLeft: "-4px" }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* دکمه راست - با آیکون فلش راست */}
          <button
            onClick={slideLeft}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95"
            aria-label="حرکت به چپ"
            style={{ marginRight: "-4px" }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* اسلایدر */}
          <div
            dir="rtl"
            ref={sliderRef}
            onScroll={shouldLoop ? normalizeLoopPosition : undefined}
            onClickCapture={handleSliderClickCapture}
            onDragStart={handleDragStart}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeaveContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-4 px-6 sm:px-8 select-none
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            `}
          >
            {displayBooks.map((book, i) => (
              <div
                key={`${book.id}-${i}`}
                draggable={false}
                className="book-card-wrapper flex-none shrink-0"
                style={{
                  width:
                    itemsPerView <= 1 ? "85%" :
                    itemsPerView <= 1.5 ? "60%" :
                    itemsPerView <= 2 ? "48%" :
                    itemsPerView <= 2.5 ? "38%" :
                    itemsPerView <= 3 ? "31%" :
                    "26%",
                  minWidth: "160px",
                  maxWidth: "280px",
                }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestBooks;