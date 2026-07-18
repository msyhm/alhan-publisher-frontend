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
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const DRAG_THRESHOLD = 6;

  const latestBooks = books.slice(0, 10);
  const totalItems = latestBooks.length;

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
     if (width < 480) setItemsPerView(1.1);
      else if (width < 640) setItemsPerView(1.6);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(2.7);
      else if (width < 1280) setItemsPerView(3.3);
      else setItemsPerView(4.2); 
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
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

  const cardWidthPercent = 100 / itemsPerView;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

          <Link
            to="/books"
            className="self-end shrink-0 text-xs sm:text-sm text-primary font-bold border-2 border-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            همه کتاب‌ها
          </Link>
        </div>

        <div className="relative py-4">
          <button
            onClick={goForward}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95"
            aria-label="کتاب بعدی"
            style={{ marginLeft: "-4px" }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={goBackward}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95"
            aria-label="کتاب قبلی"
            style={{ marginRight: "-4px" }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
            className={`flex gap-2.5 sm:gap-3 overflow-x-auto py-4 px-6 sm:px-8 select-none
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
                  minWidth: "185px",
                  maxWidth: "265px",
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