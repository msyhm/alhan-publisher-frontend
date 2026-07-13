import Icon from "../components/ui/Icon";
import PageMeta from "../components/PageMeta";
import { Link } from "react-router-dom";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";

const timeline = [
  { year: "۱۳۹۸", event: "تاسیس انتشارات الحان" },
  { year: "۱۳۹۹", event: "انتشار اولین کتاب" },
  { year: "۱۴۰۰", event: "افتتاح فروشگاه اینترنتی" },
  { year: "۱۴۰۲", event: "انتشار ۱۰امین کتاب" },
  { year: "۱۴۰۴", event: "راه‌اندازی کتاب‌های صوتی" },
];

const teamMembers = [
  { name: "دکتر علی‌مراد حیدری", role: "مدیرعامل و بنیان‌گذار", bio: "دانشیار حقوق دانشگاه فردوسی مشهد" },
  { name: "حسین ملائی",           role: "مدیر اجرایی",           bio: "کارشناس ارشد مدیریت فرهنگی" },
  { name: "زهرا کریمی",           role: "ویراستار ارشد",          bio: "کارشناس ارشد زبان و ادبیات فارسی" },
  { name: "محمد رضایی",           role: "طراح گرافیک",            bio: "کارشناس طراحی گرافیک" },
];

function About() {
  const { books }     = useBooks();
  const { settings }  = useSiteSettings();

  return (
    <>
      <PageMeta title="درباره ما" description="آشنایی با تاریخچه، اهداف و تیم انتشارات الحان" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* ===== هدر ===== */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-full text-primary text-sm mb-4">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          درباره ما
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="text-primary">درباره انتشارات</span>
          <span className="text-accent"> {settings.publisherNameAccent || "الحان"}</span>
        </h1>
        <div className="divider-gold-center mt-4" />
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
          آشنایی با تاریخچه، اهداف و تیم انتشارات الحان
        </p>
      </div>

      {/* ===== داستان ما ===== */}
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">داستان ما</h2>
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            انتشارات {settings.publisherName} {settings.publisherNameAccent} در
            سال {settings.foundingYear || "۱۳۹۸"} با هدف انتشار آثار علمی، دانشگاهی و فرهنگی
            فعالیت خود را آغاز کرد. از همان ابتدا، ما به دنبال کشف و معرفی
            اندیشه‌های نوین و ارتقای سطح دانش و فرهنگ جامعه بودیم.
          </p>
          <p>
            {settings.aboutText ||
              `با بهره‌گیری از اساتید و پژوهشگران برجسته، آثاری با کیفیت و محتوای غنی
              را به جامعه علمی و فرهنگی کشور عرضه می‌کنیم. تاکنون بیش از ${books.length} کتاب
              در حوزه‌های مختلف منتشر کرده‌ایم.`}
          </p>
        </div>
      </div>

      {/* ===== تیم ===== */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-primary text-center mb-10">
          تیم انتشارات الحان
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl shadow-card hover:shadow-elegant-hover transition-all overflow-hidden group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary-bg h-48 flex items-center justify-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full bg-gradient-gold flex items-center justify-center text-6xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-primary text-lg">{member.name}</h3>
                <p className="text-accent text-sm font-medium">{member.role}</p>
                <p className="text-text-muted text-xs mt-2">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== چشم‌انداز و رسالت — به‌جای باکس آماری قبلی ===== */}
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-primary rounded-3xl p-8 shadow-elegant-hover overflow-hidden">
            <div className="absolute inset-0 bg-accent/10 blur-2xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                <Icon name="target" size={28} strokeWidth={1.5} className="text-accent" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">چشم‌انداز ما</h3>
              <p className="text-primary-light leading-relaxed">
                {settings.vision || "تبدیل شدن به یکی از برترین ناشران علمی و فرهنگی در سطح ملی و ایجاد پلی میان دانشگاه و جامعه"}
              </p>
            </div>
          </div>

          <div className="relative bg-gradient-primary rounded-3xl p-8 shadow-elegant-hover overflow-hidden">
            <div className="absolute inset-0 bg-accent/10 blur-2xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                <Icon name="lamp" size={28} strokeWidth={1.5} className="text-accent" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">رسالت ما</h3>
              <p className="text-primary-light leading-relaxed">
                {settings.mission || "انتشار آثار ارزشمند و ارتقای دانش و فرهنگ جامعه"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== تایم‌لاین ===== */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-primary text-center mb-10">
          گام‌های ما در مسیر پیشرفت
        </h2>
        <div className="relative">
          <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-accent/30 hidden md:block" />
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-elegant-hover transition-all">
                    <span className="text-accent font-bold text-lg">{item.year}</span>
                    <p className="text-text-secondary mt-1">{item.event}</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className="bg-gradient-primary rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">آماده همکاری با شما هستیم</h2>
          <p className="text-primary-light max-w-2xl mx-auto">
            اگر نویسنده، پژوهشگر یا علاقه‌مند به همکاری با انتشارات الحان هستید، با ما تماس بگیرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/submit-book" className="btn-gold inline-flex items-center justify-center gap-2">
              <span>ارسال اثر</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white inline-flex items-center justify-center gap-2">
              <span>تماس با ما</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </div>
  </>
  );
}

export default About;