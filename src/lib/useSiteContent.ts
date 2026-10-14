import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { SiteContent, SeoPageRow, composeContent } from './content';

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

const CACHE_KEY = 'shc:content:v1';

function readCache(): { content: Partial<SiteContent>; seo: SeoPageRow[] } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCache(content: Partial<SiteContent>, seo: SeoPageRow[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ content, seo })); } catch { /* storage full / private mode */ }
}

export async function fetchSiteContent(): Promise<{ rows: Partial<SiteContent>; seo: SeoPageRow[] } | null> {
  if (!supabase) return null;
  const [c, s] = await Promise.all([
    supabase.from('site_content').select('key,value'),
    supabase.from('seo_pages').select('*')
  ]);
  if (c.error && s.error) return null;       // tables not created yet -> keep built-in defaults
  const rows: Record<string, any> = {};
  (c.data || []).forEach((r: any) => { rows[r.key] = r.value; });
  return { rows: rows as Partial<SiteContent>, seo: (s.data as SeoPageRow[]) || [] };
}

export function useSiteContent() {
  const cached = typeof window !== 'undefined' ? readCache() : null;
  const [rows, setRows] = useState<Partial<SiteContent>>(cached?.content || {});
  const [seoRows, setSeoRows] = useState<SeoPageRow[]>(cached?.seo || []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetchSiteContent();
        if (!alive || !res) return;
        setRows(res.rows);
        setSeoRows(res.seo);
        writeCache(res.rows, res.seo);
      } finally {
        if (alive) setLoaded(true);
      }
    };
    load();
    // Pick up admin edits when the visitor returns to the tab
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { alive = false; document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  return { content: composeContent(rows), seoRows, loaded };
}
