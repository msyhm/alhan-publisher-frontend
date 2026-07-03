import { useMemo } from "react";
import { Link } from "react-router-dom";
import useAuthors from "../../hooks/useAuthors";

function AuthorsSection() {
  const { authors, getBooksOf } = useAuthors();

  // ✅ نویسندگان فعال که حداقل یک کتاب دارند، مرتب بر اساس تعداد کتاب
  const topAuthors = useMemo(() => {
    return authors
      .filter((a) => a.status === "active")
      .map((a) => ({ ...a, bookCount: getBooksOf(a.name).length }))
      .sort((a, b) => b.bookCount - a.bookCount)
      .slice(0, 6);
  }, [authors]);

  if (topAuthors.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ===== هدر ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary text-sm mb-3 border border-primary/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              نویسندگان انتشارات الحان
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse inline-block" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-primary">نویسندگان</span>
              <span className="text-accent"> برتر</span>
            </h2>
            <p className="mt-2 text-text-muted text-sm max-w-xl">
              آشنایی با نویسندگان و پژوهشگران همکار انتشارات الحان
            </p>
          </div>

          <Link
            to="/about"
            className="text-sm text-primary font-bold border-2 border-primary px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all hover:shadow-lg shrink-0"
          >
            درباره ما
          </Link>
        </div>

        {/* ===== گرید نویسندگان ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {topAuthors.map((author, index) => (
            <div
              key={author.id}
              className="group bg-white rounded-2xl shadow-card hover:shadow-elegant-hover transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* آواتار */}
              <div className="relative bg-primary-bg pt-6 pb-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-gold flex items-center justify-center">
                      <span className="text-white font-black text-3xl">
                        {author.name?.charAt(0) || "؟"}
                      </span>
                    </div>
                  )}
                </div>

                {/* badge تعداد کتاب */}
                {author.bookCount > 0 && (
                  <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {author.bookCount}
                  </div>
                )}
              </div>

              {/* اطلاعات */}
              <div className="p-4 text-center">
                <h3 className="font-bold text-primary text-xs leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors">
                  {author.name}
                </h3>
                {author.field && (
                  <span className="inline-block mt-1.5 text-[10px] bg-primary-bg text-text-muted px-2 py-0.5 rounded-full">
                    {author.field}
                  </span>
                )}
                <p className="mt-2 text-[10px] text-text-muted">
                  {author.bookCount} {author.bookCount === 1 ? "کتاب" : "کتاب"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CTA ===== */}
        {authors.length > 6 && (
          <div className="text-center mt-10">
            <p className="text-text-muted text-sm mb-4">
              و {authors.length - 6} نویسنده دیگر همکار انتشارات الحان
            </p>
            <Link
              to="/about"
              className="btn-outline inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              مشاهده همه نویسندگان
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

export default AuthorsSection;
