import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSiteSettings from "../hooks/useSiteSettings";

/**
 * PageMeta — مدیریت title و meta tags بدون کتابخانه خارجی
 *
 * استفاده:
 *   <PageMeta
 *     title="درباره ما"
 *     description="آشنایی با انتشارات الحان"
 *     image="/og-image.jpg"   (اختیاری)
 *   />
 *
 * اگر title داده نشود، عنوان پیش‌فرض سایت نمایش داده می‌شود.
 */
function PageMeta({ title, description, image, noIndex = false }) {
  const { settings } = useSiteSettings();
  const location = useLocation();

  const siteName  = `${settings.publisherName} ${settings.publisherNameAccent}`;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDesc  = description || settings.slogan || `${siteName} — ناشر آثار علمی، دانشگاهی و فرهنگی`;
  const metaImage = image || "/og-image.jpg";
  const canonical = `https://alhanpublish.ir${location.pathname}`;

  useEffect(() => {
    // ─── title ──────────────────────────────────────────────────────────────
    document.title = fullTitle;

    // ─── helper: set یا create meta tag ────────────────────────────────────
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = attr.split("=");
        el.setAttribute(attrName, attrValue.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // ─── Standard meta ──────────────────────────────────────────────────────
    setMeta('meta[name="description"]',        'name="description"',        metaDesc);
    setMeta('meta[name="robots"]',             'name="robots"',             noIndex ? "noindex,nofollow" : "index,follow");

    // ─── Open Graph (فیسبوک، تلگرام، واتساپ) ────────────────────────────────
    setMeta('meta[property="og:title"]',       'property="og:title"',       fullTitle);
    setMeta('meta[property="og:description"]', 'property="og:description"', metaDesc);
    setMeta('meta[property="og:image"]',       'property="og:image"',       metaImage);
    setMeta('meta[property="og:url"]',         'property="og:url"',         canonical);
    setMeta('meta[property="og:type"]',        'property="og:type"',        "website");
    setMeta('meta[property="og:site_name"]',   'property="og:site_name"',   siteName);
    setMeta('meta[property="og:locale"]',      'property="og:locale"',      "fa_IR");

    // ─── Twitter Card ────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]',        'name="twitter:card"',        "summary_large_image");
    setMeta('meta[name="twitter:title"]',       'name="twitter:title"',       fullTitle);
    setMeta('meta[name="twitter:description"]', 'name="twitter:description"', metaDesc);
    setMeta('meta[name="twitter:image"]',       'name="twitter:image"',       metaImage);

    // ─── Canonical ──────────────────────────────────────────────────────────
    setLink("canonical", canonical);

    // cleanup: بازگشت به عنوان پیش‌فرض هنگام unmount
    return () => {
      document.title = siteName;
    };
  }, [fullTitle, metaDesc, metaImage, canonical, noIndex, siteName]);

  // هیچ چیزی رندر نمی‌کند
  return null;
}

export default PageMeta;
