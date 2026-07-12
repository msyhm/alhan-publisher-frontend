import Icon from "../ui/Icon";
import { Link } from "react-router-dom";

const PUBLISHING_STEPS = [
  { icon: "pen",      title: "ارسال اثر توسط نویسنده",              desc: "نویسنده اثر خود را از طریق فرم ارسال اثر برای انتشارات ارسال می‌کند" },
  { icon: "search",   title: "بازبینی توسط تیم الحان",              desc: "کارشناسان انتشارات محتوای اثر را با دقت بررسی و ارزیابی می‌کنند" },
  { icon: "phone",    title: "ارتباط با نویسنده و مشاوره تخصصی",    desc: "تیم انتشارات با نویسنده تماس می‌گیرد و مشاوره‌ی لازم ارائه می‌شود" },
  { icon: "image",    title: "طراحی جلد، صفحه‌آرایی و ویراستاری",   desc: "اثر توسط تیم طراحی و ویراستاری برای چاپ آماده‌سازی می‌شود" },
  { icon: "document", title: "دریافت مجوزهای لازم",                 desc: "مراحل اداری و دریافت مجوز نشر برای اثر انجام می‌گیرد" },
  { icon: "book",     title: "چاپ اثر در چاپخانه",                  desc: "کتاب با بالاترین کیفیت چاپ و صحافی در چاپخانه تولید می‌شود" },
  { icon: "chart",    title: "مراحل فروش",                          desc: "کتاب از طریق فروشگاه و کانال‌های انتشارات به دست خوانندگان می‌رسد" },
];

function PublishingProcess() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ===== هدر ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-full text-primary text-sm mb-4">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            مسیر انتشار
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">اثر شما چگونه</span>
            <span className="text-accent"> منتشر می‌شود؟</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mt-4 mx-auto"></div>
          <p className="mt-6 text-text-secondary max-w-2xl mx-auto leading-relaxed">
            از لحظه‌ی ارسال دست‌نوشته تا رسیدن کتاب به دست خواننده، این مراحل را با هم طی می‌کنیم
          </p>
        </div>

        {/* ===== تایم‌لاین مراحل ===== */}
        <div className="relative">
          <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-accent/30 hidden md:block" />
          <div className="space-y-8">
            {PUBLISHING_STEPS.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 w-full ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-elegant-hover transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={step.icon} size={18} strokeWidth={1.5} className="text-accent" />
                      <span className="text-accent font-bold text-xs">مرحله {index + 1}</span>
                    </div>
                    <h3 className="font-bold text-primary">{step.title}</h3>
                    <p className="text-text-secondary text-sm mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* ===== دعوت به اقدام ===== */}
        <div className="text-center mt-12">
          <Link to="/submit-book" className="btn-gold inline-flex items-center gap-2">
            ارسال اثر شما
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default PublishingProcess;