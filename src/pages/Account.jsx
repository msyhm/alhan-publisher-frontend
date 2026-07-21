import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../components/PageMeta";
import authService from "../services/authService";

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success("با موفقیت خارج شدید");
    navigate("/");
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center text-text-muted">در حال بارگذاری...</div>;
  }

  return (
    <>
      <PageMeta title="حساب کاربری" description="مدیریت حساب کاربری در انتشارات الحان" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <h1 className="text-3xl font-bold text-primary mb-8">حساب کاربری من</h1>

        <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user?.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="font-bold text-primary text-lg">{user?.name}</p>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          {user?.phone && (
            <p className="text-sm text-text-secondary">
              <span className="text-text-muted">شماره موبایل: </span>{user.phone}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link to="/orders" className="bg-primary-bg rounded-2xl p-5 text-center hover:bg-primary hover:text-white transition-colors">
            <p className="font-bold">📦 سفارش‌های من</p>
          </Link>
          <Link to="/favorites" className="bg-primary-bg rounded-2xl p-5 text-center hover:bg-primary hover:text-white transition-colors">
            <p className="font-bold">💛 علاقه‌مندی‌های من</p>
          </Link>
          <Link to="/books" className="bg-primary-bg rounded-2xl p-5 text-center hover:bg-primary hover:text-white transition-colors">
            <p className="font-bold">مشاهده کتاب‌ها</p>
          </Link>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 rounded-2xl p-5 text-center hover:bg-red-100 transition-colors font-bold">
            خروج از حساب کاربری
          </button>
        </div>
      </div>
    </>
  );
}

export default Account;