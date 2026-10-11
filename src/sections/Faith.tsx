import MonasteryGallery from '../components/MonasteryGallery';
import { LINKS } from '../data/content';

export default function Faith() {
  return (
    <section id="faith" className="relative bg-black py-24" aria-labelledby="faith-title">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-amber-200/70">01 / Духовна спадщина</p>
        <h2 id="faith-title" className="font-serif text-4xl md:text-6xl mt-3">
          Тиша, яку <em>хочеться почути</em>
        </h2>
        <p className="mt-4 text-white/70 max-w-[640px]">
          Духовна історія Гошева живе у двох обителях. Кожна має своє покликання, традиції та спільноту.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <article className="rounded-3xl border border-white/15 p-6 bg-gradient-to-b from-white/10 to-transparent">
            <p className="text-xs tracking-[0.2em] uppercase text-white/50">На Ясній Горі</p>
            <h3 className="text-2xl mt-2">Монастир Преображення Господнього</h3>
            <p className="mt-2 text-white/70">Василіянська обитель, Гошівська ікона Божої Матері та Дім паломника.</p>
            <div className="mt-4">
              <MonasteryGallery
                label="Змінити фото Василіянського монастиря"
                caption="Ясна Гора · Василіянський монастир"
                images={[
                  { src: 'assets/monastery.jpg', alt: 'Брама з релігійною мозаїкою та храм василіянського монастиря в Гошеві' },
                  { src: 'assets/monastery-courtyard.jpeg', alt: 'Храм і внутрішнє подвір’я Василіянського монастиря' },
                  { src: 'assets/hoshiv-abbey-summer.jpeg', alt: 'Храм Гошівської обителі влітку' },
                  { src: 'assets/hoshiv-abbey-winter.jpeg', alt: 'Храм Гошівської обителі взимку' },
                ]}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={LINKS.monastery} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white text-black px-5 py-2 font-semibold">Сайт монастиря ↗</a>
              <a href={LINKS.monasterySchedule} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 px-5 py-2">Богослужіння ↗</a>
            </div>
          </article>

          <article id="sisters" className="rounded-3xl border border-white/15 p-6 bg-gradient-to-b from-white/10 to-transparent">
            <p className="text-xs tracking-[0.2em] uppercase text-white/50">II / Пресвята Родина</p>
            <h3 className="text-2xl mt-2">Монастир <em className="font-serif">сестер</em></h3>
            <p className="mt-2 text-white/70">
              У Гошеві живе окрема жіноча чернеча спільнота — сестри Пресвятої Родини. При обителі діє храм Різдва Пресвятої Богородиці.
            </p>
            <div className="mt-4">
              <MonasteryGallery
                label="Змінити ракурс монастиря сестер"
                caption="Монастир сестер Пресвятої Родини · Гошів"
                images={[
                  { src: 'assets/sisters-front-2k.jpeg', alt: 'Монастир сестер Пресвятої Родини: храм і доріжка перед ним' },
                ]}
              />
            </div>
            <p className="mt-3 text-xs text-white/50">
              Зовнішнє літнє фото з сайту згромадження не входить до локального архіву — перевірте права перед публікацією:{' '}
              <a href={LINKS.sistersPhoto} target="_blank" rel="noopener noreferrer" className="underline">DSC_4324.jpg</a>
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={LINKS.sisters} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white text-black px-5 py-2 font-semibold">Сторінка монастиря ↗</a>
              <a href={LINKS.sistersContacts} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 px-5 py-2">Контакти сестер ↗</a>
            </div>
          </article>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <figure className="rounded-3xl overflow-hidden border border-white/15">
            <img src="assets/hoshiv-landscape-a.jpeg" alt="Краєвид Гошева та Ясної Гори" loading="lazy" className="w-full h-64 object-cover" />
            <figcaption className="px-5 py-3 text-sm text-white/60">Краєвид · Гошів</figcaption>
          </figure>
          <figure className="rounded-3xl overflow-hidden border border-white/15">
            <img src="assets/hoshiv-landscape-b.jpeg" alt="Панорама околиць Гошева" loading="lazy" className="w-full h-64 object-cover" />
            <figcaption className="px-5 py-3 text-sm text-white/60">Околиці · Прикарпаття</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
