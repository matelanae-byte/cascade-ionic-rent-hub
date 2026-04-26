## Цель
Уйти от шаблонного маркетплейс-вида к чистому, технологичному B2B-сервису подбора оборудования. Основа: глубокий синий + графит + белый, оранжевый — только как вторичный акцент.

---

## 1. Палитра (`src/index.css`)
Полная замена токенов на сдержанную B2B-палитру:

- `--background`: `220 20% 98%` — почти белый с холодным оттенком
- `--foreground`: `215 35% 12%` — графит #131C2A
- `--card`: `0 0% 100%` — чистый белый
- `--primary`: `213 70% 22%` — **глубокий синий #0F2C4A** (главный акцент, кнопки, заголовки)
- `--primary-foreground`: `0 0% 100%`
- `--secondary`: `28 88% 52%` — **оранжевый #F28C28** теперь вторичный (для важных CTA, бейджей "акция")
- `--muted`: `220 15% 95%`
- `--muted-foreground`: `218 12% 42%`
- `--border`: `220 15% 90%` — тонкие холодные границы
- `--ring`: совпадает с primary
- `--footer-bg`: `215 40% 10%` — глубокий графит-синий

Убрать фиолетовое везде. Удалить упоминания `#6B4FB3`, `#F28C28→primary`.

## 2. Шапка (`src/components/Header.tsx`)
- Убрать `bg-gradient-to-r from-[#F28C28] to-[#6B4FB3]`
- Заменить на: `bg-white/95 backdrop-blur border-b border-border` (sticky остаётся)
- Высота `h-16` → `h-18` (md), больше воздуха
- Логотип `BrandWordmark` — графитовый цвет, размер `text-lg sm:text-xl`
- Навигация: `text-foreground/70 hover:text-foreground`, `font-medium`, межбуквенный `tracking-tight`
- CTA-кнопка справа: вариант `default` (синий) с `font-semibold`, мягкая тень `shadow-sm`
- Бургер-меню: графитовая иконка вместо белой; мобильное меню — белый фон с `border-t`

## 3. Hero (`src/components/HeroSection.tsx`)
- `py-16 md:py-24` → `py-20 md:py-32` (больше воздуха)
- Eyebrow: цвет `text-secondary` (оранжевый) для маленького акцента — единственное оранжевое пятно сверху
- Заголовок: `tracking-tight`, `font-bold` (вместо `extrabold`)
- Бейджи: вместо карточек с тенью — лёгкие `bg-muted/60 border-0` плашки с иконкой `text-primary`
- Форма: `rounded-xl border-border shadow-[0_2px_20px_-8px_rgba(15,44,74,0.15)]`, заголовок крупнее
- Кнопка отправки — `default` синяя, `h-11`, `font-semibold`

## 4. Каталог (`src/components/CatalogSection.tsx`) — главная переделка
Цель: убрать «маркетплейс», прийти к каталогу подбора.

- `py-16 md:py-24` → `py-24 md:py-32`, `gap-6` → `gap-8`
- Карточки: `rounded-xl border-border bg-card`, тень убрать (или `hover:shadow-md` плавно), все одной высоты через `flex flex-col h-full`
- **Фото — фиксированное соотношение 4:3** (`aspect-[4/3]`), `object-cover`, `bg-muted`, без скруглений сверху отдельно — общий радиус карточки + `overflow-hidden` обёртки
- Категория-эйбрау: `text-xs uppercase tracking-widest text-secondary` (оранжевый — тонкий маркер)
- Название: `text-base font-semibold text-foreground line-clamp-2 min-h-[3rem]` — выравнивает высоту
- Описание: `line-clamp-3 min-h-[4.5rem]`
- Блок цен: убрать «маркетплейсный» grid с подсветкой месяца. Заменить на одну строку:
  - «от **{month/30} ₽/день**» крупно, под ней мелко «{day} ₽/день · {week} ₽/неделя · {month} ₽/мес»
  - либо чистая таблица 3 колонки в `bg-muted/40` без выделения месяца цветом
- Кнопка «Оставить заявку»: `variant="default"` (синяя), `w-full h-11`, иконка `ArrowRight` справа вместо `Send`
- Заголовок секции: `text-3xl md:text-4xl font-bold tracking-tight`, подзаголовок `max-w-2xl text-muted-foreground`

## 5. Кнопки (`src/components/ui/button.tsx`)
Унифицировать стиль во всём сайте:
- `default`: `bg-primary` (синий), `hover:bg-primary/90`, `shadow-sm`, `font-semibold`
- `secondary`: оранжевый — для редких «hot» CTA (например, «Срочный подбор»)
- `outline`: `border-border text-foreground hover:bg-muted` — для второстепенных
- Радиус оставить `rounded-md`, размеры без изменений
- Заменить ВСЕ упоминания старого secondary (синего) — теперь `secondary` это оранжевый

Аудит мест, где `variant="secondary"` использовался как «синий» — поменять на `default` или `outline`. Проверю: `WhyUsSection`, `RentalIncludesSection`, `QuickSelectSection`, `AboutSection`, `ForWhomSection`, `FAQSection`, `Offer.tsx`, `Privacy.tsx`, `RentalIncludes.tsx`.

## 6. Воздух между секциями
Глобально: каждая секция `py-16 md:py-24` → `py-20 md:py-28` (или `md:py-32` для hero/каталога). Файлы: `AboutSection`, `ForWhomSection`, `WhyUsSection`, `RentalIncludesSection`, `QuickSelectSection`, `FAQSection`.

## 7. Подсекции — единый ритм
- Заголовки секций: `text-3xl md:text-4xl font-bold tracking-tight text-foreground`, eyebrow над заголовком (если есть) — `text-xs uppercase tracking-widest text-secondary`
- Карточки внутри `WhyUsSection`, `ForWhomSection`, `RentalIncludesSection`: `bg-card border-border rounded-xl p-8`, иконки в кружке `bg-primary/8 text-primary`, без теней (или `hover:shadow-sm`)
- Чередование фонов: нечётные секции `bg-background`, чётные `bg-muted/40` — мягкие переходы вместо однородной полосы

## 8. Футер (`src/components/Footer.tsx`)
- `bg-footer-bg` остаётся (теперь глубокий графит-синий)
- Иконки соцсетей: `ring-white/15`, hover — `ring-secondary/60` (тонкий оранжевый намёк)
- Отступы `py-12 md:py-16` → `py-16 md:py-20`

## 9. Дополнительно
- `BrandWordmark`: проверить, что он наследует `currentColor` корректно для тёмной шапки → светлой
- Убрать в `App.css` декоративные анимации логотипа (если влияют) — но `App.css` не импортируется в `Index`, можно не трогать
- Проверить, что `text-primary` в существующих секциях даёт синий (теперь это так), — если где-то использовался как «оранжевый акцент» (eyebrow в hero, категория в каталоге) — заменить на `text-secondary`

## Файлы к изменению
1. `src/index.css` — палитра
2. `src/components/Header.tsx` — белая строгая шапка
3. `src/components/HeroSection.tsx` — воздух, типографика, eyebrow→secondary
4. `src/components/CatalogSection.tsx` — карточки 4:3, единая высота, новый блок цен, кнопка default
5. `src/components/ui/button.tsx` — унифицированные варианты
6. `src/components/Footer.tsx` — отступы, hover соцсетей
7. Все остальные секции (`AboutSection`, `ForWhomSection`, `WhyUsSection`, `RentalIncludesSection`, `QuickSelectSection`, `FAQSection`) — `py-` отступы, eyebrow в `text-secondary`, карточки в едином стиле, замена `variant="secondary"` на `default`/`outline` где использовалось как «синий»

## Что НЕ меняем
- Логику, контексты, БД, админку
- Структуру секций и порядок
- Тексты (всё по-прежнему редактируется через админку)
- Шрифт Inter
