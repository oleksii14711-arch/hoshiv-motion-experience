import { Link } from 'react-router-dom';
import HistoricAtlas from '../components/HistoricAtlas';
import { LINKS } from '../data/content';

const STORIES = [
  {
    tag: 'Наукове дослідження · 01',
    title: 'Що розповідають давні документи',
    text: 'Микола Кугутяк досліджує літопис, архівні свідчення та питання походження обителі. У праці згадано грамоту 1397 року про Гошів.',
    href: LINKS.kuhutiak,
    link: 'Читати дослідження',
  },
  {
    tag: 'Чорний Ділок · 02',
    title: 'Сліди ранньої монастирської обителі',
    text: 'Археологічні дослідження монастирського комплексу XVI–XVII століть: храм, господарські споруди та оборонні елементи.',
    href: LINKS.galka,
    link: 'Матеріал «Галки»',
  },
  {
    tag: 'Ясна Гора · 03',
    title: 'Ротонда, знайдена під землею',
    text: 'На Ясній Горі виявили фундамент тимчасового храму кінця XVIII — початку XIX століття. Це інше місце, ніж Чорний Ділок.',
    href: LINKS.espreso,
    link: 'Матеріал «Еспресо»',
  },
  {
    tag: 'Чорний Ділок · Березина · 04',
    title: 'Розкопки давнього монастиря',
    text: 'У літописі монастиря описано розкопки 2016 року: фундаменти церкви-ротонди на Березині та сліди дзвіниці й валів.',
    href: LINKS.excavation,
    link: 'Літопис монастиря',
  },
  {
    tag: 'Репортаж · Чорний Ділок · 05',
    title: 'Таємниці Чорного Ділка',
    text: 'Репортаж 2017 року про місцевих учасників розкопок, знахідки на Березині та питання збереження фундаментів давньої обителі.',
    href: LINKS.firtka,
    link: 'Стаття «Фіртки»',
  },
];

export default function History() {
  return (
    <>
      <section id="history" className="bg-[#101312] py-24 border-t border-white/10" aria-labelledby="history-title">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50">02 / Пам’ять місця</p>
          <div className="mt-3 md:flex md:items-end md:justify-between gap-6">
            <h2 id="history-title" className="font-serif text-4xl md:text-6xl">Зазирнути <em>у минуле</em></h2>
            <p className="mt-3 max-w-[420px] text-white/70">
              Знайдіть Гошів на старовинних картах. Придивіться до русла річки, давніх доріг і сусідніх поселень.
            </p>
          </div>

          <figure className="mt-8 rounded-3xl border border-white/15 p-6 bg-white/[0.03]">
            <blockquote className="font-serif text-2xl md:text-3xl">
              «Це одна з найгарніших місцевостей <em>Підбескиддя</em>»
            </blockquote>
            <figcaption className="mt-2 text-sm text-white/60">
              Гошів у географічному словнику · 1882 · <Link to="/hoshiv-1882" className="underline">Прочитати опис села ↗</Link>
            </figcaption>
          </figure>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORIES.map((s) => (
              <article key={s.tag} className="rounded-3xl border border-white/15 bg-black/40 p-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">{s.tag}</p>
                <h3 className="mt-2 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.text}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block underline text-sm">{s.link} ↗</a>
              </article>
            ))}
            <article className="rounded-3xl border border-white/15 bg-white text-black p-6">
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-60">Першоджерело · 1882</p>
              <h3 className="mt-2 text-xl">Гошів у географічному словнику XIX століття</h3>
              <p className="mt-2 text-sm opacity-70">Повний український переклад запису «Hoszów» із примітками.</p>
              <Link to="/hoshiv-1882" className="mt-4 inline-block rounded-full bg-black text-white px-5 py-2 text-sm">Читати переклад ↗</Link>
              <p className="mt-3 text-xs opacity-60">
                Оригінали: <a className="underline" href={LINKS.dict3} target="_blank" rel="noopener noreferrer">Том III</a> ·{' '}
                <a className="underline" href={LINKS.dict14} target="_blank" rel="noopener noreferrer">Том XIV</a>
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-3xl border border-white/15 p-6 md:flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">Читати більше</p>
              <h3 className="text-xl mt-1">Бібліотека історії Гошева</h3>
            </div>
            <div className="mt-3 md:mt-0 flex flex-wrap gap-3 text-sm">
              <a href={LINKS.book} target="_blank" rel="noopener noreferrer" className="underline">Перший том видання ↗</a>
              <a href={LINKS.book2} target="_blank" rel="noopener noreferrer" className="underline">Про другий том ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section id="atlas" className="bg-black py-24 border-t border-white/10" aria-labelledby="atlas-title">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50">Історичний атлас · 1779–1924</p>
          <h2 id="atlas-title" className="font-serif text-4xl md:text-6xl mt-3">Чотири карти — <em>одне село</em></h2>
          <p className="mt-3 text-white/70 max-w-[620px]">
            Усі чотири карти перемикаються в одному вікні. Масштаби різні — не сприймайте їх як точне географічне накладання.
          </p>
          <div className="mt-8">
            <HistoricAtlas />
          </div>
        </div>
      </section>
    </>
  );
}
