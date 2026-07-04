import PageMeta from "../components/PageMeta";
import Icon from "../components/ui/Icon";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import useBooks from "../hooks/useBooks";
import { SkeletonGrid } from "../components/LoadingSpinner";
import InlineError from "../components/InlineError";

const DEFAULT_CATEGORIES = [
  "همه","حقوق","اقتصاد","فلسفه","ادبیات","تاریخ","علمی","دانشگاهی","شعر","رمان","سیاسی","اجتماعی",
];

const SORT_OPTIONS = [
  { value: "newest",     label: "جدیدترین"     },
  { value: "oldest",     label: "قدیمی‌ترین"   },
  { value: "title",      label: "عنوان"         },
  { value: "author",     label: "نویسنده"       },
  { value: "pages",      label: "تعداد صفحات"  },
  // ✅ مرتب‌سازی بر اساس قیمت
  { value: "price_asc",  label: "ارزان‌ترین"   },
  { value: "price_desc", label: "گران‌ترین"    },
];

// ✅ گزینه‌های فیلتر قیمت
const PRICE_RANGES = [
  { value: "all",    label: "همه قیمت‌ها"        },
  { value: "free",   label: "تماس برای خرید"     },
  { value: "0-100",  label: "زیر ۱۰۰ هزار تومان" },
  { value: "100-300",label: "۱۰۰ تا ۳۰۰ هزار"   },
  { value: "300+",   label: "بالای ۳۰۰ هزار"    },
];

// ✅ گزینه‌های فیلتر چاپ
const EDITION_OPTIONS = ["همه", "اول", "دوم", "سوم", "چهارم", "پنجم"];

function Books() {
  // ✅ loading و error برای آماده‌سازی اتصال بکند
  const { books, loading, error } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "همه");
  const [search,           setSearch]           = useState(searchParams.get("search")   || "");
  const [sortBy,           setSortBy]           = useState(searchParams.get("sort")     || "newest");
  const [currentPage,      setCurrentPage]      = useState(parseInt(searchParams.get("page")) || 1);
  // ✅ فیلترهای جدید
  const [priceRange,  setPriceRange]  = useState(searchParams.get("price")   || "all");
  const [edition,     setEdition]     = useState(searchParams.get("edition") || "همه");
  const [yearFrom,    setYearFrom]    = useState(searchParams.get("yearFrom")|| "");
  const [yearTo,      setYearTo]      = useState(searchParams.get("yearTo")  || "");
  const [onlyAudio,   setOnlyAudio]   = useState(searchParams.get("audio")  === "1");

  const itemsPerPage = 12;

  const existingCategories = useMemo(() => {
    const cats = [...new Set(books.map((b) => b.category).filter(Boolean))];
    return ["همه", ...cats];
  }, [books]);

  const allCategories = useMemo(() =>
    ["همه", ...new Set([...DEFAULT_CATEGORIES.slice(1), ...existingCategories.slice(1)])],
  [existingCategories]);

  // ✅ بازه سال از داده واقعی
  const yearRange = useMemo(() => {
    const years = books.map((b) => b.year).filter(Boolean);
    return { min: Math.min(...years) || 1390, max: Math.max(...years) || 1404 };
  }, [books]);

  useEffect(() => {
    const params = {};
    if (search)                    params.search   = search;
    if (selectedCategory !== "همه") params.category = selectedCategory;
    if (sortBy !== "newest")        params.sort     = sortBy;
    if (currentPage > 1)           params.page     = currentPage;
    if (priceRange !== "all")      params.price    = priceRange;
    if (edition !== "همه")         params.edition  = edition;
    if (yearFrom)                  params.yearFrom = yearFrom;
    if (yearTo)                    params.yearTo   = yearTo;
    if (onlyAudio)                 params.audio    = "1";
    setSearchParams(params, { replace: true });
  }, [search, selectedCategory, sortBy, currentPage, priceRange, edition, yearFrom, yearTo, onlyAudio]);

  // ✅ فیلتر با اعمال همه شرط‌های جدید
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      // جستجو
      const matchSearch =
        !search.trim() ||
        book.title.includes(search) ||
        (book.authorName && book.authorName.includes(search)) ||
        (book.category && book.category.includes(search)) ||
        (book.isbn && book.isbn.includes(search));

      // دسته‌بندی
      const matchCategory = selectedCategory === "همه" || book.category === selectedCategory;

      // ✅ فیلتر قیمت
      const price = Number(book.price) || 0;
      const matchPrice = (() => {
        if (priceRange === "all")    return true;
        if (priceRange === "free")   return !book.price || book.price === "";
        if (priceRange === "0-100")  return price > 0   && price < 100000;
        if (priceRange === "100-300")return price >= 100000 && price <= 300000;
        if (priceRange === "300+")   return price > 300000;
        return true;
      })();

      // ✅ فیلتر چاپ
      const matchEdition = edition === "همه" || book.edition === edition;

      // ✅ فیلتر سال
      const matchYear =
        (!yearFrom || (book.year && book.year >= Number(yearFrom))) &&
        (!yearTo   || (book.year && book.year <= Number(yearTo)));

      // ✅ فیلتر صوتی
      const matchAudio = !onlyAudio || book.isAudio;

      return matchSearch && matchCategory && matchPrice && matchEdition && matchYear && matchAudio;
    });

    // مرتب‌سازی
    switch (sortBy) {
      case "newest":     result.sort((a, b) => (b.year  || 0) - (a.year  || 0)); break;
      case "oldest":     result.sort((a, b) => (a.year  || 0) - (b.year  || 0)); break;
      case "title":      result.sort((a, b) => a.title.localeCompare(b.title));   break;
      case "author":     result.sort((a, b) => (a.authorName||"").localeCompare(b.authorName||"")); break;
      case "pages":      result.sort((a, b) => (b.pages || 0) - (a.pages || 0)); break;
      case "price_asc":  result.sort((a, b) => (Number(a.price)||0) - (Number(b.price)||0)); break;
      case "price_desc": result.sort((a, b) => (Number(b.price)||0) - (Number(a.price)||0)); break;
    }
    return result;
  }, [books, search, selectedCategory, priceRange, edition, yearFrom, yearTo, onlyAudio, sortBy]);

  const totalPages    = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  // تعداد فیلترهای فعال
  const activeFilterCount = [
    selectedCategory !== "همه",
    priceRange !== "all",
    edition !== "همه",
    !!yearFrom,
    !!yearTo,
    onlyAudio,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("همه"); setSortBy("newest");
    setPriceRange("all"); setEdition("همه");
    setYearFrom(""); setYearTo(""); setOnlyAudio(false);
    setCurrentPage(1);
  };

  const FilterPanel = ({ mobile = false }) => (
    <div className={`space-y-4 ${mobile ? "" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 space-y-0"}`}>

      {/* جستجو */}
      <div className="relative">
        <input type="text" placeholder="جستجوی کتاب، نویسنده، شابک..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full border-2 border-primary-light/30 rounded-xl p-3 pr-10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      {/* دسته‌بندی */}
      <select value={selectedCategory}
        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
        className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 text-text-secondary">
        {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      {/* مرتب‌سازی */}
      <select value={sortBy}
        onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
        className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-primary-bg/30 text-text-secondary">
        {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>مرتب‌سازی: {opt.label}</option>)}
      </select>

      {/* دکمه‌ها */}
      <div className="flex gap-2">
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex-1 flex items-center justify-center gap-1.5 text-sm rounded-xl px-3 py-3 border-2 transition-all ${
            showAdvanced || activeFilterCount > 0
              ? "border-accent bg-accent/10 text-accent"
              : "border-primary-light/30 text-text-secondary hover:border-accent hover:text-accent"
          }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          فیلتر پیشرفته
          {activeFilterCount > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button onClick={clearFilters}
          className="flex items-center justify-center gap-1 text-sm btn-outline px-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          پاک
        </button>
      </div>

      {/* ✅ فیلترهای پیشرفته */}
      {showAdvanced && (
        <div className={`${mobile ? "" : "col-span-full"} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-primary-light/10`}>

          {/* قیمت */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">محدوده قیمت</label>
            <select value={priceRange}
              onChange={(e) => { setPriceRange(e.target.value); setCurrentPage(1); }}
              className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent transition-all bg-white text-sm text-text-secondary">
              {PRICE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {/* چاپ */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">شماره چاپ</label>
            <select value={edition}
              onChange={(e) => { setEdition(e.target.value); setCurrentPage(1); }}
              className="w-full border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent transition-all bg-white text-sm text-text-secondary">
              {EDITION_OPTIONS.map((e) => <option key={e} value={e}>چاپ {e === "همه" ? "" : ""}{e}</option>)}
            </select>
          </div>

          {/* بازه سال */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">
              سال انتشار ({yearRange.min}–{yearRange.max})
            </label>
            <div className="flex gap-2">
              <input type="number" placeholder="از" value={yearFrom}
                onChange={(e) => { setYearFrom(e.target.value); setCurrentPage(1); }}
                min={yearRange.min} max={yearRange.max}
                className="w-1/2 border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent transition-all bg-white text-sm" />
              <input type="number" placeholder="تا" value={yearTo}
                onChange={(e) => { setYearTo(e.target.value); setCurrentPage(1); }}
                min={yearRange.min} max={yearRange.max}
                className="w-1/2 border-2 border-primary-light/30 rounded-xl p-3 focus:border-accent transition-all bg-white text-sm" />
            </div>
          </div>

          {/* صوتی */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => { setOnlyAudio(!onlyAudio); setCurrentPage(1); }}
                className={`w-11 h-6 rounded-full transition-all relative ${onlyAudio ? "bg-accent" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${onlyAudio ? "right-0.5" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-text-secondary">فقط کتاب صوتی</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageMeta title="کتاب‌ها" description="مشاهده و جستجوی تمام کتاب‌های انتشارات الحان در دسته‌بندی‌های مختلف" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 pt-28">

      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-primary">کتاب‌های</span>
          <span className="text-accent"> انتشارات الحان</span>
        </h1>
        <div className="w-16 h-1 bg-accent rounded-full mt-3" />
        <p className="mt-2 text-text-muted text-sm">
          {filteredBooks.length} کتاب یافت شد
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mr-2 text-accent hover:underline text-xs">
              (پاک کردن {activeFilterCount} فیلتر)
            </button>
          )}
        </p>
      </div>

      {/* فیلتر دسکتاپ */}
      <div className="hidden md:block bg-white rounded-2xl shadow-elegant p-6 mb-8">
        <FilterPanel />
      </div>

      {/* فیلتر موبایل */}
      <div className="md:hidden mb-6">
        <button onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-white rounded-2xl shadow-elegant p-4 flex items-center justify-between">
          <span className="font-bold text-primary flex items-center gap-2">
            فیلترها
            {activeFilterCount > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{filteredBooks.length} کتاب</span>
            <svg className={`w-5 h-5 text-primary transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-white rounded-2xl shadow-elegant p-6 mt-3">
            <FilterPanel mobile />
          </div>
        </div>
      </div>

      {/* ✅ نمایش کتاب‌ها — با اولویت: خطا > لودینگ > خالی > لیست */}
      {error ? (
        <InlineError message={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        <SkeletonGrid count={8} />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-elegant">
          <div className="mb-4">
            <Icon name="books" size={48} strokeWidth={0.75} className="mx-auto text-primary/20" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">نتیجه‌ای یافت نشد</h3>
          <p className="text-text-muted">سعی کنید فیلترهای دیگری را امتحان کنید</p>
          <button onClick={clearFilters} className="mt-6 btn-gold inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            نمایش همه کتاب‌ها
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedBooks.map((book, index) => (
              <div key={book.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                  currentPage === 1 ? "border-primary-light/30 text-text-muted cursor-not-allowed" : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5)             p = i + 1;
                else if (currentPage <= 3)       p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else                             p = currentPage - 2 + i;
                return (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all font-bold ${
                      currentPage === p ? "bg-accent border-accent text-white shadow-lg" : "border-primary-light/30 text-text-secondary hover:border-primary hover:text-primary"
                    }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                  currentPage === totalPages ? "border-primary-light/30 text-text-muted cursor-not-allowed" : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </>
  );
}

export default Books;
