import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../components/PageMeta";
import BookCard from "../components/books/BookCard";
import favoritesService from "../services/favoritesService";

function Favorites() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesService
      .getAll()
      .then((res) => setBooks(Array.isArray(res?.books) ? res.books : []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (bookId) => {
    try {
      await favoritesService.remove(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("از علاقه‌مندی‌ها حذف شد");
    } catch (err) {
      toast.error(err.message || "خطا در حذف");
    }
  };

  return (
    <>
      <PageMeta title="علاقه‌مندی‌های من" description="کتاب‌های نشان‌شده در انتشارات الحان" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <h1 className="text-3xl font-bold text-primary mb-8">علاقه‌مندی‌های من</h1>

        {loading ? (
          <div className="text-center py-16 text-text-muted">در حال بارگذاری...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">💛</p>
            <p className="text-text-muted mb-6">هنوز کتابی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
            <Link to="/books" className="btn-gold inline-block">مشاهده کتاب‌ها</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => (
              <div key={book.id} className="relative group">
                <button
                  onClick={() => handleRemove(book.id)}
                  title="حذف از علاقه‌مندی‌ها"
                  className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" clipRule="evenodd" />
                  </svg>
                </button>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Favorites;