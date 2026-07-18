import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

function Checkout() {
  return (
    <>
      <PageMeta title="تسویه‌حساب" description="تکمیل خرید در انتشارات الحان" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center">
        <p className="text-6xl mb-4">🚧</p>
        <h1 className="text-2xl font-bold text-primary">تسویه‌حساب به‌زودی فعال می‌شود</h1>
        <p className="text-text-muted mt-3">این بخش (ثبت آدرس، هزینه ارسال، و پرداخت) در حال تکمیل است.</p>
        <Link to="/cart" className="btn-outline inline-block mt-6">بازگشت به سبد خرید</Link>
      </div>
    </>
  );
}

export default Checkout;