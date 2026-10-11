import ScrollVideo from '../components/ScrollVideo';
import ScrollFloat from '../components/ScrollFloat';
import GlassPanel from '../components/GlassPanel';

export const INTRO_ID = 'cinematic-intro';

export const HERO_PHOTO_SRC = 'assets/hero-hoshiv-yasna-hora.jpeg';
export const HERO_PHOTO_ALT = 'Аерофото Гошева: Ясна Гора з монастирем над селом, річкою та лісом';

/** Кінематографічний вступ 500vh. Hero — справжнє аерофото Гошева (фото-режим). */
export default function CinematicIntro() {
  return (
    <section id={INTRO_ID} className="relative" style={{ height: '500vh' }} aria-label="Кінематографічний вступ">
      <div id="home" className="absolute top-0" aria-hidden="true" />
      <ScrollVideo
        src=""
        containerId={INTRO_ID}
        photoSrc={HERO_PHOTO_SRC}
        photoAlt={HERO_PHOTO_ALT}
      />
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-24 inset-x-0 z-10 text-center pointer-events-none px-4">
          <p className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/80">
            Прикарпаття · Україна · Долинська громада
          </p>
        </div>

        <ScrollFloat containerId={INTRO_ID} />
        <GlassPanel containerId={INTRO_ID} />
      </div>
      <h1 className="sr-only">Гошів — між горою і картою</h1>
    </section>
  );
}
