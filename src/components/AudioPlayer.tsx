import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** Пісня про Гошів — тільки після дії користувача. */
export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      a.pause();
      return;
    }
    try {
      await a.play();
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="fixed z-[90] flex items-center gap-3 rounded-full border border-white/15 bg-black/70 backdrop-blur px-2 py-2 min-[420px]:px-4 bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Призупинити пісню про Гошів' : 'Слухати пісню про Гошів'}
        className="flex items-center gap-2"
      >
        <span className="flex w-10 h-10 min-[420px]:w-8 min-[420px]:h-8 items-center justify-center rounded-full bg-white text-black" aria-hidden="true">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </span>
        <span className="hidden min-[420px]:block text-left leading-tight pr-1">
          <strong className="block text-sm">Пісня про Гошів</strong>
          <small className="block text-xs text-white/60">
            {failed ? 'Не вдалося відтворити · спробуйте ще раз' : playing ? 'Звучить · призупинити' : 'Слухати · 2:04'}
          </small>
        </span>
      </button>
      <audio ref={audioRef} src="assets/pisnia-pro-hoshiv.mp3" preload="none" loop />
    </div>
  );
}
