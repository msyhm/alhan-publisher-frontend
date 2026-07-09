import PageMeta from "../components/PageMeta";
import Hero from "../components/home/Hero";
import AboutSection from "../components/home/AboutSection";
import LatestBooks from "../components/home/LatestBooks";
import UniversitiesSection from "../components/home/UniversitiesSection";
import FeaturedBook from "../components/home/FeaturedBook";
import AuthorsSection from "../components/home/AuthorsSection";
// ✅ FIX: جایگزین StatsSection (آمار تکراری با Hero) با بخش «چرا الحان؟»
import WhyAlhan from "../components/home/WhyAlhan";

function Home() {
  return (
    <>
      <PageMeta />
      <main>
        <Hero />
        <LatestBooks />
        <FeaturedBook />
        <AuthorsSection />
        <UniversitiesSection />
        <WhyAlhan />
        <AboutSection />
      </main>
    </>
  );
}

export default Home;
