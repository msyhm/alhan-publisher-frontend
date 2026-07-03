import PageMeta from "../components/PageMeta";
import Hero from "../components/home/Hero";
import AboutSection from "../components/home/AboutSection";
import StatsSection from "../components/home/StateSection";
import LatestBooks from "../components/home/LatestBooks";
import UniversitiesSection from "../components/home/UniversitiesSection";
import FeaturedBook from "../components/home/FeaturedBook";
import AuthorsSection from "../components/home/AuthorsSection";

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
        <StatsSection />
        <AboutSection />
      </main>
    </>
  );
}

export default Home;
