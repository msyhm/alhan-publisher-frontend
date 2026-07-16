import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../components/PageMeta";
import authService from "../services/authService";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("نام، ایمیل و رمز عبور الزامی است");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        phone:    formData.phone.trim() || undefined,
        password: formData.password,
      });
      toast.success("ثبت‌نام با موفقیت انجام شد! خوش آمدید");
      navigate("/account");
    } catch (err) {
      toast.error(err.message || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="ثبت‌نام" description="ساخت حساب کاربری در انتشارات الحان" />
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20 pt-28">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">ساخت حساب کاربری</h1>
          <p className="text-text-muted text-sm mt-2">برای ثبت نظر و خرید کتاب، حساب بسازید</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">نام و نام خانوادگی *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">ایمیل *</label>
            <input type="email" name="email" dir="ltr" value={formData.email} onChange={handleChange} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره موبایل</label>
            <input type="tel" name="phone" dir="ltr" placeholder="09123456789" value={formData.phone} onChange={handleChange} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">رمز عبور *</label>
            <input type="password" name="password" dir="ltr" value={formData.password} onChange={handleChange} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">تکرار رمز عبور *</label>
            <input type="password" name="confirmPassword" dir="ltr" value={formData.confirmPassword} onChange={handleChange} className={INPUT_CLS} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
            {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>

          <p className="text-center text-sm text-text-muted">
            حساب کاربری دارید؟{" "}
            <Link to="/login" className="text-accent font-bold hover:underline">وارد شوید</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;