import PageMeta from "../components/PageMeta";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSiteSettings from "../hooks/useSiteSettings";

function NotFound() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [countdown, setCountdown] = useState(10);

  // شمارش معکوس برای بازگشت خودکار
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <>
      <PageMeta title="صفحه پیدا نشد" description="صفحه مورد نظر وجود ندارد" noIndex={true} />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-center">

      {/* عدد ۴۰۴ */}
      <div className="relative select-none mb-6">
        <p className="text-[160px] sm:text-[220px] font-black text-primary/5 leading-none">
          ۴۰۴
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-gold rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
            <span className="text-white font-black text-4xl sm:text-5xl -rotate-12">
              {settings.logoLetter || "آ"}
            </span>
          </div>
        </div>
      </div>

      {/* متن */}
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-2">
        صفحه‌ای پیدا نشد
      </h1>
      <p className="text-text-muted mt-3 max-w-md leading-relaxed">
        صفحه‌ای که دنبالش می‌گردید وجود ندارد، حذف شده یا آدرس آن تغییر کرده است.
      </p>

      {/* شمارش معکوس */}
      <div className="mt-6 flex items-center gap-2 text-sm text-text-muted bg-primary-bg px-4 py-2 rounded-full">
        <svg className="w-4 h-4 text-accent animate-spin" style={{ animationDuration: "3s" }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        بازگشت خودکار به صفحه اصلی در
        <span className="font-bold text-accent w-4 text-center">
          {countdown.toLocaleString("fa-IR")}
        </span>
        ثانیه
      </div>

      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/" className="btn-gold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          صفحه اصلی
        </Link>
        <Link to="/books" className="btn-outline flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          مشاهده کتاب‌ها
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="btn-outline flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          صفحه قبلی
        </button>
      </div>

      {/* لوگو پایین */}
      <div className="mt-12 flex items-center gap-2 text-text-muted text-sm">
        <div className="w-7 h-7 bg-gradient-gold rounded-lg flex items-center justify-center shadow">
          <span className="text-white font-bold text-xs">{settings.logoLetter || "آ"}</span>
        </div>
        <span>
          {settings.publisherName} {settings.publisherNameAccent}
        </span>
      </div>

    </div>
  </>
  );
}


export default NotFound;
