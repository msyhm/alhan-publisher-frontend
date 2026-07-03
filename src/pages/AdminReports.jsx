import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useBooks from "../hooks/useBooks";
import useMessages from "../hooks/useMessages";
import useSubmissions from "../hooks/useSubmissions";
import useAuthors from "../hooks/useAuthors";

// ─── ابزارهای تاریخ ────────────────────────────────────────────────────────
const MONTHS_FA = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند",
];

// تبدیل ISO string به { jYear, jMonth (1-12) }
function toJalali(isoStr) {
  if (!isoStr) return null;
  try {
    const d = new Date(isoStr);
    // Intl برای تبدیل به شمسی
    const parts = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(d);
    const get = (t) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    return { jYear: get("year"), jMonth: get("month") };
  } catch {
    return null;
  }
}

function currentJalali() {
  return toJalali(new Date().toISOString());
}

// برچسب ماه: "فروردین ۱۴۰۴"
function monthLabel(jYear, jMonth) {
  return `${MONTHS_FA[jMonth - 1]} ${jYear.toLocaleString("fa-IR")}`;
}

// ─── کامپوننت‌های کوچک ─────────────────────────────────────────────────────

function StatCard({ title, value, sub, color, icon }) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub !== undefined && (
          <span className="text-xs font-bold opacity-70">{sub}</span>
        )}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{title}</p>
    </div>
  );
}

// نمودار میله‌ای ساده با divها — بدون کتابخانه
function BarChart({ data, color = "bg-accent", labelKey = "label", valueKey = "value", unit = "" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="w-24 text-left text-text-muted shrink-0 text-xs truncate">
            {item[labelKey]}
          </span>
          <div className="flex-1 bg-primary-bg rounded-full h-5 overflow-hidden">
            <div
              className={`${color} h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
              style={{ width: `${(item[valueKey] / max) * 100}%` }}
            >
              {item[valueKey] > 0 && (
                <span className="text-white text-[10px] font-bold">
                  {item[valueKey]}{unit}
                </span>
              )}
            </div>
          </div>
          <span className="w-6 text-center text-xs font-bold text-primary shrink-0">
            {item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

// جدول ساده
function SimpleTable({ headers, rows, empty = "داده‌ای وجود ندارد" }) {
  if (rows.length === 0)
    return <p className="text-center text-text-muted text-sm py-6">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b-2 border-primary-light/20">
            {headers.map((h) => (
              <th key={h} className="p-3 text-text-muted font-bold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-primary-light/10 hover:bg-primary-bg/30 transition">
              {row.map((cell, j) => (
                <td key={j} className="p-3 text-text-secondary">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── صفحه اصلی ─────────────────────────────────────────────────────────────
function AdminReports() {
  const { books }       = useBooks();
  const { messages }    = useMessages();
  const { submissions } = useSubmissions();
  const { authors }     = useAuthors();

  const now = currentJalali();

  // انتخاب سال برای نمودار ماهانه
  const [selectedYear, setSelectedYear] = useState(now?.jYear ?? 1403);

  // سال‌های موجود در داده‌ها
  const availableYears = useMemo(() => {
    const years = new Set();
    [...messages, ...submissions].forEach((item) => {
      const j = toJalali(item.sentAt || item.submittedAt);
      if (j) years.add(j.jYear);
    });
    if (now) years.add(now.jYear);
    return [...years].sort((a, b) => b - a);
  }, [messages, submissions]);

  // ─── آمار کلی ─────────────────────────────────────────────────────────────
  const totalStats = useMemo(() => {
    const thisMonth = messages.filter((m) => {
      const j = toJalali(m.sentAt);
      return j && j.jYear === now?.jYear && j.jMonth === now?.jMonth;
    }).length;

    const pendingSub = submissions.filter(
      (s) => s.status === "در انتظار بررسی"
    ).length;

    const approvedSub = submissions.filter(
      (s) => s.status === "تأیید شده"
    ).length;

    const audioBooks = books.filter((b) => b.isAudio).length;

    return { thisMonth, pendingSub, approvedSub, audioBooks };
  }, [books, messages, submissions, now]);

  // ─── داده ماهانه برای نمودار ─────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    return MONTHS_FA.map((label, idx) => {
      const month = idx + 1;
      const msgCount = messages.filter((m) => {
        const j = toJalali(m.sentAt);
        return j && j.jYear === selectedYear && j.jMonth === month;
      }).length;
      const subCount = submissions.filter((s) => {
        const j = toJalali(s.submittedAt);
        return j && j.jYear === selectedYear && j.jMonth === month;
      }).length;
      return { label, پیام: msgCount, ارسال: subCount };
    });
  }, [messages, submissions, selectedYear]);

  // ─── دسته‌بندی کتاب‌ها ───────────────────────────────────────────────────
  const categoryStats = useMemo(() => {
    const map = {};
    books.forEach((b) => {
      const cat = b.category || "سایر";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [books]);

  // ─── آمار نویسندگان ───────────────────────────────────────────────────────
  const authorStats = useMemo(() => {
    return authors
      .map((a) => ({
        name: a.name,
        count: books.filter((b) => b.author === a.name).length,
        field: a.field || "—",
      }))
      .filter((a) => a.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [authors, books]);

  // ─── وضعیت آثار ارسالی ───────────────────────────────────────────────────
  const submissionStatus = useMemo(() => {
    const map = {};
    submissions.forEach((s) => {
      map[s.status] = (map[s.status] || 0) + 1;
    });
    const colors = {
      "در انتظار بررسی": "bg-yellow-400",
      "در حال بررسی":    "bg-blue-400",
      "تأیید شده":       "bg-green-500",
      "رد شده":          "bg-red-400",
    };
    return Object.entries(map).map(([label, value]) => ({
      label, value, color: colors[label] || "bg-gray-400",
    }));
  }, [submissions]);

  // ─── آخرین فعالیت‌ها ─────────────────────────────────────────────────────
  const recentActivity = useMemo(() => {
    const items = [
      ...messages.map((m) => ({
        type: "پیام",
        title: m.name,
        detail: m.subject || "بدون موضوع",
        date: m.sentAt,
        badge: "bg-green-100 text-green-700",
      })),
      ...submissions.map((s) => ({
        type: "اثر",
        title: s.title,
        detail: s.fullName,
        date: s.submittedAt,
        badge: "bg-blue-100 text-blue-700",
      })),
    ];
    return items
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [messages, submissions]);

  // ─── رندر ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* ===== هدر ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">گزارش</span>
            <span className="text-accent"> آماری</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2" />
          <p className="mt-2 text-text-secondary text-sm">
            نمای کلی عملکرد سایت و فعالیت‌های ماهانه
          </p>
        </div>
        <Link to="/admin" className="btn-outline flex items-center gap-2 text-sm shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          داشبورد
        </Link>
      </div>

      {/* ===== کارت‌های آمار کلی ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="کل کتاب‌ها"     value={books.length}       icon="📚" color="bg-blue-50 text-blue-800"   sub={`${books.filter(b=>b.isAudio).length} صوتی`} />
        <StatCard title="کل پیام‌ها"     value={messages.length}    icon="✉️" color="bg-green-50 text-green-800" sub={`${totalStats.thisMonth} این ماه`} />
        <StatCard title="آثار ارسالی"   value={submissions.length} icon="📄" color="bg-purple-50 text-purple-800" sub={`${totalStats.pendingSub} در انتظار`} />
        <StatCard title="نویسندگان"     value={authors.length}     icon="✍️" color="bg-amber-50 text-amber-800"  sub={`${totalStats.approvedSub} تأیید شده`} />
      </div>

      {/* ===== نمودار ماهانه ===== */}
      <div className="bg-white rounded-3xl shadow-elegant p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary">فعالیت ماهانه</h2>
            <p className="text-xs text-text-muted mt-0.5">تعداد پیام‌های دریافتی و آثار ارسالی در هر ماه</p>
          </div>
          {/* انتخاب سال */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-text-muted">سال:</span>
            <div className="flex gap-1">
              {availableYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all ${
                    selectedYear === y
                      ? "bg-accent border-accent text-white"
                      : "border-primary-light/30 text-text-secondary hover:border-accent hover:text-accent"
                  }`}
                >
                  {y.toLocaleString("fa-IR")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-3 h-3 rounded-full bg-accent inline-block" />
            پیام‌های دریافتی
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
            آثار ارسالی
          </span>
        </div>

        {/* نمودار پیام‌ها */}
        <div className="mb-6">
          <p className="text-xs font-bold text-accent mb-2">پیام‌های دریافتی</p>
          <BarChart data={monthlyData} labelKey="label" valueKey="پیام" color="bg-accent" />
        </div>

        {/* نمودار آثار */}
        <div>
          <p className="text-xs font-bold text-blue-500 mb-2">آثار ارسالی</p>
          <BarChart data={monthlyData} labelKey="label" valueKey="ارسال" color="bg-blue-400" />
        </div>
      </div>

      {/* ===== ردیف دوم: دسته‌بندی + وضعیت آثار ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* دسته‌بندی کتاب‌ها */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <h2 className="text-lg font-bold text-primary mb-1">کتاب‌ها بر اساس دسته‌بندی</h2>
          <p className="text-xs text-text-muted mb-5">توزیع {books.length} کتاب در دسته‌های مختلف</p>
          {categoryStats.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-6">کتابی ثبت نشده است</p>
          ) : (
            <BarChart data={categoryStats} color="bg-primary" />
          )}
        </div>

        {/* وضعیت آثار ارسالی */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <h2 className="text-lg font-bold text-primary mb-1">وضعیت آثار ارسالی</h2>
          <p className="text-xs text-text-muted mb-5">مجموع {submissions.length} اثر ارسال شده</p>
          {submissionStatus.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-6">اثری ارسال نشده است</p>
          ) : (
            <div className="space-y-3">
              {submissionStatus.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-text-muted shrink-0">{s.label}</span>
                  <div className="flex-1 bg-primary-bg rounded-full h-5 overflow-hidden">
                    <div
                      className={`${s.color} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                      style={{ width: `${(s.value / submissions.length) * 100}%` }}
                    >
                      {s.value > 0 && (
                        <span className="text-white text-[10px] font-bold">{s.value}</span>
                      )}
                    </div>
                  </div>
                  <span className="w-8 text-center text-xs font-bold text-primary shrink-0">
                    {Math.round((s.value / submissions.length) * 100)}٪
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== ردیف سوم: پرکارترین نویسندگان + آخرین فعالیت‌ها ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* پرکارترین نویسندگان */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <h2 className="text-lg font-bold text-primary mb-1">پرکارترین نویسندگان</h2>
          <p className="text-xs text-text-muted mb-5">بر اساس تعداد کتاب در سیستم</p>
          <SimpleTable
            headers={["نویسنده", "حوزه", "کتاب"]}
            rows={authorStats.map((a, i) => [
              <span key="n" className="flex items-center gap-2 font-bold text-primary">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {a.name}
              </span>,
              <span key="f" className="text-xs bg-primary-bg px-2 py-0.5 rounded-full">{a.field}</span>,
              <span key="c" className="font-bold text-accent">{a.count}</span>,
            ])}
            empty="هیچ نویسنده‌ای با کتاب ثبت‌شده وجود ندارد"
          />
        </div>

        {/* آخرین فعالیت‌ها */}
        <div className="bg-white rounded-3xl shadow-elegant p-6">
          <h2 className="text-lg font-bold text-primary mb-1">آخرین فعالیت‌ها</h2>
          <p className="text-xs text-text-muted mb-5">جدیدترین پیام‌ها و آثار ارسالی</p>
          {recentActivity.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-6">فعالیتی ثبت نشده است</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const j = toJalali(item.date);
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-bg transition">
                    <span className={`shrink-0 mt-0.5 text-xs px-2 py-0.5 rounded-full font-bold ${item.badge}`}>
                      {item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">{item.title}</p>
                      <p className="text-xs text-text-muted truncate">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-text-muted whitespace-nowrap">
                      {j ? `${MONTHS_FA[j.jMonth - 1]} ${j.jYear.toLocaleString("fa-IR")}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default AdminReports;
