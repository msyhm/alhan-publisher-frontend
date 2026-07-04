import Icon from "../components/ui/Icon";
import { Link } from "react-router-dom";
import useBooks from "../hooks/useBooks";
import useMessages from "../hooks/useMessages";
import useSubmissions from "../hooks/useSubmissions";
import useAuthors from "../hooks/useAuthors";

function AdminDashboard() {
  const { books } = useBooks();
  const { messages, unreadCount } = useMessages();
  const { submissions } = useSubmissions();
  const { authors } = useAuthors();

  const pendingSubmissions = submissions.filter(
    (s) => s.status === "در انتظار بررسی"
  ).length;

  const stats = [
    {
      title: "کل کتاب‌ها",
      value: books.length,
      icon: "books",
      color: "bg-blue-50 text-blue-600",
      link: "/admin/books",
      badge: null,
    },
    {
      title: "پیام‌های دریافتی",
      value: messages.length,
      icon: "envelope",
      color: "bg-green-50 text-green-600",
      link: "/admin/messages",
      badge: unreadCount > 0
        ? { label: `${unreadCount} جدید`, style: "bg-red-50 text-red-600" }
        : null,
    },
    {
      title: "آثار ارسالی",
      value: submissions.length,
      icon: "document",
      color: "bg-purple-50 text-purple-600",
      link: "/admin/submissions",
      badge: pendingSubmissions > 0
        ? { label: `${pendingSubmissions} در انتظار`, style: "bg-yellow-50 text-yellow-700" }
        : null,
    },
    {
      // ✅ کارت نویسندگان به جای کتاب‌های صوتی — لینک به صفحه مدیریت نویسندگان
      title: "نویسندگان",
      value: authors.length,
      icon: "pen",
      color: "bg-amber-50 text-amber-600",
      link: "/admin/users",
      badge: authors.filter((a) => a.status === "active").length > 0
        ? { label: `${authors.filter((a) => a.status === "active").length} فعال`, style: "bg-green-50 text-green-700" }
        : null,
    },
  ];

  const recentBooks = [...books].slice(-5).reverse();
  const recentMessages = [...messages].slice(-5).reverse();
  const recentSubmissions = [...submissions].slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* ===== هدر ===== */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="text-primary">داشبورد</span>
              <span className="text-accent"> مدیریت</span>
            </h1>
            <div className="w-16 h-1 bg-accent rounded-full mt-2"></div>
            <p className="mt-2 text-text-secondary text-sm">
              به پنل مدیریت انتشارات الحان خوش آمدید
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/settings"
              className="btn-outline flex items-center gap-2 text-sm shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              تنظیمات سایت
            </Link>
            <Link
              to="/admin/books/add"
              className="btn-gold flex items-center gap-2 text-sm shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              افزودن کتاب جدید
            </Link>
          </div>
        </div>
      </div>

      {/* ===== لینک‌های سریع ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: "/admin/books/add",  label: "افزودن کتاب",    icon: "book",     color: "bg-blue-50   hover:bg-blue-100   text-blue-700"   },
          { to: "/admin/users",      label: "نویسندگان",       icon: "user",     color: "bg-amber-50  hover:bg-amber-100  text-amber-700"  },
          { to: "/admin/reports",    label: "گزارش آماری",    icon: "chart",    color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
          { to: "/admin/settings",   label: "تنظیمات سایت",   icon: "settings", color: "bg-green-50  hover:bg-green-100  text-green-700"  },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${item.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon === "book" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />}
              {item.icon === "user" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
              {item.icon === "chart" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
              {item.icon === "settings" && <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>}
            </svg>
            <span className="text-xs font-bold">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* ===== آمار ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white rounded-2xl shadow-elegant p-6 hover:shadow-elegant-hover transition-all hover:-translate-y-1 group animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon} size={28} strokeWidth={1.25} />
              </div>
              {/* ✅ FIX: badge واقعی یا خالی — هیچ +۵% هاردکودی وجود ندارد */}
              {stat.badge ? (
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${stat.badge.style}`}>
                  {stat.badge.label}
                </span>
              ) : (
                <span className="w-6" />
              )}
            </div>
            <h3 className="text-3xl font-bold text-primary mt-4">{stat.value}</h3>
            <p className="text-text-muted text-sm">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* ===== فعالیت‌های اخیر ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخرین کتاب‌ها */}
        <div className="bg-white rounded-2xl shadow-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Icon name="books" size={20} strokeWidth={1.5} className="text-accent inline-block" />
              آخرین کتاب‌های اضافه شده
            </h3>
            <Link to="/admin/books" className="text-xs text-accent font-bold hover:underline">
              مشاهده همه
            </Link>
          </div>
          {recentBooks.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">
              هیچ کتابی ثبت نشده است
            </p>
          ) : (
            <div className="space-y-3">
              {recentBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-bg transition">
                  <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary truncate">{book.title}</p>
                    <p className="text-xs text-text-muted">{book.authorName}</p>
                  </div>
                  <span className="text-xs text-text-muted bg-primary-bg px-2 py-1 rounded-full">
                    {book.category || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* آخرین پیام‌ها */}
        <div className="bg-white rounded-2xl shadow-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Icon name="envelope" size={20} strokeWidth={1.5} className="text-accent inline-block" />
              آخرین پیام‌ها
              {/* ✅ badge تعداد نخوانده در هدر لیست */}
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </h3>
            <Link to="/admin/messages" className="text-xs text-accent font-bold hover:underline">
              مشاهده همه
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">
              هیچ پیامی دریافت نشده است
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-center gap-3 p-3 rounded-xl hover:bg-primary-bg transition ${
                    // ✅ پیام نخوانده پس‌زمینه متفاوت دارد
                    !msg.isRead ? "bg-green-50/60 border border-green-100" : ""
                  }`}
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                      {msg.name.charAt(0)}
                    </div>
                    {/* ✅ نقطه قرمز برای پیام نخوانده */}
                    {!msg.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary truncate">{msg.name}</p>
                    <p className="text-xs text-text-muted truncate">{msg.subject || "بدون موضوع"}</p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(msg.sentAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== آثار ارسالی ===== */}
      <div className="mt-6 bg-white rounded-2xl shadow-elegant p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <Icon name="document" size={20} strokeWidth={1.5} className="text-accent inline-block" />
            آخرین آثار ارسالی
            {/* ✅ badge آثار در انتظار بررسی */}
            {pendingSubmissions > 0 && (
              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">
                {pendingSubmissions} در انتظار
              </span>
            )}
          </h3>
          <Link to="/admin/submissions" className="text-xs text-accent font-bold hover:underline">
            مشاهده همه
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">
            هیچ اثری ارسال نشده است
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right border-b border-primary-light/20">
                  <th className="p-3 text-text-muted font-bold">عنوان اثر</th>
                  <th className="p-3 text-text-muted font-bold">نویسنده</th>
                  <th className="p-3 text-text-muted font-bold">دسته‌بندی</th>
                  <th className="p-3 text-text-muted font-bold">وضعیت</th>
                  <th className="p-3 text-text-muted font-bold">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-primary-light/10 hover:bg-primary-bg/30 transition">
                    <td className="p-3 font-bold text-primary">{sub.title}</td>
                    <td className="p-3 text-text-secondary">{sub.fullName}</td>
                    <td className="p-3">
                      <span className="bg-primary-bg text-primary text-xs px-2 py-1 rounded-full">
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        sub.status === "در انتظار بررسی" ? "bg-yellow-100 text-yellow-700" :
                        sub.status === "در حال بررسی"   ? "bg-blue-100 text-blue-700"   :
                        sub.status === "تأیید شده"      ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted text-xs">
                      {new Date(sub.submittedAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
