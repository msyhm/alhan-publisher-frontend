import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ordersService from "../services/ordersService";
import InlineError from "../components/InlineError";

const STATUS_TABS = [
  { value: "",                label: "همه" },
  { value: "PENDING_PAYMENT", label: "در انتظار تسویه" },
  { value: "PAID",            label: "پرداخت‌شده" },
  { value: "PROCESSING",      label: "در حال آماده‌سازی" },
  { value: "SHIPPED",         label: "ارسال‌شده" },
  { value: "DELIVERED",       label: "تحویل‌شده" },
  { value: "CANCELLED",       label: "لغوشده" },
];

const STATUS_BADGE = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  PAID:            "bg-blue-100 text-blue-700",
  PROCESSING:      "bg-blue-100 text-blue-700",
  SHIPPED:         "bg-purple-100 text-purple-700",
  DELIVERED:       "bg-green-100 text-green-700",
  CANCELLED:       "bg-red-100 text-red-700",
};

function OrderRow({ order, onStatusChange, busy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-primary-light/10 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-right flex-wrap"
      >
        <div>
          <p className="font-bold text-primary">سفارش #{order.id}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {order.user?.name} — {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[order.status] || "bg-gray-100 text-gray-700"}`}>
            {STATUS_TABS.find((t) => t.value === order.status)?.label || order.status}
          </span>
          <span className="font-bold text-accent text-sm">{order.total.toLocaleString("fa-IR")} ت</span>
          <svg className={`w-4 h-4 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-primary-light/10 p-4 space-y-4">
          <div>
            <p className="text-xs font-bold text-text-muted mb-2">اقلام سفارش</p>
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{item.title} × {item.quantity}</span>
                  <span className="text-primary">{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold text-text-muted mb-1">مشتری</p>
              <p className="text-text-secondary">{order.user?.name}</p>
              <p className="text-text-muted text-xs">{order.user?.email}</p>
              <p className="text-text-muted text-xs">{order.user?.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted mb-1">آدرس ارسال</p>
              <p className="text-text-secondary">{order.address.fullName} — {order.address.phone}</p>
              <p className="text-text-muted text-xs">{order.address.province}، {order.address.city}</p>
              <p className="text-text-muted text-xs">{order.address.addressLine}</p>
              <p className="text-text-muted text-xs">کد پستی: {order.address.postalCode}</p>
            </div>
          </div>

          <div className="text-sm text-text-secondary space-y-1 border-t border-primary-light/10 pt-3">
            <div className="flex justify-between"><span>جمع کتاب‌ها</span><span>{order.subtotal.toLocaleString("fa-IR")} تومان</span></div>
            <div className="flex justify-between"><span>هزینه ارسال</span><span>{order.shippingCost.toLocaleString("fa-IR")} تومان</span></div>
            <div className="flex justify-between font-bold text-primary"><span>مبلغ کل</span><span className="text-accent">{order.total.toLocaleString("fa-IR")} تومان</span></div>
          </div>

          <div>
            <p className="text-xs font-bold text-text-muted mb-2">تغییر وضعیت سفارش</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.filter((t) => t.value).map((t) => (
                <button
                  key={t.value}
                  onClick={() => onStatusChange(order.id, t.value)}
                  disabled={busy || order.status === t.value}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                    order.status === t.value
                      ? `${STATUS_BADGE[t.value]} cursor-default`
                      : "bg-primary-bg text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    ordersService
      .getAllAdmin(statusFilter ? { status: statusFilter } : {})
      .then((res) => setOrders(Array.isArray(res?.orders) ? res.orders : []))
      .catch((err) => setError(err.message || "خطا در دریافت سفارش‌ها"))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await ordersService.updateStatusAdmin(id, status);
      toast.success("وضعیت سفارش به‌روزرسانی شد");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.message || "خطا در به‌روزرسانی وضعیت");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">مدیریت سفارش‌ها</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary text-white"
                : "bg-white text-text-secondary border border-primary-light/20 hover:border-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <InlineError message={error} onRetry={fetchOrders} />}

      {loading ? (
        <div className="text-center py-16 text-text-muted">در حال بارگذاری...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-text-muted">سفارشی در این دسته یافت نشد</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} busy={busyId === order.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;