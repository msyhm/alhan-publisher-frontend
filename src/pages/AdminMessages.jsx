import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import { Link } from "react-router-dom";
import useMessages from "../hooks/useMessages";
import { toast } from "react-hot-toast";
import { SkeletonRow } from "../components/LoadingSpinner";
import InlineError from "../components/InlineError";

// ✅ گزینه‌های فیلتر وضعیت خوانده/نخوانده
const FILTERS = [
  { id: "all",    label: "همه پیام‌ها" },
  { id: "unread", label: "نخوانده"      },
  { id: "read",   label: "خوانده‌شده"  },
];

function AdminMessages() {
  // ✅ markAsRead و markAllAsRead و unreadCount از hook فاز ۱
  // ✅ loading و error برای جدول پیام‌ها
  const { messages, setMessages, markAsRead, markAllAsRead, unreadCount, loading, error } = useMessages();

  const [search, setSearch]               = useState("");
  const [filter, setFilter]               = useState("all");
  const [currentPage, setCurrentPage]     = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const itemsPerPage = 10;

  // فیلتر + جستجو
  const filteredMessages = useMemo(() => {
    let result = messages;

    // فیلتر وضعیت خوانده/نخوانده
    if (filter === "unread") result = result.filter((m) => !m.isRead);
    if (filter === "read")   result = result.filter((m) =>  m.isRead);

    // جستجو
    if (search.trim()) {
      result = result.filter(
        (msg) =>
          msg.name.includes(search) ||
          msg.email.includes(search) ||
          (msg.subject && msg.subject.includes(search)) ||
          msg.message.includes(search)
      );
    }

    return result;
  }, [messages, search, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMessages.slice(start, start + itemsPerPage);
  }, [filteredMessages, currentPage]);

  // حذف پیام
  const deleteMessage = (id, name) => {
    if (window.confirm(`آیا از حذف پیام "${name}" اطمینان دارید؟`)) {
      setMessages(messages.filter((msg) => msg.id !== id));
      toast.success(`پیام "${name}" با موفقیت حذف شد`);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setIsModalOpen(false);
      }
    }
  };

  // مشاهده جزئیات — هنگام باز کردن مودال پیام را خوانده علامت می‌زند
  const viewMessage = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.isRead) markAsRead(msg.id);
  };

  // تغییر فیلتر و reset صفحه
  const handleFilterChange = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      {/* ===== هدر ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">مدیریت</span>
            <span className="text-accent"> پیام‌ها</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2"></div>
          <p className="mt-2 text-text-secondary text-sm flex items-center gap-2">
            {filteredMessages.length} پیام
            {/* ✅ badge نخوانده در زیرعنوان هدر */}
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} نخوانده
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ دکمه علامت‌زدن همه به عنوان خوانده‌شده */}
          {unreadCount > 0 && (
            <button
              onClick={() => { markAllAsRead(); toast.success("همه پیام‌ها خوانده شد"); }}
              className="btn-outline text-sm flex items-center gap-2 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              علامت‌زدن همه
            </button>
          )}
          <Link to="/admin" className="btn-outline flex items-center gap-2 text-sm shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* ===== نوار جستجو + فیلتر ===== */}
      <div className="bg-white rounded-2xl shadow-elegant p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* جستجو */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل، موضوع یا متن پیام..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full border-2 border-primary-light/30 rounded-xl p-3 pr-10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>

        {/* ✅ فیلتر خوانده / نخوانده / همه */}
        <div className="flex gap-2 shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                filter === f.id
                  ? "bg-accent border-accent text-white shadow"
                  : "border-primary-light/30 text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
              {/* نشان‌دادن تعداد نخوانده روی دکمه نخوانده */}
              {f.id === "unread" && unreadCount > 0 && (
                <span className={`mr-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  filter === "unread" ? "bg-white text-accent" : "bg-red-500 text-white"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ===== جدول ===== */}
      <div className="bg-white rounded-3xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[700px]">
            <thead className="bg-primary-bg">
              <tr>
                <th className="p-4 text-sm font-bold text-primary">#</th>
                <th className="p-4 text-sm font-bold text-primary">فرستنده</th>
                <th className="p-4 text-sm font-bold text-primary">ایمیل</th>
                <th className="p-4 text-sm font-bold text-primary">موضوع</th>
                <th className="p-4 text-sm font-bold text-primary">وضعیت</th>
                <th className="p-4 text-sm font-bold text-primary">تاریخ</th>
                <th className="p-4 text-sm font-bold text-primary">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="7" className="p-6">
                    <InlineError message={error} onRetry={() => window.location.reload()} />
                  </td>
                </tr>
              ) : loading ? (
                // ✅ چند ردیف اسکلتون به جای اسپینر — تجربه بهتر برای جدول
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} columns={7} />)
              ) : paginatedMessages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    {search || filter !== "all"
                      ? "نتیجه‌ای برای فیلتر انتخابی یافت نشد"
                      : "هیچ پیامی دریافت نشده است"}
                  </td>
                </tr>
              ) : (
                paginatedMessages.map((msg, index) => (
                  <tr
                    key={msg.id}
                    // ✅ ردیف نخوانده پس‌زمینه متفاوت دارد
                    className={`border-t border-primary-light/10 transition-colors ${
                      !msg.isRead
                        ? "bg-blue-50/40 hover:bg-blue-50/70"
                        : "hover:bg-primary-bg/30"
                    }`}
                  >
                    <td className="p-4 text-text-muted text-sm">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        {/* ✅ نقطه آبی برای نخوانده */}
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                            {msg.name.charAt(0)}
                          </div>
                          {!msg.isRead && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <span className={!msg.isRead ? "font-bold text-primary" : "font-medium text-text-secondary"}>
                          {msg.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-sm">
                      <a href={`mailto:${msg.email}`} className="hover:text-accent transition-colors">
                        {msg.email}
                      </a>
                    </td>
                    <td className={`p-4 text-sm ${!msg.isRead ? "font-bold text-primary" : "text-text-secondary"}`}>
                      {msg.subject || "بدون موضوع"}
                    </td>
                    {/* ✅ ستون وضعیت */}
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        msg.isRead
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {msg.isRead ? "خوانده‌شده" : "جدید"}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted text-sm">
                      {new Date(msg.sentAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewMessage(msg)}
                          className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          مشاهده
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id, msg.name)}
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
            if (totalPages <= 5)              pageNum = i + 1;
            else if (currentPage <= 3)        pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else                              pageNum = currentPage - 2 + i;
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

      {/* ===== مودال نمایش پیام ===== */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-scale">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* هدر مودال */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">{selectedMessage.name}</h3>
                    <p className="text-sm text-text-muted">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedMessage(null); }}
                  className="w-8 h-8 rounded-full hover:bg-primary-bg flex items-center justify-center text-text-muted hover:text-primary transition"
                >
                  <Icon name="x" size={16} strokeWidth={2} />
                </button>
              </div>

              {/* اطلاعات */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-primary-bg px-3 py-1.5 rounded-lg text-text-secondary">
                    موضوع: {selectedMessage.subject || "بدون موضوع"}
                  </span>
                  <span className="bg-primary-bg px-3 py-1.5 rounded-lg text-text-secondary">
                    تاریخ: {new Date(selectedMessage.sentAt).toLocaleString("fa-IR")}
                  </span>
                  {/* ✅ نشان‌دادن وضعیت در مودال */}
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    selectedMessage.isRead
                      ? "bg-gray-100 text-gray-500"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedMessage.isRead ? "✓ خوانده‌شده" : "● جدید"}
                  </span>
                </div>

                <div className="bg-primary-bg/30 rounded-2xl p-5">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* دکمه‌ها */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-primary-light/10">
                <a
                  href={`mailto:${selectedMessage.email}?subject=پاسخ به پیام شما`}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  پاسخ به ایمیل
                </a>
                <button
                  onClick={() => deleteMessage(selectedMessage.id, selectedMessage.name)}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
                >
                  حذف پیام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
