import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";
import useBooks from "../../hooks/useBooks";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSiteSettings();
  const { books }    = useBooks();

  useEffect(() => { setIsVisible(true); }, []);

  const featuredBook = settings.featuredBookId
    ? books.find((b) => String(b.id) === String(settings.featuredBookId))
    : books[books.length - 1] || null; // ✅ اگر ادمین انتخاب نکرده، آخرین کتاب


  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-primary">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse-gold"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-light/5 rounded-full blur-3xl animate-pulse-gold" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-accent/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-accent/10 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ===== ستون چپ: متن ===== */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-accent-light text-sm font-medium">انتشارات علمی و فرهنگی</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">{settings.publisherName}</span>
              <br />
              <span className="text-gradient-gold">{settings.publisherNameAccent}</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-light max-w-lg leading-relaxed">
              {settings.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/books" className="group btn-gold flex items-center justify-center gap-2 text-base">
                <span>مشاهده کتاب‌ها</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/submit-book" className="group btn-outline flex items-center justify-center gap-2 text-base border-white/30 text-white hover:bg-white/10 hover:border-white">
                <span>ارسال اثر</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>

          </div>

          {/* ===== ستون راست: کارت کتاب ===== */}
          <div className={`hidden lg:flex justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="relative w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-gold rounded-3xl blur-2xl opacity-30 animate-pulse-gold"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="flex flex-col items-center">

                    {/* ── تصویر جلد یا لوگو ── */}
                    <div className="w-32 h-44 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                      {featuredBook && featuredBook.image ? (
                        <img
                          src={featuredBook.image}
                          alt={featuredBook.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // اگر تصویر لود نشد حرف لوگو را نشان بده
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      {/* fallback: حرف لوگو */}
                      <div
                        className="w-full h-full bg-gradient-gold flex items-center justify-center"
                        style={{ display: featuredBook && featuredBook.image ? "none" : "flex" }}
                      >
                        <span className="text-white text-6xl font-bold">{settings.logoLetter}</span>
                      </div>
                    </div>

                    {/* ── اطلاعات کتاب ── */}
                    <div className="mt-6 text-center">
                      <p className="text-white/60 text-xs tracking-widest uppercase mb-1">اثر پیشنهادی</p>
                      <p className="text-white font-bold text-lg leading-snug">
                        {featuredBook ? featuredBook.title : "کتاب ویژه"}
                      </p>
                      <p className="text-accent-light text-sm mt-1">
                        {featuredBook ? featuredBook.authorName : "انتشارات الحان"}
                      </p>
                      {featuredBook && (
                        <Link
                          to={`/books/${featuredBook.id}`}
                          className="inline-block mt-3 text-xs text-accent-light/70 hover:text-accent-light underline underline-offset-2 transition-colors"
                        >
                          مشاهده کتاب ←
                        </Link>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* آیکون‌های تزئینی */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float">
                <Icon name="book" size={22} strokeWidth={1.5} className="text-accent" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                <Icon name="pen" size={22} strokeWidth={1.5} className="text-accent" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
