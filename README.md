# Гошів — Motion Experience (Muse Spark 1.3)

Кінематографічна версія інформаційного сайту села Гошів (Івано-Франківська область, Україна).
Ідея: «Між горою і картою». Мова: українська.

## Де що лежить

- `hoshiv-motion-spark-v1/original-site/` — незмінний оригінал з ZIP V30 (для аналізу).
- `hoshiv-motion-spark-v1/app/` — новий React-застосунок (Vite + React 19 + TypeScript + Tailwind v4 + GSAP).
- `hoshiv-motion-spark-v1/app/public/assets/` — справжні фото, карти й пісня з архіву.
- `hoshiv-motion-spark-v1/app/public/hoshiv-1882.html` — статична копія перекладу 1882 року.
- `hoshiv-motion-spark-v1/README.md` — цей файл.
- `hoshiv-motion-spark-v1/REPORT.md` — звіт про реалізацію.

## Запуск на Windows 11 (PowerShell)

```powershell
cd "C:\Users\admin\Documents\Проект по умолчанию\hoshiv-motion-spark-v1\app"
npm install
npm run dev
```

Відкрити: http://localhost:5173/

Перевірка типів і збірка:

```powershell
npm run typecheck
npm run build
npm run preview
```

## Що всередині

- Кінематографічний вступ 500vh: ScrollVideo (HLS + фото-fallback), ScrollFloat («ГОШІВ» по літерах), GlassPanel (blur 160px, 3D-паралакс, marquee), PillNav (рідинний hover, мобільне меню).
- Розділи: Святині (2 обителі, галереї), Історія (тексти, джерела, маршрут /hoshiv-1882), Атлас (4 карти, zoom, Escape, клавіатура), Громада, Бізнес (без вигаданих контактів), Карта (OSM), Пісня (тільки за натисканням), Footer.
- Шрифти: Manrope + Instrument Serif (Google Fonts). Заголовковий display — Cormorant Garamond (кирилиця: Гошів, історія, обитель, ґрунт, її, Прикарпаття). Dirtyline не використано: немає підтвердженої кирилиці й ліцензії.

## Зовнішні ресурси

- Демо-HLS: `https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8` (абстрактний фон, не Гошів; є фото-fallback і таймаут 12 с).
- Google Fonts, OpenStreetMap iframe, перевірені посилання з архіву (монастирі, громада, джерела).
