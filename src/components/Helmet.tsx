import React, { useEffect } from 'react';

export interface HelmetProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function Helmet({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: HelmetProps) {
  // Safe window location retrieval
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const defaultImage = '/src/assets/images/temple_hero_banner_1784204802858.jpg';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Document Title
    document.title = title;

    // Helper to set or update meta tag by name
    const updateMetaByName = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update meta tag by property
    const updateMetaByProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set Meta Tags
    updateMetaByName('description', description);
    if (keywords) {
      updateMetaByName('keywords', keywords);
    }
    
    updateMetaByProperty('og:title', ogTitle || title);
    updateMetaByProperty('og:description', ogDescription || description);
    updateMetaByProperty('og:type', 'website');
    updateMetaByProperty('og:url', currentUrl);
    updateMetaByProperty('og:image', ogImage || defaultImage);

    updateMetaByName('twitter:card', 'summary_large_image');
    updateMetaByName('twitter:title', ogTitle || title);
    updateMetaByName('twitter:description', ogDescription || description);
    updateMetaByName('twitter:image', ogImage || defaultImage);
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, currentUrl]);

  return null;
}
