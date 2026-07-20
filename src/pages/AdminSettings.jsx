import Icon from "../components/ui/Icon";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useSiteSettings, { useAdminCredentials } from "../hooks/useSiteSettings";
import useBooks from "../hooks/useBooks";
import ImageUploader from "../components/ui/ImageUploader";

const TABS = [
  { id: "general",      label: "عمومی",           icon: "settings" },
  { id: "hero",         label: "صفحه اصلی",       icon: "home" },
  { id: "universities", label: "دانشگاه‌ها",       icon: "book" },
  { id: "about",        label: "درباره ما",       icon: "info" },
  { id: "contact",      label: "تماس",             icon: "phone" },
  { id: "social",       label: "شبکه‌های اجتماعی", icon: "link" },
  { id: "shipping",     label: "هزینه ارسال",     icon: "map-pin" },
  { id: "security",     label: "امنیت",            icon: "lock" },
];

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    rows={rows}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 resize-none"
  />
);

function AdminSettings() {
  const { settings, updateSettings, resetSettings, loading: settingsLoading } = useSiteSettings();
  // ✅ FIX: credentials از hook جداگانه مدیریت می‌شود
  const { credentials, updateCredentials, loading: credsLoading } = useAdminCredentials();
  const { books } = useBooks();
  const [activeTab, setActiveTab] = useState("general");
  const [localSettings, setLocalSettings] = useState(settings);
  const [localCredentials, setLocalCredentials] = useState(credentials);
  const [confirmReset, setConfirmReset] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [newUniName, setNewUniName] = useState("");
  const [newUniLogo, setNewUniLogo] = useState("");
  const [editingUniId, setEditingUniId] = useState(null);
  const [newSlideImage, setNewSlideImage] = useState("");
  const [newSlideLink, setNewSlideLink] = useState("");

  // ✅ FIX: قبلاً localSettings فقط یک‌بار، با useState(settings)، مقداردهی
  // می‌شد — یعنی با مقدار پیش‌فرض قبل از پایان بارگذاری از سرور. اگر ادمین
  // زودتر از رسیدن پاسخ سرور «ذخیره» را می‌زد، تمام تنظیمات واقعی سایت با
  // مقادیر پیش‌فرض بازنویسی می‌شد. حالا به‌محض پایان بارگذاری، فرم با
  // داده‌ی واقعی همگام می‌شود.
  useEffect(() => {
    if (!settingsLoading) setLocalSettings(settings);
  }, [settingsLoading]);

  useEffect(() => {
    if (!credsLoading) setLocalCredentials(credentials);
  }, [credsLoading]);

  const set = (key, value) =>
    setLocalSettings((prev) => ({ ...prev, [key]: value }));

  const addUniversity = () => {
    if (!newUniName.trim()) return;
    const unis = localSettings.universities || [];
    const newUni = {
      id: Date.now(),
      name: newUniName.trim(),
      logo: newUniLogo.trim(),
    };
    setLocalSettings((prev) => ({ ...prev, universities: [...unis, newUni] }));
    setNewUniName("");
    setNewUniLogo("");
  };

  const removeUniversity = (id) => {
    const unis = (localSettings.universities || []).filter((u) => u.id !== id);
    setLocalSettings((prev) => ({ ...prev, universities: unis }));
  };

  const updateUniversity = (id, key, value) => {
    const unis = (localSettings.universities || []).map((u) =>
      u.id === id ? { ...u, [key]: value } : u
    );
    setLocalSettings((prev) => ({ ...prev, universities: unis }));
  };

  // ✅ اسلایدهای بنر Hero
  const addHeroSlide = () => {
    if (!newSlideImage) return;
    const slides = localSettings.heroSlides || [];
    const newSlide = {
      id: Date.now(),
      image: newSlideImage,
      link: newSlideLink.trim(),
    };
    setLocalSettings((prev) => ({ ...prev, heroSlides: [...slides, newSlide] }));
    setNewSlideImage("");
    setNewSlideLink("");
  };

  const removeHeroSlide = (id) => {
    const slides = (localSettings.heroSlides || []).filter((s) => s.id !== id);
    setLocalSettings((prev) => ({ ...prev, heroSlides: slides }));
  };

  const updateHeroSlide = (id, key, value) => {
    const slides = (localSettings.heroSlides || []).map((s) =>
      s.id === id ? { ...s, [key]: value } : s
    );
    setLocalSettings((prev) => ({ ...prev, heroSlides: slides }));
  };

  const moveHeroSlide = (id, direction) => {
    const slides = [...(localSettings.heroSlides || [])];
    const index = slides.findIndex((s) => s.id === id);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= slides.length) return;
    [slides[index], slides[target]] = [slides[target], slides[index]];
    setLocalSettings((prev) => ({ ...prev, heroSlides: slides }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("تنظیمات با موفقیت ذخیره شد");
  };

  const handlePasswordChange = () => {
    // ✅ FIX: بک‌اند رمز فعلی را الزامی می‌داند و با آن مقایسه می‌کند؛
    // قبلاً این فیلد اصلاً در فرم وجود نداشت، پس تغییر رمز همیشه رد می‌شد.
    if (!currentPass.trim()) {
      toast.error("رمز عبور فعلی را وارد کنید");
      return;
    }
    if (!newPass.trim()) {
      toast.error("رمز جدید را وارد کنید");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    if (newPass.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    // ✅ FIX: رمز در adminCredentials ذخیره می‌شود، نه siteSettings
    updateCredentials({ adminPassword: newPass, currentPassword: currentPass })
      .then(() => {
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        toast.success("رمز عبور با موفقیت تغییر یافت. لطفاً دوباره وارد شوید");
      })
      .catch((err) => toast.error(err?.message || "رمز عبور فعلی اشتباه است"));
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetSettings();
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 pt-28">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-primary">تنظیمات</span>
            <span className="text-accent"> سایت</span>
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-2"></div>
          <p className="mt-2 text-text-secondary text-sm">محتوا و اطلاعات سایت را بدون نیاز به برنامه‌نویس ویرایش کنید</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="btn-outline flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            داشبورد
          </Link>
          <button onClick={handleSave} disabled={settingsLoading} className="btn-gold flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {settingsLoading ? "در حال بارگذاری..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>

      {settingsLoading && (
        <div className="mb-6 flex items-center gap-2 text-sm text-text-muted bg-primary-bg/50 rounded-xl px-4 py-3">
          <Icon name="spinner" size={16} className="animate-spin" />
          در حال بارگذاری تنظیمات فعلی سایت — لطفاً قبل از ویرایش صبر کنید تا کامل بارگذاری شود.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* منوی تب‌ها */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-2xl shadow-elegant p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap w-full text-right ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "text-text-secondary hover:bg-primary-bg"
                }`}
              >
                <Icon name={tab.icon} size={18} strokeWidth={1.5} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* محتوای تب */}
        <div className="flex-1 bg-white rounded-2xl shadow-elegant p-6 sm:p-8">

          {/* ===== عمومی ===== */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary mb-6">اطلاعات عمومی</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="نام انتشارات (سفید)">
                  <Input value={localSettings.publisherName} onChange={(v) => set("publisherName", v)} placeholder="انتشارات" />
                </Field>
                <Field label="نام انتشارات (طلایی)">
                  <Input value={localSettings.publisherNameAccent} onChange={(v) => set("publisherNameAccent", v)} placeholder="الحان" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="حرف لوگو" hint="حرف نمایش داده شده داخل مربع لوگو">
                  <Input value={localSettings.logoLetter} onChange={(v) => set("logoLetter", v)} placeholder="آ" />
                </Field>
                <Field label="سال تاسیس">
                  <Input value={localSettings.foundingYear} onChange={(v) => set("foundingYear", v)} placeholder="۱۳۹۸" />
                </Field>
              </div>
              <Field label="شعار / توضیح کوتاه">
                <Textarea value={localSettings.slogan} onChange={(v) => set("slogan", v)} placeholder="ناشر آثار علمی..." rows={3} />
              </Field>
              <Field label="شماره پروانه نشر">
                <Input value={localSettings.publishLicense} onChange={(v) => set("publishLicense", v)} placeholder="۱۴۹۳۳" />
              </Field>
            </div>
          )}

          {/* ===== صفحه اصلی (هیرو) — مدیریت اسلایدهای بنر ===== */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">اسلایدهای بنر صفحه اصلی</h2>
                <p className="text-sm text-text-muted">
                  تصاویری که در بالای صفحه اصلی به‌صورت اسلایدر نمایش داده می‌شوند. هر اسلاید
                  می‌تواند با کلیک به یک صفحه (مثلاً یک کتاب) لینک شود یا فقط تصویر باشد.
                  برای بهترین نتیجه، تصاویر را با نسبت عرض‌به‌ارتفاع حدود ۵:۲ آپلود کنید تا
                  بدون افتادگی برش داده شوند.
                </p>
              </div>

              {/* افزودن اسلاید جدید */}
              <div className="bg-primary-bg/50 rounded-2xl p-5 border-2 border-dashed border-primary-light/30">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  افزودن اسلاید جدید
                </h3>
                <div className="space-y-3">
                  <ImageUploader
                    value={newSlideImage}
                    onChange={setNewSlideImage}
                    label="تصویر اسلاید"
                  />
                  <Field label="لینک (اختیاری)" hint="مثلاً /books/12 برای صفحه‌ی یک کتاب، یا یک آدرس کامل https://... — اگر خالی بماند، اسلاید فقط تصویر است و کلیک‌پذیر نیست.">
                    <input
                      type="text"
                      dir="ltr"
                      value={newSlideLink}
                      onChange={(e) => setNewSlideLink(e.target.value)}
                      placeholder="/books/12"
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3 text-left focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
                    />
                  </Field>
                  <button
                    onClick={addHeroSlide}
                    disabled={!newSlideImage}
                    className="btn-gold text-sm px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    افزودن اسلاید
                  </button>
                </div>
              </div>

              {/* لیست اسلایدهای موجود */}
              <div className="space-y-3">
                {(localSettings.heroSlides || []).length === 0 ? (
                  <div className="text-center py-10 text-text-muted text-sm">
                    هنوز اسلایدی اضافه نشده است — تا زمانی که حداقل یک اسلاید اضافه نشود،
                    این بخش در صفحه اصلی نمایش داده نمی‌شود.
                  </div>
                ) : (
                  (localSettings.heroSlides || []).map((slide, index) => {
                    const slides = localSettings.heroSlides || [];
                    return (
                      <div
                        key={slide.id}
                        className="bg-white rounded-2xl border-2 border-primary-light/20 p-4 flex items-center gap-4"
                      >
                        {/* پیش‌نمایش تصویر با همان نسبت واقعی روی سایت */}
                        <div className="w-28 sm:w-36 aspect-[5/2] rounded-xl overflow-hidden shrink-0 shadow border border-primary-light/20 bg-primary-bg">
                          <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            dir="ltr"
                            value={slide.link}
                            onChange={(e) => updateHeroSlide(slide.id, "link", e.target.value)}
                            placeholder="بدون لینک (فقط تصویر)"
                            className="w-full border-2 border-primary-light/30 rounded-xl p-2.5 text-sm text-left focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                          <p className="text-xs text-text-muted">
                            اسلاید {index + 1} از {slides.length}
                          </p>
                        </div>

                        {/* جابه‌جایی ترتیب */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => moveHeroSlide(slide.id, -1)}
                            disabled={index === 0}
                            className="w-7 h-7 rounded-lg border-2 border-primary-light/30 flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:pointer-events-none"
                            title="جابه‌جایی به بالا"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveHeroSlide(slide.id, 1)}
                            disabled={index === slides.length - 1}
                            className="w-7 h-7 rounded-lg border-2 border-primary-light/30 flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:pointer-events-none"
                            title="جابه‌جایی به پایین"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {/* حذف */}
                        <button
                          onClick={() => removeHeroSlide(slide.id)}
                          className="w-9 h-9 rounded-xl border-2 border-red-200 flex items-center justify-center text-red-400 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ── انتخاب کتاب ویژه (برای کارت جمع‌وجور موبایل/تبلت زیر اسلایدر) ── */}
              <div className="border-t border-primary-light/20 pt-5">
                <h3 className="font-bold text-primary mb-1">کتاب ویژه</h3>
                <p className="text-xs text-text-muted mb-4">
                  در نسخه‌ی موبایل و تبلت، یک کارت جمع‌وجور از این کتاب زیر اسلایدر نمایش داده
                  می‌شود. اگر کتابی انتخاب نشود، آخرین کتاب اضافه‌شده به‌صورت خودکار نمایش داده می‌شود.
                </p>

                {books.length === 0 ? (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <Icon name="warning" size={20} strokeWidth={1.5} className="text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700">
                      هنوز کتابی اضافه نشده است.{" "}
                      <Link to="/admin/books/add" className="font-bold underline hover:text-amber-900">
                        افزودن کتاب
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* گزینه: انتخاب خودکار (آخرین کتاب) */}
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      !localSettings.featuredBookId
                        ? "border-accent bg-accent/5"
                        : "border-primary-light/20 hover:border-primary-light/50 bg-primary-bg/30"
                    }`}>
                      <input
                        type="radio"
                        name="featuredBook"
                        value=""
                        checked={!localSettings.featuredBookId}
                        onChange={() => set("featuredBookId", null)}
                        className="accent-accent w-4 h-4 shrink-0"
                      />
                      <div className="w-10 h-14 bg-gradient-gold rounded-lg flex items-center justify-center shrink-0 shadow">
                        <span className="text-white text-xl font-bold">{localSettings.logoLetter || "آ"}</span>
                      </div>
                      <div>
                        <p className="font-medium text-primary text-sm">انتخاب خودکار (پیش‌فرض)</p>
                        <p className="text-xs text-text-muted mt-0.5">آخرین کتاب اضافه‌شده</p>
                      </div>
                    </label>

                    {/* لیست کتاب‌ها */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
                      {books.map((book) => (
                        <label
                          key={book.id}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            String(localSettings.featuredBookId) === String(book.id)
                              ? "border-accent bg-accent/5"
                              : "border-primary-light/20 hover:border-primary-light/50 bg-primary-bg/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="featuredBook"
                            value={book.id}
                            checked={String(localSettings.featuredBookId) === String(book.id)}
                            onChange={() => set("featuredBookId", book.id)}
                            className="accent-accent w-4 h-4 shrink-0"
                          />

                          {/* تصویر جلد یا placeholder */}
                          <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 shadow border border-primary-light/20 bg-primary-bg">
                            {book.image ? (
                              <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full bg-gradient-gold flex items-center justify-center"
                              style={{ display: book.image ? "none" : "flex" }}
                            >
                              <span className="text-white text-sm font-bold">
                                {book.title?.[0] || "؟"}
                              </span>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-primary text-sm truncate">{book.title}</p>
                            <p className="text-xs text-text-muted mt-0.5 truncate">{book.authorName}</p>
                            {book.category && (
                              <span className="inline-block mt-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                {book.category}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== دانشگاه‌های همکار ===== */}
          {activeTab === "universities" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary mb-2">دانشگاه‌های همکار</h2>
              <p className="text-sm text-text-muted -mt-4">
                دانشگاه‌هایی که با اساتیدشان همکاری داشته‌ایم را مدیریت کنید
              </p>

              {/* افزودن دانشگاه جدید */}
              <div className="bg-primary-bg/50 rounded-2xl p-5 border-2 border-dashed border-primary-light/30">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  افزودن دانشگاه جدید
                </h3>
                <div className="space-y-3">
                  <Field label="نام دانشگاه">
                    <input
                      type="text"
                      value={newUniName}
                      onChange={(e) => setNewUniName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addUniversity()}
                      placeholder="مثال: دانشگاه تهران"
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
                    />
                  </Field>
                  {/* ✅ FIX: ImageUploader به جای input ساده URL */}
                  <ImageUploader
                    value={newUniLogo}
                    onChange={setNewUniLogo}
                    label="لوگوی دانشگاه (اختیاری)"
                  />
                  <button
                    onClick={addUniversity}
                    disabled={!newUniName.trim()}
                    className="btn-gold text-sm px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    افزودن دانشگاه
                  </button>
                </div>
              </div>

              {/* لیست دانشگاه‌های موجود */}
              <div className="space-y-3">
                {(localSettings.universities || []).length === 0 ? (
                  <div className="text-center py-10 text-text-muted text-sm">
                    هنوز دانشگاهی اضافه نشده است
                  </div>
                ) : (
                  (localSettings.universities || []).map((uni) => (
                    <div
                      key={uni.id}
                      className="bg-white rounded-2xl border-2 border-primary-light/20 p-4 flex items-center gap-4"
                    >
                      {/* لوگو */}
                      <div className="w-12 h-12 rounded-full border-2 border-primary-light/20 bg-primary-bg flex items-center justify-center overflow-hidden shrink-0">
                        {uni.logo ? (
                          <img
                            src={uni.logo}
                            alt={uni.name}
                            className="w-9 h-9 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: uni.logo ? "none" : "flex" }}
                        >
                          <span className="text-lg font-bold text-primary-light">{uni.name?.[0] || "د"}</span>
                        </div>
                      </div>

                      {/* ویرایش یا نمایش */}
                      {editingUniId === uni.id ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={uni.name}
                            onChange={(e) => updateUniversity(uni.id, "name", e.target.value)}
                            className="w-full border-2 border-primary-light/30 rounded-xl p-2.5 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                          {/* ✅ FIX: ImageUploader برای لوگوی دانشگاه در حالت ویرایش */}
                          <ImageUploader
                            value={uni.logo}
                            onChange={(val) => updateUniversity(uni.id, "logo", val)}
                            label="لوگوی دانشگاه"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary text-sm">{uni.name}</p>
                          {uni.logo && (
                            <p className="text-xs text-text-muted mt-0.5">
                              {uni.logo.startsWith("data:") ? "✓ لوگو آپلود شده" : uni.logo}
                            </p>
                          )}
                        </div>
                      )}

                      {/* دکمه‌های عملیات */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            setEditingUniId(editingUniId === uni.id ? null : uni.id)
                          }
                          className="w-9 h-9 rounded-xl border-2 border-primary-light/30 flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all"
                          title={editingUniId === uni.id ? "بستن" : "ویرایش"}
                        >
                          {editingUniId === uni.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => removeUniversity(uni.id)}
                          className="w-9 h-9 rounded-xl border-2 border-red-200 flex items-center justify-center text-red-400 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* پیش‌نمایش */}
              {(localSettings.universities || []).length > 0 && (
                <div className="bg-primary rounded-2xl p-6 mt-2">
                  <p className="text-white/60 text-xs mb-4 text-center">پیش‌نمایش نمایش دانشگاه‌ها در سایت</p>
                  <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {(localSettings.universities || []).map((uni) => (
                      <div key={uni.id} className="flex-none flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
                          {uni.logo ? (
                            <img
                              src={uni.logo}
                              alt={uni.name}
                              className="w-11 h-11 object-contain"
                              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center" style={{ display: uni.logo ? "none" : "flex" }}>
                            <span className="text-xl font-bold text-accent">{uni.name?.[0] || "د"}</span>
                          </div>
                        </div>
                        <p className="text-white/70 text-[10px] text-center max-w-[80px] leading-4">{uni.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== درباره ما ===== */}
          {activeTab === "about" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary mb-6">محتوای درباره ما</h2>
              <Field label="متن اصلی درباره ما">
                <Textarea value={localSettings.aboutText} onChange={(v) => set("aboutText", v)} placeholder="درباره انتشارات..." rows={5} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-primary-bg/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-accent mb-3">چشم‌انداز</p>
                  <Textarea value={localSettings.vision} onChange={(v) => set("vision", v)} placeholder="چشم‌انداز..." rows={3} />
                </div>
                <div className="bg-primary-bg/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-accent mb-3">رسالت</p>
                  <Textarea value={localSettings.mission} onChange={(v) => set("mission", v)} placeholder="رسالت..." rows={3} />
                </div>
                <div className="bg-primary-bg/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-accent mb-3">⭐ ارزش‌ها</p>
                  <Textarea value={localSettings.values} onChange={(v) => set("values", v)} placeholder="اصالت، کیفیت و نوآوری..." rows={3} />
                </div>
              </div>
            </div>
          )}

          {/* ===== تماس ===== */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary mb-6">اطلاعات تماس</h2>
              <Field label="آدرس">
                <Textarea value={localSettings.address} onChange={(v) => set("address", v)} placeholder="آدرس..." rows={2} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="شماره تلفن (نمایشی)" hint="مثال: ۰۲۵-۳۲۷۰۱۱۲۶">
                  <Input value={localSettings.phone} onChange={(v) => set("phone", v)} placeholder="۰۲۵-۳۲۷۰۱۱۲۶" />
                </Field>
                <Field label="شماره تلفن (لینک tel:)" hint="فقط اعداد، بدون خط تیره: 02532701126">
                  <Input value={localSettings.phoneRaw} onChange={(v) => set("phoneRaw", v)} placeholder="02532701126" />
                </Field>
              </div>
              <Field label="ایمیل">
                <Input type="email" value={localSettings.email} onChange={(v) => set("email", v)} placeholder="info@example.com" />
              </Field>
            </div>
          )}

          {/* ===== شبکه‌های اجتماعی ===== */}
          {activeTab === "social" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary mb-6">شبکه‌های اجتماعی</h2>
              <Field label="لینک اینستاگرام">
                <Input value={localSettings.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="لینک تلگرام">
                <Input value={localSettings.telegram} onChange={(v) => set("telegram", v)} placeholder="https://t.me/..." />
              </Field>
            </div>
          )}

          {/* ===== هزینه ارسال ===== */}
          {activeTab === "shipping" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary mb-6">هزینه ارسال پستی</h2>
              <Field label="هزینه ارسال (تومان)" hint="این مبلغ به‌صورت ثابت به سبد خرید هر سفارش اضافه می‌شود">
                <Input
                  type="number"
                  value={localSettings.shippingCost}
                  onChange={(v) => set("shippingCost", Number(v) || 0)}
                  placeholder="50000"
                />
              </Field>
            </div>
          )}

          {/* ===== امنیت ===== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary mb-6">تنظیمات امنیتی</h2>

              {/* نام کاربری */}
              <div className="bg-primary-bg/50 rounded-2xl p-5">
                <h3 className="font-bold text-primary mb-4">اطلاعات ورود فعلی</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="نام کاربری فعلی">
                    {/* ✅ FIX: از localCredentials خوانده و در adminCredentials ذخیره می‌شود */}
                    <Input value={localCredentials.adminUsername} onChange={(v) => setLocalCredentials((prev) => ({ ...prev, adminUsername: v }))} placeholder="admin" />
                  </Field>
                </div>
                <button
                  onClick={() => { updateCredentials({ adminUsername: localCredentials.adminUsername }); toast.success("نام کاربری به‌روز شد"); }}
                  className="mt-4 btn-gold text-sm px-6"
                >
                  ذخیره نام کاربری
                </button>
              </div>

              {/* تغییر رمز */}
              <div className="bg-primary-bg/50 rounded-2xl p-5">
                <h3 className="font-bold text-primary mb-4">تغییر رمز عبور</h3>
                <div className="space-y-4">
                  <Field label="رمز عبور فعلی" hint="برای تغییر رمز، ابتدا رمز فعلی خود را وارد کنید">
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="رمز عبور فعلی"
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
                    />
                  </Field>
                  <Field label="رمز عبور جدید">
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
                    />
                  </Field>
                  <Field label="تکرار رمز عبور جدید">
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="تکرار رمز"
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
                    />
                  </Field>
                  <button onClick={handlePasswordChange} className="btn-gold text-sm px-6">
                    تغییر رمز عبور
                  </button>
                </div>
              </div>

              {/* بازنشانی */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-1.5"><Icon name="warning" size={18} strokeWidth={1.5} />بازنشانی تنظیمات</h3>
                <p className="text-sm text-red-600 mb-4">تمام تنظیمات به حالت پیش‌فرض برمی‌گردند. این عمل قابل بازگشت نیست.</p>
                <button
                  onClick={handleReset}
                  className={`text-sm px-6 py-2.5 rounded-xl font-bold transition-all ${
                    confirmReset
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {confirmReset ? "مطمئن هستم، بازنشانی شود" : "بازنشانی تنظیمات"}
                </button>
                {confirmReset && (
                  <button onClick={() => setConfirmReset(false)} className="mr-3 text-sm text-text-muted hover:text-primary">
                    انصراف
                  </button>
                )}
              </div>
            </div>
          )}

          {/* دکمه ذخیره پایین صفحه (به جز امنیت که خودش داره) */}
          {activeTab !== "security" && (
            <div className="mt-8 pt-6 border-t border-primary-light/20 flex justify-end">
              <button onClick={handleSave} disabled={settingsLoading} className="btn-gold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ذخیره تغییرات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
