import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MAPS } from '../data/content';
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

/** Історичний атлас: 4 карти в одному вікні, zoom, Escape, клавіатура.
 *  Переглядач: pinch-to-zoom двома пальцями навколо фокусної точки,
 *  перетягування одним пальцем/мишею з межами, колесо миші — масштаб.
 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface PinchState {
  d0: number;
  z0: number;
  mx0: number;
  my0: number;
  px0: number;
  py0: number;
}

export default function HistoricAtlas() {
  const [selected, setSelected] = useState('1779');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zoom, setZoomState] = useState(1);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const map = MAPS.find((m) => m.year === selected) ?? MAPS[0];

  const zoomRef = useRef(1);
  const gesture = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    pinch: null as PinchState | null,
    last: null as { x: number; y: number } | null,
    pan: { x: 0, y: 0 },
  });

  type nullSupplier = null | {
    d0: number;
    z0: number;
    mx0: number;
    my0: number;
    px0: number;
    py0: number;
  };

  const setZoom = useCallback((z: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +z.toFixed(3)));
    zoomRef.current = clamped;
    setZoomState(clamped);
  }, []);

  const baseWidth = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
    return Math.min(1000, vw - 60);
  }, []);

  const clampPan = useCallback((px: number, py: number, z: number) => {
    const vp = viewportRef.current;
    const cw = vp ? vp.clientWidth : 0;
    const ch = vp ? vp.clientHeight : 0;
    const w = baseWidth() * z;
    const h = w; // карти квадратні 2048×2048
    const rx = Math.max(0, (w - cw) / 2);
    const ry = Math.max(0, (h - ch) / 2);
    return {
      x: Math.min(rx, Math.max(-rx, px)),
      y: Math.min(ry, Math.max(-ry, py)),
    };
  }, [baseWidth]);

  const applyPan = useCallback((p: { x: number; y: number }) => {
    gesture.current.pan = p;
    if (stageRef.current) {
      stageRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    }
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    applyPan({ x: 0, y: 0 });
  }, [setZoom, applyPan]);

  // Утримуємо панораму в межах після кнопкового/клавіатурного зуму
  useEffect(() => {
    if (!dialogOpen) return;
    const g = gesture.current;
    applyPan(clampPan(g.pan.x, g.pan.y, zoomRef.current));
  }, [zoom, dialogOpen, clampPan, applyPan]);

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
      if (e.key === '+' || e.key === '=') setZoom(zoomRef.current + 0.5);
      if (e.key === '-') setZoom(zoomRef.current - 0.5);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [dialogOpen]);

  // Колесо миші / трекпад: масштаб навколо курсора (без прокручування фону)
  useEffect(() => {
    if (!dialogOpen) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const z0 = zoomRef.current;
      const z1 = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z0 + (e.deltaY > 0 ? -0.25 : 0.25)).toFixed(3)));
      if (z1 === z0) return;
      const g = gesture.current;
      const u = contentPoint({ x: mx, y: my }, g.pan, z0);
      setZoom(z1);
      applyPan(panForFocal({ x: mx, y: my }, u, z1));
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [dialogOpen, setZoom, clampPan, applyPan]);

  const posInViewport = (clientX: number, clientY: number) => {
    const r = viewportRef.current?.getBoundingClientRect();
    return { x: clientX - (r?.left ?? 0), y: clientY - (r?.top ?? 0) };
  };

  const contentPoint = (m: { x: number; y: number }, pan: { x: number; y: number }, z: number) => {
    // Вміст відносно центру зображення: сцена відцентрована flex-контейнером,
    // translate(0,0) означає «центр збігається», тож відлік ведемо від центра.
    const vp = viewportRef.current;
    const cx = (vp ? vp.clientWidth : 0) / 2;
    const cy = (vp ? vp.clientHeight : 0) / 2;
    return { ux: (m.x - cx - pan.x) / z, uy: (m.y - cy - pan.y) / z };
  };

  const panForFocal = (
    m: { x: number; y: number },
    u: { ux: number; uy: number },
    z1: number,
  ) => {
    const vp = viewportRef.current;
    const cx = (vp ? vp.clientWidth : 0) / 2;
    const cy = (vp ? vp.clientHeight : 0) / 2;
    return clampPan(m.x - cx - u.ux * z1, m.y - cy - u.uy * z1, z1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      viewportRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const g = gesture.current;
    const p = posInViewport(e.clientX, e.clientY);
    g.pointers.set(e.pointerId, p);
    if (g.pointers.size === 2) {
      const [a, b] = [...g.pointers.values()];
      g.pinch = {
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        z0: zoomRef.current,
        mx0: (a.x + b.x) / 2,
        my0: (a.y + b.y) / 2,
        px0: g.pan.x,
        py0: g.pan.y,
      };
      g.last = null;
    } else if (g.pointers.size === 1) {
      g.last = p;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.pointers.has(e.pointerId)) return;
    const p = posInViewport(e.clientX, e.clientY);
    g.pointers.set(e.pointerId, p);
    if (g.pointers.size === 2 && g.pinch) {
      const [a, b] = [...g.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const z1 = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(g.pinch.z0 * (d / g.pinch.d0)).toFixed(3)));
      // Точка вмісту під серединою відрізка лишається на місці
      const u = contentPoint({ x: g.pinch.mx0, y: g.pinch.my0 }, { x: g.pinch.px0, y: g.pinch.py0 }, g.pinch.z0);
      if (z1 !== zoomRef.current) setZoom(z1);
      applyPan(panForFocal({ x: mx, y: my }, u, z1));
    } else if (g.pointers.size === 1 && g.last) {
      const dx = p.x - g.last.x;
      const dy = p.y - g.last.y;
      g.last = p;
      if (dx !== 0 || dy !== 0) {
        applyPan(clampPan(g.pan.x + dx, g.pan.y + dy, zoomRef.current));
      }
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    g.pointers.delete(e.pointerId);
    if (g.pointers.size === 1) {
      // Перехід pinch → перетягування без стрибка: якір на палець, що лишився
      const [rest] = [...g.pointers.values()];
      g.last = rest;
      g.pinch = null;
    } else if (g.pointers.size === 0) {
      g.last = null;
      g.pinch = null;
    }
  };

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
            resetView();
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

      {dialogOpen &&
        createPortal(
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
          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onContextMenu={(e) => e.preventDefault()}
            className="flex-1 overflow-hidden p-4 flex items-center justify-center touch-none overscroll-contain select-none"
            style={{ WebkitTouchCallout: 'none' }}
            tabIndex={0}
            aria-label="Карта. Щипок двома пальцями — масштаб, перетягування одним пальцем або мишею — рух"
          >
            <div ref={stageRef} className="will-change-transform">
              <img
                src={map.src}
                alt={map.alt}
                draggable={false}
                style={{ width: `${baseWidth() * zoom}px`, maxWidth: 'none' }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-white/10">
            <span className="text-sm text-white/60">Масштаб</span>
            <button onClick={() => setZoom(zoomRef.current - 0.5)} disabled={zoom <= 1} aria-label="Зменшити карту" className="rounded-full border border-white/20 p-2 disabled:opacity-40">
              <ZoomOut size={18} />
            </button>
            <output aria-live="polite" className="min-w-[56px] text-center">{Math.round(zoom * 100)}%</output>
            <button onClick={() => setZoom(zoomRef.current + 0.5)} disabled={zoom >= 3} aria-label="Збільшити карту" className="rounded-full border border-white/20 p-2 disabled:opacity-40">
              <ZoomIn size={18} />
            </button>
            <button onClick={resetView} className="rounded-full border border-white/20 px-4 py-2 text-sm">Умістити</button>
          </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
