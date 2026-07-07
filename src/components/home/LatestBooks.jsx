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

function LatestBooks() {
  const { books } = useBooks();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const autoPlayRef = useRef(null);
  const isHoveringRef = useRef(false);
  const directionRef = useRef(1); // 1 = جلو، -1 = عقب (برای autoplay رفت‌وبرگشتی به‌جای پرش)
  const DRAG_THRESHOLD = 6; // پیکسل — کمتر از این یعنی «کلیک»، بیشتر یعنی «درگ»

  const latestBooks = books.slice(0, 10);
  const totalItems = latestBooks.length;
  const maxIndex = Math.max(0, totalItems - Math.floor(itemsPerView));

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
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // تابع کمکی برای دریافت scrollLeft در RTL
  const getScrollPosition = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return 0;
    return Math.abs(slider.scrollLeft);
  }, []);

  // اسکرول به ایندکس مشخص
  const scrollToIndex = useCallback((index) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cards = slider.querySelectorAll('.book-card-wrapper');
    if (!cards.length) return;

    const targetIndex = Math.min(index, cards.length - 1);
    const targetCard = cards[targetIndex];
    if (!targetCard) return;

    const gap = 20;
    const cardWidth = targetCard.offsetWidth;
    const targetPosition = targetIndex * (cardWidth + gap);

    slider.scrollTo({
      left: -targetPosition,
      behavior: 'smooth'
    });
  }, []);

  // حرکت به راست
  const slideRight = useCallback(() => {
    if (currentIndex < maxIndex) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, maxIndex, scrollToIndex]);

  // حرکت به چپ
  const slideLeft = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, scrollToIndex]);

  // اسنپ به نزدیک‌ترین کارت
  const snapToNearestCard = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const cards = slider.querySelectorAll('.book-card-wrapper');
    if (!cards.length) return;

    const cardWidth = cards[0]?.offsetWidth || 220;
    const gap = 20;
    const scrollPosition = getScrollPosition();
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    
    setCurrentIndex(clampedIndex);
    scrollToIndex(clampedIndex);
  }, [maxIndex, getScrollPosition, scrollToIndex]);

  // هندل درگ با ماوس
  const handleMouseDown = useCallback((e) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();

    dragRef.current = {
      active: true,
      startX: e.clientX - rect.left,
      startClientX: e.clientX,
      startClientY: e.clientY,
      scrollLeft: slider.scrollLeft,
      moved: false,
    };
    setIsDragging(true);

    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.active || !sliderRef.current) return;
    e.preventDefault();

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const walk = (x - dragRef.current.startX) * 1.5;

    // فقط وقتی جابه‌جایی واقعی از آستانه رد شد، «درگ» در نظر گرفته می‌شود
    // تا کلیک‌های ساده روی کارت به‌اشتباه به‌عنوان درگ لغو نشوند
    const totalMove = Math.abs(e.clientX - dragRef.current.startClientX);
    if (totalMove > DRAG_THRESHOLD) {
      dragRef.current.moved = true;
    }

    slider.scrollLeft = dragRef.current.scrollLeft + walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    snapToNearestCard();
    if (!isHoveringRef.current) return;
    startAutoPlay();
  }, [snapToNearestCard]);

  // این تابع به BookCard پاس داده می‌شود تا بفهمد آخرین تعامل «درگ» بوده یا «کلیک»
  const wasDragged = useCallback(() => {
    const moved = dragRef.current.moved;
    dragRef.current.moved = false;
    return moved;
  }, []);

  // هندل تاچ برای موبایل
  const handleTouchStart = useCallback((e) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const touch = e.touches[0];

    dragRef.current = {
      active: true,
      startX: touch.clientX - rect.left,
      startClientX: touch.clientX,
      scrollLeft: slider.scrollLeft,
      moved: false,
    };

    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragRef.current.active || !sliderRef.current) return;
    e.preventDefault();

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const walk = (x - dragRef.current.startX) * 1.5;

    if (Math.abs(touch.clientX - dragRef.current.startClientX) > DRAG_THRESHOLD) {
      dragRef.current.moved = true;
    }

    slider.scrollLeft = dragRef.current.scrollLeft + walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.active = false;
    snapToNearestCard();
    startAutoPlay();
  }, [snapToNearestCard]);

  // AutoPlay — رفت‌وبرگشتی (bounce) به‌جای پرش ناگهانی به ابتدای لیست
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        let next = prev + directionRef.current;
        if (next > maxIndex) {
          directionRef.current = -1;
          next = Math.max(0, maxIndex - 1);
        } else if (next < 0) {
          directionRef.current = 1;
          next = Math.min(maxIndex, 1);
        }
        scrollToIndex(next);
        return next;
      });
    }, 4000);
  }, [maxIndex, scrollToIndex]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [startAutoPlay]);

  // توقف autoplay هنگام هاور (شامل اسکرول با تاچ‌پد/ویل که mousedown را فعال نمی‌کند)
  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  const handleMouseLeaveSlider = useCallback(() => {
    isHoveringRef.current = false;
    if (!dragRef.current.active) startAutoPlay();
  }, [startAutoPlay]);

  // هندل اسکرول
  const handleScroll = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider || dragRef.current.active) return;
    
    const cards = slider.querySelectorAll('.book-card-wrapper');
    if (!cards.length) return;
    
    const cardWidth = cards[0]?.offsetWidth || 220;
    const gap = 20;
    const scrollPosition = getScrollPosition();
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    
    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  }, [maxIndex, getScrollPosition, currentIndex]);

  const goToSlide = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    scrollToIndex(clampedIndex);
  }, [maxIndex, scrollToIndex]);

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

          <Link
            to="/books"
            className="text-xs sm:text-sm text-primary font-bold border-2 border-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            همه کتاب‌ها
          </Link>
        </div>

        {/* ===== اسلایدر ===== */}
        <div
          className="relative py-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveSlider}
        >
          {/* دکمه چپ - با آیکون فلش چپ */}
          <button
            onClick={slideRight}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95 ${
              currentIndex < maxIndex ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            aria-label="حرکت به راست"
            style={{ marginLeft: '-4px' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* دکمه راست - با آیکون فلش راست */}
          <button
            onClick={slideLeft}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95 ${
              currentIndex > 0 ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            aria-label="حرکت به چپ"
            style={{ marginRight: '-4px' }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* اسلایدر */}
          <div
            dir="rtl"
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-4 px-6 sm:px-8 select-none snap-x snap-mandatory
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
          >
            {latestBooks.map((book) => (
              <div
                key={book.id}
                className="book-card-wrapper flex-none snap-start transition-all duration-300"
                style={{
                  width: itemsPerView <= 1 ? '85%' : 
                         itemsPerView <= 1.5 ? '60%' :
                         itemsPerView <= 2 ? '48%' :
                         itemsPerView <= 2.5 ? '38%' :
                         itemsPerView <= 3 ? '31%' :
                         '26%',
                  minWidth: '160px',
                  maxWidth: '280px',
                }}
              >
                <BookCard book={book} onDragClick={wasDragged} />
              </div>
            ))}
          </div>
        </div>

        {/* ===== نقاط ناوبری ===== */}
        {totalItems > 0 && (
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-3">
            {Array.from({ length: Math.min(6, maxIndex + 1) }).map((_, i) => {
              const isActive = i === Math.min(currentIndex, maxIndex);
              return (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-accent shadow-lg shadow-accent/30"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary/20 hover:bg-primary/50 hover:scale-125"
                  }`}
                  aria-label={`اسلاید ${i + 1}`}
                />
              );
            })}
            {maxIndex + 1 > 6 && (
              <span className="text-[10px] sm:text-xs text-text-muted mr-1">+{maxIndex + 1 - 6}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestBooks;