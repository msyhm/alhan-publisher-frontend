/**
 * InlineError.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * نمایش خطای غیربحرانی داخل یک بخش از صفحه (نه کل صفحه را خراب نمی‌کند)
 * برای حالت‌هایی که hook یک error برمی‌گرداند، مثل خطای دریافت پیام‌ها.
 *
 * استفاده:
 *   const { messages, loading, error } = useMessages();
 *   if (error) return <InlineError message={error} onRetry={() => window.location.reload()} />;
 */
function InlineError({ message, onRetry }) {
  return (
    <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-center">
      <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-red-700 font-bold text-sm mb-1">خطا در دریافت اطلاعات</p>
      <p className="text-red-500 text-xs mb-4">{message || "لطفاً دوباره تلاش کنید"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white text-sm px-5 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  );
}

export default InlineError;
