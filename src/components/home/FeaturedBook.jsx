import { Link } from "react-router-dom";
import { useMemo } from "react";
import useBooks from "../../hooks/useBooks";
import useSiteSettings from "../../hooks/useSiteSettings";

function FeaturedBook() {
  const { books }    = useBooks();
  const { settings } = useSiteSettings();

  // ✅ کتاب ویژه: انتخاب ادمین یا آخرین کتاب اضافه‌شده
  const book = useMemo(() => {
    if (settings.featuredBookId) {
      const found = books.find((b) => String(b.id) === String(settings.featuredBookId));
      if (found) return found;
    }
    return books[books.length - 1] || null;
  }, [books, settings.featuredBookId]);

  if (!book) return null;

  return (
    // ✅ فقط زیر lg نمایش داده می‌شود — چون کارت کتاب ویژه‌ی Hero از lg به بالا خودش نشون داده می‌شه
    <section className="py-6 sm:py-10 bg-primary-bg/50 lg:hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-elegant-hover overflow-hidden">
          <div className="grid grid-cols-2">

            {/* ─── تصویر (نسخه‌ی کوچیک‌شده‌ی همون کارت جلد دسکتاپ) ─── */}
            <div className="relative bg-gradient-primary overflow-hidden flex items-center justify-center py-4 px-3">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-accent/30 rounded-xl blur-xl scale-105 opacity-60" />
                <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                    ویژه
                  </span>
                  {book.isAudio && (
                    <span className="absolute bottom-1.5 left-1.5 bg-blue-500/90 text-white text-[9px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                      صوتی
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ─── اطلاعات (نسخه‌ی فشرده‌ی همون بخش دسکتاپ) ─── */}
            <div className="flex flex-col justify-center p-3 sm:p-5">
              {book.category && (
                <span className="self-start text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-1.5">
                  {book.category}
                </span>
              )}

              <h3 className="text-sm sm:text-lg font-bold text-primary leading-snug line-clamp-2">
                {book.title}
              </h3>

              <p className="text-xs sm:text-sm text-text-secondary mt-1 flex items-center gap-1 truncate">
                <svg className="w-3 h-3 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {book.authorName}
              </p>

              {book.description && (
                <p className="text-[11px] sm:text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                  {book.description}
                </p>
              )}

              <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
                <div>
                  {book.price ? (
                    <p className="text-xs sm:text-base font-bold text-accent">
                      {Number(book.price).toLocaleString("fa-IR")}
                      <span className="text-[9px] sm:text-[10px] font-normal text-text-muted mr-0.5">تومان</span>
                    </p>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-text-muted">تماس برای خرید</p>
                  )}
                </div>
                <Link
                  to={`/books/${book.id}`}
                  className="btn-gold text-[11px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2 shrink-0"
                >
                  مشاهده
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBook;