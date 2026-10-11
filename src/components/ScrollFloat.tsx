import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  containerId: string;
}

/** ScrollFloat — «ГОШІВ» розпадається на літери під час скролу. */
export default function ScrollFloat({ containerId }: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const chars = el.querySelectorAll('.char');
    const ctx = gsap.context(() => {
      gsap.set(chars, {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: '50% 0%',
      });
      gsap.to(chars, {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.05,
        ease: 'power2.inOut',
        duration: 1,
        scrollTrigger: {
          trigger: document.getElementById(containerId) ?? `#${containerId}`,
          start: 'top top',
          end: '+=1000',
          scrub: 1.5,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [containerId]);

  const word = 'ГОШІВ';
  const sub = 'МІЖ ГОРОЮ І КАРТОЮ';

  return (
    <div
      ref={ref}
      className="fixed inset-0 flex flex-col justify-end p-4 md:p-8 pointer-events-none z-10"
      aria-label="Гошів — між горою і картою"
    >
      <div className="max-w-[1400px] w-full mx-auto pb-[16vh] text-center">
        <span className="block" role="text" aria-label="Гошів">
          <span className="pill-word" aria-hidden="true">
            {word.split('').map((ch, i) => (
              <span
                key={i}
                className="char font-display text-white"
                style={{ fontSize: 'clamp(4rem, 15vw, 317px)', lineHeight: 0.85 }}
              >
                {ch}
              </span>
            ))}
          </span>
        </span>
        <span className="block mt-3" aria-hidden="true">
          <span className="pill-word">
            {sub.split(' ').map((w, wi, arr) => (
              <span key={wi}>
                <span className="pill-word">
                  {w.split('').map((ch, ci) => (
                    <span
                      key={ci}
                      className="char font-sans font-semibold text-white/90"
                      style={{ fontSize: 'clamp(0.9rem, 2.6vw, 1.6rem)', letterSpacing: '0.18em' }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                {wi < arr.length - 1 ? (
                  <span className="char" style={{ fontSize: 'clamp(0.9rem, 2.6vw, 1.6rem)' }}>&nbsp;</span>
                ) : null}
              </span>
            ))}
          </span>
        </span>
        <span className="sr-only">Гошів. Між горою і картою</span>
      </div>
    </div>
  );
}
