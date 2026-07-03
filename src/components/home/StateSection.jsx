import { useState, useEffect, useRef } from "react";
import useSiteSettings from "../../hooks/useSiteSettings";

const Counter = ({ end, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const duration = 2000;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [end, isVisible]);

  return <span>{count}</span>;
};

function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {settings.stats.map((item, index) => (
            <div
              key={item.title}
              className="group bg-primary-bg p-8 sm:p-10 rounded-3xl text-center shadow-card hover:shadow-elegant-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-1">
                  <Counter end={item.value} isVisible={isVisible} />
                  {item.suffix}
                </h3>
                <p className="text-text-secondary font-medium text-sm">{item.title}</p>
                <div className="mt-4 w-12 h-1 bg-accent rounded-full mx-auto group-hover:w-20 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
