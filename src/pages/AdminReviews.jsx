import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import reviewsService from "../services/reviewsService";
import InlineError from "../components/InlineError";

const STATUS_TABS = [
  { value: "",          label: "همه" },
  { value: "PENDING",   label: "در انتظار بررسی" },
  { value: "APPROVED",  label: "تاییدشده" },
  { value: "REJECTED",  label: "ردشده" },
];

const STATUS_BADGE = {
  PENDING:  "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};
const STATUS_LABEL = {
  PENDING:  "در انتظار",
  APPROVED: "تاییدشده",
  REJECTED: "ردشده",
};

function Stars({ value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`w-3.5 h-3.5 ${n <= value ? "text-accent" : "text-primary-light/30"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    setError(null);
    reviewsService
      .getAll(statusFilter ? { status: statusFilter } : {})
      .then((res) => setReviews(Array.isArray(res?.reviews) ? res.reviews : []))
      .catch((err) => setError(err.message || "خطا در دریافت نظرات"))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await reviewsService.updateStatus(id, status);
      toast.success(status === "APPROVED" ? "نظر تایید شد" : "نظر رد شد");
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      toast.error(err.message || "خطا در تغییر وضعیت");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("این نظر برای همیشه حذف شود؟")) return;
    setBusyId(id);
    try {
      await reviewsService.remove(id);
      toast.success("نظر حذف شد");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(err.message || "خطا در حذف نظر");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">مدیریت نظرات</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary text-white"
                : "bg-white text-text-secondary border border-primary-light/20 hover:border-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <InlineError message={error} onRetry={fetchReviews} />}

      {loading ? (
        <div className="text-center py-16 text-text-muted">در حال بارگذاری...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-text-muted">نظری در این دسته یافت نشد</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card border border-primary-light/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-primary">{r.user?.name}</span>
                    <span className="text-[11px] text-text-muted">{r.user?.email}</span>
                    <Stars value={r.rating} />
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  {r.book && (
                    <Link to={`/books/${r.book.id}`} target="_blank" className="text-xs text-accent hover:underline mt-1 inline-block">
                      کتاب: {r.book.title}
                    </Link>
                  )}
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">{r.comment}</p>
                  <p className="text-[11px] text-text-muted mt-2">
                    {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.status !== "APPROVED" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "APPROVED")}
                      disabled={busyId === r.id}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      تایید
                    </button>
                  )}
                  {r.status !== "REJECTED" && (
                    <button
                      onClick={() => handleStatusChange(r.id, "REJECTED")}
                      disabled={busyId === r.id}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-50"
                    >
                      رد
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={busyId === r.id}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;