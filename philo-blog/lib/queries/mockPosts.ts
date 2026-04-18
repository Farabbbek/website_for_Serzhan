import type { ArticlePost, CategoryMeta, Post } from "@/types/blog";

export const mockCategories: CategoryMeta[] = [
  {
    name: "МАҚАЛАЛАР",
    slug: "maqalalar",
    description:
      "Редакциялық эсселер, талдаулар және философиялық журнал пішініндегі ұзақ мәтіндер.",
  },
  {
    name: "ЦИФРОВИЗАЦИЯ",
    slug: "cifr",
    description:
      "Технология, интерфейс, алгоритм және цифрлық мәдениет туралы философиялық ойлар.",
  },
  {
    name: "ЭТИКА",
    slug: "etika",
    description:
      "Жауапкершілік, қоғам, шешім қабылдау және жасанды интеллект этикасына арналған мақалалар.",
  },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Алгоритм мен ар-ождан: цифрлық шешімдердің адамдық өлшемі",
    slug: "algoritm-men-ar-ozhdan",
    excerpt:
      "Жасанды интеллекттің күнделікті өмірге енуі моральдық жауапкершілікті жеңілдетпейді, керісінше адам таңдауының салмағын айқындай түседі.",
    cover_url: "https://picsum.photos/seed/philo-post-1/900/506",
    published_at: "2026-04-18",
    views_count: 1240,
    categories: { name: "ЭТИКА", slug: "etika" },
    profiles: {
      full_name: "Айдана Мұратқызы",
      avatar_url: "https://picsum.photos/seed/author-aidana/64/64",
    },
  },
  {
    id: 2,
    title: "Сандық архив және ұжымдық жады: философия нені сақтап қалуы тиіс",
    slug: "sandyk-arhiv-zhane-uzhymdyk-zhady",
    excerpt:
      "Архив енді тек сақтау орны емес, ол болашақ пікірталастардың формасын анықтайтын мәдени интерфейске айналды.",
    cover_url: "https://picsum.photos/seed/philo-post-2/900/506",
    published_at: "2026-04-17",
    views_count: 980,
    categories: { name: "МАҚАЛАЛАР", slug: "maqalalar" },
    profiles: {
      full_name: "Ермек Сейтхан",
      avatar_url: "https://picsum.photos/seed/author-ermek/64/64",
    },
  },
  {
    id: 3,
    title: "Платформа дәуіріндегі үнсіздік: баяу ойлау неге саяси күшке айналады",
    slug: "platforma-dauirindegi-undizdik",
    excerpt:
      "Үздіксіз реакцияға құрылған ортада ойлану уақытының өзі қарсы мәдени әрекетке ұқсай бастайды.",
    cover_url: "https://picsum.photos/seed/philo-post-3/900/506",
    published_at: "2026-04-16",
    views_count: 1502,
    categories: { name: "ЦИФРОВИЗАЦИЯ", slug: "cifr" },
    profiles: {
      full_name: "Мадина Қасен",
      avatar_url: "https://picsum.photos/seed/author-madina/64/64",
    },
  },
  {
    id: 4,
    title: "Философиялық журналдың жаңа тілі: интерфейс, ырғақ және редакциялық сенім",
    slug: "filosofiyalyk-zhurnaldyn-zhana-tili",
    excerpt:
      "Беттегі құрылым да, экрандағы қозғалыс та мәтіннің беделін қалыптастырады. Дизайн бұл жерде пікірдің серігіне айналады.",
    cover_url: "https://picsum.photos/seed/philo-post-4/900/506",
    published_at: "2026-04-15",
    views_count: 864,
    categories: { name: "МАҚАЛАЛАР", slug: "maqalalar" },
    profiles: {
      full_name: "Данияр Омаров",
      avatar_url: "https://picsum.photos/seed/author-daniyar/64/64",
    },
  },
  {
    id: 5,
    title: "Этикасыз автоматтандыру болмайды: шешім қабылдайтын жүйелерге кім жауап береді",
    slug: "etikasiz-avtomattandyru-bolmaidy",
    excerpt:
      "Автоматтандырылған жүйелердегі қате тек техникалық ақау емес, ол жауапкершілікті кімнің көтеретінін ашып көрсететін моральдық түйін.",
    cover_url: "https://picsum.photos/seed/philo-post-5/900/506",
    published_at: "2026-04-14",
    views_count: 1175,
    categories: { name: "ЭТИКА", slug: "etika" },
    profiles: {
      full_name: "Сауле Жақып",
      avatar_url: "https://picsum.photos/seed/author-saule/64/64",
    },
  },
  {
    id: 6,
    title: "Жасанды интеллект және гумбольдтық білім: университетке қандай ой қажет",
    slug: "zhai-zhane-gumboldt-bilimi",
    excerpt:
      "Университет технологияға тез бейімделген сайын, оның философиялық іргетасы бұрынғыдан да маңызды бола түседі.",
    cover_url: "https://picsum.photos/seed/philo-post-6/900/506",
    published_at: "2026-04-13",
    views_count: 932,
    categories: { name: "ЦИФРОВИЗАЦИЯ", slug: "cifr" },
    profiles: {
      full_name: "Аружан Төлеген",
      avatar_url: "https://picsum.photos/seed/author-aruzhan/64/64",
    },
  },
  {
    id: 7,
    title: "Мақала оқудың мәдениеті: экрандағы назар мен қағаздағы тыныс",
    slug: "makala-okudyn-madenieti",
    excerpt:
      "Оқу тәжірибесі форматқа тәуелді. Бірақ мәселе тек тасымалдаушыда емес, мәтінмен бірге орнайтын ішкі тәртіпте жатыр.",
    cover_url: "https://picsum.photos/seed/philo-post-7/900/506",
    published_at: "2026-04-12",
    views_count: 786,
    categories: { name: "МАҚАЛАЛАР", slug: "maqalalar" },
    profiles: {
      full_name: "Назерке Айтбаева",
      avatar_url: "https://picsum.photos/seed/author-nazerke/64/64",
    },
  },
  {
    id: 8,
    title: "Сандық кеңістіктегі сенім дағдарысы: ақиқат, сараптама және қауесет",
    slug: "sandyk-kenistiktegi-senim-dagdarysy",
    excerpt:
      "Ақпарат көп болған сайын бағдар жоғалады. Философия мұнда тек сын емес, қоғамдық бағдар ұсынуы тиіс.",
    cover_url: "https://picsum.photos/seed/philo-post-8/900/506",
    published_at: "2026-04-11",
    views_count: 1386,
    categories: { name: "ЦИФРОВИЗАЦИЯ", slug: "cifr" },
    profiles: {
      full_name: "Руслан Тілеубек",
      avatar_url: "https://picsum.photos/seed/author-ruslan/64/64",
    },
  },
  {
    id: 9,
    title: "Қамқорлық философиясы және желідегі қауым: бір-бірімізді қалай естиміз",
    slug: "kamkorlyk-filosofiyasy-zhane-zhelidegi-kauym",
    excerpt:
      "Онлайн кеңістіктегі этика тек ереже емес, өзгенің даусын тыңдай алатын қоғамдық машық ретінде көрінеді.",
    cover_url: "https://picsum.photos/seed/philo-post-9/900/506",
    published_at: "2026-04-10",
    views_count: 655,
    categories: { name: "ЭТИКА", slug: "etika" },
    profiles: {
      full_name: "Әлия Досан",
      avatar_url: "https://picsum.photos/seed/author-aliya/64/64",
    },
  },
  {
    id: 10,
    title: "Философия және интерфейс эстетикасы: неге ойдың өзіне де сахна керек",
    slug: "filosofiya-zhane-interfeis-estetikasy",
    excerpt:
      "Экрандық басылымда мазмұн мен форма ажырамайды: композицияның өзі оқырманға ойлау ырғағын ұсынады.",
    cover_url: "https://picsum.photos/seed/philo-post-10/900/506",
    published_at: "2026-04-09",
    views_count: 1018,
    categories: { name: "МАҚАЛАЛАР", slug: "maqalalar" },
    profiles: {
      full_name: "Тимур Қабылов",
      avatar_url: "https://picsum.photos/seed/author-timur/64/64",
    },
  },
];

function buildArticleContent(post: Post, index: number) {
  const categoryName = post.categories?.name ?? "ФИЛОСОФИЯ";
  const emphasis =
    index % 3 === 0
      ? "редакциялық ырғақ пен қоғамдық жауапкершілік"
      : index % 3 === 1
        ? "цифрлық мәдениеттегі баяу ойлау тәжірибесі"
        : "этикалық пайым мен технологиялық инфрақұрылым";

  return `# ${post.title}

${post.excerpt}

Философиялық басылым үшін цифрлық орта жай ғана жаңа тарату арнасы емес. Ол ойдың құрылымын, дәлелдің үнін және оқырманмен арадағы сенім механизмін қайта анықтайтын мәдени кеңістік. Осы материалда біз ${emphasis} туралы сөйлесеміз.

## Негізгі мәселе

${categoryName} тақырыбы бүгін тек академиялық талқылаумен шектелмейді. Ол интерфейс таңдауынан бастап, дереккөзге сену дағдысына дейін созылатын қоғамдық тәжірибеге айналды.

Философия дәл осы жерде маңызды: ол экрандағы құбылысты баяулатуға, ұғымдарды айқындауға және асығыс реакцияның орнына пайым ұсынуға мүмкіндік береді. Бізге жылдам түсініктеме емес, ұзақ мерзімді өлшем керек.

### Интерфейс те аргумент

Мәтін қалай берілсе, ой да солай қабылданады. Редакциялық тор, тыныс, бос кеңістік және типографиялық екпіннің бәрі авторлық позицияның бір бөлігіне айналады.

> Технология бейтарап көрінгенімен, ол әрдайым бір тәртіпті, бір ырғақты және бір жауапкершілік моделін ұсынады.

## Қоғамдық сенімнің формалары

Оқырман бүгін мазмұннан бұрын контексті бағалайды. Кім жазды? Қайда жарияланды? Бұл ой қаншалықты тексерілген? Осындай сұрақтар цифрлық философияның күн тәртібіне айналды.

Осы себепті редакция тек мәтін шығаратын орын емес, сенім инфрақұрылымын құратын орта болуы тиіс. Бұл жерде [басқа мақалалар](/posts/${post.slug}) да бір-бірімен әңгімелеседі.

### Дерек пен пайымның арасы

Пікір мен фактінің арасына шекара қою жеткіліксіз. Ең маңыздысы, олардың бір мәтінде қалай үйлесетінін түсіндіру. Дәл осы аралықта философиялық редактураның шынайы жұмысы басталады.

\`\`\`ts
const question = "Нені автоматтандыруға болады?";
const responsibility = "Нені адам сақтап қалуы тиіс?";
const editorialAnswer = [question, responsibility].join(" ");
\`\`\`

## Баяу оқу мәдениеті

Экрандағы мәтін де терең бола алады, егер ол оқырманға тоқтауға мүмкіндік берсе. Біз іздейтін нәрсе ескі форманы көшіру емес, тереңдікке лайық жаңа редакциялық пішін.

Сондықтан философиялық блог технологияны тек құрал ретінде емес, мінез бен мәдениет қалыптастыратын орта ретінде қарастыруы тиіс.`;
}

const tagMap: Record<string, string[]> = {
  etika: ["Этика", "Жауапкершілік", "Қоғам"],
  cifr: ["Цифровизация", "Технология", "Мәдениет"],
  maqalalar: ["Мақалалар", "Редактура", "Философия"],
};

export const mockArticles: ArticlePost[] = mockPosts.map((post, index) => ({
  ...post,
  hero_caption:
    "Редакциялық иллюстрация: философиялық мәтін, интерфейс және цифрлық мәдениет туралы визуалды метафора.",
  tags: tagMap[post.categories?.slug ?? "maqalalar"] ?? ["Философия"],
  bio:
    "Заманауи мәдениет, цифрлық этика және философиялық публицистика тоғысындағы тақырыптарды зерттейтін автор.",
  content: buildArticleContent(post, index),
}));

export function getMockArticleBySlug(slug: string) {
  return mockArticles.find((article) => article.slug === slug) ?? null;
}

export function getRelatedMockPosts(currentSlug: string, limit = 3) {
  return mockPosts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}

export function searchMockPosts(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("kk-KZ");

  if (!normalizedQuery) {
    return mockPosts;
  }

  return mockPosts.filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.categories?.name ?? "",
      post.profiles?.full_name ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase("kk-KZ");

    return haystack.includes(normalizedQuery);
  });
}

export function getCategoryMetaBySlug(slug: string) {
  return mockCategories.find((category) => category.slug === slug) ?? null;
}

export function getPostsByCategorySlug(slug: string) {
  return mockPosts.filter((post) => post.categories?.slug === slug);
}
