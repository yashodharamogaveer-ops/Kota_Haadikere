import { useEffect } from 'react';

export interface HelmetProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  /** Absolute canonical URL. When omitted the current location is used. */
  canonical?: string;
  noindex?: boolean;
  /** <html lang> */
  lang?: string;
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
  themeColor?: string;
  faviconUrl?: string;
  /** schema.org JSON-LD blocks */
  jsonLd?: any[];
  googleVerification?: string;
  bingVerification?: string;
  ga4Id?: string;
  gtmId?: string;
}

const upsert = (selector: string, create: () => HTMLElement, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) { el = create(); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  return el;
};

const meta = (key: 'name' | 'property', name: string, content: string) =>
  upsert(`meta[${key}="${name}"]`, () => { const m = document.createElement('meta'); m.setAttribute(key, name); return m; }, { content });

const removeMeta = (key: 'name' | 'property', name: string) => {
  document.head.querySelector(`meta[${key}="${name}"]`)?.remove();
};

export function Helmet(p: HelmetProps) {
  const {
    title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonical, noindex,
    lang, locale, siteName, twitterHandle, themeColor, faviconUrl, jsonLd,
    googleVerification, bingVerification, ga4Id, gtmId
  } = p;
  const currentUrl = canonical || ogUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');
  const jsonLdString = jsonLd && jsonLd.length ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
    if (lang) document.documentElement.lang = lang;

    meta('name', 'description', description);
    if (keywords) meta('name', 'keywords', keywords); else removeMeta('name', 'keywords');
    meta('name', 'robots', noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    if (currentUrl) {
      upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l; }, { href: currentUrl });
      meta('property', 'og:url', currentUrl);
    }

    meta('property', 'og:title', ogTitle || title);
    meta('property', 'og:description', ogDescription || description);
    meta('property', 'og:type', 'website');
    if (siteName) meta('property', 'og:site_name', siteName);
    if (locale) meta('property', 'og:locale', locale);
    if (ogImage) { meta('property', 'og:image', ogImage); meta('name', 'twitter:image', ogImage); }

    meta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    meta('name', 'twitter:title', ogTitle || title);
    meta('name', 'twitter:description', ogDescription || description);
    if (twitterHandle) meta('name', 'twitter:site', twitterHandle.startsWith('@') ? twitterHandle : '@' + twitterHandle);

    if (themeColor) meta('name', 'theme-color', themeColor);
    if (googleVerification) meta('name', 'google-site-verification', googleVerification);
    if (bingVerification) meta('name', 'msvalidate.01', bingVerification);

    if (faviconUrl) {
      upsert('link[rel="icon"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'icon'); return l; }, { href: faviconUrl });
      upsert('link[rel="apple-touch-icon"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'apple-touch-icon'); return l; }, { href: faviconUrl });
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, currentUrl, noindex, lang, locale, siteName, twitterHandle, themeColor, faviconUrl, googleVerification, bingVerification]);

  // JSON-LD (replaced on every page change)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = 'dynamic-jsonld';
    document.getElementById(id)?.remove();
    // remove the build-time (pre-rendered) JSON-LD so it is not duplicated
    document.head.querySelectorAll('script[type="application/ld+json"]:not(#dynamic-jsonld)').forEach(n => n.remove());
    if (!jsonLdString) return;
    const s = document.createElement('script');
    s.id = id; s.type = 'application/ld+json'; s.text = jsonLdString;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, [jsonLdString]);

  // Analytics: loaded once, only when an ID is configured in the admin panel
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (gtmId && /^GTM-[A-Z0-9]+$/.test(gtmId) && !document.getElementById('gtm-loader')) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.id = 'gtm-loader'; s.async = true; s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(s);
    }
    if (ga4Id && /^G-[A-Z0-9]+$/.test(ga4Id) && !gtmId && !document.getElementById('ga4-loader')) {
      const s = document.createElement('script');
      s.id = 'ga4-loader'; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(s);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () { (window as any).dataLayer.push(arguments); };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', ga4Id, { anonymize_ip: true });
    }
  }, [ga4Id, gtmId]);

  return null;
}
