import Icon from "../components/ui/Icon";
import PageMeta from "../components/PageMeta";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import useBooks from "../hooks/useBooks";
import useSiteSettings from "../hooks/useSiteSettings";

// ✅ فصل‌های «مسیر رشد» — سال‌های واقعی تاریخچه‌ی انتشارات، دست‌نخورده
const chapters = [
  { year: "۱۳۹۸", title: "آغاز", event: "تأسیس انتشارات الحان در قم" },
  { year: "۱۳۹۹", title: "همراهی", event: "همکاری با اساتید دانشگاه‌های برتر" },
  { year: "۱۴۰۰", title: "گشایش", event: "افتتاح فروشگاه اینترنتی" },
  { year: "۱۴۰۲", title: "گسترش", event: "همکاری با پلتفرم‌های معتبر فروش" },
  { year: "۱۴۰۴", title: "امتداد", event: "فعالیت‌های فرهنگی" },
];

const universities = [
  "دانشگاه تهران",
  "دانشگاه فردوسی مشهد",
  "دانشگاه حضرت معصومه (ع)",
  "دانشگاه قم",
];

function About() {
  const { books } = useBooks();
  const { settings } = useSiteSettings();
  const articleRef = useRef(null);
  const ribbonFillRef = useRef(null);

  // ✅ روبان پیشرفت مطالعه — همون رنگ ribbon که «امضای بصری سایت»
  // تعریف شده بود ولی جایی استفاده نمی‌شد. هرچه پایین‌تر می‌رید، پایین‌تر می‌آید؛
  // دقیقاً مثل روبان نشانگر صفحه‌ی یک کتاب واقعی.
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      const fill = ribbonFillRef.current;
      if (!el || !fill) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, total > 0 ? (scrolled / total) * 100 : 0));
      fill.style.height = `${pct}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <PageMeta title="درباره ما" description="آشنایی با تاریخچه، اهداف و تیم انتشارات الحان" />

      {/* ✅ روبان پیشرفت — فقط دسکتاپ، حاشیه‌ی چپ صفحه */}
      <div className="hidden lg:block fixed top-28 bottom-8 left-6 w-[3px] z-10">
        <div className="w-full h-full bg-primary/10 rounded-full overflow-hidden">
          <div
            ref={ribbonFillRef}
            className="w-full bg-[var(--color-ribbon)] rounded-full transition-[height] duration-150 ease-out"
            style={{ height: "0%" }}
          />
        </div>
      </div>

      <div ref={articleRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-20 pt-28">

        {/* ===== پیشگفتار ===== */}
        <div className="text-center mb-20">
          <span className="ribbon-tag">
            <Icon name="book" size={13} strokeWidth={2} />
            پیشگفتار
          </span>
          <h1 className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl leading-tight text-primary">
            درباره‌ی انتشارات
            <span className="text-accent"> {settings.publisherNameAccent || "الحان"}</span>
          </h1>
          <div className="divider-gold-center mt-6" />
        </div>

        {/* ===== فصل ۱: داستان ما ===== */}
        <section className="mb-24">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono-nums text-5xl text-accent/25 leading-none">۰۱</span>
            <h2 className="font-display text-2xl sm:text-3xl text-primary">داستان ما</h2>
          </div>
          <div className="space-y-4 text-text-secondary leading-[2]">
            <p>
              انتشارات {settings.publisherName || "الحان"} سال {settings.foundingYear || "۱۳۹۸"} در
              قم شکل گرفت؛ نه با یک دفتر بزرگ، بلکه با یک ایده‌ی ساده: کتاب علمی و دانشگاهی
              نباید فقط برای قفسه‌ی کتابخانه‌ها نوشته شود.
            </p>
            <p>
              از همان سال‌های اول، همکاری با اساتید دانشگاه‌هایی مثل{" "}
              {universities.map((u, i) => (
                <span key={u}>
                  <span className="text-primary font-medium">{u}</span>
                  {i < universities.length - 1 ? "، " : " "}
                </span>
              ))}
              مسیر را مشخص کرد: هر عنوانی که منتشر می‌شود، پیش از چاپ زیر نگاه یک متخصص واقعی
              رفته است.
            </p>
            <p>
              پروانه‌ی نشر <span className="font-mono-nums text-primary">{settings.publishLicense || "۱۴۹۳۳"}</span>{" "}
              فقط یک عدد روی کاغذ نیست؛ یادآور همان مسئولیتی است که از روز اول پذیرفتیم. تا امروز{" "}
              <span className="font-mono-nums text-accent font-bold">{books.length || "چند ده"}</span> عنوان
              کتاب منتشر شده — و این فصل هنوز ادامه دارد.
            </p>
          </div>
        </section>

        {/* ===== فصل ۲: چشم‌انداز و رسالت ===== */}
        <section className="mb-24">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono-nums text-5xl text-accent/25 leading-none">۰۲</span>
            <h2 className="font-display text-2xl sm:text-3xl text-primary">چشم‌انداز، رسالت و ارزش‌ها</h2>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-8 items-start">
              <span className="text-accent text-sm font-bold whitespace-nowrap">چشم‌انداز</span>
              <p className="text-text-secondary leading-[2]">
                {settings.vision ||
                  "الحان جایی باشد که یک پژوهشگر جوان، بدون واسطه‌های پیچیده، بتواند اثرش را به دست مخاطب واقعی برساند — چه یک دانشجو باشد، چه یک خواننده‌ی عادیِ علاقه‌مند به دانش."}
              </p>
            </div>
            <div className="divider-gold" />
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-8 items-start">
              <span className="text-accent text-sm font-bold whitespace-nowrap">رسالت</span>
              <p className="text-text-secondary leading-[2]">
                {settings.mission ||
                  "انتشار آثاری که ارزش علمی و فرهنگی داشته باشند، نه فقط آثاری که پرفروش باشند. هر کتابی که چاپ می‌کنیم باید چیزی به دانش یا فرهنگ جامعه اضافه کند."}
              </p>
            </div>
            <div className="divider-gold" />
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-8 items-start">
              <span className="text-accent text-sm font-bold whitespace-nowrap">ارزش‌ها</span>
              <p className="text-text-secondary leading-[2]">
                {settings.values ||
                  "اصالت محتوا، دقت در ویرایش، و صداقت با نویسنده و خواننده — سه خط قرمزی که هیچ‌وقت از آن عبور نمی‌کنیم."}
              </p>
            </div>
          </div>
        </section>

        {/* ===== فصل ۳: مسیر رشد ===== */}
        <section className="mb-24">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono-nums text-5xl text-accent/25 leading-none">۰۳</span>
            <h2 className="font-display text-2xl sm:text-3xl text-primary">مسیر رشد</h2>
          </div>

          <div className="space-y-0">
            {chapters.map((c, i) => (
              <div
                key={c.year}
                className={`flex items-start gap-4 sm:gap-6 py-5 ${
                  i !== chapters.length - 1 ? "border-b border-primary/10" : ""
                }`}
              >
                <span className="font-mono-nums text-lg sm:text-xl text-primary shrink-0 w-16 sm:w-20">
                  {c.year}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                <div>
                  <span className="text-accent text-xs font-bold uppercase tracking-wide">{c.title}</span>
                  <p className="text-text-secondary mt-0.5">{c.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== شناسنامه‌ی کتاب — بخش تیم، به‌سبک صفحه‌ی کلوفون ===== */}
        <section className="mb-24">
          <div className="border border-primary/15 rounded-sm p-8 sm:p-10 bg-surface relative">
            <div className="absolute top-4 right-4 left-4 h-px bg-primary/10" />
            <div className="absolute bottom-4 right-4 left-4 h-px bg-primary/10" />
            <p className="text-center text-[11px] tracking-[0.25em] text-text-muted uppercase mb-6">
              شناسنامه‌ی مجموعه
            </p>
            <p className="text-text-secondary leading-[2.1] text-center max-w-xl mx-auto">
              تیم انتشارات {settings.publisherNameAccent || "الحان"} از آدم‌هایی با تخصص‌های کاملاً
              متفاوت شکل گرفته: کسی که بازاریابی و فروش را می‌شناسد، کسی که متن را ویرایش و پالایش
              می‌کند، کسی که طراحی گرافیک دیجیتال را جلو می‌برد، کسی که پشت کد و توسعه‌ی همین سایتی
              است که الان می‌بینید، و کسی که فقط کارش ایده‌پردازی است — فکر کردن به این‌که قدم بعدی
              چه باشد. با وجود این تفاوت، همه‌شان یک هدف مشترک دارند: بزرگ‌تر کردن این مجموعه و
              کمک به گسترش فرهنگ کتاب‌خوانی.
            </p>
            <div className="divider-gold-center mt-6" />
          </div>
        </section>

        {/* ===== دعوت به همکاری ===== */}
        <section className="text-center border-t border-primary/10 pt-16">
          <span className="font-display text-3xl text-primary block mb-3">فصل بعدی، با شما</span>
          <p className="text-text-secondary max-w-xl mx-auto leading-[2]">
            اگر نویسنده، مترجم یا پژوهشگر هستید و دوست دارید بخشی از این مسیر باشید،
            خوشحال می‌شویم بشنویم چه چیزی برای گفتن دارید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/submit-book" className="btn-gold inline-flex items-center justify-center gap-2">
              <span>ارسال اثر</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-outline inline-flex items-center justify-center gap-2">
              <span>تماس با ما</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}

export default About;
