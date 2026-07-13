import { Link } from "react-router-dom";
import useSiteSettings from "../../hooks/useSiteSettings";
import logoWhite from "../../assets/logo-white.png";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-gradient-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-light rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* درباره */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoWhite}
                alt={settings.publisherName + " " + settings.publisherNameAccent}
                className="h-14 w-auto object-contain"
              />
              <div>
                <h2 className="text-xl font-bold leading-tight">{settings.publisherName}</h2>
                <span className="text-accent-light font-bold text-lg leading-tight -mt-1 block">{settings.publisherNameAccent}</span>
              </div>
            </div>
            <p className="text-primary-light leading-relaxed text-sm">{settings.slogan}</p>
            <div className="mt-4">
              <span className="badge badge-gold text-white border border-accent/30">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                فعالیت از {settings.foundingYear}
              </span>
            </div>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="text-lg font-bold text-accent-light mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              دسترسی سریع
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { to: "/books", label: "کتاب‌ها" },
                { to: "/about", label: "درباره ما" },
                { to: "/submit-book", label: "ارسال اثر" },
                { to: "/contact", label: "تماس با ما" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-primary-light hover:text-white transition-all hover:translate-x-1 flex items-center gap-2 text-sm group">
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-lg font-bold text-accent-light mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              تماس با ما
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-primary-light">
                <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{settings.address}</span>
              </div>
              <a href={`tel:${settings.phoneRaw}`} className="flex items-center gap-3 text-primary-light hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-accent group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-primary-light hover:text-white transition-colors group">
                <svg className="w-5 h-5 text-accent group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {settings.email}
              </a>
            </div>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div>
            <h3 className="text-lg font-bold text-accent-light mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              ما را دنبال کنید
            </h3>
            <div className="flex flex-col gap-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-light hover:text-white transition-all hover:translate-x-1 group">
                  <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </span>
                  اینستاگرام
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-light hover:text-white transition-all hover:translate-x-1 group">
                  <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </span>
                  تلگرام
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-light">
          <p>© {currentYear} تمامی حقوق برای {settings.publisherName} {settings.publisherNameAccent} محفوظ است.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>شماره پروانه نشر: {settings.publishLicense}</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span>طراحی و توسعه: تیم الحان</span>
            <span className="w-px h-4 bg-white/20"></span>
            <Link to="/admin/login" className="hover:text-white transition-colors">پنل مدیریت</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
