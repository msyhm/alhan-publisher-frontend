import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../components/PageMeta";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";
import { useCart } from "../context/CartContext";
import ordersService from "../services/ordersService";

const INPUT_CLS = "w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30";

const PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی",
  "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس",
  "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

function Checkout() {
  const navigate = useNavigate();
  const { books } = useBooks();
  const { settings } = useSiteSettings();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    addressLine: "",
  });

  const cartRows = items
    .map((item) => ({ item, book: books.find((b) => b.id === item.bookId) }))
    .filter((row) => row.book);

  const subtotal = cartRows.reduce((sum, { item, book }) => {
    return sum + (book.price ? Number(book.price) * item.quantity : 0);
  }, 0);
  const shippingCost = Number(settings.shippingCost) || 0;
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartRows.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }
    if (!formData.fullName.trim() || !formData.addressLine.trim()) {
      toast.error("لطفاً همه‌ی فیلدهای الزامی را پر کنید");
      return;
    }
    if (!/^09\d{9}$/.test(formData.phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    if (!formData.province) {
      toast.error("استان را انتخاب کنید");
      return;
    }
    if (!/^\d{10}$/.test(formData.postalCode)) {
      toast.error("کد پستی باید ۱۰ رقم باشد");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ordersService.create({
        ...formData,
        items: cartRows.map(({ item }) => ({ bookId: item.bookId, quantity: item.quantity })),
      });
      clearCart();
      toast.success("سفارش شما با موفقیت ثبت شد");
      navigate(`/order-confirmation/${res.order.id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartRows.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-text-muted mb-6">سبد خرید شما خالی است</p>
        <Link to="/books" className="btn-gold inline-block">مشاهده کتاب‌ها</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="تسویه‌حساب" description="تکمیل خرید در انتشارات الحان" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <h1 className="text-3xl font-bold text-primary mb-8">تسویه‌حساب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl shadow-elegant p-6 sm:p-8 space-y-4">
            <h2 className="font-bold text-primary mb-2">آدرس ارسال</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">نام و نام خانوادگی گیرنده *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شماره موبایل *</label>
                <input type="tel" name="phone" dir="ltr" placeholder="09123456789" value={formData.phone} onChange={handleChange} className={INPUT_CLS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">استان *</label>
                <select name="province" value={formData.province} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">— انتخاب کنید —</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">شهر *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className={INPUT_CLS} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">آدرس کامل *</label>
                <textarea name="addressLine" rows={3} value={formData.addressLine} onChange={handleChange} className={`${INPUT_CLS} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">کد پستی *</label>
                <input type="text" name="postalCode" dir="ltr" maxLength={10} value={formData.postalCode} onChange={handleChange} className={INPUT_CLS} />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full mt-2 disabled:opacity-60">
              {isSubmitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
            </button>
          </form>

          <div className="bg-white rounded-3xl shadow-elegant p-6 h-fit">
            <h2 className="font-bold text-primary mb-4">خلاصه سفارش</h2>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cartRows.map(({ item, book }) => (
                <div key={book.id} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-text-secondary truncate">{book.title} × {item.quantity}</span>
                  <span className="text-primary font-medium shrink-0">
                    {book.price ? (Number(book.price) * item.quantity).toLocaleString("fa-IR") : "—"}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-primary-light/10 pt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span>جمع کتاب‌ها</span>
                <span>{subtotal.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>هزینه ارسال</span>
                <span>{shippingCost.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex items-center justify-between font-bold text-primary text-base pt-2 border-t border-primary-light/10">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-accent">{total.toLocaleString("fa-IR")} تومان</span>
              </div>
            </div>
            <p className="text-[11px] text-text-muted mt-4 leading-relaxed">
              پس از ثبت سفارش، همکاران ما برای هماهنگی پرداخت با شما تماس خواهند گرفت.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;