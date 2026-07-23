import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";

const AUTOPLAY_INTERVAL = 5000;
const FADE_MS = 700;
const DRAG_THRESHOLD = 45; // حداقل جابه‌جایی (پیکسل) برای اینکه درگ به‌عنوان تغییر اسلاید حساب بشه

function Hero() {
  const { settings } = useSiteSettings();
  const slides = settings.heroSlides || [];
  const hasMultiple = slides.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const isPausedRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, moved: false });

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToIndex = (index) => setCurrentIndex(index);

  // ─── پخش خودکار — هر چند ثانیه یک‌بار، با توقف روی هاور/درگ ────────────────
  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      if (!isPausedRef.current) goNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [hasMultiple, goNext]);

  // ─── درگ با موس (دسکتاپ) و لمس (موبایل) — هر دو یک مسیر مشترک ─────────────
  const startDrag = useCallback((clientX) => {
    dragRef.current = { active: true, startX: clientX, moved: false };
    isPausedRef.current = true;
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!dragRef.current.active) return;
    if (Math.abs(clientX - dragRef.current.startX) > 5) dragRef.current.moved = true;
  }, []);

  const endDrag = useCallback((clientX) => {
    if (!dragRef.current.active) return;
    const delta = clientX - dragRef.current.startX;
    dragRef.current.active = false;
    isPausedRef.current = false;
    if (!hasMultiple || Math.abs(delta) < DRAG_THRESHOLD) return;
    // کشیدن به سمت راست = اسلاید بعدی، کشیدن به سمت چپ = اسلاید قبلی
    if (delta > 0) goNext();
    else goPrev();
  }, [hasMultiple, goNext, goPrev]);

  const handleMouseDown = (e) => { e.preventDefault(); startDrag(e.clientX); };
  const handleMouseMove = (e) => moveDrag(e.clientX);
  const handleMouseUp = (e) => endDrag(e.clientX);
  const handleMouseLeaveContainer = () => {
    isPausedRef.current = false;
    if (dragRef.current.active) dragRef.current.active = false;
  };
  const handleTouchStart = (e) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e) => moveDrag(e.touches[0].clientX);
  const handleTouchEnd = (e) => endDrag(e.changedTouches[0].clientX);

  // جلوگیری از کلیک ناخواسته روی لینک، درست بعد از یک درگ واقعی
  const handleLinkClick = (e) => {
    if (dragRef.current.moved) e.preventDefault();
  };

  if (slides.length === 0) return null;

  return (
    <section className="pt-16 sm:pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-primary-bg aspect-[5/2] select-none cursor-grab active:cursor-grabbing"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={handleMouseLeaveContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* ✅ نسبت عرض/ارتفاع ثابت (۵:۲) در همه‌ی سایزها — با تغییر اندازه صفحه
              فقط کوچک/بزرگ می‌شود، هرگز کش نمی‌آید یا کیفیتش به‌هم نمی‌خورد.
              اسلایدها روی هم (absolute) چیده شدن و با opacity/scale محو-ظاهر می‌شن. */}
          {slides.map((slide, i) => {
            const isActive = i === currentIndex;
            const image = (
              <img
                src={slide.image}
                alt=""
                draggable={false}
                className={`w-full h-full object-cover ${isActive ? "animate-hero-kenburns" : ""}`}
              />
            );
            const content = slide.link ? (
              slide.link.startsWith("/") ? (
                <Link to={slide.link} className="block w-full h-full" onClick={handleLinkClick} draggable={false}>
                  {image}
                </Link>
              ) : (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                  onClick={handleLinkClick}
                >
                  {image}
                </a>
              )
            ) : (
              <div className="w-full h-full">{image}</div>
            );

            return (
              <div
                key={slide.id}
                className="absolute inset-0 overflow-hidden"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: isActive ? 1 : 0,
                }}
              >
                {content}
              </div>
            );
          })}

          {hasMultiple && (
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
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
