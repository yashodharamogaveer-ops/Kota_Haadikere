import { PageType } from '../types';

export type IndexablePageType = 'home' | 'about' | 'gallery' | 'seva' | 'contact' | 'privacy';

export interface SitemapPageConfig {
  page: IndexablePageType;
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  titleKn: string;
  titleEn: string;
  lastmod?: string;
}

export interface SitemapGeneratorOptions {
  /**
   * Base domain URL for the website (e.g. 'https://haadikereshanitemple.org' or window.location.origin)
   */
  baseUrl?: string;
  /**
   * Selected list of pages to include. Defaults to all dynamic pages: ['home', 'about', 'gallery', 'seva', 'contact', 'privacy']
   */
  pages?: IndexablePageType[];
  /**
   * Optional additional dynamic URLs (such as specific festivals, events, or announcements)
   */
  extraRoutes?: Array<{
    path: string;
    priority?: number;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    lastmod?: string;
  }>;
  /**
   * Whether to include xhtml:link multilingual alternate tags for 'kn' and 'en'
   */
  includeLanguageAlternates?: boolean;
}

/**
 * Default metadata configuration for each dynamic temple page
 */
export const TEMPLE_PAGES_SITEMAP_CONFIG: Record<IndexablePageType, SitemapPageConfig> = {
  home: {
    page: 'home',
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    titleKn: 'ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ',
    titleEn: 'Shantamurthy Sri Shaneshwara Temple | Haadikere, Udupi',
  },
  seva: {
    page: 'seva',
    path: '/#seva',
    priority: 0.9,
    changefreq: 'weekly',
    titleKn: 'ಸೇವೆಗಳು ಮತ್ತು ವಿಶೇಷ ಪೂಜೆಗಳ ವಿವರ',
    titleEn: 'Holy Seva Offerings, Poojas & Notice Board',
  },
  about: {
    page: 'about',
    path: '/#about',
    priority: 0.8,
    changefreq: 'monthly',
    titleKn: 'ಕ್ಷೇತ್ರದ ಹಿನ್ನೆಲೆ, ಇತಿಹಾಸ ಮತ್ತು ಕಲ್ಯಾಣ ಮಂಟಪ',
    titleEn: 'Temple Sanctuary History, Timings & Marriage Hall',
  },
  gallery: {
    page: 'gallery',
    path: '/#gallery',
    priority: 0.8,
    changefreq: 'weekly',
    titleKn: 'ಪವಿತ್ರ ಚಿತ್ರಸಂಪುಟ ಮತ್ತು ವೀಡಿಯೊಗಳು',
    titleEn: 'Sacred Media Gallery, Photos & Videos',
  },
  contact: {
    page: 'contact',
    path: '/#contact',
    priority: 0.7,
    changefreq: 'monthly',
    titleKn: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ, ವಿಳಾಸ ಮತ್ತು ಮಾರ್ಗಸೂಚಿ',
    titleEn: 'Contact Information, Route Map & Directions',
  },
  privacy: {
    page: 'privacy',
    path: '/privacy-policy',
    priority: 0.5,
    changefreq: 'monthly',
    titleKn: 'ಗೌಪ್ಯತಾ ನೀತಿ - ಭಕ್ತರ ಪವಿತ್ರ ಮಾಹಿತಿ ರಕ್ಷಣೆ',
    titleEn: 'Privacy Policy - Devotee Sacred Data Protection',
  },
};

/**
 * Dynamic list of all primary temple pages
 */
export const ALL_TEMPLE_PAGES: IndexablePageType[] = [
  'home',
  'about',
  'gallery',
  'seva',
  'contact',
  'privacy',
];

/**
 * Resolves the canonical base URL for sitemap generation
 */
export const resolveCanonicalBaseUrl = (providedUrl?: string): string => {
  if (providedUrl && providedUrl.trim().length > 0) {
    return providedUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    // Avoid localhost or internal IP if deployed with specific domain
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://haadikereshanitemple.org';
};

/**
 * Formats a Date object into W3C / ISO-8601 YYYY-MM-DD format for XML sitemaps
 */
export const formatSitemapDate = (date?: Date | string): string => {
  try {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Generates a valid XML Sitemap string according to the official Sitemaps XML protocol (sitemaps.org).
 * Uses the temple's dynamic page list (home, about, gallery, seva, contact).
 *
 * @param options SitemapGeneratorOptions
 * @returns string The XML document formatted as sitemap.xml
 */
export function generateSitemapXml(options: SitemapGeneratorOptions = {}): string {
  const baseUrl = resolveCanonicalBaseUrl(options.baseUrl);
  const pagesToInclude = options.pages && options.pages.length > 0 ? options.pages : ALL_TEMPLE_PAGES;
  const today = formatSitemapDate();
  const includeAlternates = options.includeLanguageAlternates ?? true;

  const urlEntries: string[] = [];

  // Generate XML entry for each temple page
  for (const pageKey of pagesToInclude) {
    const config = TEMPLE_PAGES_SITEMAP_CONFIG[pageKey];
    if (!config) continue;

    const loc = `${baseUrl}${config.path === '/' ? '' : config.path}`;
    const lastmod = config.lastmod ? formatSitemapDate(config.lastmod) : today;

    let alternateTags = '';
    if (includeAlternates) {
      alternateTags = `
    <xhtml:link rel="alternate" hreflang="kn" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`;
    }

    urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority.toFixed(1)}</priority>${alternateTags}
  </url>`);
  }

  // Include extra custom dynamic routes (e.g. festivals, special events from database)
  if (options.extraRoutes && options.extraRoutes.length > 0) {
    for (const extra of options.extraRoutes) {
      const loc = extra.path.startsWith('http') ? extra.path : `${baseUrl}${extra.path.startsWith('/') ? '' : '/'}${extra.path}`;
      const lastmod = extra.lastmod ? formatSitemapDate(extra.lastmod) : today;
      const changefreq = extra.changefreq || 'weekly';
      const priority = (extra.priority ?? 0.6).toFixed(1);

      urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  }

  // Complete XML output with schema namespace declarations
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<!-- Dynamic Sitemap for Shantamurthy Sri Shaneshwara Temple, Haadikere -->
<!-- Generated for search engine indexing: Google, Bing, Yahoo, Yandex, DuckDuckGo -->
${urlEntries.join('\n')}
</urlset>
`;
}

/**
 * Escapes XML special characters for safety in URLs and values
 */
function escapeXml(unsafeStr: string): string {
  return unsafeStr.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Utility to trigger client-side download of the generated sitemap.xml
 */
export function downloadSitemapXml(
  filename = 'sitemap.xml',
  options: SitemapGeneratorOptions = {}
): void {
  const xmlContent = generateSitemapXml(options);
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates robots.txt content referencing the canonical sitemap
 */
export function generateRobotsTxt(baseUrl?: string): string {
  const domain = resolveCanonicalBaseUrl(baseUrl);
  return `# Robots.txt for Shantamurthy Sri Shaneshwara Temple Haadikere
User-agent: *
Allow: /

# Sitemap Location
Sitemap: ${domain}/sitemap.xml
`;
}
