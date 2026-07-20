import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import ordersService from "../services/ordersService";

const STATUS_LABEL = {
  PENDING_PAYMENT: "در انتظار تسویه",
  PAID:            "پرداخت‌شده",
  PROCESSING:      "در حال آماده‌سازی",
  SHIPPED:         "ارسال‌شده",
  DELIVERED:       "تحویل‌شده",
  CANCELLED:       "لغوشده",
};

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersService
      .getById(id)
      .then((res) => setOrder(res.order))
      .catch((err) => setError(err.message || "سفارش پیدا نشد"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center text-text-muted">در حال بارگذاری...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 pt-28 text-center">
        <p className="text-6xl mb-4">😕</p>
        <p className="text-text-muted mb-6">{error || "سفارش پیدا نشد"}</p>
        <Link to="/" className="btn-gold inline-block">بازگشت به خانه</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="سفارش ثبت شد" description="جزئیات سفارش شما در انتشارات الحان" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">سفارش شما با موفقیت ثبت شد</h1>
          <p className="text-text-muted text-sm mt-2">شماره سفارش: <span className="font-bold text-primary">#{order.id}</span></p>
        </div>

        <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted">وضعیت سفارش</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{item.title} × {item.quantity}</span>
                <span className="text-primary font-medium">{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
              </div>
            ))}
          </div>

          <div className="border-t border-primary-light/10 pt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span>جمع کتاب‌ها</span>
              <span>{order.subtotal.toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>هزینه ارسال</span>
              <span>{order.shippingCost.toLocaleString("fa-IR")} تومان</span>
            </div>
            <div className="flex items-center justify-between font-bold text-primary text-base pt-2 border-t border-primary-light/10">
              <span>مبلغ کل</span>
              <span className="text-accent">{order.total.toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>

          <div className="border-t border-primary-light/10 mt-4 pt-4 text-sm text-text-secondary">
            <p className="font-bold text-primary mb-1">آدرس ارسال</p>
            <p>{order.address.fullName} — {order.address.phone}</p>
            <p>{order.address.province}، {order.address.city}</p>
            <p>{order.address.addressLine}</p>
            <p className="text-text-muted text-xs mt-1">کد پستی: {order.address.postalCode}</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/books" className="btn-outline inline-block">ادامه خرید</Link>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;