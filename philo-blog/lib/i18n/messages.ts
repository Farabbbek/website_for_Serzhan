import type { Locale } from "@/lib/i18n/config";

type Messages = {
  nav: {
    about: string;
    forum: string;
    login: string;
    subscribe: string;
    articles: string;
    news: string;
    materials: string;
    podcasts: string;
    home: string;
    profile: string;
    admin: string;
    signOut: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    toggleCategories: string;
  };
  footer: {
    zerde: string;
    platform: string;
    home: string;
    articles: string;
    about: string;
    forum: string;
    podcasts: string;
    soon: string;
    copyright: string;
    locales: string;
  };
  common: {
    editorial: string;
    readMore: string;
    viewAll: string;
    allPodcasts: string;
    allMaterials: string;
    podcastBadge: string;
    newsBadge: string;
    materialBadge: string;
    download: string;
    view: string;
    source: string;
    noResults: string;
    open: string;
    play: string;
    close: string;
    categoriesFilter: string;
    clear: string;
    noLink: string;
  };
  home: {
    unauthorized: string;
    latest: string;
    noPosts: string;
    noPodcasts: string;
    noMaterials: string;
  };
  about: {
    subtitle: string;
    note: string;
    down: string;
    transition: string;
    missionLabel: string;
    mission1: string;
    mission2: string;
    mission3: string;
    quoteTitle: string;
    quote1: string;
    quote2: string;
    strategyLabel: string;
    aboutLabel: string;
    about1: string;
    about2: string;
    about3: string;
    university: string;
    metaUniversity: string;
    metaCity: string;
  };
  connect: {
    eyebrow: string;
    title: string;
    subtitle: string;
    open: string;
    telegramDesc: string;
    instagramDesc: string;
    youtubeDesc: string;
    emailDesc: string;
  };
  auth: {
    googleFirst: string;
    googleLogin: string;
    emailLogin: string;
    or: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    missingSupabase: string;
  };
  forum: {
    soon: string;
    title: string;
    description: string;
    follow: string;
  };
  search: {
    pageTitle: string;
    noResults: string;
    tryAnother: string;
    all: string;
    searchLabel: string;
    placeholder: string;
    clear: string;
    resultsFor: string;
  };
  articles: {
    allCategories: string;
    noExcerpt: string;
    featuredOpen: string;
    sectionCount: string;
    noArticles: string;
    noArticlesSoon: string;
    noArticlesInCategory: string;
    chooseAnother: string;
  };
  articleShell: {
    contents: string;
    share: string;
    copied: string;
    copyLink: string;
    openLink: string;
    mobileToc: string;
  };
  podcasts: {
    noItems: string;
    listAria: string;
    noDescription: string;
    instagramOpen: string;
    externalOpen: string;
    originalLink: string;
    externalLink: string;
    notFound: string;
    openPage: string;
    play: string;
    podcastBadge: string;
    close: string;
  };
  materials: {
    pageTitle: string;
    subtitle: string;
    noItems: string;
    noItemsSoon: string;
    noDescription: string;
    materialBadge: string;
    all: string;
    bachelor: string;
    master: string;
    phd: string;
  };
  news: {
    source: string;
  };
};

export const messages: Record<Locale, Messages> = {
  kk: {
    nav: {
      about: "БІЗ ТУРАЛЫ",
      forum: "ФОРУМ",
      login: "КІРУ",
      subscribe: "ЖАЗЫЛУ",
      articles: "МАҚАЛАЛАР",
      news: "ЖАҢАЛЫҚТАР",
      materials: "МАТЕРИАЛДАР",
      podcasts: "ПОДКАСТТАР",
      home: "БАСТЫ БЕТ",
      profile: "ПРОФИЛЬ",
      admin: "АДМИН ПАНЕЛЬ",
      signOut: "ШЫҒУ",
      openMenu: "Мәзірді ашу",
      closeMenu: "Мәзірді жабу",
      toggleTheme: "Тақырыпты ауыстыру",
      toggleCategories: "Санаттарды ауыстыру",
    },
    footer: {
      zerde: "Қазақстан философия студенттерінің платформасы. ҚарҰЗУ · Ф-23-1К",
      platform: "ПЛАТФОРМА",
      home: "Басты бет",
      articles: "Мақалалар",
      about: "Біз туралы",
      forum: "Форум",
      podcasts: "Подкасттар",
      soon: "Жақында",
      copyright: "© {year} ZERDE · Е.А.Бөкетов атындағы ҚарҰЗУ",
      locales: "ҚАЗ / РУС / ENG",
    },
    common: {
      editorial: "Редакция",
      readMore: "Оқу →",
      viewAll: "Барлығын көру →",
      allPodcasts: "Барлық подкасттар →",
      allMaterials: "Барлық материалдар →",
      podcastBadge: "ПОДКАСТ",
      newsBadge: "ЖАҢАЛЫҚ",
      materialBadge: "МАТЕРИАЛ",
      download: "Жүктеу",
      view: "Көру",
      source: "Дереккөз",
      noResults: "Нәтиже табылмады",
      open: "→ Өту",
      play: "Ойнату",
      close: "Жабу",
      categoriesFilter: "Санат сүзгілері",
      clear: "Тазарту",
      noLink: "сілтеме табылмады",
    },
    home: {
      unauthorized: "Бұл бетке кіруге рұқсатыңыз жоқ",
      latest: "СОҢҒЫ ҚОСЫЛҒАНДАР",
      noPosts: "Жарияланымдар әзірге табылмады.",
      noPodcasts: "Подкасттар әзірге табылмады.",
      noMaterials: "Материалдар әзірге табылмады.",
    },
    about: {
      subtitle: "Студенттік философия платформасы",
      note: "Ойлау, пікірталас және интеллектуалдық қауымдастық кеңістігі",
      down: "ТӨМЕН",
      transition: "ЖОБА ТУРАЛЫ",
      missionLabel: "ЖОБА МАҚСАТЫ",
      mission1:
        "Біздің жоба – Қазақстанның түкпір-түкпіріндегі философия студенттерін біріктіретін заманауи онлайн-платформа құруға бағытталған.",
      mission2:
        "Сайттың негізгі мақсаты – студенттер арасында тұрақты байланыс орнатып, ортақ интеллектуалдық кеңістік қалыптастыру. Платформа арқылы қатысушылар академиялық материалдармен алмасып, пікірталастар ұйымдастырып, бірлескен жобаларды жүзеге асыра алады.",
      mission3:
        "Бұл жоба әртүрлі университет студенттері арасындағы ынтымақтастықты күшейтіп, философиялық ойлау мен кәсіби дамуға қолайлы орта ұсынады.",
      quoteTitle: "ФИЛОСОФИЯ ДЕГЕН НЕ?",
      quote1:
        "Философия деген – даналықпен айналысу ғана емес, сонымен қатар соған деген құштарлық пен махаббат.",
      quote2:
        "Бұл – ойлауға, елестетуге және дүниені тереңірек түсінуге мүмкіндік беретін еркін кеңістік.",
      strategyLabel: "БІЗДІҢ СТРАТЕГИЯМЫЗ",
      aboutLabel: "БІЗ ТУРАЛЫ",
      about1:
        "Біз – Е.А.Бөкетов атындағы Қарағанды университетінің Философия және психология факультетінде білім алып жүрген Ф-23-1К тобының 3 курс студенттеріміз.",
      about2:
        "Біздің топтың ерекшелігі – шағын әрі бірегей құрамда болуымыз. Бұл бізге өзара тығыз интеллектуалдық байланыс орнатып, ортақ идеяларды бірлесіп дамытуға мүмкіндік береді.",
      about3:
        "Кураторымыз – Марат Жұмагельдинов. Біздің оқу бағдарымыз классикалық философияны, білімге деген құштарлықты және заманауи қоғамға ашық интеллектуалдық ұстанымды негізге алады.",
      university: "Е.А.Бөкетов атындағы Қарағанды университеті",
      metaUniversity: "Е.А.БӨКЕТОВ АТЫНДАҒЫ ҚарҰЗУ",
      metaCity: "ҚАРАҒАНДЫ, 2026",
    },
    connect: {
      eyebrow: "Байланыс",
      title: "ЖАЗЫЛУ",
      subtitle: "Бізбен байланысу үшін әлеуметтік желілерімізге жазылыңыз немесе тікелей хабарлама жіберіңіз.",
      open: "→ Өту",
      telegramDesc: "Негізгі чат - жаңалықтар, пікірталастар",
      instagramDesc: "Визуалды контент, цитаталар, медиа",
      youtubeDesc: "Лекциялар, подкасттар, видео материалдар",
      emailDesc: "Серіктестік және ресми ұсыныстар",
    },
    auth: {
      googleFirst: "Алдымен Google арқылы кіріңіз",
      googleLogin: "Google арқылы кіру",
      emailLogin: "Email арқылы кіру →",
      or: "немесе",
      email: "Email",
      password: "Құпиясөз",
      signIn: "Кіру",
      signingIn: "Кіріп жатыр...",
      missingSupabase: "Supabase орнатылмаған. .env.local тексеріңіз.",
    },
    forum: {
      soon: "Жақында",
      title: "Форум жақын арада іске қосылады",
      description: "Жақын уақытта мұнда пікірталастар, сұрақтар және идея алмасу алаңы ашылады.",
      follow: "ZERDE жаңалықтарын бақылап жүріңіз",
    },
    search: {
      pageTitle: "Іздеу",
      noResults: "Нәтиже табылмады",
      tryAnother: "Басқа кілтсөзбен іздеп көріңіз немесе санаттар бойынша материалдарды шолыңыз.",
      all: "барлығы",
      searchLabel: "Мақалаларды іздеу",
      placeholder: "Философия, этика, цифровизация...",
      clear: "Тазарту",
      resultsFor: "Іздеу нәтижелері",
    },
    articles: {
      allCategories: "Барлығы",
      noExcerpt: "Толық мәтінді ашып оқыңыз.",
      featuredOpen: "мақаласын ашу",
      sectionCount: "мақала",
      noArticles: "Мақалалар жоқ",
      noArticlesSoon: "Жақын арада мақалалар қосылады",
      noArticlesInCategory: "Бұл санатта мақалалар жоқ",
      chooseAnother: "Басқа санатты таңдап көріңіз",
    },
    articleShell: {
      contents: "МАЗМҰНЫ",
      share: "БӨЛІСУ",
      copied: "Сілтеме көшірілді",
      copyLink: "Сілтемені көшіру",
      openLink: "Ашық сілтеме",
      mobileToc: "Мазмұны",
    },
    podcasts: {
      noItems: "Подкасттар әзірге табылмады.",
      listAria: "Подкасттар тізімі",
      noDescription: "Эпизодты ашып толық сипаттамасын оқыңыз.",
      instagramOpen: "Instagram видеоны қарау үшін →",
      externalOpen: "Контентті ашу үшін →",
      originalLink: "түпнұсқа сілтеме",
      externalLink: "сыртқы сілтеме",
      notFound: "сілтеме табылмады",
      openPage: "бетіне өту",
      play: "Ойнату",
      podcastBadge: "ПОДКАСТ",
      close: "Жабу",
    },
    materials: {
      pageTitle: "МАТЕРИАЛДАР",
      subtitle: "Ғылыми мақалалар, оқу құралдары және зерттеу жұмыстары",
      noItems: "Материалдар жоқ",
      noItemsSoon: "Жақын арада материалдар қосылады",
      noDescription: "Оқу материалының толық сипаттамасын материал бетінде көре аласыз.",
      materialBadge: "МАТЕРИАЛ",
      all: "Барлығы",
      bachelor: "Бакалавр",
      master: "Магистр",
      phd: "PhD",
    },
    news: {
      source: "Дереккөз",
    },
  },
  ru: {
    nav: {
      about: "О НАС",
      forum: "ФОРУМ",
      login: "ВОЙТИ",
      subscribe: "ПОДПИСАТЬСЯ",
      articles: "СТАТЬИ",
      news: "НОВОСТИ",
      materials: "МАТЕРИАЛЫ",
      podcasts: "ПОДКАСТЫ",
      home: "ГЛАВНАЯ",
      profile: "ПРОФИЛЬ",
      admin: "АДМИН ПАНЕЛЬ",
      signOut: "ВЫЙТИ",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      toggleTheme: "Переключить тему",
      toggleCategories: "Переключить категории",
    },
    footer: {
      zerde: "Платформа студентов философии Казахстана. КарНИУ · Ф-23-1К",
      platform: "ПЛАТФОРМА",
      home: "Главная",
      articles: "Статьи",
      about: "О нас",
      forum: "Форум",
      podcasts: "Подкасты",
      soon: "Скоро",
      copyright: "© {year} ZERDE · КарНИУ имени Е.А.Букетова",
      locales: "KAZ / RUS / ENG",
    },
    common: {
      editorial: "Редакция",
      readMore: "Читать →",
      viewAll: "Смотреть всё →",
      allPodcasts: "Все подкасты →",
      allMaterials: "Все материалы →",
      podcastBadge: "ПОДКАСТ",
      newsBadge: "НОВОСТЬ",
      materialBadge: "МАТЕРИАЛ",
      download: "Скачать",
      view: "Открыть",
      source: "Источник",
      noResults: "Ничего не найдено",
      open: "→ Открыть",
      play: "Воспроизвести",
      close: "Закрыть",
      categoriesFilter: "Фильтры категорий",
      clear: "Очистить",
      noLink: "ссылка не найдена",
    },
    home: {
      unauthorized: "У вас нет доступа к этой странице",
      latest: "ПОСЛЕДНИЕ ПУБЛИКАЦИИ",
      noPosts: "Публикации пока не найдены.",
      noPodcasts: "Подкасты пока не найдены.",
      noMaterials: "Материалы пока не найдены.",
    },
    about: {
      subtitle: "Студенческая философская платформа",
      note: "Пространство мышления, дискуссии и интеллектуального сообщества",
      down: "НИЖЕ",
      transition: "О ПРОЕКТЕ",
      missionLabel: "ЦЕЛЬ ПРОЕКТА",
      mission1:
        "Наш проект направлен на создание современной онлайн-платформы, объединяющей студентов-философов со всех уголков Казахстана.",
      mission2:
        "Главная цель сайта — наладить устойчивую связь между студентами и сформировать общее интеллектуальное пространство. Через платформу участники могут обмениваться академическими материалами, организовывать дискуссии и реализовывать совместные проекты.",
      mission3:
        "Этот проект усиливает сотрудничество между студентами разных университетов и создаёт среду, благоприятную для философского мышления и профессионального роста.",
      quoteTitle: "ЧТО ТАКОЕ ФИЛОСОФИЯ?",
      quote1:
        "Философия — это не только занятие мудростью, но и страсть, и любовь к ней.",
      quote2:
        "Это свободное пространство, позволяющее мыслить, воображать и глубже понимать мир.",
      strategyLabel: "НАША СТРАТЕГИЯ",
      aboutLabel: "О НАС",
      about1:
        "Мы — студенты 3 курса группы Ф-23-1К факультета философии и психологии Карагандинского университета имени Е.А.Букетова.",
      about2:
        "Особенность нашей группы — в небольшом и уникальном составе. Это позволяет нам выстраивать тесную интеллектуальную связь и совместно развивать общие идеи.",
      about3:
        "Наш куратор — Марат Жумагельдинов. Наша учебная траектория опирается на классическую философию, стремление к знанию и открытую интеллектуальную позицию по отношению к современному обществу.",
      university: "Карагандинский университет имени Е.А.Букетова",
      metaUniversity: "КАРАГАНДИНСКИЙ УНИВЕРСИТЕТ ИМ. Е.А.БУКЕТОВА",
      metaCity: "КАРАГАНДА, 2026",
    },
    connect: {
      eyebrow: "Контакты",
      title: "ПОДПИСАТЬСЯ",
      subtitle: "Подписывайтесь на наши социальные сети или отправьте нам сообщение напрямую.",
      open: "→ Открыть",
      telegramDesc: "Главный чат — новости и обсуждения",
      instagramDesc: "Визуальный контент, цитаты, медиа",
      youtubeDesc: "Лекции, подкасты и видеоматериалы",
      emailDesc: "Партнёрство и официальные предложения",
    },
    auth: {
      googleFirst: "Сначала войдите через Google",
      googleLogin: "Войти через Google",
      emailLogin: "Войти через Email →",
      or: "или",
      email: "Email",
      password: "Пароль",
      signIn: "Войти",
      signingIn: "Вход...",
      missingSupabase: "Supabase не настроен. Проверьте .env.local.",
    },
    forum: {
      soon: "Скоро",
      title: "Форум скоро будет запущен",
      description: "Совсем скоро здесь откроется площадка для дискуссий, вопросов и обмена идеями.",
      follow: "Следите за обновлениями ZERDE",
    },
    search: {
      pageTitle: "Поиск",
      noResults: "Ничего не найдено",
      tryAnother: "Попробуйте другой запрос или просмотрите материалы по категориям.",
      all: "всё",
      searchLabel: "Искать статьи",
      placeholder: "Философия, этика, цифровизация...",
      clear: "Очистить",
      resultsFor: "Результаты поиска",
    },
    articles: {
      allCategories: "Все",
      noExcerpt: "Откройте материал, чтобы прочитать полный текст.",
      featuredOpen: "открыть статью",
      sectionCount: "статей",
      noArticles: "Статей нет",
      noArticlesSoon: "Скоро здесь появятся статьи",
      noArticlesInCategory: "В этой категории пока нет статей",
      chooseAnother: "Попробуйте выбрать другую категорию",
    },
    articleShell: {
      contents: "СОДЕРЖАНИЕ",
      share: "ПОДЕЛИТЬСЯ",
      copied: "Ссылка скопирована",
      copyLink: "Скопировать ссылку",
      openLink: "Открытая ссылка",
      mobileToc: "Содержание",
    },
    podcasts: {
      noItems: "Подкасты пока не найдены.",
      listAria: "Список подкастов",
      noDescription: "Откройте эпизод, чтобы прочитать полное описание.",
      instagramOpen: "Чтобы посмотреть видео в Instagram →",
      externalOpen: "Чтобы открыть контент →",
      originalLink: "оригинальная ссылка",
      externalLink: "внешняя ссылка",
      notFound: "ссылка не найдена",
      openPage: "открыть страницу",
      play: "Воспроизвести",
      podcastBadge: "ПОДКАСТ",
      close: "Закрыть",
    },
    materials: {
      pageTitle: "МАТЕРИАЛЫ",
      subtitle: "Научные статьи, учебные пособия и исследовательские работы",
      noItems: "Материалов нет",
      noItemsSoon: "Скоро материалы появятся",
      noDescription: "Полное описание учебного материала доступно на странице материала.",
      materialBadge: "МАТЕРИАЛ",
      all: "Все",
      bachelor: "Бакалавр",
      master: "Магистр",
      phd: "PhD",
    },
    news: {
      source: "Источник",
    },
  },
  en: {
    nav: {
      about: "ABOUT",
      forum: "FORUM",
      login: "LOGIN",
      subscribe: "SUBSCRIBE",
      articles: "ARTICLES",
      news: "NEWS",
      materials: "MATERIALS",
      podcasts: "PODCASTS",
      home: "HOME",
      profile: "PROFILE",
      admin: "ADMIN PANEL",
      signOut: "SIGN OUT",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      toggleTheme: "Toggle theme",
      toggleCategories: "Toggle categories",
    },
    footer: {
      zerde: "A platform for philosophy students of Kazakhstan. KarNIU · F-23-1K",
      platform: "PLATFORM",
      home: "Home",
      articles: "Articles",
      about: "About",
      forum: "Forum",
      podcasts: "Podcasts",
      soon: "Soon",
      copyright: "© {year} ZERDE · Buketov Karaganda University",
      locales: "KAZ / RUS / ENG",
    },
    common: {
      editorial: "Editorial Team",
      readMore: "Read →",
      viewAll: "View all →",
      allPodcasts: "All podcasts →",
      allMaterials: "All materials →",
      podcastBadge: "PODCAST",
      newsBadge: "NEWS",
      materialBadge: "MATERIAL",
      download: "Download",
      view: "View",
      source: "Source",
      noResults: "No results found",
      open: "→ Open",
      play: "Play",
      close: "Close",
      categoriesFilter: "Category filters",
      clear: "Clear",
      noLink: "link not found",
    },
    home: {
      unauthorized: "You do not have permission to access this page",
      latest: "LATEST ADDITIONS",
      noPosts: "No publications found yet.",
      noPodcasts: "No podcasts found yet.",
      noMaterials: "No materials found yet.",
    },
    about: {
      subtitle: "Student Philosophy Platform",
      note: "A space for thought, discussion, and intellectual community",
      down: "DOWN",
      transition: "ABOUT THE PROJECT",
      missionLabel: "PROJECT MISSION",
      mission1:
        "Our project is aimed at creating a modern online platform that brings together philosophy students from all regions of Kazakhstan.",
      mission2:
        "The main goal of the site is to establish lasting connections among students and build a shared intellectual space. Through the platform, participants can exchange academic materials, organize discussions, and develop collaborative projects.",
      mission3:
        "This project strengthens cooperation among students from different universities and offers an environment conducive to philosophical thinking and professional growth.",
      quoteTitle: "WHAT IS PHILOSOPHY?",
      quote1:
        "Philosophy is not only the practice of engaging with wisdom, but also a longing and love for it.",
      quote2:
        "It is a free space that allows us to think, imagine, and understand the world more deeply.",
      strategyLabel: "OUR STRATEGY",
      aboutLabel: "ABOUT US",
      about1:
        "We are third-year students of group F-23-1K at the Faculty of Philosophy and Psychology of Buketov Karaganda University.",
      about2:
        "What makes our group distinctive is our small and unique composition. It allows us to form close intellectual ties and develop shared ideas together.",
      about3:
        "Our curator is Marat Zhumageldinov. Our academic path is grounded in classical philosophy, a passion for knowledge, and an intellectually open stance toward contemporary society.",
      university: "Buketov Karaganda University",
      metaUniversity: "BUKETOV KARAGANDA UNIVERSITY",
      metaCity: "KARAGANDA, 2026",
    },
    connect: {
      eyebrow: "Contact",
      title: "SUBSCRIBE",
      subtitle: "Follow our social platforms or send us a direct message to get in touch.",
      open: "→ Open",
      telegramDesc: "Main chat for updates and discussions",
      instagramDesc: "Visual content, quotes, and media",
      youtubeDesc: "Lectures, podcasts, and video materials",
      emailDesc: "Partnerships and official inquiries",
    },
    auth: {
      googleFirst: "Please sign in with Google first",
      googleLogin: "Continue with Google",
      emailLogin: "Sign in with Email →",
      or: "or",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      signingIn: "Signing in...",
      missingSupabase: "Supabase is not configured. Check .env.local.",
    },
    forum: {
      soon: "Soon",
      title: "The forum is launching soon",
      description: "This space will soon open for discussions, questions, and exchange of ideas.",
      follow: "Stay tuned for ZERDE updates",
    },
    search: {
      pageTitle: "Search",
      noResults: "No results found",
      tryAnother: "Try another keyword or browse materials by category.",
      all: "all",
      searchLabel: "Search articles",
      placeholder: "Philosophy, ethics, digitalization...",
      clear: "Clear",
      resultsFor: "Search results",
    },
    articles: {
      allCategories: "All",
      noExcerpt: "Open the piece to read the full text.",
      featuredOpen: "open article",
      sectionCount: "articles",
      noArticles: "No articles",
      noArticlesSoon: "Articles will appear here soon",
      noArticlesInCategory: "There are no articles in this category yet",
      chooseAnother: "Try selecting a different category",
    },
    articleShell: {
      contents: "CONTENTS",
      share: "SHARE",
      copied: "Link copied",
      copyLink: "Copy link",
      openLink: "Open link",
      mobileToc: "Contents",
    },
    podcasts: {
      noItems: "No podcasts found yet.",
      listAria: "Podcast list",
      noDescription: "Open the episode to read the full description.",
      instagramOpen: "To watch the Instagram video →",
      externalOpen: "To open the content →",
      originalLink: "original link",
      externalLink: "external link",
      notFound: "link not found",
      openPage: "open page",
      play: "Play",
      podcastBadge: "PODCAST",
      close: "Close",
    },
    materials: {
      pageTitle: "MATERIALS",
      subtitle: "Research papers, study guides, and academic resources",
      noItems: "No materials",
      noItemsSoon: "Materials will be added soon",
      noDescription: "The full description of this study material is available on its detail page.",
      materialBadge: "MATERIAL",
      all: "All",
      bachelor: "Bachelor",
      master: "Master",
      phd: "PhD",
    },
    news: {
      source: "Source",
    },
  },
};

export function withYear(template: string, year: number): string {
  return template.replace("{year}", String(year));
}
