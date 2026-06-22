# Paula Leech Therapy — paulaleech.com

Astro + Tailwind CSS, deployed to Cloudflare Pages.
Source of truth for paulaleech.com. Replaces the previous Squarespace site.

## Quick start

```bash
npm install
npm run dev      # http://127.0.0.1:4321 — live reload
npm run build    # writes static site to ./dist
npm run preview  # serve the built site locally
```

## Architecture

| Concern | Tool |
|---|---|
| Static site generator | Astro (TypeScript, strict) |
| Styling | Tailwind CSS v4 (theme tokens in `src/styles/global.css`) |
| Hosting | Cloudflare Pages (auto-deploy on push to `main`) |
| Therapy scheduling + telehealth + billing | SimplePractice (external) — booking widget embedded on `/book` |
| Course/training scheduling + payment | Cal.com + Stripe (embedded on `/book` and `/trainings`) |
| Email signups | Kit / ConvertKit (TODO) |
| Self-paced video courses | Podia (external link, TODO when first course launches) |
| Form submissions | Formspree (TODO before launch) |
| Domain registrar | TBD (currently Squarespace — to migrate or just repoint DNS) |

## Adding a new live training or course

Edit `src/pages/trainings.astro` and add an entry to the `upcoming` array:

```js
{
  title: 'Title',
  subtitle: 'AASECT Special Group Supervision',
  description: '...',
  instructors: ['Paula Leech, LMFT, CST-S'],
  price: 400,
  cta: 'Enroll',
  href: 'https://cal.com/paulaleech/your-event-slug', // Cal.com URL with Stripe attached
}
```

Commit, push, Cloudflare auto-deploys in ~30 seconds. Done.

## Image assets

All scraped images from the original Squarespace site are in `public/images/`. Filenames are intentionally generic (`img_01.png` etc.) — we'll rename and prune as we replace with new AI-generated illustrations.

## TODOs before launch

- [ ] SimplePractice client portal URL → `src/pages/book.astro`
- [ ] Cal.com booking URL → `src/pages/book.astro`
- [ ] Stripe payment links → embedded in Cal.com event types
- [ ] Real Amazon URL → `src/pages/the-book.astro`
- [ ] Formspree form action → `src/pages/contact.astro`
- [ ] Kit / ConvertKit signup form → `src/layouts/Layout.astro` footer
- [ ] Real podcast/press URLs → `src/pages/press.astro`
- [ ] TikTok URL → `src/layouts/Layout.astro` + `src/pages/contact.astro`
- [ ] Replace `img_*.png` filenames with descriptive names
- [ ] AI-generated illustrations (Krea / similar) to replace older watercolor pieces
- [ ] Exit-intent email popup on home page
- [ ] DNS cutover from Squarespace to Cloudflare Pages
- [ ] favicon
