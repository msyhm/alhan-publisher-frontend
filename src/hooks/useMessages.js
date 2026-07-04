import { useState, useEffect, useCallback, useMemo } from "react";
import messagesService from "../services/messagesService";

function useMessages() {
  const [messages, setMessagesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await messagesService.getAll();
        if (!cancelled) setMessagesState(Array.isArray(data?.messages) ? data.messages : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت پیام‌ها");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ سازگار با کد قدیمی
  const setMessages = useCallback(async (newMessages) => {
    setMessagesState(newMessages);
    try {
      await messagesService.setAll(newMessages);
    } catch (err) {
      setError(err.message || "خطا در ذخیره پیام‌ها");
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    setMessagesState((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    try {
      await messagesService.markAsRead(id);
    } catch (err) {
      setError(err.message || "خطا در به‌روزرسانی پیام");
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setMessagesState((prev) => prev.map((m) => ({ ...m, isRead: true })));
    try {
      await messagesService.markAllAsRead();
    } catch (err) {
      setError(err.message || "خطا در به‌روزرسانی پیام‌ها");
    }
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  return {
    messages,
    setMessages,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };
}

export default useMessages;
