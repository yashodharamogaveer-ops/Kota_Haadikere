# Website (public)

React + Vite + Tailwind. Reads everything from Supabase; edited through the separate **admin-panel** project.

```bash
cp .env.example .env     # fill in the two Supabase values
npm install
npm run dev              # http://localhost:3000
npm run build            # → dist/  (also pre-renders pages, sitemap.xml, robots.txt, llms.txt)
```

Host settings: build command `npm run build`, output folder `dist`. Environment variables
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set on the host (the build reads the live content to generate
the SEO files). `vercel.json` and `public/_redirects`/`_headers` are included.

## What is automatic
* Per-page title, description, canonical (`https://www.haadikereshaneshwara.com/...`), Open Graph / Twitter cards.
* JSON-LD for Google: `HinduTemple`, `WebSite`, page type, `BreadcrumbList`, upcoming `Event`s.
* Pre-rendered HTML for every page + `sitemap.xml`, `robots.txt` (Google, Bing and AI crawlers allowed) and `llms.txt`,
  so AI bots that don’t run JavaScript still read the content.
* Admin changes are live for visitors immediately; the pre-rendered pages/sitemap/llms.txt refresh on the next build
  (use the **Rebuild now** button in the admin: SEO → Publish, after pasting your host’s deploy-hook URL).
* WhatsApp links (floating button, footer, contact page, trustees) normalise the number so `wa.me` always accepts it.

## Developer notes
* `src/lib/content.ts` – content model, defaults, WhatsApp helper; `src/lib/useSiteContent.ts` – loader + cache.
* Inline texts use `tx('ಕನ್ನಡ', 'English')`; run `npm run extract-strings` after adding some, then sync the admin
  (`npm run sync-shared` inside `admin-panel`).
* With an empty database the site renders exactly like the original design.
