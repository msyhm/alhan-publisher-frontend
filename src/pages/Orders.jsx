import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
const STATUS_BADGE = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  PAID:            "bg-blue-100 text-blue-700",
  PROCESSING:      "bg-blue-100 text-blue-700",
  SHIPPED:         "bg-purple-100 text-purple-700",
  DELIVERED:       "bg-green-100 text-green-700",
  CANCELLED:       "bg-red-100 text-red-700",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersService
      .getMine()
      .then((res) => setOrders(Array.isArray(res?.orders) ? res.orders : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta title="سفارش‌های من" description="تاریخچه‌ی سفارش‌های شما در انتشارات الحان" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <h1 className="text-3xl font-bold text-primary mb-8">سفارش‌های من</h1>

        {loading ? (
          <div className="text-center py-16 text-text-muted">در حال بارگذاری...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-text-muted mb-6">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link to="/books" className="btn-gold inline-block">مشاهده کتاب‌ها</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order-confirmation/${order.id}`}
                className="block bg-white rounded-2xl shadow-card border border-primary-light/10 p-5 hover:shadow-elegant-hover transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-primary">سفارش #{order.id}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")} — {order.items.length} کالا
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_BADGE[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                    <span className="font-bold text-accent">{order.total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;