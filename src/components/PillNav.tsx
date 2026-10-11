import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const DESKTOP_ITEMS = [
  { id: 'home', label: 'Головна' },
  { id: 'faith', label: 'Святині' },
  { id: 'history', label: 'Історія' },
  { id: 'atlas', label: 'Атлас' },
];

const MOBILE_ITEMS = [
  { id: 'home', label: 'Головна' },
  { id: 'faith', label: 'Святині' },
  { id: 'history', label: 'Історія' },
  { id: 'atlas', label: 'Атлас' },
  { id: 'community', label: 'Громада' },
  { id: 'business', label: 'Бізнес' },
  { id: 'map', label: 'Карта' },
];

function circleGeometry(w: number, h: number) {
  const R = (w * w / 4 + h * h) / (2 * h);
  const D = 2 * R + 2;
  const delta = R - Math.sqrt(Math.max(0, R * R - w * w / 4)) + 1;
  return { R, D, delta };
}

function PillButton({ target, label, onNavigate }: { target: string; label: string; onNavigate?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const circle = btn.querySelector('.hover-circle') as HTMLElement;
    const labelEl = btn.querySelector('.pill-label') as HTMLElement;
    const hoverEl = btn.querySelector('.pill-label-hover') as HTMLElement;
    if (!circle || !labelEl || !hoverEl) return;

    const setup = () => {
      const r = btn.getBoundingClientRect();
      const { D, delta } = circleGeometry(r.width, r.height);
      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.left = '50%';
      circle.style.bottom = `${-delta}px`;
      circle.style.transformOrigin = `50% ${D - delta}px`;
      gsap.set(circle, { scale: 0, xPercent: -50 });
      gsap.set(hoverEl, { yPercent: 100 });
    };
    setup();
    window.addEventListener('resize', setup);

    const enter = () => {
      gsap.to(circle, { scale: 3, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(labelEl, { yPercent: -120, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(hoverEl, { yPercent: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    };
    const leave = () => {
      gsap.to(circle, { scale: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(labelEl, { yPercent: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(hoverEl, { yPercent: 100, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
    };
    btn.addEventListener('mouseenter', enter);
    btn.addEventListener('mouseleave', leave);
    btn.addEventListener('focus', enter);
    btn.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('resize', setup);
      btn.removeEventListener('mouseenter', enter);
      btn.removeEventListener('mouseleave', leave);
      btn.removeEventListener('focus', enter);
      btn.removeEventListener('blur', leave);
    };
  }, []);

  const go = () => {
    const el = document.getElementById(target);
    if (el) gsap.to(window, { duration: 3, ease: 'power3.inOut', scrollTo: { y: el, offsetY: 0 } });
    onNavigate?.();
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={go}
      className="relative overflow-hidden rounded-[50px] bg-[#f0f0f0] text-black font-semibold text-[14px] tracking-[0.05em] uppercase px-6 py-2"
    >
      <span className="hover-circle absolute rounded-full bg-black pointer-events-none" aria-hidden="true" />
      <span className="pill-label relative block">{label}</span>
      <span className="pill-label-hover absolute inset-0 flex items-center justify-center text-white" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}

export default function PillNav() {
  const logoRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (logoRef.current) gsap.fromTo(logoRef.current, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'power2.out' });
    if (boxRef.current) gsap.fromTo(boxRef.current, { width: 0, opacity: 0 }, { width: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open ]);

  const goHome = () => {
    const el = document.getElementById('home');
    if (el) gsap.to(window, { duration: 3, ease: 'power3.inOut', scrollTo: { y: el } });
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 top-[max(24px,env(safe-area-inset-top))]">
      <button
        ref={logoRef}
        type="button"
        onClick={goHome}
        aria-label="Гошів — на початок"
        className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center group"
      >
        <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white transition-transform duration-200 group-hover:rotate-[360deg]" aria-hidden="true">
          <path d="m50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z" />
          <path d="m17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z" />
          <path d="m82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z" />
          <path d="m17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z" />
        </svg>
      </button>

      <div ref={boxRef} className="bg-black rounded-[50px] p-1 border-2 border-black overflow-hidden">
        <div className="hidden md:flex items-center gap-1">
          {DESKTOP_ITEMS.map((i) => (
            <PillButton key={i.id} target={i.id} label={i.label} />
          ))}
        </div>
        <div className="md:hidden">
          <button
            ref={menuBtnRef}
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            onClick={() => setOpen((v) => !v)}
            className="w-12 h-10 flex flex-col items-center justify-center gap-1 rounded-[50px] bg-[#f0f0f0]"
          >
            <span className={`block w-6 h-[2px] bg-black transition-transform ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-black transition-transform ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed top-[84px] left-1/2 -translate-x-1/2 bg-black rounded-3xl p-2 border border-white/15 flex flex-col gap-1 w-[240px] animate-[fadeSlide_0.25s_ease]">
          {MOBILE_ITEMS.map((i) => (
            <PillButton key={i.id} target={i.id} label={i.label} onNavigate={() => setOpen(false)} />
          ))}
        </div>
      )}
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
}
