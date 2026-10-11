import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  src: string;
  className?: string;
  containerId: string;
  /** Кінематографічний фото-hero: коли задано, HLS не завантажується, hero — справжнє фото Гошева. */
  photoSrc?: string;
  photoAlt?: string;
}

const FALLBACK_PHOTOS = [
  'assets/hoshiv-aerial-header-v18.jpeg',
  'assets/hoshiv-panorama.jpg',
  'assets/hoshiv-landscape-a.jpeg',
  'assets/hoshiv-landscape-b.jpeg',
];

/**
 * ScrollVideo — кадр відео керується прокручуванням 500vh сцени.
 * HLS через hls.js, Safari — нативно. Fallback — кінематографічні фото Гошева.
 */
export default function ScrollVideo({ src, className = '', containerId, photoSrc, photoAlt = '' }: ScrollVideoProps) {
  const photoMode = Boolean(photoSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroZoomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const seekState = useRef({ target: 0, pending: false });

  // HLS setup (механізм збережено; у фото-режимі не виконується)
  useEffect(() => {
    if (photoMode) {
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    let cancelled = false;
    let timeout: number | undefined;

    // Safety timeout: never hang the site on slow HLS
    timeout = window.setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
        // не позначаємо як failed одразу — даємо фото-fallback працювати під відео
      }
    }, 12000);

    const onCanPlay = () => {
      if (cancelled) return;
      setLoading(false);
      if (timeout) window.clearTimeout(timeout);
    };

    const onError = () => {
      if (cancelled) return;
      setVideoFailed(true);
      setLoading(false);
      if (timeout) window.clearTimeout(timeout);
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl') && !Hls.isSupported()) {
        video.src = src;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 120,
          maxMaxBufferLength: 600,
          maxBufferSize: 200 * 1024 * 1024,
          startPosition: 0,
          capLevelToPlayerSize: false,
          startLevel: -1,
          autoStartLoad: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
          try {
            const top = data.levels.length - 1;
            // На слабких пристроях обмежуємо якість
            const isWeak =
              navigator.hardwareConcurrency <= 4 ||
              /Android|iPhone|iPad/i.test(navigator.userAgent);
            const level = isWeak ? Math.min(1, top) : top;
            hls!.currentLevel = level;
            hls!.startLevel = level;
          } catch {
            /* ignore */
          }
        });
        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          try {
            const dur = video.duration;
            if (dur && Number.isFinite(dur) && video.buffered.length > 0) {
              const end = video.buffered.end(video.buffered.length - 1);
              setProgress(Math.min(100, Math.round((end / dur) * 100)));
            }
          } catch {
            /* ignore */
          }
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) onError();
        });
      } else {
        video.src = src;
      }
    } catch {
      onError();
    }

    return () => {
      cancelled = true;
      if (timeout) window.clearTimeout(timeout);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
      if (hls) hls.destroy();
    };
  }, [src, photoMode]);

  // У фото-режимі лоадер зникає після завантаження hero-кадру (із таймаутом)
  useEffect(() => {
    if (!photoMode) return;
    const t = window.setTimeout(() => setLoading(false), 8000);
    return () => window.clearTimeout(t);
  }, [photoMode, photoSrc]);

  // Scroll scrub — тільки в межах 500vh сцени
  useEffect(() => {
    if (photoMode) {
      const ctx = gsap.context(() => {
        const triggerEl = document.getElementById(containerId);
        ScrollTrigger.create({
          trigger: triggerEl ?? `#${containerId}`,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            // Кінематографічний фото-hero: повільний наїзд, дрейф угору, затемнення
            const hero = heroZoomRef.current;
            if (hero) {
              const p = self.progress;
              hero.style.transform = `translate3d(0, ${(p * 9).toFixed(2)}%, 0) scale(${(1 + p * 0.22).toFixed(3)})`;
              hero.style.filter = `brightness(${(1 - p * 0.3).toFixed(3)}) saturate(${(1 - p * 0.12).toFixed(3)})`;
            }
          },
        });
      });
      return () => ctx.revert();
    }
    const video = videoRef.current;
    if (!video) return;

    const doSeek = (time: number) => {
      const st = seekState.current;
      if (video.seeking || st.pending) {
        st.target = time;
        return;
      }
      try {
        if (!Number.isFinite(time) || !Number.isFinite(video.duration)) return;
        const clamped = Math.max(0, Math.min(video.duration - 0.05, time));
        if (Math.abs(video.currentTime - clamped) < 0.04) return;
        st.pending = true;
        st.target = clamped;
        video.currentTime = clamped;
      } catch {
        st.pending = false;
      }
    };

    const onSeeked = () => {
      const st = seekState.current;
      st.pending = false;
      try {
        if (
          Number.isFinite(st.target) &&
          Math.abs(video.currentTime - st.target) > 0.08 &&
          !video.seeking
        ) {
          const t = st.target;
          st.pending = true;
          video.currentTime = t;
        }
      } catch {
        st.pending = false;
      }
    };

    video.addEventListener('seeked', onSeeked);

    const ctx = gsap.context(() => {
      const triggerEl = document.getElementById(containerId);
      ScrollTrigger.create({
        trigger: triggerEl ?? `#${containerId}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // 1) scroll-driven відео
          const dur = video.duration;
          if (dur && Number.isFinite(dur) && dur > 0 && !videoFailed) {
            doSeek(self.progress * dur);
          }
          // 2) scroll-driven fallback: кросфейд + наближення фото
          const el = fallbackRef.current;
          if (el) {
            const imgs = el.querySelectorAll('.sv-photo');
            const n = imgs.length;
            const pos = self.progress * n;
            imgs.forEach((img, i) => {
              const local = Math.max(0, Math.min(1, pos - i + 0.5));
              const opacity = i === 0 ? Math.max(0, 1 - pos * 1.2) : Math.max(0, Math.min(1, local * 1.6));
              const scale = 1.05 + local * 0.25;
              (img as HTMLElement).style.opacity = String(i === n - 1 && pos > n - 1 ? 1 : opacity);
              (img as HTMLElement).style.transform = `scale(${scale.toFixed(3)})`;
            });
            // затемнення до кінця сцени
            el.style.filter = `brightness(${(1 - self.progress * 0.35).toFixed(3)})`;
          }
        },
      });
    });

    return () => {
      video.removeEventListener('seeked', onSeeked);
      ctx.revert();
    };
  }, [containerId, videoFailed, photoMode]);

  // Паралакс курсора
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      if (photoMode) {
        gsap.to(heroRef.current, { x: mx * -22, y: my * -22, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
        return;
      }
      gsap.to(videoRef.current, { x: mx * -30, y: my * -30, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(fallbackRef.current, { x: mx * -18, y: my * -18, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [photoMode]);

  if (photoMode) {
    return (
      <>
        {/* Кінематографічний фото-hero: справжнє аерофото Гошева з Ясною Горою */}
        <div
          ref={heroRef}
          className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-black"
        >
          <div ref={heroZoomRef} className="absolute inset-0 will-change-transform">
            <img
              src={photoSrc}
              alt={photoAlt}
              fetchPriority="high"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              className="kenburns absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 38%' }}
            />
          </div>
          {/* Верхнє затемнення під навігацію */}
          <div className="absolute inset-x-0 top-0 h-[22vh] bg-gradient-to-b from-black/65 via-black/25 to-transparent" />
          {/* Нижнє затемнення під заголовок */}
          <div className="absolute inset-x-0 bottom-0 h-[46vh] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          {/* Бічна глибина + віньєтка */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          <div className="hero-vignette absolute inset-0" />
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center text-2xl font-sans">
            Завантажуємо Гошів…
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* fallback-фото: справжній Гошів, завжди під відео */}
      <div
        ref={fallbackRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-black"
      >
        {FALLBACK_PHOTOS.map((p, i) => (
          <img
            key={p}
            src={p}
            alt=""
            className="sv-photo absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0 }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      </div>

      <video
        ref={videoRef}
        muted
        playsInline
        crossOrigin="anonymous"
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className={`fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center object-cover scale-[1.35] ${videoFailed ? 'hidden' : ''} ${className}`}
      />

      {loading && (
        <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center text-2xl font-sans">
          Завантажуємо Гошів… {progress > 0 ? `${progress}%` : ''}
        </div>
      )}
    </>
  );
}
