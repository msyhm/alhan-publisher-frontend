import Icon from "../components/ui/Icon";
import PageMeta from "../components/PageMeta";
import { Link } from "react-router-dom";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";

// ✅ نقاط عطف — سال‌های واقعی تاریخچه‌ی انتشارات، دست‌نخورده
const milestones = [
  { year: "۱۳۹۸", event: "تأسیس انتشارات الحان در قم" },
  { year: "۱۳۹۹", event: "همکاری با اساتید دانشگاه‌های برتر" },
  { year: "۱۴۰۰", event: "افتتاح فروشگاه اینترنتی" },
  { year: "۱۴۰۲", event: "همکاری با پلتفرم‌های معتبر فروش" },
  { year: "۱۴۰۴", event: "فعالیت‌های فرهنگی" },
];

// ✅ مُهر — نشان دایره‌ای به‌جای شماره‌ی توی دایره‌ی ژنریک یا آیکون توی مربع گرد
function Seal({ children, rotate = 0, size = "md" }) {
  const dims = size === "lg" ? "w-28 h-28 sm:w-32 sm:h-32" : "w-20 h-20 sm:w-24 sm:h-24";
  return (
    <div
      className={`${dims} shrink-0 rounded-full border-2 border-accent/70 flex items-center justify-center relative`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute inset-1.5 rounded-full border border-dashed border-accent/40" />
      <div className="relative text-center">{children}</div>
    </div>
  );
}

function About() {
  const { books } = useBooks();
  const { settings } = useSiteSettings();

  return (
    <>
      <PageMeta title="درباره ما" description="آشنایی با تاریخچه، اهداف و تیم انتشارات الحان" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 pt-28 overflow-hidden">

        {/* ===== هدر — نامتقارن، مُهر کنار عنوان ===== */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10 mb-24">
          <Seal rotate={-8} size="lg">
            <span className="font-display text-primary text-3xl">{settings.logoLetter || "آ"}</span>
          </Seal>
          <div className="text-center sm:text-right flex-1">
            <p className="text-accent text-sm font-bold mb-2">درباره‌ی ما</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight text-primary">
              انتشارات {settings.publisherName || ""}
              <span className="text-accent"> {settings.publisherNameAccent || "الحان"}</span>
            </h1>
          </div>
        </div>

        {/* ===== داستان ما — تک‌ستونه با نقل‌قول برجسته ===== */}
        <section className="mb-24 max-w-3xl">
          <p className="text-text-secondary leading-[2] text-lg">
            انتشارات {settings.publisherName || "الحان"} سال {settings.foundingYear || "۱۳۹۸"} در قم
            شکل گرفت؛ نه با یک دفتر بزرگ، بلکه با یک ایده‌ی ساده: کتاب علمی و دانشگاهی نباید فقط
            برای قفسه‌ی کتابخانه‌ها نوشته شود.
          </p>

          <blockquote className="my-8 sm:mr-10 border-r-4 border-accent pr-6 py-1">
            <p className="font-display text-2xl sm:text-3xl text-primary leading-snug">
              هر عنوانی که منتشر می‌کنیم، پیش از چاپ زیر نگاه یک متخصص واقعی رفته است.
            </p>
          </blockquote>

          <p className="text-text-secondary leading-[2] text-lg">
            پروانه‌ی نشر <span className="font-mono-nums text-primary">{settings.publishLicense || "۱۴۹۳۳"}</span>{" "}
            فقط یک عدد روی کاغذ نیست؛ یادآور همان مسئولیتی است که از روز اول پذیرفتیم. تا امروز{" "}
            <span className="font-mono-nums text-accent font-bold">{books.length || "چند ده"}</span> عنوان
            کتاب منتشر شده.
          </p>
        </section>

        {/* ===== چشم‌انداز / رسالت / ارزش‌ها — سه مُهر، چیدمان نامتقارن ===== */}
        <section className="mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-14 gap-x-8">
            <div className="flex flex-col items-center text-center md:mt-0">
              <Seal rotate={-5}>
                <Icon name="target" size={26} strokeWidth={1.5} className="text-accent" />
              </Seal>
              <h3 className="font-display text-xl text-primary mt-5 mb-2">چشم‌انداز</h3>
              <p className="text-text-secondary leading-[1.9] text-sm max-w-[220px]">
                {settings.vision ||
                  "الحان جایی باشد که یک پژوهشگر جوان، بدون واسطه‌های پیچیده، بتواند اثرش را به دست مخاطب واقعی برساند."}
              </p>
            </div>

            <div className="flex flex-col items-center text-center md:mt-12">
              <Seal rotate={4}>
                <Icon name="lamp" size={26} strokeWidth={1.5} className="text-accent" />
              </Seal>
              <h3 className="font-display text-xl text-primary mt-5 mb-2">رسالت</h3>
              <p className="text-text-secondary leading-[1.9] text-sm max-w-[220px]">
                {settings.mission ||
                  "انتشار آثاری که ارزش علمی و فرهنگی دارند، نه فقط آثاری که پرفروش‌اند."}
              </p>
            </div>

            <div className="flex flex-col items-center text-center md:-mt-4">
              <Seal rotate={-3}>
                <Icon name="check" size={26} strokeWidth={1.5} className="text-accent" />
              </Seal>
              <h3 className="font-display text-xl text-primary mt-5 mb-2">ارزش‌ها</h3>
              <p className="text-text-secondary leading-[1.9] text-sm max-w-[220px]">
                {settings.values ||
                  "اصالت محتوا، دقت در ویرایش، و صداقت با نویسنده و خواننده."}
              </p>
            </div>
          </div>
        </section>

        {/* ===== نقاط عطف — خط دست‌ساز و مُهرهای سال ===== */}
        <section className="mb-28">
          <h2 className="font-display text-2xl sm:text-3xl text-primary text-center mb-14">
            نقاط عطف
          </h2>
          <div className="relative">
            <div
              className="absolute right-1/2 top-4 bottom-4 w-px hidden md:block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--color-accent) 0 6px, transparent 6px 12px)",
                opacity: 0.5,
              }}
            />
            <div className="space-y-10 md:space-y-0">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`flex flex-col md:flex-row items-center gap-5 md:gap-10 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  } ${i > 0 ? "md:-mt-4" : ""}`}
                >
                  <div className="flex-1 flex justify-center md:justify-end">
                    <Seal rotate={i % 2 === 0 ? -6 : 6}>
                      <span className="font-mono-nums text-primary text-sm sm:text-base">{m.year}</span>
                    </Seal>
                  </div>
                  <p
                    className={`flex-1 text-text-secondary leading-relaxed text-center ${
                      i % 2 === 1 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    {m.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== بیانیه‌ی تیم — به‌سبک یک متن امضاشده ===== */}
        <section className="mb-28">
          <div className="max-w-2xl mx-auto text-center relative">
            <Icon name="pen" size={22} strokeWidth={1.5} className="text-accent/50 mx-auto mb-5" />
            <p className="font-display text-xl sm:text-2xl text-primary leading-[1.9]">
              تیم انتشارات {settings.publisherNameAccent || "الحان"} از آدم‌هایی با تخصص‌های کاملاً
              متفاوت شکل گرفته — از مدیریت بازاریابی و ویراستاری تا طراحی گرافیک دیجیتال، برنامه‌نویسی
              و ایده‌پردازی. با وجود این تفاوت، همه‌شان یک هدف مشترک دارند: بزرگ‌تر کردن این مجموعه
              و کمک به گسترش فرهنگ کتاب‌خوانی.
            </p>
            <div className="mt-8 inline-flex items-center gap-3">
              <div className="w-10 h-px bg-accent/50" />
              <span className="text-accent text-xs font-bold tracking-widest">
                تیم {settings.publisherNameAccent || "الحان"}
              </span>
              <div className="w-10 h-px bg-accent/50" />
            </div>
          </div>
        </section>

        {/* ===== دعوت به همکاری ===== */}
        <section className="bg-gradient-primary rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-light rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl mb-4">آماده‌ی همکاری با شما هستیم</h2>
            <p className="text-primary-light max-w-2xl mx-auto">
              اگر نویسنده، مترجم، پژوهشگر یا علاقه‌مند به همکاری با انتشارات الحان هستید، با ما تماس بگیرید.
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
        </section>

      </div>
    </>
  );
}

export default About;
