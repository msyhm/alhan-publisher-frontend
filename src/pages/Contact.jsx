import PageMeta from "../components/PageMeta";
import Icon from "../components/ui/Icon";
import { useState } from "react";
import useMessages from "../hooks/useMessages";
import { toast } from "react-hot-toast";

function Contact() {
  const { messages, setMessages } = useMessages();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // شبیه‌سازی ارسال
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        ...formData,
        sentAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages([...messages, newMessage]);
      setSent(true);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("پیام شما با موفقیت ارسال شد!");
    }, 1000);
  };

  const contactInfo = [
    {
      icon: "map-pin",
      title: "آدرس دفتر",
      details: "قم، زنبیل‌آباد، ۳۰ متری قائم، پلاک ۱۸۳",
      link: null,
    },
    {
      icon: "phone",
      title: "تلفن ثابت",
      details: "۰۲۵-۳۲۷۰۱۱۲۶",
      link: "tel:02532701126",
    },
    {
      icon: "mobile",
      title: "تلفن همراه",
      details: "۰۹۲۲-۳۰۱-۲۴۲۹",
      link: "tel:09223012429",
    },
    {
      icon: "mail",
      title: "ایمیل",
      details: "alhannasher@gmail.com",
      link: "mailto:alhannasher@gmail.com",
    },
  ];

  const socials = [
    {
      name: "اینستاگرام",
      icon: "instagram",
      url: "https://instagram.com/AlhanPublish",
      handle: "@AlhanPublish",
    },
    {
      name: "تلگرام",
      icon: "telegram",
      url: "https://t.me/AlhanPublish",
      handle: "@AlhanPublish",
    },
  ];

  return (
    <>
      <PageMeta title="تماس با ما" description="راه‌های ارتباط با انتشارات الحان — آدرس، تلفن، ایمیل و فرم تماس" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">
      {/* ===== هدر ===== */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-bg px-4 py-2 rounded-full text-primary text-sm mb-4">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          ارتباط با ما
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="text-primary">تماس با</span>
          <span className="text-accent"> ما</span>
        </h1>
        <div className="divider-gold-center mt-4"></div>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
          سوالات، پیشنهادات یا درخواست همکاری خود را با ما در میان بگذارید.
          کارشناسان ما در اسرع وقت پاسخگوی شما خواهند بود.
        </p>
      </div>

      {/* ===== اطلاعات تماس + فرم ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* اطلاعات تماس */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-8 sticky top-28">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              اطلاعات تماس
            </h2>

            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-primary-bg rounded-xl flex items-center justify-center shrink-0 text-xl group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon name={item.icon} size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-sm">{item.title}</h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-text-secondary text-sm hover:text-accent transition-colors"
                      >
                        {item.details}
                      </a>
                    ) : (
                      <p className="text-text-secondary text-sm">{item.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="mt-8 pt-8 border-t border-primary-light/20">
              <h3 className="font-bold text-text mb-4 text-sm">ما را دنبال کنید</h3>
              <div className="flex flex-col gap-3">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary-bg hover:bg-accent hover:text-white transition-all group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      <Icon name={social.icon} size={20} strokeWidth={1.5} />
                    </span>
                    <span className="font-medium text-sm group-hover:text-white">
                      {social.name}
                    </span>
                    <span className="text-text-muted text-xs mr-auto group-hover:text-white/80">
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ساعت کاری */}
            <div className="mt-6 p-4 bg-primary-bg/50 rounded-2xl border border-primary-light/10">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="clock" size={18} strokeWidth={1.5} className="text-accent" />
                <span className="font-bold text-primary">ساعت کاری:</span>
                <span className="text-text-secondary">شنبه تا چهارشنبه ۹ الی ۱۷</span>
              </div>
            </div>
          </div>
        </div>

        {/* فرم تماس */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-elegant p-6 sm:p-10">
            {sent ? (
              <div className="text-center py-12 animate-fade-scale">
                <div className="mb-4"><Icon name="check" size={56} strokeWidth={1} className="mx-auto text-green-500" /></div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  پیام شما ارسال شد
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  از تماس شما متشکریم. کارشناسان ما در اسرع وقت پاسخ شما را خواهند داد.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 btn-gold inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                      placeholder="شماره تماس"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      موضوع
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
                      placeholder="موضوع پیام"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    متن پیام *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border-2 border-primary-light/30 rounded-xl p-3.5 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 resize-none"
                    placeholder="پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <span>ارسال پیام</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ===== نقشه ===== */}
      <div className="mt-12">
        <div className="bg-white rounded-3xl shadow-elegant overflow-hidden">
          <div className="h-72 sm:h-96 relative">
            {/* ✅ FIX: مختصات واقعی قم، زنبیل‌آباد، ۳۰ متری قائم */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.2!2d50.8961!3d34.6401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0d6b1a2c3d4e%3A0x5f6a7b8c9d0e1f2a!2z2YXZhtjt2KjZitmEINin2YTYrdm-2KfZhg!5e0!3m2!1sfa!2sir!4v1700000000000!5m2!1sfa!2sir"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقعیت انتشارات الحان — قم، زنبیل‌آباد"
              className="w-full h-full"
            />
            {/* دکمه باز کردن در گوگل‌مپ */}
            <a
              href="https://maps.google.com/?q=34.6401,50.8961"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 bg-white text-primary px-4 py-2 rounded-full shadow-lg text-sm font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              باز کردن در گوگل‌مپ
            </a>
            <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
              انتشارات الحان
            </div>
          </div>
          {/* آدرس زیر نقشه */}
          <div className="px-6 py-4 border-t border-primary-light/10 flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            قم، زنبیل‌آباد، ۳۰ متری قائم، پلاک ۱۸۳
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default Contact;