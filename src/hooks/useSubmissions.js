import { useState, useEffect, useCallback } from "react";
import submissionsService from "../services/submissionsService";

function useSubmissions() {
  const [submissions, setSubmissionsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await submissionsService.getAll();
        if (!cancelled) setSubmissionsState(Array.isArray(data?.submissions) ? data.submissions : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت آثار ارسالی");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ سازگار با کد قدیمی
  const setSubmissions = useCallback(async (newSubmissions) => {
    setSubmissionsState(newSubmissions);
    try {
      await submissionsService.setAll(newSubmissions);
    } catch (err) {
      setError(err.message || "خطا در ذخیره آثار ارسالی");
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    setSubmissionsState((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      await submissionsService.updateStatus(id, status);
    } catch (err) {
      setError(err.message || "خطا در به‌روزرسانی وضعیت");
    }
  }, []);

  const removeSubmission = useCallback(async (id) => {
    setSubmissionsState((prev) => prev.filter((s) => s.id !== id));
    try {
      await submissionsService.remove(id);
    } catch (err) {
      setError(err.message || "خطا در حذف اثر");
    }
  }, []);

  return {
    submissions,
    setSubmissions,
    loading,
    error,
    updateStatus,
    removeSubmission,
  };
}

export default useSubmissions;
