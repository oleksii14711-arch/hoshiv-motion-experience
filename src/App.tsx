import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PillNav from './components/PillNav';
import AudioPlayer from './components/AudioPlayer';
import CinematicIntro from './sections/CinematicIntro';
import Faith from './sections/Faith';
import History from './sections/History';
import { Community, Business, Location, Footer } from './sections/Info';
import Hoshiv1882 from './pages/Hoshiv1882';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const location = useLocation();

  // reveal-анімації для інформаційних секцій
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });
    });
    // оновити тригери після навігації
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-white focus:text-black focus:px-4 focus:py-2">
        Перейти до змісту
      </a>
      <PillNav />
      <CinematicIntro />
      <main id="main" className="relative z-30 bg-black">
        <div className="reveal"><Faith /></div>
        <div className="reveal"><History /></div>
        <div className="reveal"><Community /></div>
        <div className="reveal"><Business /></div>
        <div className="reveal"><Location /></div>
      </main>
      <div className="relative z-30">
        <Footer />
      </div>
      <AudioPlayer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hoshiv-1882" element={<Hoshiv1882 />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
