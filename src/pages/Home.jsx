import PageMeta from "../components/PageMeta";
import Hero from "../components/home/Hero";
import PublishingProcess from "../components/home/PublishingProcess";
import LatestBooks from "../components/home/LatestBooks";
import UniversitiesSection from "../components/home/UniversitiesSection";
import FeaturedBook from "../components/home/FeaturedBook";
import WhyAlhan from "../components/home/WhyAlhan";

function Home() {
  return (
    <>
      <PageMeta />
      <main>
        <Hero />
        <FeaturedBook />
        <LatestBooks />
        <UniversitiesSection />
        <WhyAlhan />
        <PublishingProcess />
      </main>
    </>
  );
}

export default Home;
