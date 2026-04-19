# ZERDE Philo Blog

Проект философского блога на Next.js (App Router) для платформы студентов КарГУ.

README ниже отражает текущее состояние проекта и все ключевые изменения, которые были реализованы в рамках итераций STEP 1-6 и последующих багфиксов.

## 1) Технологический стек

- Next.js 15 (App Router)
- React 19 + TypeScript
- Framer Motion (анимации)
- Tailwind CSS v4
- Lucide React (иконки)
- Supabase SDK (клиент)
- next-mdx-remote (рендер контента статьи)

## 2) Что было сделано (полный срез)

### STEP 1: Критические исправления навигации

- Переработан Header как единый источник маршрутов для десктопа и мобильного меню.
- Убраны проблемные ручные переходы и приведены ссылки к стабильной Link-навигации.
- Активные пункты меню рассчитываются от pathname, а не от временного локального состояния.
- Канонический маршрут для кнопки ЖАЗЫЛУ переведен на `/connect`.

### STEP 2: Переходы страниц и prefetch

- Включен и стабилизирован обертчик переходов страниц (`PageTransition`).
- В layout подключен `PageTransition` как default export.
- В Header для ключевых ссылок используется prefetch.

### STEP 3: Auth-поток

- Страница `auth/login` объединяет login/register в табах на одном экране.
- `auth/register` теперь делает redirect на `auth/login`.

### STEP 4: Новый /connect

- Переписана страница `/connect` под карточки социальных каналов.
- Добавлены Telegram, Instagram, YouTube и Email блоки в едином визуальном стиле.

### STEP 5: Исправления внутренних ссылок

- Исправлены ссылки-заглушки и неверные переходы:
	- About CTA ведет в `/category/maqalalar`.
	- HeroSection ссылки Оқу... ведут на реальные `/posts/[slug]` (с fallback).
	- На странице статьи исправлены breadcrumb и fallback-ссылки.

### STEP 6: Полноценный Footer

- Полностью заменен Footer на многоколоночный вариант с разделами:
	- ZERDE
	- ПЛАТФОРМА
	- БАЙЛАНЫС
- Добавлена нижняя сервисная полоса с годом и языками.

### Дополнительные исправления и стабилизация

- Устранен intermittent blank-screen на `/about`:
	- страница переведена на стабильный SSR-подход;
	- template для about упрощен до passthrough;
	- удален проблемный loading fallback для about-сегмента.
- Исправлен runtime кейс `Cannot find module './611.js'` через очистку `.next` и чистый перезапуск dev-сервера.
- Формат даты в карточках приведен к UTC-формату `DD.MM.YYYY` для исключения hydration mismatch.

### Последние изменения Header по контенту меню

- Из строкы категорий удалены:
	- ЦИФР
	- ЭТИКА
- Переименовано:
	- ХАБАРЛАР -> ЖАҢАЛЫҚТАР
- Удален пункт БАСТЫ БЕТ из category-row (главная уже доступна через логотип/корневой маршрут).

## 3) Актуальные маршруты (app)

### Публичные

- `/`
- `/about`
- `/posts`
- `/posts/[slug]`
- `/category/[slug]`
- `/search`
- `/connect`
- `/forum`
- `/news`
- `/materials`
- `/podcasts`
- `/auth/login`
- `/auth/register` (redirect на `/auth/login`)

### Админ

- `/admin`
- `/admin/categories`
- `/admin/posts`
- `/admin/posts/new`

## 4) Важные файлы

- `components/layout/Header.tsx` - основная логика навигации, языков, mobile overlay, категория dropdown.
- `components/layout/Footer.tsx` - новый Footer.
- `components/layout/PageTransition.tsx` - глобальные page transitions.
- `app/layout.tsx` - подключение Header, PageTransition, Footer, ThemeProvider.
- `app/about/page.tsx` + `app/about/template.tsx` - стабилизированная about-страница.
- `app/auth/login/page.tsx`, `app/auth/register/page.tsx` - auth flow.
- `app/connect/page.tsx` - страница подписки/контактов.
- `components/blog/HeroSection.tsx` - ссылки на реальные статьи.
- `app/posts/[slug]/page.tsx` - исправленные внутренние ссылки статьи.
- `components/blog/PostCard.tsx` - устойчивое форматирование даты.

## 5) Локальный запуск

Из корня проекта `philo-blog`:

```bash
npm install
npm run dev
```

Сборка production:

```bash
npm run build
npm run start
```

Линт:

```bash
npm run lint
```

## 6) Переменные окружения

Для опциональной интеграции Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Если значения отсутствуют или равны `placeholder`, браузерный клиент Supabase корректно отключается.

## 7) Текущий статус

- Проект собирается (`npm run build` успешно).
- Ключевые маршруты рабочие.
- Навигация и внутренние ссылки приведены к консистентному состоянию.
- About-роут стабилизирован после серии переходных багов.

## 8) Что можно сделать дальше (по желанию)

- Синхронизировать текст заголовка страницы `/news` с новым лейблом ЖАҢАЛЫҚТАР в Header.
- Добавить реальные данные/контент для stub-страниц (`/forum`, `/materials`, `/podcasts`, `/news`).
- Добавить e2e smoke-тесты на ключевые роуты и навигацию.
