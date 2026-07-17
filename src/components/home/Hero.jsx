import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";
import useBooks from "../../hooks/useBooks";
import logoWhite from "../../assets/logo-white.png";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSiteSettings();
  const { books } = useBooks();

  useEffect(() => { setIsVisible(true); }, []);

  const featuredBook = settings.featuredBookId
    ? books.find((b) => String(b.id) === String(settings.featuredBookId))
    : books[books.length - 1] || null; // ✅ اگر ادمین انتخاب نکرده، آخرین کتاب

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      {/* خط‌های افقی ظریف، یادآور خطوط متن یک صفحه‌ی چاپی */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 38px, #efe8d8 39px)"
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-end">

          {/* ===== ستون متن: مثل صفحه‌ی عنوان یک کتاب ===== */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="ribbon-tag">
              <Icon name="book" size={14} strokeWidth={2} />
              انتشارات علمی و فرهنگی
            </span>

            <h1 className="font-display mt-7 text-5xl sm:text-6xl md:text-7xl leading-[1.15]">
              <span className="text-white">{settings.publisherName}</span>{" "}
              <span style={{ color: "var(--color-accent-light)" }}>{settings.publisherNameAccent}</span>
            </h1>

            <div className="divider-gold mt-7 mb-6" style={{ background: "var(--color-accent-light)" }}></div>

            <p className="text-lg sm:text-xl text-primary-light max-w-lg leading-relaxed">
              {settings.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link to="/books" className="group btn-gold flex items-center justify-center gap-2 text-base">
                <span>مشاهده کتاب‌ها</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/submit-book" className="group btn-outline flex items-center justify-center gap-2 text-base border-white/30 text-white hover:bg-white/10 hover:border-white">
                <span>ارسال اثر</span>
                <Icon name="pen" size={18} strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {/* ===== ستون کتاب: جلد روی هم، مثل قفسه ===== */}
          <div className={`hidden lg:flex justify-center transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}>
            <div className="relative">
              <div className="w-52 h-72 book-shadow rounded-sm overflow-hidden -rotate-3 hover:rotate-0 transition-transform duration-500">
                {featuredBook && featuredBook.image ? (
                  <img src={featuredBook.image} alt={featuredBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-10" style={{ background: "var(--color-accent)" }}>
                    <img src={logoWhite} alt="انتشارات الحان" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <div className="mt-8 pt-5 border-t border-white/15 text-center">
                <p className="text-white/50 text-[11px] tracking-[0.2em] uppercase font-mono-nums mb-1">اثر پیشنهادی</p>
                <p className="text-white font-bold text-lg leading-snug">
                  {featuredBook ? featuredBook.title : "کتاب ویژه"}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-accent-light)" }}>
                  {featuredBook ? featuredBook.authorName : "انتشارات الحان"}
                </p>
                {featuredBook && (
                  <Link
                    to={`/books/${featuredBook.id}`}
                    className="inline-block mt-3 text-xs text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    مشاهده کتاب ←
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== نوار شناسنامه‌مانند، مثل صفحه‌ی حقوق نشر یک کتاب ===== */}
        <div className="mt-16 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono-nums text-sm">
          <div>
            <p className="text-white/45 text-xs mb-1">تأسیس</p>
            <p className="text-white text-lg">{settings.foundingYear || "—"}</p>
          </div>
          <div>
            <p className="text-white/45 text-xs mb-1">عناوین منتشرشده</p>
            <p className="text-white text-lg">{books.length || "—"}</p>
          </div>
          <div>
            <p className="text-white/45 text-xs mb-1">پروانه‌ی نشر</p>
            <p className="text-white text-lg">{settings.publishLicense || "—"}</p>
          </div>
          <div>
            <p className="text-white/45 text-xs mb-1">حوزه</p>
            <p className="text-white text-lg">علمی و فرهنگی</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
