import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARQUEE_ITEMS } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

interface GlassPanelProps {
  containerId: string;
}

export default function GlassPanel({ containerId }: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const wrap = wrapRef.current;
    if (!panel || !wrap) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduce) return;
      const triggerEl = document.getElementById(containerId);
      if (!triggerEl) return;
      gsap.fromTo(
        panel,
        { y: '100%' },
        {
          y: '0%',
          ease: 'none',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, [containerId]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const wrap = wrapRef.current;
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      gsap.to(panel, {
        x: mx * 20,
        y: my * 20,
        rotationY: mx * 4,
        rotationX: -my * 4,
        transformPerspective: 1000,
        duration: 1,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };
    const scope = wrap ?? window;
    scope.addEventListener('mousemove', onMove as EventListener, { passive: true });
    return () => scope.removeEventListener('mousemove', onMove as EventListener);
  }, []);

  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div ref={wrapRef} className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 pointer-events-none">
      <div
        ref={panelRef}
        className="glass-panel pointer-events-auto w-full max-w-[1250px] h-[900px] max-h-[85vh] rounded-3xl relative overflow-hidden flex flex-col justify-between"
      >
        <div className="px-6 md:px-12 pt-10 md:pt-14 text-center">
          <p className="text-xs tracking-[0.25em] uppercase opacity-60 font-sans">Про Гошів</p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-[96px] leading-[1.1] lg:leading-[92.6px] tracking-tight max-w-[1000px] mx-auto mt-4">
            Місце, де <em>історія</em> живе серед гір, давніх карт і{' '}
            <em>монастирських дзвонів</em>
          </h2>
          <p className="mt-6 text-white/70 max-w-[640px] mx-auto font-sans">
            Дві обителі, Ясна Гора, карти 1779–1924 років і живе село Долинської громади.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 font-sans">
            <a href="#faith" className="pointer-events-auto rounded-full bg-white text-black px-6 py-2 text-sm font-semibold">
              Святині
            </a>
            <a href="#atlas" className="pointer-events-auto rounded-full border border-white/30 px-6 py-2 text-sm">
              Атлас 1779–1924
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 overflow-hidden">
          <div className="marquee-track flex gap-8 whitespace-nowrap animate-marquee w-max">
            {[...row, ...row].map((item, i) => (
              <span
                key={i}
                className="uppercase font-sans font-semibold text-sm tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                {item} <span className="mx-4 opacity-50">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
