import Icon from "../ui/Icon";
import { Link } from "react-router-dom";
import useSiteSettings from "../../hooks/useSiteSettings";

// ✅ به‌جای آمار خام (که برای یک انتشارات تازه‌کار چندان چشمگیر نیست)،
// چند نکته‌ی متقاعدکننده که هم به فروش کتاب کمک می‌کند هم نویسنده جذب می‌کند
const VALUE_PROPS = [
  { icon: "academic", title: "داوری تخصصی",       desc: "بررسی دقیق هر اثر توسط ویراستاران مجرب، پیش از چاپ" },
  { icon: "document",  title: "چاپ حرفه‌ای",       desc: "چاپ باکیفیت، مطابق استانداردهای نشر دانشگاهی" },
  { icon: "target",    title: "دیده‌شدن اثر شما",  desc: "معرفی و فروش کتاب از طریق کانال‌های انتشارات" },
];

function AboutSection() {
  const { settings } = useSiteSettings();

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-gradient-primary rounded-3xl p-6 sm:p-8 shadow-elegant-hover overflow-hidden">
              <div className="absolute inset-0 bg-accent/10 blur-2xl"></div>

              <div className="relative">
                <h3 className="text-white font-bold text-lg">چرا انتشارات الحان؟</h3>
                <p className="text-primary-light text-xs mt-1 mb-5">
                  از ثبت ایده تا رسیدن کتاب به دست خواننده، همراه شما هستیم
                </p>

                <div className="space-y-3">
                  {VALUE_PROPS.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Icon name={item.icon} size={20} strokeWidth={1.5} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{item.title}</h4>
                        <p className="text-primary-light text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/submit-book"
                  className="mt-5 flex items-center justify-center gap-2 bg-accent text-white font-bold text-sm py-3 rounded-xl hover:bg-accent-dark transition-colors"
                >
                  ارسال اثر برای بررسی
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-2xl shadow-lg flex items-center justify-center animate-float">
              <Icon name="book-open" size={28} strokeWidth={1.5} className="text-white" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-full text-primary text-sm mb-4">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              درباره ما
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-primary">درباره {settings.publisherName}</span>
              <br />
              <span className="text-accent">{settings.publisherNameAccent}</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mt-4"></div>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">{settings.aboutText}</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all">
                <Icon name="target" size={24} strokeWidth={1.25} className="text-accent mb-2" />
                <h4 className="font-bold text-primary text-sm">چشم‌انداز</h4>
                <p className="mt-1 text-text-muted text-xs leading-relaxed">{settings.vision}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all">
                <Icon name="lamp" size={24} strokeWidth={1.25} className="text-accent mb-2" />
                <h4 className="font-bold text-primary text-sm">رسالت</h4>
                <p className="mt-1 text-text-muted text-xs leading-relaxed">{settings.mission}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all">
                <div className="text-accent text-2xl mb-2"></div>
                <h4 className="font-bold text-primary text-sm">ارزش‌ها</h4>
                <p className="mt-1 text-text-muted text-xs leading-relaxed">{settings.values}</p>
              </div>
            </div>

            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
              <span>بیشتر بدانید</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
