import { Component } from "react";
import { Link } from "react-router-dom";

/**
 * ErrorBoundary.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * گرفتن خطاهای رندر React که در غیر این صورت کل صفحه را سفید می‌کنند.
 * فقط Class Component می‌تواند ErrorBoundary باشد (محدودیت React).
 *
 * استفاده در App.jsx — دور کل اپ یا دور بخش‌های حساس:
 *   <ErrorBoundary>
 *     <BrowserRouter>...</BrowserRouter>
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // ✅ در آینده با بکند: ارسال خطا به سرویس لاگ (Sentry و ...)
    console.error("[ErrorBoundary] خطای غیرمنتظره:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
            مشکلی پیش آمد
          </h1>
          <p className="text-text-muted max-w-md leading-relaxed mb-2">
            متأسفانه خطایی غیرمنتظره رخ داد. تیم فنی از این موضوع مطلع خواهد شد.
          </p>

          {/* جزئیات خطا فقط در محیط توسعه */}
          {import.meta.env?.DEV && this.state.error && (
            <pre className="mt-4 p-4 bg-red-50 text-red-700 text-xs rounded-xl max-w-lg overflow-x-auto text-left" dir="ltr">
              {this.state.error.toString()}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={this.handleReset} className="btn-gold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              بازگشت به صفحه اصلی
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline flex items-center gap-2"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
