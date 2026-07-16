import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../components/PageMeta";
import authService from "../services/authService";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("ایمیل و رمز عبور الزامی است");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.login({ email: email.trim(), password });
      toast.success("خوش آمدید!");
      const redirectTo = location.state?.from || "/account";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || "ایمیل یا رمز عبور اشتباه است");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="ورود" description="ورود به حساب کاربری انتشارات الحان" />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20 pt-28">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">ورود به حساب کاربری</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">ایمیل</label>
            <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">رمز عبور</label>
            <input type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT_CLS} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
            {isSubmitting ? "در حال ورود..." : "ورود"}
          </button>

          <p className="text-center text-sm text-text-muted">
            حساب کاربری ندارید؟{" "}
            <Link to="/register" className="text-accent font-bold hover:underline">ثبت‌نام کنید</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;