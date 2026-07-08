import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import { Link } from "react-router-dom";
import useSubmissions from "../hooks/useSubmissions";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = [
  "در انتظار بررسی",
  "در حال بررسی",
  "تأیید شده",
  "رد شده",
];

function AdminSubmissions() {
  const { submissions, setSubmissions } = useSubmissions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // فیلتر آثار
  const filteredSubmissions = useMemo(() => {
    let result = submissions;
    
    if (search.trim()) {
      result = result.filter(
        (sub) =>
          sub.title.includes(search) ||
          sub.fullName.includes(search) ||
          sub.email.includes(search) ||
          (sub.category && sub.category.includes(search))
      );
    }

    if (statusFilter !== "همه") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    return result;
  }, [submissions, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(start, start + itemsPerPage);
  }, [filteredSubmissions, currentPage]);

  // به‌روزرسانی وضعیت
  const updateStatus = (id, newStatus) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    toast.success(`وضعیت اثر به "${newStatus}" تغییر یافت`);
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  // حذف اثر
  const deleteSubmission = (id, title) => {
    if (window.confirm(`آیا از حذف اثر "${title}" اطمینان دارید؟`)) {
      const updated = submissions.filter((sub) => sub.id !== id);
      setSubmissions(updated);
      toast.success(`اثر "${title}" با موفقیت حذف شد`);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
        setIsModalOpen(false);
      }
    }
  };

  // مشاهده جزئیات
  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  // آمار وضعیت‌ها
  const statusCounts = {
    همه: submissions.length,
    "در انتظار بررسی": submissions.filter((s) => s.status === "در انتظار بررسی").length,
    "در حال بررسی": submissions.filter((s) => s.status === "در حال بررسی").length,
    "تأیید شده": submissions.filter((s) => s.status === "تأیید شده").length,
    "رد شده": submissions.filter((s) => s.status === "رد شده").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "در انتظار بررسی":
        return "bg-yellow-100 text-yellow-700";
      case "در حال بررسی":
        return "bg-blue-100 text-blue-700";
      case "تأیید شده":
        return "bg-green-100 text-green-700";
      case "رد شده":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* ===== هدر ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">مدیریت</span>
            <span className="text-accent"> آثار ارسالی</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2"></div>
          <p className="mt-2 text-text-secondary text-sm">
            {filteredSubmissions.length} اثر ارسال شده است
          </p>
        </div>
        <Link
          to="/admin"
          className="btn-outline flex items-center gap-2 text-sm shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت به داشبورد
        </Link>
      </div>

      {/* ===== فیلترها ===== */}
      <div className="bg-white rounded-2xl shadow-elegant p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* جستجو */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجوی عنوان، نویسنده، ایمیل..."
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

          {/* فیلتر وضعیت */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? "bg-accent text-white shadow-lg"
                    : "bg-primary-bg text-text-secondary hover:bg-primary-bg/70"
                }`}
              >
                {status}
                <span className="mr-1 text-xs opacity-70">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== جدول ===== */}
      <div className="bg-white rounded-3xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[800px]">
            <thead className="bg-primary-bg">
              <tr>
                <th className="p-4 text-sm font-bold text-primary">#</th>
                <th className="p-4 text-sm font-bold text-primary">عنوان اثر</th>
                <th className="p-4 text-sm font-bold text-primary">نویسنده</th>
                <th className="p-4 text-sm font-bold text-primary">دسته‌بندی</th>
                <th className="p-4 text-sm font-bold text-primary">وضعیت</th>
                <th className="p-4 text-sm font-bold text-primary">فایل</th>
                <th className="p-4 text-sm font-bold text-primary">تاریخ</th>
                <th className="p-4 text-sm font-bold text-primary">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    {search || statusFilter !== "همه"
                      ? "نتیجه‌ای برای فیلترهای شما یافت نشد"
                      : "هیچ اثری ارسال نشده است"}
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="border-t border-primary-light/10 hover:bg-primary-bg/30 transition-colors"
                  >
                    <td className="p-4 text-text-muted text-sm">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-bold text-primary text-sm">{sub.title}</td>
                    <td className="p-4 text-text-secondary text-sm">{sub.fullName}</td>
                    <td className="p-4">
                      <span className="bg-primary-bg text-primary text-xs px-3 py-1.5 rounded-full">
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    {/* ✅ FIX: badge فایل حالا قابل کلیک است و مستقیم فایل را باز می‌کند */}
                    <td className="p-4">
                      {sub.hasFile && sub.fileUrl ? (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          مشاهده فایل
                        </a>
                      ) : sub.hasFile ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          دارد
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">ندارد</span>
                      )}
                    </td>
                    <td className="p-4 text-text-muted text-sm">
                      {new Date(sub.submittedAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewSubmission(sub)}
                          className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          مشاهده
                        </button>
                        <button
                          onClick={() => deleteSubmission(sub.id, sub.title)}
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

      {/* ===== مودال نمایش اثر ===== */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-scale">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* هدر مودال */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-primary text-xl">{selectedSubmission.title}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    ارسال‌شده توسط {selectedSubmission.fullName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedSubmission(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-primary-bg flex items-center justify-center text-text-muted hover:text-primary transition"
                >
                  <Icon name="x" size={16} strokeWidth={2} />
                </button>
              </div>

              {/* وضعیت فعلی */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-text-secondary">وضعیت:</span>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="text-xs text-text-muted">
                  کد پیگیری: {selectedSubmission.trackingCode || `AL-${String(selectedSubmission.id).slice(-6)}`}
                </span>
              </div>

              {/* اطلاعات */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">نویسنده</p>
                  <p className="font-bold text-primary mt-0.5">{selectedSubmission.fullName}</p>
                </div>
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">ایمیل</p>
                  <p className="font-bold text-primary mt-0.5">{selectedSubmission.email}</p>
                </div>
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">شماره تماس</p>
                  <p className="font-bold text-primary mt-0.5">{selectedSubmission.phone || "—"}</p>
                </div>
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">دسته‌بندی</p>
                  <p className="font-bold text-primary mt-0.5">{selectedSubmission.category}</p>
                </div>
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">فایل اثر</p>
                  {selectedSubmission.hasFile ? (
                    <div className="mt-0.5">
                      <p className="font-bold text-green-700 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {selectedSubmission.fileName || "فایل آپلود شده"}
                      </p>
                      {selectedSubmission.fileSize && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {selectedSubmission.fileSize < 1024 * 1024
                            ? `${(selectedSubmission.fileSize / 1024).toFixed(0)} KB`
                            : `${(selectedSubmission.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                        </p>
                      )}
                      {/* ✅ FIX: لینک واقعی برای مشاهده/دانلود فایل — قبلاً فقط نام فایل نمایش داده می‌شد */}
                      {selectedSubmission.fileUrl && (
                        <a
                          href={selectedSubmission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-accent hover:text-accent-dark bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          مشاهده / دانلود فایل
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium text-text-muted mt-0.5 text-sm">فایلی ارسال نشده</p>
                  )}
                </div>
                <div className="bg-primary-bg/30 rounded-xl p-3">
                  <p className="text-text-muted text-xs">تاریخ ارسال</p>
                  <p className="font-bold text-primary mt-0.5">
                    {new Date(selectedSubmission.submittedAt).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>

              {/* خلاصه اثر */}
              <div className="mt-4 bg-primary-bg/30 rounded-2xl p-4">
                <h4 className="font-bold text-primary text-sm mb-2">خلاصه اثر</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {selectedSubmission.summary}
                </p>
              </div>

              {selectedSubmission.description && (
                <div className="mt-3 bg-primary-bg/30 rounded-2xl p-4">
                  <h4 className="font-bold text-primary text-sm mb-2">توضیحات تکمیلی</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedSubmission.description}
                  </p>
                </div>
              )}

              {/* تغییر وضعیت */}
              <div className="mt-6 pt-6 border-t border-primary-light/10">
                <p className="text-sm font-medium text-text-secondary mb-3">تغییر وضعیت:</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(selectedSubmission.id, status);
                      }}
                      disabled={selectedSubmission.status === status}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSubmission.status === status
                          ? "bg-primary text-white cursor-default"
                          : "bg-primary-bg hover:bg-accent hover:text-white text-text-secondary"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* دکمه‌ها */}
              <div className="flex gap-3 mt-4">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=پاسخ به ارسال اثر: ${selectedSubmission.title}`}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  ارسال ایمیل به نویسنده
                </a>
                <button
                  onClick={() => deleteSubmission(selectedSubmission.id, selectedSubmission.title)}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
                >
                  حذف اثر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissions;