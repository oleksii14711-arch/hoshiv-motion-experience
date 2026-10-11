import { useState } from 'react';

interface GalleryImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width?: number;
  height?: number;
}

interface MonasteryGalleryProps {
  images: GalleryImage[];
  label: string;
  caption: string;
}

/** Галерея-перемикач: працює мишею, дотиком і клавіатурою (кнопка). */
export default function MonasteryGallery({ images, label, caption }: MonasteryGalleryProps) {
  const [index, setIndex] = useState(0);
  const current = images[index % images.length];

  const swap = () => setIndex((i) => (i + 1) % images.length);

  return (
    <figure className="rounded-3xl overflow-hidden border border-white/15 bg-white/5">
      <button
        type="button"
        onClick={swap}
        aria-label={label}
        aria-pressed={index !== 0}
        className="relative block w-full text-left"
      >
        <img
          src={current.src}
          srcSet={current.srcSet}
          sizes={current.sizes}
          alt={current.alt}
          loading="lazy"
          className="w-full h-[320px] md:h-[420px] object-cover"
        />
        <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs">
          Інший ракурс ↔ ({index + 1}/{images.length})
        </span>
      </button>
      <figcaption className="px-5 py-3 text-sm text-white/70">{caption}</figcaption>
    </figure>
  );
}
