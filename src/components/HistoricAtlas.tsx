import { useCallback, useEffect, useRef, useState } from 'react';
import { MAPS } from '../data/content';
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

/** Історичний атлас: 4 карти в одному вікні, zoom, Escape, клавіатура. */
export default function HistoricAtlas() {
  const [selected, setSelected] = useState('1779');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const dialogImgRef = useRef<HTMLImageElement>(null);
  const map = MAPS.find((m) => m.year === selected) ?? MAPS[0];

  const showMap = useCallback((year: string) => {
    setSelected(year);
  }, []);

  // fade при перемиканні
  useEffect(() => {
    const img = document.getElementById('historic-image');
    if (!img || !('animate' in img)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    img.getAnimations().forEach((a) => a.cancel());
    img.animate(
      [
        { opacity: 0.18, transform: 'translateY(12px) scale(0.985)' },
        { opacity: 1, transform: 'translate(0,0) scale(1)' },
      ],
      { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
  }, [selected]);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDialogOpen(false);
        openBtnRef.current?.focus();
      }
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, +(z + 0.5).toFixed(2)));
      if (e.key === '-') setZoom((z) => Math.max(1, +(z - 0.5).toFixed(2)));
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [dialogOpen]);

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    let next: number | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % MAPS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index + MAPS.length - 1) % MAPS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = MAPS.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      tabsRef.current[next]?.focus();
      showMap(MAPS[next].year);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-6">
      <div className="min-w-0">
        <p className="text-xs tracking-[0.2em] uppercase text-white/50">Атлас Гошева</p>
        <div role="tablist" aria-label="Історичні карти" className="mt-4 flex lg:flex-col flex-row overflow-x-auto gap-2 max-w-full">
          {MAPS.map((m, i) => {
            const active = m.year === selected;
            return (
              <button
                key={m.year}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                aria-selected={active}
                aria-controls="historic-map"
                id={`tab-${m.year}`}
                tabIndex={active ? 0 : -1}
                onClick={() => showMap(m.year)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`min-w-[220px] lg:min-w-0 text-left rounded-2xl border px-4 py-3 flex items-center gap-3 transition-colors ${
                  active ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                }`}
              >
                <span className="text-xs opacity-60">0{i + 1}</span>
                <span>
                  <strong className="block">{m.label}</strong>
                  <small className="opacity-70">{m.tabNote}</small>
                </span>
                <span aria-hidden="true" className="ml-auto">→</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-white/60">
          Фрагменти охоплюють різну площу. Перемикайте роки, щоб роздивитися кожен окремо.
        </p>
      </div>

      <div id="historic-map" role="tabpanel" aria-labelledby={`tab-${selected}`} className="min-w-0 rounded-3xl overflow-hidden border border-white/15 bg-[#0d0f0e]">
        <button
          id="open-map"
          ref={openBtnRef}
          onClick={() => {
            setZoom(1);
            setDialogOpen(true);
          }}
          aria-label={`Збільшити ${map.title.toLowerCase()}`}
          className="relative block w-full group"
        >
          <img
            id="historic-image"
            src={map.src}
            alt={map.alt}
            width={2048}
            height={2048}
            loading="lazy"
            className="w-full max-h-[520px] object-cover"
          />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/70 backdrop-blur px-4 py-2 text-sm">
            <Maximize2 size={16} /> Роздивитися
          </span>
        </button>
        <div className="p-6" aria-live="polite" aria-atomic="true">
          <p className="text-xs tracking-[0.2em] uppercase text-white/50">Експонат {map.index}</p>
          <h3 className="text-2xl mt-1">{map.title}</h3>
          <p className="mt-2 text-white/70">{map.description}</p>
          <div className="my-4 h-px bg-white/10" />
          <p className="text-xs tracking-[0.2em] uppercase text-white/50">Що роздивитися</p>
          <p className="mt-1">{map.observation}</p>
          <p className="mt-3 text-xs text-white/50">
            Роки й походження фрагментів подано за матеріалами проєкту. Карти мають різний масштаб і охоплення.
          </p>
        </div>
      </div>

      {dialogOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="dialog-caption" className="fixed inset-0 z-[120] bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/50">Атлас Гошева</p>
              <h2 id="dialog-caption" className="text-xl">{map.title}</h2>
            </div>
            <button onClick={() => { setDialogOpen(false); openBtnRef.current?.focus(); }} aria-label="Закрити карту" className="rounded-full border border-white/20 p-2">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center" tabIndex={0} aria-label="Карта. Після збільшення можна прокручувати">
            <img
              ref={dialogImgRef}
              src={map.src}
              alt={map.alt}
              draggable={false}
              style={{ width: `${Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 60 : 800) * zoom}px`, maxWidth: 'none' }}
            />
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-white/10">
            <span className="text-sm text-white/60">Масштаб</span>
            <button onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(2)))} disabled={zoom <= 1} aria-label="Зменшити карту" className="rounded-full border border-white/20 p-2 disabled:opacity-40">
              <ZoomOut size={18} />
            </button>
            <output aria-live="polite" className="min-w-[56px] text-center">{Math.round(zoom * 100)}%</output>
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(2)))} disabled={zoom >= 3} aria-label="Збільшити карту" className="rounded-full border border-white/20 p-2 disabled:opacity-40">
              <ZoomIn size={18} />
            </button>
            <button onClick={() => setZoom(1)} className="rounded-full border border-white/20 px-4 py-2 text-sm">Умістити</button>
          </div>
        </div>
      )}
    </div>
  );
}
