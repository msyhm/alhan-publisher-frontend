import { useState, useEffect, useCallback } from "react";
import authorsService from "../services/authorsService";
import useBooks from "./useBooks";

function useAuthors() {
  const { books } = useBooks();
  const [authors, setAuthorsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await authorsService.getAll();
        if (!cancelled) setAuthorsState(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت نویسندگان");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getBooksOf = useCallback(
    (authorName) => books.filter((b) => b.author === authorName),
    [books]
  );

  const addAuthor = useCallback(async (data) => {
    try {
      const newAuthor = await authorsService.create(data);
      setAuthorsState((prev) => [newAuthor, ...prev]);
      return newAuthor;
    } catch (err) {
      setError(err.message || "خطا در افزودن نویسنده");
      throw err;
    }
  }, []);

  const updateAuthor = useCallback(async (id, data) => {
    try {
      const updated = await authorsService.update(id, data);
      setAuthorsState((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err) {
      setError(err.message || "خطا در ویرایش نویسنده");
      throw err;
    }
  }, []);

  const deleteAuthor = useCallback(async (id) => {
    try {
      await authorsService.remove(id);
      setAuthorsState((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message || "خطا در حذف نویسنده");
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (id) => {
    setAuthorsState((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
      )
    );
    try {
      await authorsService.toggleStatus(id);
    } catch (err) {
      setError(err.message || "خطا در تغییر وضعیت");
    }
  }, []);

  return {
    authors,
    loading,
    error,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    toggleStatus,
    getBooksOf,
  };
}

export default useAuthors;
