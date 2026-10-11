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
    <div className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-full border border-white/15 bg-black/70 backdrop-blur px-4 py-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Призупинити пісню про Гошів' : 'Слухати пісню про Гошів'}
        className="flex items-center gap-2"
      >
        <span className="flex w-8 h-8 items-center justify-center rounded-full bg-white text-black" aria-hidden="true">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </span>
        <span className="text-left leading-tight">
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
