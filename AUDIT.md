# AUDIT.md — studentsandparents.com reference audit (for Dynaverse Errors clone)

Audited live on 2026-10-26/27 (homepage, 2 category pages, full post, DMCA, Contact,
Privacy Policy, Copyright, `style.css` 74,770 B, `main.js` 8,090 B, fonts, JSON-LD).

## 1. Technology
- **Zero-CMS static HTML**: every page is a pre-built `.html` file; no server code, no DB.
- **CDN**: Cloudflare proxy; Rocket Loader ON (scripts carry `type="…-text/javascript"`);
  speculation rules `/cdn-cgi/speculation`. Both are host-side toggles — not code.
- **Design system**: "Kutak" Ghost theme (by apalodi) converted to static. CSS variable
  namespace `--kutak--*`, Ghost Koenig content classes `kg-*`.
- **Assets** (all under `/assets/kutukdev/`): `css/style.css` (74,770 B), `js/main.js`
  (8,090 B, vanilla, 7 modules: embed sizing, gallery, kg-toggle, pagination-load-more,
  sharing, site-actions panel, sticky header). Fonts self-hosted **Source Sans Pro**
  woff2 400/600/700, declared in an **inline `<style>@font-face`** block in every page
  `<head>`, preloaded ×3 with `crossorigin`.
- **Images**: 100% hotlinked Bing thumbnails `https://tse1.mm.bing.net/th?q={kebab-keyword}&w=474&h=274&c=7`;
  no local image copies; `loading="lazy"` below the fold, first post image `loading="eager"`;
  preconnect to `tse1.mm.bing.net`. `alt` = post title.
- **Ads**: Adsterra iframe banners (468×60 zone A, 300×250 zone B) via
  `atOptions` + `invoke.js`, wrapped in bare `<center>`. AdSense on homepage only.
  Analytics: Histats counter.
- **Minification**: CSS shipped as single file (some minification), JS single bundle.

## 2. Layout
- **Header** (`#site-header.site-header`): white band, `--kutak--size--header`
  (60–70px), bottom border dim; hamburger trigger left + wordmark (accent color, 35px,
  bold, uppercase) linking `/`. No horizontal nav — navigation lives in a full-screen
  slide-out `site-actions` panel (full category list, backdrop click-to-close, body
  scroll lock). Sticky ≥1000px via IntersectionObserver (`data-is-sticky`).
- **Homepage**: `<main>` → 468×60 ad → `div.site-content.section` →
  `div.posts-feed[data-layout-grid="columns"]` with ~21 vertical post cards. No hero,
  no pagination UI.
- **Category page**: 468×60 ad → `section.site-content.section` →
  `h1.category-title` → `posts-feed` with ~21 cards of that category.
- **Post page**: 468×60 ad (before article) → `article.article.post.featured` →
  `header.article-header.section[data-theme=highlight]` split band (light gray
  `#f4f6f8`): figure LEFT ≈47% (1200×630 Bing thumb, rounded 12px), content RIGHT:
  `h1.article-header__title`, `p.article-header__excerpt` (lede ~150 words),
  `div.article-header__footer` (category tag accent + date `<time>`).
  → `.article-main.section > .article-content` (660px column): 300×250 ad first,
  then `nav.table-of-contents` (nested `ol/ul`), `h2#quick-info-table` + `<table>`
  (2-col fact sheet, `thead` first row), H2 narrative sections with H3/H4,
  `<h2 id="faq">FAQ</h2>` with `<h3>` questions + `<p>` answers.
  → `footer.article-footer` containing `section.related-posts.section[data-theme=highlight]`
  ("You might also like") with `related-posts__grid` of **horizontal** post cards
  (3–6, same category, alphabetical neighbours).
- **Footer** (`#site-footer.site-footer[data-theme=highlight]`): `nav-secondary` menu
  row — **Home, Dmca, Contact, Privacy Policy, Copyright** — plus
  `p.site-footer__copyright` ("© 2025 Daily Students News"). Minimal, small, dim.
- **Breakpoints**: mobile-first; feed grid 3 cols ≥62.5em, 2 cols ≥37.5em, 1 below;
  key breakpoints 600px, 1000px (desktop switch); article column 660px, container 1160px.

## 3. HTML patterns
- Body class **`home-template` on every page** (reference oddity — copied as-is).
- `<div class="site" id="site">` wraps header/main/footer; `<a class="skip-link
  visually-hidden-focusable" href="#main">`; `<main id="main" class="site-main">`.
- Post card (vertical, feed): `article.post-card.post[data-layout=vertical]` →
  `a.post-card__media > picture.post-card__figure > img.post-card__image(16/9)` →
  `div.post-card__content > a.post-card__content-link(h2.post-card__title +
  p.post-card__excerpt) + div.post-card__footer(span.post-card__meta-tag-primary,
  span.post-card__meta--date)`. Related cards: same but `data-layout=horizontal`,
  picture unwrapped, `h3` title, no excerpt.
- TOC: `nav.table-of-contents > ol > li(a[href="#id"]) [> ul > li(a)]`.

## 4. SEO
- `<title>` = post title, **no brand suffix**; meta description present on posts;
  `robots = index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large`;
  canonical on every page (non-www host + non-www canonical — reference quirk).
- OG block: `og:locale en_US, og:type article|website, og:title, og:description, og:url,
  og:site_name, og:updated_time, og:image(+alt/width/height), article:published_time,
  article:modified_time, article:section` + twitter `summary_large_image`.
- JSON-LD on posts (4 blocks): guessed entity type (`TVSeries` — reference oddity,
  dropped in clone per blueprint §10.3), `BlogPosting` (wordCount "0" — oddity kept;
  author Person; publisher Organization + logo), `@graph` (Person/Organization + WebSite
  + WebPage), `BreadcrumbList` (reference lists only Home→Post; master instructions
  require Home›Hub›Post, so the clone emits 3 levels).
- Reference has FAQ content but **no FAQPage schema** → clone adds `FAQPage` (mandated).
- URLs: post `/{category-slug}/{post-slug}.html`; category `/category/{slug}/`;
  static `/page/{name}.html`. Reference ships **no sitemap.xml/robots.txt** (404) →
  clone ships sitemap index + hub sitemaps + robots.txt (mandated upgrade).

## 5. Ads (positions per page type)
| Page | Slots |
|---|---|
| Post | 468×60 immediately after `<header>`, before `<article>`; 300×250 first element inside `.article-content` |
| Homepage | 468×60 first element of `<main>`, before feed |
| Category | 468×60 first element of `<main>`, before feed |
Wrapper on reference = bare `<center>` (no label, no fixed box, causes CLS — the clone
adds fixed-size labelled containers per master instructions §6, positions unchanged).

## 6. Static/legal pages
`/page/dmca.html`, `/page/contact.html`, `/page/privacy-policy.html`, `/page/copyright.html`.
DMCA = standard notification-of-infringement text with agent contact; Privacy Policy =
Google-style policy (Information we collect / How we use / Transparency / … / Enforcement /
Changes / Specific product practices); Contact and Copyright are short single-H1 pages.
Footer menu = exactly: Home · Dmca · Contact · Privacy Policy · Copyright.

## 7. Colors (allowed change zone)
Reference: accent `#e60073` (hot magenta) via `--ghost-accent-color`; highlight band
`#f4f6f8`; text rgba-black scale; border rgba-black scale; base `#fff`.
Clone palette (only colors change, nothing else in CSS): primary `#0b5cad`,
header/footer navy `#0f2a4a`, accent `#5aa9ff`, background `#f5f7fa`, card `#fff`,
text `#1b1f24`, muted `#5b6572`, border `#dfe3e8`. Light theme only, no dark mode.

## 8. New header/footer per master instructions (replaces reference header/footer)
Navbar: dark navy `#0f2a4a`, logo.webp 48px left + "Dynaverse Errors" white live text,
hub menu right (ordered by post count), mobile horizontal scroll; search strip below
(light gradient, centered, tagline hidden <520px wide or <620px tall, 48px field max
820px wide, 2px blue border, radius 14px, soft shadow, placeholder
"Search error code, e.g. 0x80040220  ( / )"); client-side JSON search (normalized codes,
ranking exact>prefix>title>keywords, top-6 dropdown, Enter → `/?q=`, `/` focuses).
Footer: compact ~48px, same menu labels/order as reference footer, plus
"© 2026 Dynaverse Errors. Not affiliated with or endorsed by Microsoft. Product names
are trademarks of Microsoft."; sticks to viewport bottom on short pages.

## 9. Clone decisions
- Reference oddities kept: `home-template` body class everywhere, `wordCount: "0"`,
  BlogPosting author shape (cloned as Organization "Dynaverse Errors" instead of a
  person name — content-policy requirement), inline `@font-face` block per page.
- Additions mandated by master instructions: visible breadcrumb (Home › Hub › Post),
  BreadcrumbList with 3 levels, FAQPage JSON-LD, meta description everywhere, sitemap
  index + hub sitemaps, robots.txt, GSC file `google4a76338cbc6eddcb.html` at root,
  provided logo/favicons at root, Adsterra keys `2ae45376961d3205d47ae3d3acd65458`
  (468×60) / `76edcf33d56397a5e8a4e65d6779a73f` (300×250) at `bauval.org`, both units
  on homepage/hubs/posts, search system, 800-word minimum error-code content.
