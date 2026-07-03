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
    <section className="py-16 sm:py-24 bg-primary-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* هدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent text-sm mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            کتاب ویژه
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="text-primary">معرفی</span>
            <span className="text-accent"> کتاب برگزیده</span>
          </h2>
        </div>

        {/* کارت اصلی */}
        <div className="bg-white rounded-3xl shadow-elegant-hover overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ─── تصویر ─── */}
            <div className="relative bg-gradient-primary overflow-hidden min-h-[320px] lg:min-h-0">
              {/* پس‌زمینه تزئینی */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
              </div>

              <div className="relative flex items-center justify-center h-full py-12 px-8">
                <div className="relative">
                  {/* سایه پشت جلد */}
                  <div className="absolute inset-0 bg-accent/30 rounded-2xl blur-2xl scale-105 opacity-60" />
                  {/* جلد کتاب */}
                  <div className="relative w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    {/* نشان «کتاب ویژه» روی جلد */}
                    <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                      ویژه
                    </div>
                    {book.isAudio && (
                      <div className="absolute bottom-3 left-3 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12M8.464 8.464a5 5 0 000 7.072" />
                        </svg>
                        صوتی
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── اطلاعات ─── */}
            <div className="flex flex-col justify-center p-8 sm:p-12">

              {book.category && (
                <span className="inline-block self-start bg-accent/10 text-accent text-sm font-bold px-3 py-1 rounded-full mb-4">
                  {book.category}
                </span>
              )}

              <h3 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                {book.title}
              </h3>

              <p className="text-text-secondary mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {book.author}
              </p>

              {/* اطلاعات نشر */}
              <div className="flex flex-wrap gap-3 mt-4">
                {book.year && (
                  <span className="text-xs bg-primary-bg text-text-secondary px-3 py-1.5 rounded-lg">
                    سال {book.year}
                  </span>
                )}
                {book.pages && (
                  <span className="text-xs bg-primary-bg text-text-secondary px-3 py-1.5 rounded-lg">
                    {book.pages} صفحه
                  </span>
                )}
                {book.edition && (
                  <span className="text-xs bg-primary-bg text-text-secondary px-3 py-1.5 rounded-lg">
                    چاپ {book.edition}
                  </span>
                )}
                {book.isbn && (
                  <span className="text-xs bg-primary-bg text-text-secondary px-3 py-1.5 rounded-lg" dir="ltr">
                    ISBN: {book.isbn}
                  </span>
                )}
              </div>

              {/* توضیحات */}
              {book.description && (
                <p className="text-text-secondary mt-5 leading-relaxed line-clamp-4">
                  {book.description}
                </p>
              )}

              {/* قیمت + دکمه */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  {book.price ? (
                    <>
                      <p className="text-xs text-text-muted">قیمت</p>
                      <p className="text-2xl font-bold text-accent">
                        {Number(book.price).toLocaleString("fa-IR")}
                        <span className="text-sm font-normal text-text-muted mr-1">تومان</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-primary">تماس برای خرید</p>
                  )}
                </div>
                <Link
                  to={`/books/${book.id}`}
                  className="btn-gold flex items-center gap-2 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
                  </svg>
                  مشاهده کتاب
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
