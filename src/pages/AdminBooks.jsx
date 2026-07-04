import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useBooks from "../hooks/useBooks";
import { toast } from "react-hot-toast";

function AdminBooks() {
  const { books, removeBook } = useBooks();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // فیلتر کتاب‌ها بر اساس جستجو
  const filteredBooks = useMemo(() => {
    if (!search.trim()) return books;
    return books.filter(
      (book) =>
        book.title.includes(search) ||
        (book.authorName || "").includes(search) ||
        (book.category && book.category.includes(search))
    );
  }, [books, search]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const deleteBook = async (id, title) => {
    if (window.confirm(`آیا از حذف کتاب "${title}" اطمینان دارید؟`)) {
      try {
        await removeBook(id);
        toast.success(`کتاب "${title}" با موفقیت حذف شد`);
      } catch (err) {
        toast.error(err.message || "خطا در حذف کتاب");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">
      {/* ===== هدر ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">مدیریت</span>
            <span className="text-accent"> کتاب‌ها</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2"></div>
          <p className="mt-2 text-text-secondary text-sm">
            {filteredBooks.length} کتاب در سیستم ثبت شده است
          </p>
        </div>
        <Link
          to="/admin/books/add"
          className="btn-gold flex items-center gap-2 text-sm shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          افزودن کتاب
        </Link>
      </div>

      {/* ===== جستجو ===== */}
      <div className="bg-white rounded-2xl shadow-elegant p-4 mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="جستجوی کتاب، نویسنده یا دسته‌بندی..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-2 border-primary-light/30 rounded-xl p-3 pr-10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
      </div>

      {/* ===== جدول ===== */}
      <div className="bg-white rounded-3xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[700px]">
            <thead className="bg-primary-bg">
              <tr>
                <th className="p-4 text-sm font-bold text-primary">#</th>
                <th className="p-4 text-sm font-bold text-primary">تصویر</th>
                <th className="p-4 text-sm font-bold text-primary">عنوان</th>
                <th className="p-4 text-sm font-bold text-primary">نویسنده</th>
                <th className="p-4 text-sm font-bold text-primary">دسته‌بندی</th>
                <th className="p-4 text-sm font-bold text-primary">سال</th>
                <th className="p-4 text-sm font-bold text-primary">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    {search ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هیچ کتابی ثبت نشده است"}
                  </td>
                </tr>
              ) : (
                paginatedBooks.map((book, index) => (
                  <tr
                    key={book.id}
                    className="border-t border-primary-light/10 hover:bg-primary-bg/30 transition-colors"
                  >
                    <td className="p-4 text-text-muted text-sm">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-lg shadow"
                      />
                    </td>
                    <td className="p-4 font-bold text-primary text-sm">{book.title}</td>
                    <td className="p-4 text-text-secondary text-sm">{book.authorName}</td>
                    <td className="p-4">
                      <span className="bg-primary-bg text-primary text-xs px-3 py-1.5 rounded-full">
                        {book.category || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted text-sm">{book.year || "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/books/edit/${book.id}`}
                          className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          ویرایش
                        </Link>
                        <button
                          onClick={() => deleteBook(book.id, book.title)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
              currentPage === 1
                ? "border-primary-light/30 text-text-muted cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl border-2 transition-all font-bold ${
                  currentPage === pageNum
                    ? "bg-accent border-accent text-white shadow-lg"
                    : "border-primary-light/30 text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages
                ? "border-primary-light/30 text-text-muted cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminBooks;