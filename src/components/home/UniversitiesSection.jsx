import { useState } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";

const GraduationCapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.5 3 2.5 6 2.5s6-1 6-2.5v-5" />
  </svg>
);

function UniCard({ uni }) {
  const [imgError, setImgError] = useState(false);
  // ✅ Base64 یا URL — هر دو کار می‌کنند
  const hasLogo = uni.logo && !imgError;

  return (
    <div className="uni-card flex flex-col items-center gap-3 cursor-default group">

      {/* لوگو */}
      <div
        className="uni-card-logo relative w-[84px] h-[84px] rounded-[20px] flex items-center justify-center overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-accent/20"
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        {hasLogo ? (
          <img
            src={uni.logo}
            alt={uni.name}
            className="uni-card-img w-[54px] h-[54px] object-contain transition-transform duration-300 select-none group-hover:scale-105"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          // ✅ fallback: حرف اول با پس‌زمینه گرادینت
          <div className="w-[54px] h-[54px] rounded-xl bg-gradient-gold flex items-center justify-center">
            <span className="text-white text-xl font-black">
              {uni.name?.[0] || "د"}
            </span>
          </div>
        )}
      </div>

      {/* نام */}
      <p
        className="uni-card-name text-[11.5px] font-medium text-center leading-[1.65] max-w-[110px] transition-colors duration-300 group-hover:text-accent-light"
        style={{ color: "rgba(255,255,255,0.58)" }}
      >
        {uni.name}
      </p>
    </div>
  );
}

function UniversitiesSection() {
  const { settings } = useSiteSettings();
  const universities = settings.universities || [];

  if (!universities.length) return null;

  return (
    <section
      className="unis-section-bg relative py-24 overflow-hidden direction-rtl"
      dir="rtl"
      style={{ background: "linear-gradient(155deg, #142b26 0%, #0f2a25 40%, #1a3a34 100%)" }}
    >

      {/* هدر */}
      <div className="relative z-10 text-center mb-16 px-6">

        {/* برچسب */}
        <div
          className="inline-flex items-center gap-2 mb-5 px-4 py-[5px] rounded-full text-[11.5px] font-semibold tracking-[0.13em]"
          style={{
            background: "rgba(201,169,110,0.1)",
            border: "1px solid rgba(201,169,110,0.22)",
            color: "#e8d5a3",
          }}
        >
          <GraduationCapIcon />
          همکاری علمی
          <span
            className="unis-pulse-dot w-[5px] h-[5px] rounded-full"
            style={{ background: "#c9a96e" }}
          />
        </div>

        {/* عنوان */}
        <h2 className="text-[clamp(26px,4vw,40px)] font-bold text-white leading-[1.35] m-0 mb-4">
          دانشگاه‌های{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #c9a96e 0%, #e8d5a3 60%, #c9a96e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            همکار
          </span>
        </h2>

        {/* خط طلایی */}
        <div
          className="w-12 h-[2px] rounded-full mx-auto mb-4"
          style={{ background: "linear-gradient(90deg, transparent, #c9a96e, transparent)" }}
        />

        <p className="text-[13.5px] leading-[1.8] m-0" style={{ color: "rgba(255,255,255,0.45)" }}>
          افتخار همکاری با اساتید برجسته دانشگاه های معتبر کشور را داریم
        </p>
      </div>

      {/* گرید */}
      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <div className="grid gap-y-5 gap-x-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
        >
          {universities.map((uni) => (
            <UniCard key={uni.id} uni={uni} />
          ))}
        </div>
      </div>

      {/* خط پایینی */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-16 opacity-20">
        <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.7)" }} />
        <div className="w-1 h-1 rounded-full" style={{ background: "#c9a96e" }} />
        <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.7)" }} />
      </div>

    </section>
  );
}

export default UniversitiesSection;
