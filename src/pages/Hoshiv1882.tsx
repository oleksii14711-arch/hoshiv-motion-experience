import { Link } from 'react-router-dom';
import { LINKS } from '../data/content';

/** Сторінка перекладу 1882 року — повний текст зі збереженням змісту оригіналу. */
export default function Hoshiv1882() {
  return (
    <div className="bg-[#f4f0e8] text-[#282b29] min-h-screen">
      <header className="bg-[#22292b] text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl">Гошів.</Link>
        <Link to="/" className="text-sm underline">← До головної</Link>
      </header>
      <main className="max-w-[860px] mx-auto px-6 py-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#8b514c] font-bold">Історична бібліотека / переклад джерела</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-2">Гошів. <em>Свідчення 1882 року.</em></h1>
        <p className="mt-3">Село, Ґериня та монастир на Ясній Горі в польському географічному словнику XIX століття.</p>
        <p className="mt-2 text-sm">
          «Hoszów», том III, с. 168–169 ·{' '}
          <a className="underline" href={LINKS.dict3} target="_blank" rel="noopener noreferrer">Оригінал: с. 168 ↗</a>
        </p>
        <hr className="my-8" />
        <div className="space-y-4 leading-7">
          <p><strong>Гошів</strong> (руською — «Гошів») із Ґеринею. Село в Долинському повіті, за 14 км на північний захід від Долини й за 5 км на південь від станції в Болехові, при гостинці з Долини до Болехова, над Свічею.</p>
          <p>Ґериня лежить на захід від Гошева. Східна частина місцевості — у долині Свічі (близько 380 м), західна — горбиста. Це одна з найгарніших місцевостей Підбескиддя.</p>
          <p>На південь від Ґерині й північний захід від Гошева височить пагорб Ясна Гора (483 м); на захід від нього гора Гошів сягає 594 м.</p>
          <p>За підрахунками 1869 року, у Гошеві було 161 будинок і 908 мешканців у громаді; у Ґерині — 84 будинки та 449 мешканців.</p>
          <p>У Гошеві були василіянський монастир і церква Святого Миколая, школа, нафтопереробня, олійниця, водяний тартак і броварня. У Ґерині — церква Вознесіння Христового.</p>
          <p>Гошівський монастир стоїть на Ясній Горі. Там — чудотворний образ Божої Матері за взірцем Ченстоховської ікони. Муровану церкву спорудили 1842 року.</p>
          <p>Початок монастиря словник відносить до 1570 року. Спершу він стояв серед лісу в місці Красний, тепер — Чорний Ділок.</p>
          <p>Повний текст перекладу збережено в оригінальному файлі <code>original-site/dist/hoshiv-1882.html</code> та у файлі <a className="underline" href="hoshiv-1882.html">hoshiv-1882.html</a>. Це свідчення словника XIX століття — перекази про заснування й облогу подано як цитати джерела, а не як встановлені сучасні факти.</p>
          <p>Далі на сторінці 169 починається окрема стаття «Hoszów 2.» про однойменне село в іншому повіті. Вона не стосується Гошева на Івано-Франківщині.</p>
        </div>
        <hr className="my-8" />
        <p className="text-sm">
          Оригінали:{' '}
          <a className="underline" href={LINKS.dict3} target="_blank" rel="noopener noreferrer">Том III, с. 168</a> ·{' '}
          <a className="underline" href={LINKS.dict14} target="_blank" rel="noopener noreferrer">Том XIV</a>
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-black text-white px-6 py-2 text-sm">← Повернутися на головну</Link>
      </main>
    </div>
  );
}
