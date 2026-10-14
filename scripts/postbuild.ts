/**
 * Runs after `vite build` (see package.json "build").
 *
 * Reads the live content from Supabase and writes into dist/:
 *   • sitemap.xml        – all pages (+ gallery images)
 *   • robots.txt         – Google/Bing + AI crawlers allowed
 *   • llms.txt           – plain-language summary for ChatGPT / Gemini / Perplexity / Claude
 *   • index.html, about/index.html, gallery/…  – real HTML for every page (title, description,
 *     canonical, Open Graph, JSON-LD and readable text), so crawlers that do not run JavaScript
 *     (most AI bots) still see the content. The React app replaces this snapshot when it loads.
 *
 * It never fails the build: if Supabase cannot be reached, built-in defaults are used.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeContent, resolveTranslations, SiteContent, SeoPageRow } from '../src/lib/content';
import { buildJsonLd, INDEXABLE_PAGES, PAGE_LABELS, PAGE_PATHS, resolvePageSeo, siteUrlOf, absoluteUrl, SeoPageKey } from '../src/lib/seo';
import { getDefaultSeo } from '../src/lib/seoDefaults';
import { translations } from '../src/types';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// load .env for local builds (hosts inject real env vars)
for (const f of ['.env', '.env.local']) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const URL_ = process.env.VITE_SUPABASE_URL, KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function rest<T = any[]>(table: string, query = 'select=*'): Promise<T> {
  if (!URL_ || !KEY) return [] as any;
  try {
    const r = await fetch(`${URL_}/rest/v1/${table}?${query}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!r.ok) return [] as any;
    return (await r.json()) as T;
  } catch { return [] as any; }
}

const esc = (s: any) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s: any) => String(s ?? '').replace(/<\/p>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
const pick = (kn: any, en: any, lang: 'kn' | 'en') => (lang === 'kn' ? (kn || en) : (en || kn)) || '';

async function main() {
  if (!fs.existsSync(path.join(dist, 'index.html'))) { console.warn('[postbuild] dist/index.html not found – skipping'); return; }

  const [contentRows, seoRows, sevas, events, history, people, faqs, media, profile, features] = await Promise.all([
    rest<any[]>('site_content', 'select=key,value&is_public=eq.true'),
    rest<SeoPageRow[]>('seo_pages'),
    rest<any[]>('sevas', 'select=*&is_active=eq.true&order=sort_order.asc'),
    rest<any[]>('events', 'select=*&order=event_date.asc'),
    rest<any[]>('temple_history', 'select=*&order=sort_order.asc'),
    rest<any[]>('committee_members', 'select=*&is_active=eq.true&order=sort_order.asc'),
    rest<any[]>('faqs', 'select=*&is_active=eq.true&order=sort_order.asc'),
    rest<any[]>('media_items', 'select=*&order=created_at.desc&limit=50'),
    rest<any[]>('temple_profile', 'select=*&limit=1'),
    rest<any[]>('about_features', 'select=*&order=id.asc')
  ]);

  const map: any = {};
  (contentRows || []).forEach((r: any) => { map[r.key] = r.value; });
  const content: SiteContent = composeContent(map);
  const prof = (profile && profile[0]) || {};
  const site = siteUrlOf(content);
  const tKn = resolveTranslations('kn', content), tEn = resolveTranslations('en', content);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (events || []).filter(e => e.event_date && e.event_date >= today);

  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
    .replace(/<div id="root">[\s\S]*?<\/div>\s*<script/, '<div id="root"></div>\n    <script');
  const phones = tEn.contactSection.phones;
  const addr = (l: 'kn' | 'en') => pick(l === 'kn' ? content.contact.address_kn || prof.address : content.contact.address_en || prof.address, (l === 'kn' ? tKn : tEn).contactSection.address, l) || (l === 'kn' ? tKn : tEn).contactSection.address;

  /* ---------- per-page HTML ---------- */
  const section = (lang: 'kn' | 'en', page: SeoPageKey) => {
    const t = lang === 'kn' ? tKn : tEn;
    const h: string[] = [];
    h.push(`<h1>${esc(t.templeName)} — ${esc(t.templeSub)}</h1>`);
    if (page === 'home') {
      h.push(`<p>${esc(t.hero.tagline)}</p>`, `<h2>${esc(t.hero.timingsTitle)}</h2><p>${esc(t.hero.timingsSaturdays)}</p><p>${esc(t.hero.timingsWeekdays)}</p><p>${esc(t.hero.timingSpecial)}</p>`);
      const first = history[0];
      if (first) h.push(`<h2>${esc(pick(first.title_kn, first.title_en, lang))}</h2><p>${esc(strip(pick(first.content_kn, first.content_en, lang)))}</p>`);
      if (upcoming.length) h.push(`<h2>${lang === 'kn' ? 'ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು' : 'Upcoming events'}</h2><ul>` + upcoming.map(e => `<li>${esc(e.event_date)} — ${esc(pick(e.title_kn, e.title_en, lang))}</li>`).join('') + '</ul>');
    }
    if (page === 'about') {
      h.push(`<h2>${esc(pick(prof.about_title_kn, prof.about_title_en, lang) || t.about.title)}</h2>`,
        `<p>${esc(pick(prof.about_intro_kn, prof.about_intro_en, lang) || t.about.intro)}</p>`,
        `<p>${esc(pick(prof.about_description1_kn, prof.about_description1_en, lang) || t.about.description1)}</p>`,
        `<p>${esc(pick(prof.about_description2_kn, prof.about_description2_en, lang) || t.about.description2)}</p>`);
      for (const x of history) h.push(`<h3>${esc(pick(x.title_kn, x.title_en, lang))}</h3><p>${esc(strip(pick(x.content_kn, x.content_en, lang)))}</p>`);
      const feats = (features || []).length ? features.map((f: any) => ({ title: pick(f.title_kn, f.title, lang), desc: pick(f.desc_kn, f.desc, lang) })) : t.about.features;
      h.push(`<h2>${esc(t.about.specialFeatureTitle)}</h2><ul>` + feats.map((f: any) => `<li><b>${esc(f.title)}</b>: ${esc(f.desc)}</li>`).join('') + '</ul>');
    }
    if (page === 'seva') {
      h.push(`<h2>${esc(t.sevaSection.title)}</h2><p>${esc(t.sevaSection.subtitle)}</p><ul>` +
        (sevas || []).map(s => `<li><b>${esc(pick(s.title_kn, s.title_en, lang))}</b>${s.price ? ` — ₹${esc(s.price)}` : ''}: ${esc(pick(s.description_kn, s.description_en, lang))}</li>`).join('') + '</ul>');
    }
    if (page === 'gallery') {
      h.push(`<h2>${esc(t.gallerySection.title)}</h2><p>${esc(t.gallerySection.subtitle)}</p>`);
    }
    if (page === 'contact' || page === 'home') {
      h.push(`<h2>${esc(t.contactSection.title)}</h2><address>${esc(addr(lang))}</address>`,
        `<p>${esc(t.contactSection.phoneLabel)}: ${phones.map(esc).join(', ')}</p><p>${esc(t.contactSection.emailLabel)}: ${esc(content.contact.email || prof.email || t.contactSection.email)}</p>`);
      if (page === 'contact') {
        h.push(`<p>${esc(t.contactSection.mapInstructions)}</p>`);
        if (people.length) h.push('<ul>' + people.map(p => `<li>${esc(pick(p.name_kn, p.name_en, lang))} — ${esc(pick(p.designation_kn, p.designation_en, lang))}${p.phone ? ', ' + esc(p.phone) : ''}</li>`).join('') + '</ul>');
      }
    }
    if (page === 'privacy') h.push(`<p>${esc(t.nav.privacy)}</p>`);
    const nav = INDEXABLE_PAGES.map(p => `<a href="${PAGE_PATHS[p]}">${esc(PAGE_LABELS[p][lang])}</a>`).join(' | ');
    return `<div lang="${lang}"><nav>${nav}</nav>${h.join('')}</div>`;
  };

  const writePage = (page: SeoPageKey) => {
    const lang: 'kn' = 'kn';
    const d = getDefaultSeo(page, lang);
    const seo = resolvePageSeo(page, lang, d, seoRows || [], content);
    const url = site + (PAGE_PATHS[page] === '/' ? '/' : PAGE_PATHS[page]);
    const img = absoluteUrl(site, seo.image);
    const ld = buildJsonLd({ page, lang, content, title: seo.title, description: seo.description, image: seo.image, address: addr('kn'), phones, email: content.contact.email || prof.email || tKn.contactSection.email, events: upcoming.map(e => ({ ...e, title: e.title_en, description: e.description_en, poster_url: e.image_url })) });
    const head = [
      `<title>${esc(seo.title)}</title>`,
      `<meta name="description" content="${esc(seo.description)}" />`,
      seo.keywords ? `<meta name="keywords" content="${esc(seo.keywords)}" />` : '',
      `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="website" /><meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:title" content="${esc(seo.title)}" /><meta property="og:description" content="${esc(seo.description)}" />`,
      `<meta property="og:site_name" content="${esc(content.seo.site_name_kn || '')}" /><meta property="og:locale" content="kn_IN" /><meta property="og:locale:alternate" content="en_IN" />`,
      img ? `<meta property="og:image" content="${esc(img)}" /><meta name="twitter:image" content="${esc(img)}" />` : '',
      `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}" /><meta name="twitter:title" content="${esc(seo.title)}" /><meta name="twitter:description" content="${esc(seo.description)}" />`,
      content.branding.theme_color ? `<meta name="theme-color" content="${esc(content.branding.theme_color)}" />` : '',
      content.integrations.google_site_verification ? `<meta name="google-site-verification" content="${esc(content.integrations.google_site_verification)}" />` : '',
      content.integrations.bing_site_verification ? `<meta name="msvalidate.01" content="${esc(content.integrations.bing_site_verification)}" />` : '',
      content.branding.favicon_url ? `<link rel="icon" href="${esc(content.branding.favicon_url)}" /><link rel="apple-touch-icon" href="${esc(content.branding.favicon_url)}" />` : '<link rel="icon" href="/favicon.png" /><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />',
      ...ld.map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    ].filter(Boolean).join('\n    ');

    let html = template
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name="(description|keywords|robots)"[^>]*>\s*/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
      .replace(/<link\s+rel="sitemap"[^>]*>\s*/gi, '')
      .replace('</head>', `    ${head}\n    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${section('kn', page)}${section('en', page)}</div>`);
    const out = page === 'home' ? path.join(dist, 'index.html') : path.join(dist, PAGE_PATHS[page].replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  };
  for (const p of INDEXABLE_PAGES) writePage(p);

  /* ---------- sitemap.xml ---------- */
  const lastmodOf = (page: SeoPageKey) => today;
  const imgs = (media || []).filter(m => (m.kind || 'image') !== 'video').map(m => m.url || m.image_url || m.src).filter(Boolean).slice(0, 40);
  const urls = INDEXABLE_PAGES.filter(p => !(seoRows || []).find(r => r.page_key === p && r.noindex)).map(p => {
    const loc = site + (PAGE_PATHS[p] === '/' ? '/' : PAGE_PATHS[p]);
    const pri = p === 'home' ? '1.0' : p === 'privacy' ? '0.3' : '0.8';
    const freq = p === 'home' ? 'weekly' : p === 'privacy' ? 'yearly' : 'monthly';
    const im = p === 'gallery' ? imgs.map(u => `\n    <image:image><image:loc>${esc(absoluteUrl(site, u))}</image:loc></image:image>`).join('') : '';
    return `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmodOf(p)}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>${im}\n  </url>`;
  });
  fs.writeFileSync(path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`);

  /* ---------- robots.txt ---------- */
  const aiBots = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'cohere-ai', 'Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot'];
  const allowAI = content.seo.allow_ai_crawlers !== false;
  const robots = [
    `# ${content.seo.site_name_en || 'Temple'}`,
    'User-agent: *', 'Allow: /', '',
    ...aiBots.flatMap(b => [`User-agent: ${b}`, allowAI ? 'Allow: /' : 'Disallow: /', '']),
    `Sitemap: ${site}/sitemap.xml`, `# AI summary: ${site}/llms.txt`, ''
  ].join('\n');
  fs.writeFileSync(path.join(dist, 'robots.txt'), robots);

  /* ---------- llms.txt ---------- */
  const t = tEn;
  const L: string[] = [];
  L.push(`# ${content.seo.site_name_en || t.templeName}`, '');
  L.push(`> ${content.seo.ai_summary_en || `${t.templeName} (${t.templeSub}) is a Hindu temple of Lord Shaneshwara (Shani Dev) worshipped in the peaceful form of "Shantamurthy", located at Haadikere, Brahmavara Taluk, Udupi District, Karnataka, India.`}`, '');
  if (content.seo.ai_summary_kn) L.push(content.seo.ai_summary_kn, '');
  L.push('## Key facts', `- Name: ${t.templeName} / ${tKn.templeName}`, `- Address: ${addr('en')}`, `- Phone: ${phones.join(', ')}`, `- Email: ${content.contact.email || prof.email || t.contactSection.email}`);
  if (content.contact.latitude) L.push(`- Location: ${content.contact.latitude}, ${content.contact.longitude}`);
  if (content.contact.directions_url) L.push(`- Directions: ${content.contact.directions_url}`);
  L.push(`- Darshan timings: ${content.timings.special_title_en}: ${content.timings.special_hours_en}; ${content.timings.other_title_en}: ${content.timings.other_hours_en}`);
  L.push('- Languages: Kannada, English', '- Entry: free for all devotees. This website does not take online bookings or payments.', '');
  L.push('## Pages', ...INDEXABLE_PAGES.map(p => `- [${PAGE_LABELS[p].en}](${site}${PAGE_PATHS[p]})`), '');
  if ((sevas || []).length) L.push('## Sevas & poojas (offered at the temple counter)', ...sevas.map(s => `- ${pick(s.title_en, s.title_kn, 'en')}${s.price ? ` (₹${s.price})` : ''}: ${pick(s.description_en, s.description_kn, 'en')}`), '');
  if (upcoming.length) L.push('## Upcoming events', ...upcoming.map(e => `- ${e.event_date}${e.event_time ? ' ' + e.event_time : ''}: ${pick(e.title_en, e.title_kn, 'en')} — ${strip(pick(e.description_en, e.description_kn, 'en'))}`), '');
  if ((faqs || []).length) { L.push('## Frequently asked questions'); for (const f of faqs) L.push(`### ${pick(f.question_en, f.question_kn, 'en')}`, strip(pick(f.answer_en, f.answer_kn, 'en')), ''); }
  fs.writeFileSync(path.join(dist, 'llms.txt'), L.join('\n'));

  console.log(`[postbuild] OK — ${INDEXABLE_PAGES.length} pages, sitemap.xml, robots.txt, llms.txt (${URL_ ? (contentRows.length ? 'live data' : 'defaults – no content rows yet') : 'defaults – Supabase env missing'})`);
}

main().catch(e => { console.warn('[postbuild] skipped:', e?.message || e); });
