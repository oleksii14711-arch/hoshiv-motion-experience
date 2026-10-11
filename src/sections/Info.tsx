import { LINKS } from '../data/content';

const ITEMS = [
  { no: '01', tag: 'Самоврядування', title: 'Гошівський старостинський округ', text: 'Офіційна сторінка села', href: LINKS.starosta },
  { no: '02', tag: 'Освіта', title: 'Гошівський ліцей', text: 'Відомості про заклад освіти', href: LINKS.lyceum },
  { no: '03', tag: 'Наша громада', title: 'Долинська міська рада', text: 'Новини, оголошення та послуги', href: LINKS.dolyna },
  { no: '04', tag: 'Поруч', title: 'Болехівська міська рада', text: 'Життя сусідньої громади', href: LINKS.bolekhiv },
];

const BUSINESS = [
  { no: '01', title: 'Автомайстерні', text: 'Ремонт і догляд за авто' },
  { no: '02', title: 'Магазини', text: 'Потрібне поруч із домом' },
  { no: '03', title: 'Смак Гошева', text: 'Місцеві продукти та копчення' },
  { no: '04', title: 'Кафе та гостинність', text: 'Місця для зустрічей' },
  { no: '05', title: 'Рослини й господарства', text: 'Теплиці та декоративні рослини' },
];

export function Community() {
  return (
    <section id="community" className="bg-[#0e1512] py-24 border-t border-white/10" aria-labelledby="community-title">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-emerald-200/70">03 / Люди та громада</p>
        <h2 id="community-title" className="font-serif text-4xl md:text-6xl mt-3">Велике життя <em>малого села</em></h2>
        <p className="mt-3 text-white/70 max-w-[560px]">Школа, сусіди, спільні справи. Гошів · Долина · Болехів.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {ITEMS.map((i) => (
            <a key={i.no} href={i.href} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition-colors">
              <span className="text-xs text-white/50">{i.no} · {i.tag}</span>
              <h3 className="mt-1 text-xl">{i.title}</h3>
              <p className="text-sm text-white/60">{i.text} ↗</p>
            </a>
          ))}
        </div>
        <figure className="mt-6 rounded-3xl overflow-hidden border border-white/15">
          <img src="assets/hoshiv-panorama.jpg" alt="Ясна Гора над будинками Гошева" loading="lazy" className="w-full h-72 object-cover" />
          <figcaption className="px-5 py-3 text-sm text-white/60">Ясна Гора над селом</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Business() {
  return (
    <section id="business" className="bg-black py-24 border-t border-white/10" aria-labelledby="business-title">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-white/50">04 / Місцеві справи · каталог наповнюється</p>
        <h2 id="business-title" className="font-serif text-4xl md:text-6xl mt-3">Зроблено <em>своїми</em></h2>
        <p className="mt-3 text-white/70 max-w-[560px]">
          Майстри, крамниці й невеликі родинні справи. Назви й контакти додамо після узгодження з власниками — нічого не вигадуємо.
        </p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS.map((b) => (
            <div key={b.no} className="rounded-3xl border border-white/15 p-6 bg-white/[0.03]">
              <span className="text-xs text-white/50">{b.no}</span>
              <h3 className="mt-1 text-xl">{b.title}</h3>
              <p className="text-sm text-white/60">{b.text}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-dashed border-white/25 p-6 text-white/60 text-sm">
            За кожною справою — людина. Наповнюємо поступово, знайомимо особисто.
          </div>
        </div>
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section id="map" className="bg-[#101312] py-24 border-t border-white/10" aria-labelledby="location-title">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-white/50">05 / На карті</p>
        <h2 id="location-title" className="font-serif text-4xl md:text-6xl mt-3">Зустрінемось <em>у Гошеві</em></h2>
        <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-3xl overflow-hidden border border-white/15 min-h-[380px] bg-black">
            <iframe
              title="Карта Гошева з позначкою василіянського монастиря на Ясній Горі"
              loading="lazy"
              src={LINKS.osmEmbed}
              className="w-full h-[380px] lg:h-[480px] border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <aside className="rounded-3xl border border-white/15 p-6 bg-white/[0.04]">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">Орієнтир на карті</p>
            <h3 className="text-2xl mt-2">Ясна Гора</h3>
            <p className="text-sm text-white/70 mt-1">Василіянський монастир Преображення Господнього</p>
            <a href={LINKS.osm} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-white text-black px-5 py-2 text-sm font-semibold">Відкрити карту ↗</a>
            <p className="mt-4 text-sm"><strong>Гошів, Івано-Франківщина</strong><br /><span className="text-white/60">Долинська міська громада, Калуський район</span></p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-14">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <a href="#home" className="font-display text-4xl">Гошів<span>.</span></a>
          <p className="text-white/60 text-sm max-w-[320px]">Історія, святині та люди. Село, яке живе.<br />Івано-Франківщина · Україна</p>
          <a href="#home" className="rounded-full border border-white/25 px-5 py-2 text-sm">Нагору ↑</a>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between text-sm text-white/50">
          <span>Гошів · Живе село · Кінематографічна версія</span>
          <span>
            Оригінал: <a className="underline" href={LINKS.currentSite} target="_blank" rel="noopener noreferrer">goshiv-heritage</a> ·{' '}
            <a className="underline" href="hoshiv-1882.html">hoshiv-1882.html</a>
          </span>
        </div>
        <details className="mt-6 text-xs text-white/50">
          <summary className="cursor-pointer underline">Автори світлин і джерела</summary>
          <p className="mt-2">Панорама: Bogdan Kosar / Wikimedia Commons, CC BY-SA 4.0. Монастир: Dmytro Petishkin / Wikimedia Commons, CC BY 4.0. Жіночий монастир: Згромадження сестер Пресвятої Родини. Історичні карти — фрагменти, надані Михайлом.</p>
        </details>
      </div>
    </footer>
  );
}
