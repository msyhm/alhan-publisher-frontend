import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useBooks from "../../hooks/useBooks";
import Icon from "../ui/Icon";
import logoBlack from "../../assets/logo-black.png";

const links = [
  { to: "/",            label: "خانه",       icon: "home"   },
  { to: "/books",       label: "کتاب‌ها",    icon: "books"  },
  { to: "/about",       label: "درباره ما",  icon: "info"   },
  { to: "/contact",     label: "تماس با ما", icon: "phone"  },
  { to: "/submit-book", label: "ارسال اثر",  icon: "pen"    },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { books } = useBooks();
  const navigate = useNavigate();
  const location = useLocation();
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchBtnRef = useRef(null);
  // ✅ جستجو در همه صفحات فعال است، نه فقط صفحه اصلی
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const results = books.filter(
      (b) =>
        b.title.includes(searchQuery) ||
        (b.authorName  && b.authorName.includes(searchQuery))  ||
        (b.category && b.category.includes(searchQuery)) ||
        (b.isbn    && b.isbn.includes(searchQuery))
    );
    setSearchResults(results.slice(0, 6));
    setShowResults(true);
  }, [searchQuery, books]);

  // باگ ۱ برطرف شد: دو ref جدا برای دسکتاپ و موبایل
  useEffect(() => {
    function handleClickOutside(e) {
      const insideDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(e.target);
      const insideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      const insideMobileBtn = mobileSearchBtnRef.current && mobileSearchBtnRef.current.contains(e.target);

      if (!insideDesktop && !insideMobile) {
        setShowResults(false);
      }
      if (!insideMobile && !insideMobileBtn) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      setIsSearchOpen(false);
      navigate("/books?search=" + encodeURIComponent(searchQuery));
      setSearchQuery("");
    }
  };

  const handleResultClick = (id) => {
    setSearchQuery("");
    setShowResults(false);
    setIsSearchOpen(false);
    navigate("/books/" + id);
  };

  const SearchResultsDropdown = ({ isMobile }) => (
    showResults ? (
      <div className={`absolute top-full w-full bg-white rounded-2xl shadow-dropdown border border-primary-light/10 overflow-hidden z-50 ${isMobile ? "mt-1" : "mt-2"}`}>
        {searchResults.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <Icon name="search" size={32} strokeWidth={1} className="mx-auto mb-2 text-primary/30" />
            <p className="text-text-muted text-sm">نتیجه‌ای یافت نشد</p>
          </div>
        ) : (
          <>
            {searchResults.map((book, index) => (
              <button
                key={book.id}
                onClick={() => handleResultClick(book.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-bg transition text-right ${
                  index !== searchResults.length - 1 ? "border-b border-primary-light/10" : ""
                }`}
              >
                <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text truncate">{book.title}</p>
                  <p className="text-xs text-text-muted truncate">{book.authorName}</p>
                  {book.category && (
                    <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {book.category}
                    </span>
                  )}
                </div>
                <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
            <button
              onClick={handleSearchSubmit}
              className="w-full px-5 py-3 text-sm text-accent font-bold hover:bg-primary-bg transition border-t border-primary-light/10 flex items-center justify-center gap-2"
            >
              مشاهده همه نتایج
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    ) : null
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-elegant py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ===== دسکتاپ ===== */}
        <div className="hidden md:flex justify-between items-center gap-6">
          <Link to="/" className="group flex items-center gap-2 shrink-0">
            <img
              src={logoBlack}
              alt="انتشارات الحان"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="text-xl font-bold text-primary block leading-tight">انتشارات</span>
              <span className="text-sm font-bold text-accent block leading-tight -mt-0.5">الحان</span>
            </div>
          </Link>

          {!isAdminPage && (
            <div ref={desktopSearchRef} className="relative flex-1 max-w-md">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowResults(true)}
                    placeholder="جستجوی کتاب، نویسنده یا دسته‌بندی..."
                    className="w-full bg-primary-bg border-2 border-transparent rounded-full px-5 py-2.5 pr-12 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 placeholder:text-text-muted"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); setShowResults(false); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      
                    </button>
                  )}
                </div>
              </form>
              <SearchResultsDropdown isMobile={false} />
            </div>
          )}

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  location.pathname === link.to
                    ? "text-primary bg-primary-bg"
                    : "text-text-secondary hover:text-primary hover:bg-primary-bg/50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon name={link.icon} size={18} strokeWidth={1.5} />
                  {link.label}
                </span>
                {location.pathname === link.to && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"></span>
                )}
              </Link>
            ))}

            <Link
              to="/admin/login"
              className="mr-2 relative w-10 h-10 rounded-xl bg-gradient-gold text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
              title="حساب کاربری"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ===== موبایل: همبرگر+سرچ راست | لوگو وسط | حساب کاربری چپ ===== */}
        <div className="grid grid-cols-3 items-center md:hidden">

          {/* راست: همبرگر + دکمه سرچ */}
          <div className="flex items-center gap-1 justify-self-start">
            <button
              onClick={() => { setOpen(!open); setIsSearchOpen(false); }}
              className="flex flex-col justify-center gap-1.5 p-2 rounded-xl hover:bg-primary-bg transition-colors"
              aria-label="منو"
            >
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>

            {!isAdminPage && (
              <button
                ref={mobileSearchBtnRef}
                onClick={() => { setIsSearchOpen(!isSearchOpen); setOpen(false); }}
                className="p-2 text-primary hover:text-accent transition-colors rounded-xl hover:bg-primary-bg"
                aria-label="جستجو"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* وسط: لوگو */}
          <Link
            to="/"
            onClick={() => { setOpen(false); setIsSearchOpen(false); }}
            className="justify-self-center flex items-center gap-2"
          >
            <img
              src={logoBlack}
              alt="انتشارات الحان"
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="text-base font-bold text-primary block leading-tight">انتشارات</span>
              <span className="text-xs font-bold text-accent block leading-tight -mt-0.5">الحان</span>
            </div>
          </Link>

          {/* چپ: حساب کاربری */}
          <Link
            to="/admin/login"
            onClick={() => { setOpen(false); setIsSearchOpen(false); }}
            className="justify-self-end relative w-9 h-9 rounded-xl bg-gradient-gold text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            aria-label="حساب کاربری"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* باکس سرچ موبایل */}
      {!isAdminPage && isSearchOpen && (
        <div className="md:hidden px-4 pt-3 pb-2 border-t border-primary-light/20">
          <div ref={mobileSearchRef} className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی کتاب، نویسنده..."
                  autoFocus
                  className="w-full bg-primary-bg border-2 border-accent/30 rounded-xl px-4 py-3 pr-12 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowResults(false); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    
                  </button>
                )}
              </div>
            </form>
            <SearchResultsDropdown isMobile={true} />
          </div>
        </div>
      )}

      <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="pt-4 pb-2 px-4 space-y-1 border-t border-primary-light/20 mt-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === link.to
                  ? "bg-primary-bg text-primary font-bold"
                  : "text-text-secondary hover:bg-primary-bg/50 hover:text-primary"
              }`}
            >
              <Icon name={link.icon} size={20} strokeWidth={1.5} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
