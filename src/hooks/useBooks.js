import { useState, useEffect, useCallback } from "react";
import booksService from "../services/booksService";

/**
 * useBooks — حالا از booksService استفاده می‌کند (نه مستقیم localStorage)
 * شامل loading و error state برای آماده‌سازی UI پیش از اتصال بکند واقعی.
 */
function useBooks() {
  const [books, setBooksState] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  // بارگذاری اولیه
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await booksService.getAll();
        if (!cancelled) setBooksState(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت کتاب‌ها");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ سازگار با کد قدیمی: setBooks(newArray) — هم state هم storage را آپدیت می‌کند
  const setBooks = useCallback(async (newBooks) => {
    setBooksState(newBooks); // به‌روزرسانی خوش‌بینانه UI
    try {
      await booksService.setAll(newBooks);
    } catch (err) {
      setError(err.message || "خطا در ذخیره کتاب‌ها");
      throw err;
    }
  }, []);

  // متدهای جدید و دقیق‌تر — برای استفاده تدریجی در صفحات
  const addBook = useCallback(async (bookData) => {
    try {
      const newBook = await booksService.create(bookData);
      setBooksState((prev) => [...prev, newBook]);
      return newBook;
    } catch (err) {
      setError(err.message || "خطا در افزودن کتاب");
      throw err;
    }
  }, []);

  const updateBook = useCallback(async (id, updates) => {
    try {
      const updated = await booksService.update(id, updates);
      setBooksState((prev) => prev.map((b) => (String(b.id) === String(id) ? updated : b)));
      return updated;
    } catch (err) {
      setError(err.message || "خطا در ویرایش کتاب");
      throw err;
    }
  }, []);

  const removeBook = useCallback(async (id) => {
    try {
      await booksService.remove(id);
      setBooksState((prev) => prev.filter((b) => String(b.id) !== String(id)));
    } catch (err) {
      setError(err.message || "خطا در حذف کتاب");
      throw err;
    }
  }, []);

  return {
    books,
    setBooks,    // ✅ سازگار با کد قدیمی (مثل AddBook, EditBook فعلی)
    loading,
    error,
    addBook,     // متدهای جدید برای استفاده تدریجی
    updateBook,
    removeBook,
  };
}

export default useBooks;
