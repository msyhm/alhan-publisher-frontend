// LatestBooks.jsx
import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import useBooks from "../../hooks/useBooks";
import BookCard from "../books/BookCard";

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

function LatestBooks() {
  const { books } = useBooks();
  const sliderRef = useRef(null);
  const [layout, setLayout] = useState({ itemsPerView: 4, minWidth: 150, maxWidth: 212 });
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const DRAG_THRESHOLD = 6;

  const latestBooks = books.slice(0, 10);
  const totalItems = latestBooks.length;

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      // ✅ زیر ۷۶۸px دقیقاً مثل گرید ۲‌ستونه‌ی صفحه Books — همیشه ۲ کارت کامل، بدون peek
      if (width < 768) setLayout({ itemsPerView: 2, minWidth: 130, maxWidth: 175 });
      else if (width < 1024) setLayout({ itemsPerView: 3.4, minWidth: 150, maxWidth: 212 });
      else if (width < 1280) setLayout({ itemsPerView: 4.1, minWidth: 150, maxWidth: 212 });
      else setLayout({ itemsPerView: 5.3, minWidth: 150, maxWidth: 212 });
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const getGap = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return 12;
    return parseFloat(getComputedStyle(slider).columnGap) || 12;
  }, []);

  const nudge = useCallback(
    (direction) => {
      const slider = sliderRef.current;
      if (!slider) return;
      const cards = slider.querySelectorAll(".book-card-wrapper");
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth;
      const amount = cardWidth + getGap();
      slider.scrollBy({ left: -amount * direction, behavior: "smooth" });
    },
    [getGap]
  );

  const goForward = () => nudge(1);
  const goBackward = () => nudge(-1);

  const updateScrollButtons = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 1) {
      setCanScrollBack(false);
      setCanScrollForward(false);
      return;
    }
    const scrolled = Math.abs(slider.scrollLeft);
    setCanScrollBack(scrolled > 2);
    setCanScrollForward(scrolled < maxScroll - 2);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    updateScrollButtons();
    slider.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      slider.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, layout.itemsPerView, totalItems]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      slider.scrollLeft += e.deltaY;
    };
    slider.addEventListener("wheel", onWheel, { passive: false });
    return () => slider.removeEventListener("wheel", onWheel);
  }, []);

  const handleSliderClickCapture = useCallback((e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }, []);

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
  }, []);

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
    const walk = (x - dragRef.current.startX) * 1;
    if (Math.abs(walk) > DRAG_THRESHOLD) dragRef.current.moved = true;
    slider.scrollLeft = dragRef.current.scrollLeft - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
  }, []);

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
    const walk = (x - dragRef.current.startX) * 1;
    if (Math.abs(walk) > DRAG_THRESHOLD) dragRef.current.moved = true;
    slider.scrollLeft = dragRef.current.scrollLeft - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  if (!latestBooks.length) {
    return (
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-text-muted">کتابی برای نمایش وجود ندارد.</p>
        </div>
      </section>
    );
  }

  const cardWidthPercent = 100 / layout.itemsPerView;

  return (
    <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="sm:flex sm:items-end sm:justify-between sm:gap-4 mb-2 sm:mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full text-primary text-xs sm:text-sm mb-1.5 border border-primary/10 backdrop-blur-sm">
              <BookOpenIcon />
              <span>جدیدترین آثار</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              <span className="bg-accent/20 text-accent text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                {totalItems} کتاب
              </span>
            </div>

            {/* عنوان + دکمه (فقط موبایل) هم‌ردیف */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                <span className="text-primary">کتاب‌های</span>
                <span className="text-accent"> جدید</span>
              </h2>
              <Link
                to="/books"
                className="sm:hidden shrink-0 text-xs text-primary font-bold border-2 border-primary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95"
              >
                همه کتاب‌ها
              </Link>
            </div>

            <p className="mt-0.5 text-text-muted text-xs sm:text-sm max-w-xl leading-snug">
              آخرین کتاب‌های منتشر شده انتشارات الحان
            </p>
          </div>

          {/* دکمه دسکتاپ — همون جای قبلی، ته‌تراز با کل بلوک */}
          <Link
            to="/books"
            className="hidden sm:inline-block shrink-0 text-sm text-primary font-bold border-2 border-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            همه کتاب‌ها
          </Link>
        </div>

        <div className="relative py-1 sm:py-1.5">
          <button
            onClick={goForward}
            disabled={!canScrollForward}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="کتاب بعدی"
            style={{ marginLeft: "-4px" }}
          >
            <ChevronLeftIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </button>

          <button
            onClick={goBackward}
            disabled={!canScrollBack}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="کتاب قبلی"
            style={{ marginRight: "-4px" }}
          >
            <ChevronRightIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </button>

          <div
            dir="rtl"
            ref={sliderRef}
            onClickCapture={handleSliderClickCapture}
            onDragStart={handleDragStart}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`flex gap-2.5 sm:gap-3 overflow-x-auto py-4 px-2 sm:px-4 select-none
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            `}
          >
            {latestBooks.map((book) => (
              <div
                key={book.id}
                draggable={false}
                className="book-card-wrapper flex-none shrink-0"
                style={{
                  width: `${cardWidthPercent}%`,
                  minWidth: `${layout.minWidth}px`,
                  maxWidth: `${layout.maxWidth}px`,
                }}
              >
                <BookCard book={book} aspectClass="aspect-[2/3]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestBooks;