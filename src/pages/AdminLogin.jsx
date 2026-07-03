import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useSiteSettings from "../hooks/useSiteSettings";
import apiClient from "../services/apiClient";

function AdminLogin() {
  const navigate  = useNavigate();
  const { settings } = useSiteSettings();
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ لاگین واقعی با API بکند
      // بکند JWT را در httpOnly cookie ذخیره می‌کند — نیازی به sessionStorage نیست
      const res = await apiClient.post("/auth/login", { username, password });

      toast.success(res.message || "خوش آمدید");
      navigate("/admin");

    } catch (err) {
      // خطای 401 یا هر خطای دیگر
      const message = err.status === 429
        ? "تعداد تلاش‌های ناموفق زیاد است. لطفاً ۱۵ دقیقه دیگر امتحان کنید"
        : err.message || "نام کاربری یا رمز عبور اشتباه است";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{settings.logoLetter}</span>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-primary leading-tight">{settings.publisherName}</h1>
              <span className="text-accent font-bold text-lg leading-tight block -mt-1">{settings.publisherNameAccent}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-elegant-hover p-8 sm:p-10 animate-fade-scale">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary">ورود به پنل مدیریت</h2>
            <p className="mt-1 text-sm text-text-muted">لطفاً اطلاعات خود را وارد کنید</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">نام کاربری</label>
              <div className="relative">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 pr-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                  placeholder="نام کاربری" required autoComplete="username" />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">رمز عبور</label>
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 pr-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                  placeholder="رمز عبور" required autoComplete="current-password" />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-scale">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full btn-gold flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  در حال ورود...
                </>
              ) : "ورود به پنل مدیریت"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
