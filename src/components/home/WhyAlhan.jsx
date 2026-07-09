/**
 * WhyAlhan.jsx
 * ─────────────────────────────────────────────────────────────────────────
 * بخش «چرا الحان؟» — جایگزین StatsSection قبلی، زیر UniversitiesSection
 * محتوا ثابت است (نه وابسته به دیتابیس) — چهار مزیت رقابتی واقعی انتشارات
 * برای اعتمادسازی کاربر تازه‌وارد طراحی شده است
 */

const REASONS = [
  {
    title: "داوری تخصصی آثار",
    description:
      "هر اثر پیش از انتشار توسط داوران متخصص همان حوزه بررسی و ارزیابی می‌شود تا کیفیت علمی و محتوایی آن تضمین شود.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: "همکاری با اساتید دانشگاه",
    description:
      "شبکه‌ای از اساتید و پژوهشگران دانشگاه‌های معتبر کشور، مشاور علمی و ویراستار آثار منتشرشده در انتشارات الحان هستند.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.5 3 2.5 6 2.5s6-1 6-2.5v-5" />
      </svg>
    ),
  },
  {
    title: "چاپ باکیفیت",
    description:
      "از انتخاب کاغذ تا صحافی نهایی، تمام مراحل تولید کتاب با دقت و استانداردهای بالای صنعت نشر انجام می‌شود.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    title: "پشتیبانی نویسنده",
    description:
      "از لحظه ارسال اثر تا پس از انتشار، تیم ما همراه نویسنده است و در هر مرحله راهنمایی و پاسخگویی لازم را ارائه می‌دهد.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
];

function WhyAlhan() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* هدر بخش */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold tracking-wide mb-4">
            چرا انتشارات الحان؟
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
            دلایل انتخاب ما
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            تعهد ما به کیفیت، دقت و همراهی با نویسندگان از ابتدا تا انتشار اثر
          </p>
        </div>

        {/* گرید مزیت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {REASONS.map((reason, index) => (
            <div
              key={reason.title}
              className="group bg-primary-bg p-8 rounded-3xl text-center shadow-card hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  {reason.icon}
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {reason.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {reason.description}
                </p>
                <div className="mt-5 w-10 h-1 bg-accent rounded-full mx-auto group-hover:w-16 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyAlhan;
