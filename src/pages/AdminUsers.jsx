import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthors from "../hooks/useAuthors";
import ImageUploader from "../components/ui/ImageUploader";

const FIELDS = [
  "حقوق", "ادبیات", "علوم پایه", "مهندسی", "پزشکی",
  "فلسفه", "تاریخ", "اقتصاد", "روانشناسی", "دین و معارف", "سایر",
];

const EMPTY_FORM = {
  name: "", email: "", phone: "", field: "", bio: "", avatar: "", status: "active",
};

const FILTERS = [
  { id: "all",      label: "همه" },
  { id: "active",   label: "فعال" },
  { id: "inactive", label: "غیرفعال" },
];

// ───── Modal ─────────────────────────────────────────────────────────────────
function AuthorModal({ author, onClose, onSave }) {
  const [form, setForm] = useState(author || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "نام الزامی است";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "ایمیل معتبر نیست";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">

          {/* هدر مودال */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {author ? "ویرایش نویسنده" : "افزودن نویسنده جدید"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-primary-bg flex items-center justify-center text-text-muted hover:text-primary transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* آواتار */}
            <ImageUploader
              value={form.avatar}
              onChange={(v) => set("avatar", v)}
              label="تصویر نویسنده (اختیاری)"
            />

            {/* نام */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                نام و نام خانوادگی *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="مثال: دکتر علی رضایی"
                className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 ${
                  errors.name ? "border-red-400" : "border-primary-light/30 focus:border-accent"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* ایمیل + تلفن */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">ایمیل</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="example@mail.com"
                  dir="ltr"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 ${
                    errors.email ? "border-red-400" : "border-primary-light/30 focus:border-accent"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">تلفن</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                />
              </div>
            </div>

            {/* حوزه تخصصی + وضعیت */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">حوزه تخصصی</label>
                <select
                  value={form.field}
                  onChange={(e) => set("field", e.target.value)}
                  className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                >
                  <option value="">انتخاب کنید</option>
                  {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">وضعیت</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
            </div>

            {/* بیوگرافی */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">بیوگرافی کوتاه</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="معرفی کوتاه نویسنده..."
                className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 resize-none"
              />
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-primary-light/10">
            <button onClick={handleSave} className="btn-gold flex-1">
              {author ? "ذخیره تغییرات" : "افزودن نویسنده"}
            </button>
            <button
              onClick={onClose}
              className="btn-outline px-6"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── کارت نویسنده ──────────────────────────────────────────────────────────
function AuthorCard({ author, bookCount, onEdit, onDelete, onToggle }) {
  return (
    <div className={`bg-white rounded-2xl border-2 transition-all hover:shadow-elegant ${
      author.status === "inactive" ? "border-gray-200 opacity-70" : "border-primary-light/20"
    }`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* آواتار */}
          <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-accent/10 flex items-center justify-center border-2 border-primary-light/10">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-accent">{author.name?.charAt(0) || "؟"}</span>
            )}
          </div>

          {/* اطلاعات */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-primary text-sm leading-tight">{author.name}</h3>
                {author.field && (
                  <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full inline-block mt-1">
                    {author.field}
                  </span>
                )}
              </div>
              {/* badge وضعیت */}
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ${
                author.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {author.status === "active" ? "فعال" : "غیرفعال"}
              </span>
            </div>

            {author.email && (
              <p className="text-xs text-text-muted mt-1.5 truncate">
                <a href={`mailto:${author.email}`} className="hover:text-accent transition-colors">
                  {author.email}
                </a>
              </p>
            )}
            {author.phone && (
              <p className="text-xs text-text-muted">{author.phone}</p>
            )}
          </div>
        </div>

        {/* بیوگرافی */}
        {author.bio && (
          <p className="text-xs text-text-secondary mt-3 leading-relaxed line-clamp-2">
            {author.bio}
          </p>
        )}

        {/* آمار کتاب */}
        <div className="mt-4 pt-3 border-t border-primary-light/10 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {bookCount} کتاب در سیستم
          </span>
          <span className="text-xs text-text-muted">
            {new Date(author.createdAt).toLocaleDateString("fa-IR")}
          </span>
        </div>
      </div>

      {/* دکمه‌های عملیات */}
      <div className="border-t border-primary-light/10 flex divide-x divide-x-reverse divide-primary-light/10">
        <button
          onClick={() => onEdit(author)}
          className="flex-1 py-2.5 text-xs font-bold text-primary hover:bg-primary-bg transition-colors rounded-br-2xl"
        >
          ویرایش
        </button>
        <button
          onClick={() => onToggle(author.id)}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
            author.status === "active"
              ? "text-yellow-600 hover:bg-yellow-50"
              : "text-green-600 hover:bg-green-50"
          }`}
        >
          {author.status === "active" ? "غیرفعال‌سازی" : "فعال‌سازی"}
        </button>
        <button
          onClick={() => onDelete(author.id, author.name)}
          className="flex-1 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors rounded-bl-2xl"
        >
          حذف
        </button>
      </div>
    </div>
  );
}

// ───── صفحه اصلی ─────────────────────────────────────────────────────────────
function AdminUsers() {
  const { authors, addAuthor, updateAuthor, deleteAuthor, toggleStatus, getBooksOf } = useAuthors();
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const filtered = useMemo(() => {
    let result = authors;
    if (filter !== "all") result = result.filter((a) => a.status === filter);
    if (search.trim())
      result = result.filter(
        (a) =>
          a.name.includes(search) ||
          (a.email && a.email.includes(search)) ||
          (a.field && a.field.includes(search))
      );
    return result;
  }, [authors, search, filter]);

  const activeCount   = authors.filter((a) => a.status === "active").length;
  const inactiveCount = authors.filter((a) => a.status === "inactive").length;

  const openAdd  = ()       => { setEditingAuthor(null); setModalOpen(true); };
  const openEdit = (author) => { setEditingAuthor(author); setModalOpen(true); };
  const closeModal = ()     => { setModalOpen(false); setEditingAuthor(null); };

  const handleSave = (form) => {
    if (editingAuthor) {
      updateAuthor(editingAuthor.id, form);
      toast.success(`اطلاعات "${form.name}" ویرایش شد`);
    } else {
      addAuthor(form);
      toast.success(`نویسنده "${form.name}" اضافه شد`);
    }
    closeModal();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`آیا از حذف "${name}" اطمینان دارید؟`)) {
      deleteAuthor(id);
      toast.success(`"${name}" حذف شد`);
    }
  };

  const handleToggle = (id) => {
    const author = authors.find((a) => a.id === id);
    toggleStatus(id);
    toast.success(
      author.status === "active"
        ? `"${author.name}" غیرفعال شد`
        : `"${author.name}" فعال شد`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* ===== هدر ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">مدیریت</span>
            <span className="text-accent"> نویسندگان</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2" />
          <p className="mt-2 text-text-secondary text-sm">
            {authors.length} نویسنده ثبت شده —{" "}
            <span className="text-green-600 font-bold">{activeCount} فعال</span>
            {inactiveCount > 0 && (
              <span className="text-gray-400 font-bold"> / {inactiveCount} غیرفعال</span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="btn-outline flex items-center gap-2 text-sm shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            داشبورد
          </Link>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            افزودن نویسنده
          </button>
        </div>
      </div>

      {/* ===== آمار سریع ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "کل نویسندگان", value: authors.length, color: "text-primary", bg: "bg-blue-50" },
          { label: "نویسنده فعال",  value: activeCount,   color: "text-green-700", bg: "bg-green-50" },
          { label: "غیرفعال",      value: inactiveCount,  color: "text-gray-500",  bg: "bg-gray-50" },
          {
            label: "مجموع کتاب‌ها",
            value: authors.reduce((sum, a) => sum + getBooksOf(a.name).length, 0),
            color: "text-accent",
            bg: "bg-accent/5",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ===== جستجو + فیلتر ===== */}
      <div className="bg-white rounded-2xl shadow-elegant p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل یا حوزه تخصصی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-primary-light/30 rounded-xl p-3 pr-10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <div className="flex gap-2 shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                filter === f.id
                  ? "bg-accent border-accent text-white shadow"
                  : "border-primary-light/30 text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== گرید کارت‌ها ===== */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <svg className="w-16 h-16 mx-auto mb-4 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-bold text-primary">
            {search || filter !== "all" ? "نویسنده‌ای با این مشخصات یافت نشد" : "هنوز نویسنده‌ای اضافه نشده است"}
          </p>
          {!search && filter === "all" && (
            <button onClick={openAdd} className="btn-gold mt-4 text-sm">
              افزودن اولین نویسنده
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              bookCount={getBooksOf(author.name).length}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ===== مودال ===== */}
      {modalOpen && (
        <AuthorModal
          author={editingAuthor}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AdminUsers;
