import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";

const AUTOPLAY_INTERVAL = 5000;

const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

function Hero() {
  const { settings } = useSiteSettings();
  const slides = settings.heroSlides || [];
  const hasMultiple = slides.length > 1;

  const sliderRef = useRef(null);
  const isPausedRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ─── تشخیص اسلاید فعلی از روی موقعیت اسکرول (سازگار با هر دو قرارداد RTL) ──
  const updateCurrentIndex = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider || slider.clientWidth === 0) return;
    const scrolled = Math.abs(slider.scrollLeft);
    setCurrentIndex(Math.round(scrolled / slider.clientWidth));
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    updateCurrentIndex();
    slider.addEventListener("scroll", updateCurrentIndex, { passive: true });
    window.addEventListener("resize", updateCurrentIndex);
    return () => {
      slider.removeEventListener("scroll", updateCurrentIndex);
      window.removeEventListener("resize", updateCurrentIndex);
    };
  }, [updateCurrentIndex, slides.length]);

  // ─── حرکت به اسلاید بعدی/قبلی — با چرخش (loop) در دو سر لیست ──────────────
  const goNext = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const scrolled = Math.abs(slider.scrollLeft);
    if (scrolled >= maxScroll - 2) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
    }
  }, []);

  const goPrev = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const scrolled = Math.abs(slider.scrollLeft);
    if (scrolled <= 2) {
      slider.scrollTo({ left: -maxScroll, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    }
  }, []);

  const goToIndex = useCallback((index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollTo({ left: -index * slider.clientWidth, behavior: "smooth" });
  }, []);

  // ─── پخش خودکار — هر چند ثانیه یک‌بار، با توقف روی هاور/لمس ────────────────
  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      if (!isPausedRef.current) goNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [hasMultiple, goNext]);

  if (slides.length === 0) return null;

  return (
    <section className="pt-24 sm:pt-28 pb-6 sm:pb-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-primary-bg"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={() => { isPausedRef.current = true; }}
          onTouchEnd={() => { isPausedRef.current = false; }}
        >
          {/* ✅ نسبت عرض/ارتفاع ثابت (۵:۲) در همه‌ی سایزها — با تغییر اندازه صفحه
              فقط کوچک/بزرگ می‌شود، هرگز کش نمی‌آید یا کیفیتش به‌هم نمی‌خورد */}
          <div
            ref={sliderRef}
            dir="rtl"
            className="flex aspect-[5/2] overflow-x-auto snap-x snap-mandatory scroll-smooth
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((slide) => {
              const image = (
                <img
                  src={slide.image}
                  alt=""
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              );
              return (
                <div key={slide.id} className="w-full h-full shrink-0 snap-start">
                  {slide.link ? (
                    slide.link.startsWith("/") ? (
                      <Link to={slide.link} className="block w-full h-full">
                        {image}
                      </Link>
                    ) : (
                      <a
                        href={slide.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        {image}
                      </a>
                    )
                  ) : (
                    <div className="w-full h-full">{image}</div>
                  )}
                </div>
              );
            })}
          </div>

          {hasMultiple && (
            <>
              <button
                onClick={goNext}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 active:scale-95"
                aria-label="اسلاید بعدی"
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={goPrev}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:scale-110 active:scale-95"
                aria-label="اسلاید قبلی"
              >
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => goToIndex(i)}
                    aria-label={`رفتن به اسلاید ${i + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-5 sm:w-6 bg-white"
                        : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
