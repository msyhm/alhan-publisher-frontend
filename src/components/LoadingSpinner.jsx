/**
 * LoadingSpinner.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * کامپوننت بارگذاری با دو حالت: inline (داخل یک بخش) و fullPage (تمام صفحه)
 *
 * استفاده:
 *   <LoadingSpinner />                          ← inline ساده
 *   <LoadingSpinner fullPage />                  ← تمام صفحه
 *   <LoadingSpinner size="sm" text="در حال بارگذاری کتاب‌ها..." />
 */
function LoadingSpinner({ fullPage = false, size = "md", text = "" }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size]} rounded-full border-primary-light/20 border-t-accent animate-spin`}
      />
      {text && <p className="text-sm text-text-muted">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinner}</div>;
}

/**
 * SkeletonCard — برای جایگزینی لیست کتاب‌ها هنگام بارگذاری
 * تجربه کاربری بهتر از اسپینر ساده برای گریدهای کارت
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="h-48 sm:h-56 md:h-64 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-3" />
      </div>
    </div>
  );
}

/**
 * SkeletonGrid — چند SkeletonCard کنار هم برای جایگزینی گرید کتاب‌ها
 * استفاده: <SkeletonGrid count={8} />
 */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * SkeletonRow — برای جدول‌های ادمین (پیام‌ها، آثار ارسالی و ...)
 */
export function SkeletonRow({ columns = 5 }) {
  return (
    <tr className="border-t border-primary-light/10 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export default LoadingSpinner;
