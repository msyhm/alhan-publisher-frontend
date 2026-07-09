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
    <section className="py-5 sm:py-8 bg-primary-bg/50 lg:hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link
          to={`/books/${book.id}`}
          className="group flex items-stretch h-28 sm:h-36 bg-white rounded-2xl shadow-elegant-hover overflow-hidden border border-primary/5 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* ─── تصویر (کوچک، فقط به‌اندازه‌ی ارتفاع کارت) ─── */}
          <div className="relative w-20 sm:w-28 shrink-0 bg-gradient-primary overflow-hidden">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
              ویژه
            </span>
          </div>

          {/* ─── محتوا (فشرده) ─── */}
          <div className="flex-1 min-w-0 flex flex-col justify-center px-3 sm:px-4 py-2">
            {book.category && (
              <span className="self-start text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-1">
                {book.category}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-bold text-primary leading-snug line-clamp-1">
              {book.title}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 truncate">{book.authorName}</p>

            <div className="mt-auto pt-1.5 flex items-center justify-between gap-2">
              {book.price ? (
                <p className="text-xs sm:text-sm font-bold text-accent">
                  {Number(book.price).toLocaleString("fa-IR")}
                  <span className="text-[10px] font-normal text-text-muted mr-0.5">تومان</span>
                </p>
              ) : (
                <p className="text-[11px] text-text-muted">تماس برای خرید</p>
              )}
              <span className="text-[11px] font-bold text-primary group-hover:text-accent transition-colors shrink-0 flex items-center gap-1">
                مشاهده
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedBook;