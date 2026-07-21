import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMessages from "../../hooks/useMessages";
import useSiteSettings from "../../hooks/useSiteSettings";
import { useAdminCredentials } from "../../hooks/useSiteSettings";
import { clearAdminSession } from "../ProtectedRoute";
import Icon from "../ui/Icon";

const NAV_ITEMS = [
  { to: "/admin",             label: "داشبورد",         icon: "home",     end: true  },
  { to: "/admin/books",       label: "مدیریت کتاب‌ها",  icon: "books"                },
  { to: "/admin/messages",    label: "پیام‌ها",          icon: "envelope", badge: true},
  { to: "/admin/reviews",     label: "نظرات",           icon: "reviews"           },  
  { to: "/admin/submissions", label: "آثار ارسالی",     icon: "document"           },
  { to: "/admin/orders",      label: "سفارش‌ها",         icon: "orders" },
  { to: "/admin/users",       label: "نویسندگان",       icon: "user"               },
  { to: "/admin/reports",     label: "گزارش آماری",     icon: "chart"              },
  { to: "/admin/settings",    label: "تنظیمات",         icon: "settings"           },
];

// ─── NavItem ────────────────────────────────────────────────────────────────
function NavItem({ item, collapsed, unreadCount, onClick }) {
  const location = useLocation();
  const isActive = item.end
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  return (
    <Link
      to={item.to}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-accent text-white shadow-lg shadow-accent/30"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="shrink-0">
        <Icon name={item.icon} size={20} strokeWidth={1.5} />
      </span>
      <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
        collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
      }`}>
        {item.label}
      </span>
      {item.badge && unreadCount > 0 && (
        <span className={`shrink-0 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary transition-all ${
          collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto min-w-[20px] h-5 px-1"
        }`}>
          {unreadCount > 99 ? "۹۹+" : unreadCount}
        </span>
      )}
      {collapsed && (
        <span className="absolute right-full mr-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {item.label}
          {item.badge && unreadCount > 0 && (
            <span className="mr-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function AdminSidebar({ collapsed, onToggle, onMobileClose, isMobile }) {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { credentials } = useAdminCredentials();
  const { unreadCount } = useMessages();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    if (showLogoutConfirm) {
      clearAdminSession();
      navigate("/admin/login", { replace: true });
    } else {
      setShowLogoutConfirm(true);
      // ۳ ثانیه بعد تأیید را ریست کن
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  return (
    <aside className={`flex flex-col h-full bg-primary transition-all duration-300 ${
      collapsed && !isMobile ? "w-[68px]" : "w-64"
    }`}>

      {/* ─── هدر ─── */}
      <div className={`flex items-center border-b border-white/10 shrink-0 ${
        collapsed && !isMobile ? "justify-center py-4 px-2" : "justify-between py-4 px-4"
      }`}>
        {(!collapsed || isMobile) && (
          <Link
            to="/admin"
            onClick={isMobile ? onMobileClose : undefined}
            className="flex items-center gap-2.5 min-w-0"
          >
            <div className="w-9 h-9 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <span className="text-white font-bold text-base">{settings.logoLetter || "آ"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">{settings.publisherName}</p>
              <p className="text-accent text-xs font-bold leading-tight">{settings.publisherNameAccent}</p>
            </div>
          </Link>
        )}
        {collapsed && !isMobile && (
          <div className="w-9 h-9 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-base">{settings.logoLetter || "آ"}</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
            title={collapsed ? "باز کردن منو" : "بستن منو"}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <Icon name="x" size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* ✅ نمایش نام ادمین — فقط در حالت باز */}
      {(!collapsed || isMobile) && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 bg-white/5 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">
              {credentials.adminUsername || "admin"}
            </p>
            <p className="text-white/40 text-[10px]">مدیر سیستم</p>
          </div>
          <span className="shrink-0 w-2 h-2 rounded-full bg-green-400 mr-auto" title="آنلاین" />
        </div>
      )}

      {/* ─── ناوبری ─── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            collapsed={collapsed && !isMobile}
            unreadCount={unreadCount}
            onClick={isMobile ? onMobileClose : undefined}
          />
        ))}
      </nav>

      {/* ─── فوتر sidebar ─── */}
      <div className="shrink-0 border-t border-white/10 p-2 space-y-1">
        <Link
          to="/"
          target="_blank"
          onClick={isMobile ? onMobileClose : undefined}
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all group"
        >
          <svg className="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${
            collapsed && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}>
            مشاهده سایت
          </span>
          {collapsed && !isMobile && (
            <span className="absolute right-full mr-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
              مشاهده سایت
            </span>
          )}
        </Link>

        {/* ✅ دکمه خروج با تأیید دو مرحله‌ای */}
        <button
          onClick={handleLogout}
          className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
            showLogoutConfirm
              ? "bg-red-500/30 text-red-300 animate-pulse"
              : "text-red-400 hover:bg-red-500/20 hover:text-red-300"
          }`}
        >
          <svg className="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${
            collapsed && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}>
            {showLogoutConfirm ? "تأیید خروج؟" : "خروج از پنل"}
          </span>
          {collapsed && !isMobile && (
            <span className="absolute right-full mr-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
              {showLogoutConfirm ? "تأیید خروج؟" : "خروج"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── Layout اصلی ─────────────────────────────────────────────────────────────
function AdminLayout({ children }) {
  const location  = useLocation();
  const { unreadCount } = useMessages();

  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("adminSidebarCollapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("adminSidebarCollapsed", String(next));
  };

  const currentItem = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background" dir="rtl">

      {/* ─── Sidebar دسکتاپ ─── */}
      <div className="hidden lg:flex flex-col shrink-0">
        <AdminSidebar collapsed={collapsed} onToggle={toggleCollapsed} isMobile={false} />
      </div>

      {/* ─── Drawer موبایل ─── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}
      <div className={`lg:hidden fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 shadow-2xl ${
        mobileOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <AdminSidebar collapsed={false} onMobileClose={() => setMobileOpen(false)} isMobile={true} />
      </div>

      {/* ─── محتوا ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar موبایل */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-primary-light/20 shadow-sm shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-primary text-sm">
            {currentItem?.label ?? "پنل مدیریت"}
          </span>
          <Link
            to="/admin/messages"
            className="relative w-9 h-9 rounded-xl border-2 border-primary-light/20 flex items-center justify-center text-primary hover:bg-primary-bg transition"
          >
            <Icon name="envelope" size={18} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "۹+" : unreadCount}
              </span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
