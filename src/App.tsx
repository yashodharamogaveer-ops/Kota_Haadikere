import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import { 
  Menu, 
  X, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2, 
  Heart,
  ChevronDown,
  ArrowUp,
  Facebook,
  Instagram,
  Home,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
  Video,
  Image as ImageIcon,
  Maximize,
  Pin,
  Bell,
  BookOpen,
  Flame,
  Utensils,
  ShieldCheck
} from 'lucide-react';
import { translations, sevasList, chantsList, Language, PageType, Seva, Chant } from './types';
import { MandalaWatermark, CornerRangoli, SpiritualBannerBorder } from './components/SpiritualOrnaments';
import { Helmet } from './components/Helmet';
import { supabase } from './supabase';
import { LazyImage } from './components/LazyImage';
import { LazyVideo } from './components/LazyVideo';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';
import { LoadingSkeleton, EmptyState, ErrorState } from './components/DataStates';

// Import images using ESM to let Vite bundle and hash them correctly for production/dev environments
import shaniDevLogo from './assets/images/shani_dev_logo_1784204786723.jpg';
import heroBanner1 from './assets/images/hero_banner1_1784781843147.jpg';
import herBanner2 from './assets/images/her_banner2_1784781858123.jpg';
import heroBanner3 from './assets/images/hero_banner1_1784781843147.jpg';
import aboutPreviewPhoto from './assets/images/about_preview_1784781883857.jpg';
import aboutHeroPhoto from './assets/images/about_hero_1784781898397.jpg';
import galleryLamps from './assets/images/gallery_lamps_1784205248711.jpg';
import galleryPuja from './assets/images/gallery_puja_1784205264923.jpg';
import galleryShrine from './assets/images/gallery_shrine_1784205276240.jpg';
import galleryFestive from './assets/images/gallery_festive_1784205700881.jpg';
import galleryMisty from './assets/images/gallery_misty_1784205717145.jpg';
import marriageHallPhoto from './assets/images/marriage_hall_1784213413334.jpg';
import trusteePresidentPhoto from './assets/images/trustee_president_portrait_1784214644708.jpeg';
import trusteeAdminPhoto from './assets/images/trustee_admin_portrait_1784214658850.jpg';

const heroSlides = [
  {
    image: heroBanner1,
    captionKn: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶನೀಶ್ವರ ಜಾಗೃತ ತಾಣ",
    captionEn: "The historical holy temple shrine of Haadikere"
  },
  {
    image: herBanner2,
    captionKn: "ಹಚ್ಚ ಹಸಿರಿನ ಸುಂದರ ಪ್ರಕೃತಿಯ ನಡುವೆ ಕಂಗೊಳಿಸುತ್ತಿರುವ ದೇಗುಲ",
    captionEn: "Misty morning atmosphere of the sacred sanctuary"
  },
  {
    image: heroBanner3,
    captionKn: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶನೀಶ್ವರ ಜಾಗೃತ ತಾಣ",
    captionEn: "The historical holy temple shrine of Haadikere"
  }
];

// Helper function to format dates beautifully in Kannada and English languages
const formatDate = (dateStr: string, language: 'kn' | 'en') => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    if (language === 'kn') {
      return d.toLocaleDateString('kn-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (e) {
    return dateStr;
  }
};

// Helper function to clean and safely strip HTML tags from Supabase/database content
const cleanSupabaseHtml = (str: string) => {
  if (!str) return '';
  let cleaned = str;
  // Convert basic paragraph closing tags or line breaks to actual clean newlines
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  // Strip all other HTML tags
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
  // Unescape standard HTML entities for clean reading
  cleaned = cleaned.replace(/&nbsp;/g, ' ')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&ldquo;/g, '“')
                   .replace(/&rdquo;/g, '”')
                   .replace(/&lsquo;/g, '‘')
                   .replace(/&rsquo;/g, '’');
  
  // Collapse excessive multi-newlines into clean double-newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/ಶನೈಶ್ಚರ/g, 'ಶನೀಶ್ವರ');
  return cleaned.trim();
};

const normalizeKannadaName = (val: any): any => {
  if (typeof val === 'string') {
    return val.replace(/ಶನೈಶ್ಚರ/g, 'ಶನೀಶ್ವರ');
  }
  if (Array.isArray(val)) {
    return val.map(normalizeKannadaName);
  }
  if (val && typeof val === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(val)) {
      out[k] = normalizeKannadaName(val[k]);
    }
    return out;
  }
  return val;
};

// Breadcrumb Navigation Component
const Breadcrumb = ({ 
  currentPage, 
  navigateToPage, 
  lang, 
  t 
}: { 
  currentPage: PageType;
  navigateToPage: (page: PageType) => void;
  lang: Language;
  t: any;
}) => {
  if (currentPage === 'home') return null;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm font-medium mb-8 bg-stone-50 border border-stone-200/60 py-2 px-3.5 rounded-full w-fit shadow-xs relative z-20"
      aria-label="Breadcrumb"
    >
      <button 
        onClick={() => navigateToPage('home')}
        className="hover:text-saffron-600 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-stone-600"
      >
        <Home className="w-3.5 h-3.5 text-stone-500" />
        <span>{lang === 'kn' ? 'ಮುಖ್ಯ ಪುಟ' : 'Home'}</span>
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
      <span className="text-saffron-600 font-bold">
        {t.nav[currentPage]}
      </span>
    </motion.nav>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('kn');
  
  // Supabase live settings, committee members, sevas, gallery, and announcements state
  const [settings, setSettings] = useState<any>(null);
  const [trustees, setTrustees] = useState<any[]>([]);
  const [dbSevas, setDbSevas] = useState<any[]>([]);
  const [dbGallery, setDbGallery] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [aboutFeatures, setAboutFeatures] = useState<any[]>([]);
  const [dbHistory, setDbHistory] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isTrusteesLoading, setIsTrusteesLoading] = useState(true);
  const [isSevasLoading, setIsSevasLoading] = useState(true);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(true);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [isAboutFeaturesLoading, setIsAboutFeaturesLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Granular error states for retry handling
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [trusteesError, setTrusteesError] = useState<string | null>(null);
  const [sevasError, setSevasError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [aboutFeaturesError, setAboutFeaturesError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Individual Fetch / Retry Functions
  const fetchSettingsData = async () => {
    if (!supabase) {
      setIsSettingsLoading(false);
      return;
    }
    setIsSettingsLoading(true);
    setSettingsError(null);
    try {
      const { data: settingsData, error: err } = await supabase
        .from('temple_profile')
        .select('*, whatsapp_number:whatsapp, phone_number:phone')
        .maybeSingle();

      if (err) {
        setSettingsError(err.message || 'Failed to load profile');
      } else if (settingsData) {
        setSettings(normalizeKannadaName(settingsData));
      }
    } catch (err: any) {
      setSettingsError(err?.message || 'Network error');
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const fetchTrusteesData = async () => {
    if (!supabase) {
      setIsTrusteesLoading(false);
      return;
    }
    setIsTrusteesLoading(true);
    setTrusteesError(null);
    try {
      const { data: trusteesData, error: err } = await supabase
        .from('committee_members')
        .select('*, name:name_en, role:designation_en, role_kn:designation_kn')
        .filter('is_active', 'eq', true)
        .order('sort_order', { ascending: true });

      if (err) {
        setTrusteesError(err.message || 'Failed to load committee members');
      } else {
        setTrustees(normalizeKannadaName(trusteesData || []));
      }
    } catch (err: any) {
      setTrusteesError(err?.message || 'Network error');
    } finally {
      setIsTrusteesLoading(false);
    }
  };

  const fetchSevasData = async () => {
    if (!supabase) {
      setIsSevasLoading(false);
      return;
    }
    setIsSevasLoading(true);
    setSevasError(null);
    try {
      const { data: sevasData, error: err } = await supabase
        .from('sevas')
        .select('*, name:title_en, name_kn:title_kn, description:description_en')
        .filter('is_active', 'eq', true)
        .order('sort_order', { ascending: true });

      if (err) {
        setSevasError(err.message || 'Failed to load sevas');
      } else {
        setDbSevas(normalizeKannadaName(sevasData || []));
      }
    } catch (err: any) {
      setSevasError(err?.message || 'Network error');
    } finally {
      setIsSevasLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    if (!supabase) {
      setIsGalleryLoading(false);
      return;
    }
    setIsGalleryLoading(true);
    setGalleryError(null);
    try {
      const { data: galleryData, error: err } = await supabase
        .from('media_items')
        .select('*, type:kind, caption:caption_en')
        .order('created_at', { ascending: false });

      if (err) {
        setGalleryError(err.message || 'Failed to load gallery');
      } else {
        setDbGallery(normalizeKannadaName(galleryData || []));
      }
    } catch (err: any) {
      setGalleryError(err?.message || 'Network error');
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const fetchAnnouncementsData = async () => {
    if (!supabase) {
      setIsAnnouncementsLoading(false);
      return;
    }
    setIsAnnouncementsLoading(true);
    setAnnouncementsError(null);
    try {
      const { data: announcementsData, error: err } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        setAnnouncementsError(err.message || 'Failed to load announcements');
      } else {
        setAnnouncements(normalizeKannadaName(announcementsData || []));
      }
    } catch (err: any) {
      setAnnouncementsError(err?.message || 'Network error');
    } finally {
      setIsAnnouncementsLoading(false);
    }
  };

  const fetchNotificationsData = async () => {
    if (!supabase) {
      setIsNotificationsLoading(false);
      return;
    }
    setIsNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const { data: notificationsData, error: err } = await supabase
        .from('notifications')
        .select('*, title:title_en, message:message_en')
        .filter('is_active', 'eq', true)
        .order('created_at', { ascending: false });

      if (err) {
        setNotificationsError(err.message || 'Failed to load notifications');
      } else {
        setNotifications(normalizeKannadaName(notificationsData || []));
      }
    } catch (err: any) {
      setNotificationsError(err?.message || 'Network error');
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const fetchEventsData = async () => {
    if (!supabase) {
      setIsEventsLoading(false);
      return;
    }
    setIsEventsLoading(true);
    setEventsError(null);
    try {
      const { data: eventsData, error: err } = await supabase
        .from('events')
        .select('*, title:title_en, description:description_en, poster_url:image_url')
        .order('event_date', { ascending: true });

      if (err) {
        setEventsError(err.message || 'Failed to load events');
      } else {
        setEvents(normalizeKannadaName(eventsData || []));
      }
    } catch (err: any) {
      setEventsError(err?.message || 'Network error');
    } finally {
      setIsEventsLoading(false);
    }
  };

  const fetchAboutFeaturesData = async () => {
    if (!supabase) {
      setIsAboutFeaturesLoading(false);
      return;
    }
    setIsAboutFeaturesLoading(true);
    setAboutFeaturesError(null);
    try {
      const { data: featuresData, error: err } = await supabase
        .from('about_features')
        .select('*')
        .order('id', { ascending: true });

      if (err) {
        setAboutFeaturesError(err.message || 'Failed to load features');
      } else {
        setAboutFeatures(normalizeKannadaName(featuresData || []));
      }
    } catch (err: any) {
      setAboutFeaturesError(err?.message || 'Network error');
    } finally {
      setIsAboutFeaturesLoading(false);
    }
  };

  const fetchHistoryData = async () => {
    if (!supabase) {
      setIsHistoryLoading(false);
      return;
    }
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const { data: historyData, error: err } = await supabase
        .from('temple_history')
        .select('*, title:title_en, content:content_en, year:era_year')
        .order('sort_order', { ascending: true });

      if (err) {
        setHistoryError(err.message || 'Failed to load temple history');
      } else {
        setDbHistory(historyData && historyData.length > 0 ? normalizeKannadaName(historyData) : null);
      }
    } catch (err: any) {
      setHistoryError(err?.message || 'Network error');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSettingsData();
    fetchTrusteesData();
    fetchSevasData();
    fetchGalleryData();
    fetchAnnouncementsData();
    fetchNotificationsData();
    fetchEventsData();
    fetchAboutFeaturesData();
    fetchHistoryData();
  }, []);

  // Helper to parse page from current URL (with catch-all 404 handling)
  const getPageFromUrl = (): PageType => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    // Check specific known routes first
    if (path.includes('privacy') || hash.includes('privacy')) {
      return 'privacy';
    }
    if (path === '/about' || hash === '#about' || path.startsWith('/about')) return 'about';
    if (path === '/gallery' || hash === '#gallery' || path.startsWith('/gallery')) return 'gallery';
    if (path === '/seva' || hash === '#seva' || path.startsWith('/seva')) return 'seva';
    if (path === '/contact' || hash === '#contact' || path.startsWith('/contact')) return 'contact';

    // Root paths
    if (path === '/' || path === '' || path === '/home' || path === '/index.html') {
      if (hash === '#home' || hash === '#' || hash === '') {
        return 'home';
      }
      if (hash.includes('about')) return 'about';
      if (hash.includes('gallery')) return 'gallery';
      if (hash.includes('seva')) return 'seva';
      if (hash.includes('contact')) return 'contact';
      if (hash.includes('privacy')) return 'privacy';
      if (hash === '#404' || hash === '#notfound') return 'notfound';
      return 'home';
    }

    // Explicit 404 routes
    if (path === '/404' || path === '/notfound' || hash === '#404') return 'notfound';

    // Catch-all: Any unrecognized route becomes 404 Not Found
    return 'notfound';
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromUrl);

  // Synchronize browser URL on popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromUrl();
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Interactive Seva State
  const [selectedSevas, setSelectedSevas] = useState<Seva[]>([]);
  const [isSankalpaOpen, setIsSankalpaOpen] = useState(false);
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteeGotra, setDevoteeGotra] = useState('');
  const [devoteeNakshatra, setDevoteeNakshatra] = useState('');
  const [sankalpaSuccess, setSankalpaSuccess] = useState(false);

  // Audio Chant Generator State
  const [playingChantId, setPlayingChantId] = useState<string | null>(null);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Contact Form State & Spam Protection
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactHoneypot, setContactHoneypot] = useState('');
  const [contactFormErrors, setContactFormErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [contactTouched, setContactTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; message?: boolean }>({});
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const contactFormRenderTimeRef = useRef<number>(Date.now());

  // Reset contact form render timestamp when viewing pages
  useEffect(() => {
    contactFormRenderTimeRef.current = Date.now();
  }, [currentPage]);

  // UI Utilities State
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<{ id: number; type: 'image' | 'video'; src: string; caption: string } | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxImageRef = useRef<HTMLImageElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeGalleryTab, setActiveGalleryTab] = useState<'images' | 'videos'>('images');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isEventPosterZoomed, setIsEventPosterZoomed] = useState(false);

  // Mobile Double-Tap & Click Media Handler
  const lastTapTimeRef = useRef<number>(0);
  const handleMediaItemClick = (item: { id: number; type: 'image' | 'video'; src: string; caption: string }) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected: Open in full display lightbox and toggle full screen
      setZoomLevel(1);
      setActiveLightboxItem(item);
      toggleAppFullScreen();
    } else {
      // Single tap / click: Open in lightbox modal
      setZoomLevel(1);
      setActiveLightboxItem(item);
      if (window.innerWidth < 1024) {
        toggleAppFullScreen();
      }
    }
    lastTapTimeRef.current = now;
  };

  // Lightbox Image Double Tap Handler (toggles 2x zoom and full screen)
  const handleLightboxImageClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      setZoomLevel(prev => (prev > 1 ? 1 : 2.2));
      toggleAppFullScreen();
    } else {
      toggleAppFullScreen();
    }
    lastTapTimeRef.current = now;
  };

  // Automatic Hero Carousel Transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // Transitions every 6 seconds
    return () => clearInterval(timer);
  }, [currentSlide]);

  // GSAP Section Refs
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const historySectionRef = useRef<HTMLDivElement | null>(null);
  const homeGallerySectionRef = useRef<HTMLDivElement | null>(null);
  const homeEventsSectionRef = useRef<HTMLDivElement | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const gallerySectionRef = useRef<HTMLDivElement | null>(null);
  const sevaSectionRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const privacySectionRef = useRef<HTMLDivElement | null>(null);

  // Global ScrollTrigger mobile optimization
  useEffect(() => {
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });
  }, []);

  // GSAP Refresh when dynamic asynchronous data resolves from Supabase
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [
    isHistoryLoading,
    isGalleryLoading,
    isEventsLoading,
    isSevasLoading,
    isTrusteesLoading,
    dbGallery,
    dbHistory,
    events,
    dbSevas,
    trustees,
    currentPage,
    activeGalleryTab
  ]);

  // GSAP ScrollTrigger Animations for Home Page (Hero, History, Gallery Preview, Events)
  useEffect(() => {
    if (currentPage === 'home') {
      const mm = gsap.matchMedia();

      // Desktop Viewports (>= 768px): preserves existing desktop animation behavior and timing
        mm.add("(min-width: 768px)", () => {
          // 1. Hero text entrance animation
          if (heroTextRef.current) {
            gsap.fromTo(
              heroTextRef.current.children,
              { opacity: 0, y: 25, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          // 2. History section entrance animation (Desktop)
          if (historySectionRef.current) {
            const leftEl = historySectionRef.current.querySelector('.gsap-history-left');
            const rightEl = historySectionRef.current.querySelector('.gsap-history-right');
            if (leftEl) {
              gsap.fromTo(
                leftEl,
                { opacity: 0, y: 30, scale: 0.98 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.6,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: historySectionRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
            if (rightEl) {
              gsap.fromTo(
                rightEl,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  delay: 0.08,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: historySectionRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }

          // 3. Home Gallery Preview section entrance animation (Desktop)
          if (homeGallerySectionRef.current) {
            const galleryItems = homeGallerySectionRef.current.querySelectorAll('.gsap-home-gallery-item');
            if (galleryItems && galleryItems.length > 0) {
              gsap.fromTo(
                galleryItems,
                { opacity: 0, y: 30, scale: 0.97 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: homeGallerySectionRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }

          // 4. Upcoming Events section entrance animation (Desktop)
          if (homeEventsSectionRef.current) {
            const eventItems = homeEventsSectionRef.current.querySelectorAll('.gsap-events-item');
            if (eventItems && eventItems.length > 0) {
              gsap.fromTo(
                eventItems,
                { opacity: 0, y: 30, scale: 0.98 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.6,
                  stagger: 0.08,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: homeEventsSectionRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }
        });

        // Mobile Viewports (< 768px): snappier, reduced y-offset (18px), scale-in (0.95 -> 1), early trigger ('top 95%')
        mm.add("(max-width: 767px)", () => {
          // 1. Hero text entrance animation
          if (heroTextRef.current) {
            gsap.fromTo(
              heroTextRef.current.children,
              { opacity: 0, y: 18, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          // 2. History section entrance animation (Mobile)
          if (historySectionRef.current) {
            const leftEl = historySectionRef.current.querySelector('.gsap-history-left');
            const rightEl = historySectionRef.current.querySelector('.gsap-history-right');
            if (leftEl) {
              gsap.fromTo(
                leftEl,
                { opacity: 0, y: 18, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.48,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: historySectionRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
            if (rightEl) {
              gsap.fromTo(
                rightEl,
                { opacity: 0, y: 18, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.48,
                  delay: 0.04,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: historySectionRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }

          // 3. Home Gallery Preview section entrance animation (Mobile)
          if (homeGallerySectionRef.current) {
            const galleryItems = homeGallerySectionRef.current.querySelectorAll('.gsap-home-gallery-item');
            if (galleryItems && galleryItems.length > 0) {
              gsap.fromTo(
                galleryItems,
                { opacity: 0, y: 18, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.46,
                  stagger: 0.05,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: homeGallerySectionRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }

          // 4. Upcoming Events section entrance animation (Mobile)
          if (homeEventsSectionRef.current) {
            const eventItems = homeEventsSectionRef.current.querySelectorAll('.gsap-events-item');
            if (eventItems && eventItems.length > 0) {
              gsap.fromTo(
                eventItems,
                { opacity: 0, y: 18, scale: 0.95 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.48,
                  stagger: 0.05,
                  ease: 'power2.out',
                  clearProps: 'transform,opacity',
                  scrollTrigger: {
                    trigger: homeEventsSectionRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }
        });
      return () => mm.revert();
    }
  }, [currentPage, isGalleryLoading, isEventsLoading]);

  // GSAP ScrollTrigger Animations for About Page (Header, Floated Story, Timings/Guidelines, Kalyana Mantapa)
  useEffect(() => {
    if (currentPage === 'about' && aboutSectionRef.current) {
      const mm = gsap.matchMedia(aboutSectionRef);

      // Desktop Viewports (>= 768px): preserves existing desktop animation behavior and timing
        mm.add("(min-width: 768px)", () => {
          // About Header & Main Story Narrative
          const storyItems = aboutSectionRef.current?.querySelectorAll('.gsap-about-item');
          if (storyItems && storyItems.length > 0) {
            gsap.fromTo(
              storyItems,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: aboutSectionRef.current,
                  start: 'top 92%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Darshan timings & devotee guidelines 3 cards
          const noticeCards = aboutSectionRef.current?.querySelectorAll('.gsap-about-card');
          if (noticeCards && noticeCards.length > 0) {
            gsap.fromTo(
              noticeCards,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: noticeCards[0],
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Kalyana Mantapa (Shantamurthi Sabhabhavana) Section
          const mantapaItems = aboutSectionRef.current?.querySelectorAll('.gsap-about-mantapa');
          if (mantapaItems && mantapaItems.length > 0) {
            gsap.fromTo(
              mantapaItems,
              { opacity: 0, y: 30, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.07,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: mantapaItems[0],
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Mobile Viewports (< 768px): snappier, reduced y-offset (18px), scale-in (0.95 -> 1), early trigger ('top 95%')
        mm.add("(max-width: 767px)", () => {
          // About Header & Main Story Narrative
          const storyItems = aboutSectionRef.current?.querySelectorAll('.gsap-about-item');
          if (storyItems && storyItems.length > 0) {
            gsap.fromTo(
              storyItems,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: aboutSectionRef.current,
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Darshan timings & devotee guidelines 3 cards
          const noticeCards = aboutSectionRef.current?.querySelectorAll('.gsap-about-card');
          if (noticeCards && noticeCards.length > 0) {
            gsap.fromTo(
              noticeCards,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.46,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: noticeCards[0],
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Kalyana Mantapa (Shantamurthi Sabhabhavana) Section
          const mantapaItems = aboutSectionRef.current?.querySelectorAll('.gsap-about-mantapa');
          if (mantapaItems && mantapaItems.length > 0) {
            gsap.fromTo(
              mantapaItems,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: mantapaItems[0],
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      return () => mm.revert();
    }
  }, [currentPage, isHistoryLoading]);

  // GSAP ScrollTrigger Animations for Gallery Page (Header, Tabs, Media Grid)
  useEffect(() => {
    if (currentPage === 'gallery' && gallerySectionRef.current) {
      const mm = gsap.matchMedia(gallerySectionRef);

      // Desktop Viewports (>= 768px): preserves existing desktop animation behavior and timing
        mm.add("(min-width: 768px)", () => {
          // Gallery Header and Tabs
          const headers = gallerySectionRef.current?.querySelectorAll('.gsap-gallery-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          // Photo / Video Grid Cards
          const cards = gallerySectionRef.current?.querySelectorAll('.gsap-gallery-card');
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 28, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: gallerySectionRef.current,
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Mobile Viewports (< 768px): snappier, reduced y-offset (18px), scale-in (0.95 -> 1), early trigger ('top 95%')
        mm.add("(max-width: 767px)", () => {
          // Gallery Header and Tabs
          const headers = gallerySectionRef.current?.querySelectorAll('.gsap-gallery-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          // Photo / Video Grid Cards
          const cards = gallerySectionRef.current?.querySelectorAll('.gsap-gallery-card');
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                stagger: 0.04,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: gallerySectionRef.current,
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      return () => mm.revert();
    }
  }, [currentPage, activeGalleryTab, isGalleryLoading]);

  // GSAP ScrollTrigger Animations for Seva Page (Header, Sevas Table, Calculation Card)
  useEffect(() => {
    if (currentPage === 'seva' && sevaSectionRef.current) {
      const mm = gsap.matchMedia(sevaSectionRef);

      // Desktop Viewports (>= 768px): preserves existing desktop animation behavior and timing
        mm.add("(min-width: 768px)", () => {
          const headers = sevaSectionRef.current?.querySelectorAll('.gsap-seva-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          const cards = sevaSectionRef.current?.querySelectorAll('.gsap-seva-card');
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: sevaSectionRef.current,
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Mobile Viewports (< 768px): snappier, reduced y-offset (18px), scale-in (0.95 -> 1), early trigger ('top 95%')
        mm.add("(max-width: 767px)", () => {
          const headers = sevaSectionRef.current?.querySelectorAll('.gsap-seva-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          const cards = sevaSectionRef.current?.querySelectorAll('.gsap-seva-card');
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: sevaSectionRef.current,
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      return () => mm.revert();
    }
  }, [currentPage, isSevasLoading]);

  // GSAP ScrollTrigger Animations for Contact Page (Header, Info Cards, Form, Map, Trustees)
  useEffect(() => {
    if (currentPage === 'contact' && contactSectionRef.current) {
      const mm = gsap.matchMedia(contactSectionRef);

      // Desktop Viewports (>= 768px): preserves existing desktop animation behavior and timing
        mm.add("(min-width: 768px)", () => {
          const headers = contactSectionRef.current?.querySelectorAll('.gsap-contact-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          const contactCards = contactSectionRef.current?.querySelectorAll('.gsap-contact-card');
          if (contactCards && contactCards.length > 0) {
            gsap.fromTo(
              contactCards,
              { opacity: 0, y: 28, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: contactSectionRef.current,
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          const formEl = contactSectionRef.current?.querySelector('.gsap-contact-form');
          if (formEl) {
            gsap.fromTo(
              formEl,
              { opacity: 0, y: 30, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: formEl,
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          const trusteeCards = contactSectionRef.current?.querySelectorAll('.gsap-trustee-card');
          if (trusteeCards && trusteeCards.length > 0) {
            gsap.fromTo(
              trusteeCards,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: trusteeCards[0],
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });

        // Mobile Viewports (< 768px): snappier, reduced y-offset (18px), scale-in (0.95 -> 1), early trigger ('top 95%')
        mm.add("(max-width: 767px)", () => {
          const headers = contactSectionRef.current?.querySelectorAll('.gsap-contact-header');
          if (headers && headers.length > 0) {
            gsap.fromTo(
              headers,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity'
              }
            );
          }

          const contactCards = contactSectionRef.current?.querySelectorAll('.gsap-contact-card');
          if (contactCards && contactCards.length > 0) {
            gsap.fromTo(
              contactCards,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: contactSectionRef.current,
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          const formEl = contactSectionRef.current?.querySelector('.gsap-contact-form');
          if (formEl) {
            gsap.fromTo(
              formEl,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: formEl,
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          const trusteeCards = contactSectionRef.current?.querySelectorAll('.gsap-trustee-card');
          if (trusteeCards && trusteeCards.length > 0) {
            gsap.fromTo(
              trusteeCards,
              { opacity: 0, y: 18, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.48,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform,opacity',
                scrollTrigger: {
                  trigger: trusteeCards[0],
                  start: 'top 95%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      return () => mm.revert();
    }
  }, [currentPage, isTrusteesLoading]);

  // GSAP Animation for Privacy Policy Page
  useEffect(() => {
    if (currentPage === 'privacy' && privacySectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          privacySectionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          }
        );
      }, privacySectionRef);
      return () => ctx.revert();
    }
  }, [currentPage]);

  // GSAP Mobile Screen Mode: Staggered animation when mobile menu opens
  useEffect(() => {
    if (isMenuOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      gsap.fromTo(
        '.gsap-mobile-nav-item',
        { opacity: 0, x: -22, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.32, stagger: 0.05, ease: 'back.out(1.4)' }
      );
    }
  }, [isMenuOpen]);

  // GSAP Mobile Screen Mode: Tactile touch-press micro-interactions on cards & interactive elements
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      const touchCards = document.querySelectorAll<HTMLElement>(
        '.gsap-touch-interactive, .gsap-seva-card, .gsap-gallery-card, .gsap-trustee-card, .gsap-about-card, .gsap-events-item'
      );
      const cleanups: (() => void)[] = [];

      touchCards.forEach((card) => {
        const onTouchStart = () => {
          gsap.to(card, { scale: 0.97, duration: 0.12, ease: 'power2.out' });
        };
        const onTouchEnd = () => {
          gsap.to(card, { scale: 1, duration: 0.22, ease: 'back.out(2)' });
        };

        card.addEventListener('touchstart', onTouchStart, { passive: true });
        card.addEventListener('touchend', onTouchEnd, { passive: true });
        card.addEventListener('touchcancel', onTouchEnd, { passive: true });

        cleanups.push(() => {
          card.removeEventListener('touchstart', onTouchStart);
          card.removeEventListener('touchend', onTouchEnd);
          card.removeEventListener('touchcancel', onTouchEnd);
        });
      });

      return () => {
        cleanups.forEach((c) => c());
      };
    });

    return () => mm.revert();
  }, [currentPage, isSevasLoading, isGalleryLoading, isEventsLoading, isTrusteesLoading]);

  const t = translations[lang];

  // Given exact Google Maps URL for Shantamurti Shanishwar Convention Hall
  const CANONICAL_SHANTAMURTI_DIRECTIONS_URL = "https://maps.app.goo.gl/wafQnU8wtXiP43dL9";
  const TEMPLE_MAP_SHARE_URL = "https://maps.app.goo.gl/wafQnU8wtXiP43dL9";

  // Canonical Google Maps embed URL strictly for Shantamurti Shanishwar Convention Hall (Kota Haadikere Nagabana)
  const CANONICAL_SHANTAMURTI_MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.1692974075495!2d74.7048578748017!3d13.525199802500058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc970046bdb13d%3A0x154bc51d87e73d67!2sShantamurti%20shanishwar%20convention%20hall!5e0!3m2!1sen!2sin!4v1784817529778!5m2!1sen!2sin";

  const getValidMapEmbedUrl = (rawUrl?: string): string => {
    // Strictly validate against canonical Shantamurti Shanishwar Convention Hall embed to prevent incorrect redirections
    if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim()) {
      let url = rawUrl.trim();
      if (url.includes('<iframe')) {
        const match = url.match(/src=["']([^"']+)["']/i);
        if (match && match[1]) {
          url = match[1];
        }
      }
      if (
        (url.includes('google.com/maps/embed') || url.includes('output=embed')) &&
        (url.includes('0x3bbc970046bdb13d') || url.includes('Shantamurti') || url.includes('shanishwar') || url.includes('Haadikere'))
      ) {
        return url;
      }
    }
    // Strictly return the canonical embed URL for Shantamurti Shanishwar Convention Hall
    return CANONICAL_SHANTAMURTI_MAP_EMBED_URL;
  };

  const templeDirectionsUrl = CANONICAL_SHANTAMURTI_DIRECTIONS_URL;
  
  // Combine notifications and announcements dynamically from Supabase, resolving column types & language fallback
  const allNotifications = [
    ...(notifications || []).map((n, idx) => ({
      id: n.id || `notif-${idx}`,
      text: lang === 'kn'
        ? (n.message_kn || n.text_kn || n.content_kn || n.title_kn || n.message || n.text || n.content || n.title || '').trim()
        : (n.message || n.text || n.content || n.title || n.message_kn || n.text_kn || n.content_kn || n.title_kn || '').trim(),
      created_at: n.created_at
    })),
    ...(announcements || []).map((a, idx) => ({
      id: a.id || `ann-${idx}`,
      text: lang === 'kn'
        ? (a.message_kn || a.text_kn || a.content_kn || a.title_kn || a.message || a.text || a.content || a.title || '').trim()
        : (a.message || a.text || a.content || a.title || a.message_kn || a.text_kn || a.content_kn || a.title_kn || '').trim(),
      created_at: a.created_at
    }))
  ].filter(item => item.text && item.text !== '');
  const rawSevas = supabase ? dbSevas : (dbSevas.length > 0 ? dbSevas : sevasList[lang]);
  const sevas = rawSevas.map(s => {
    // Robust price/amount/cost extractor to prevent any NaN values from Supabase schema/data
    const extractPriceValue = (item: any): number => {
      if (!item) return 0;
      const possibleKeys = ['price', 'amount', 'cost', 'seva_price', 'seva_amount', 'charge', 'charges', 'fee', 'fees', 'rate', 'value'];
      
      let rawVal: any = undefined;
      for (const key of possibleKeys) {
        if (item[key] !== undefined && item[key] !== null) {
          rawVal = item[key];
          break;
        }
      }
      
      if (rawVal === undefined || rawVal === null) {
        const keys = Object.keys(item);
        for (const key of keys) {
          const lowerKey = key.toLowerCase();
          if (possibleKeys.some(pk => lowerKey.includes(pk))) {
            rawVal = item[key];
            break;
          }
        }
      }
      
      let num = NaN;
      if (typeof rawVal === 'number') {
        num = rawVal;
      } else if (typeof rawVal === 'string') {
        const cleanStr = rawVal.replace(/[^\d.]/g, '');
        num = parseFloat(cleanStr);
      }
      
      if (isNaN(num) || num <= 0) {
        const sId = item.id?.toString().toLowerCase() || '';
        const sName = (item.name || item.name_kn || '').toLowerCase();
        const fallbackItem = 
          sevasList['en'].find(fallback => fallback.id?.toLowerCase() === sId || sName.includes(fallback.id?.toLowerCase()) || fallback.name?.toLowerCase().includes(sName)) ||
          sevasList['kn'].find(fallback => fallback.id?.toLowerCase() === sId || fallback.name?.toLowerCase().includes(sName));
        if (fallbackItem) {
          return fallbackItem.price;
        }
      }
      
      return isNaN(num) ? 50 : num;
    };

    return {
      id: s.id?.toString(),
      name: lang === 'kn' ? (s.name_kn || s.name) : (s.name || s.name_kn),
      price: extractPriceValue(s),
      description: lang === 'kn' ? (s.description_kn || s.description || '') : (s.description || s.description_kn || '')
    };
  });

  const chants = chantsList[lang];

  const defaultGalleryItems = [
    {
      id: 1,
      type: 'image',
      src: galleryLamps,
      caption_kn: "ದೇವಸ್ಥಾನದ ಗರ್ಭಗುಡಿಯ ದೀಪಾಲಂಕಾರ",
      caption: "Divine lamp lighting inside the temple garbhagriha"
    },
    {
      id: 2,
      type: 'image',
      src: galleryPuja,
      caption_kn: "ಶ್ರೀ ಶನೀಶ್ವರ ಸ್ವಾಮಿಗೆ ಜರುಗಿದ ವಿಶೇಷ ಮಹಾ ಪೂಜೆ",
      caption: "Special Maha Puja and decoration of Shri Shaneshwara Swamy"
    },
    {
      id: 3,
      type: 'image',
      src: galleryShrine,
      caption_kn: "ದೇವಸ್ಥಾನದ ಭವ್ಯ ಮುಖದ್ವಾರ ಮತ್ತು ಗೋಪುರ",
      caption: "The majestic entrance and gopuram of the temple shrine"
    },
    {
      id: 4,
      type: 'image',
      src: galleryFestive,
      caption_kn: "ಲಕ್ಷದೀಪೋತ್ಸವ ಹಬ್ಬದ ಅದ್ಧೂರಿ ಸಂಭ್ರಮ",
      caption: "Grand celebration of the traditional Lakhadeepotsava festival"
    },
    {
      id: 5,
      type: 'image',
      src: galleryMisty,
      caption_kn: "ಪವಿತ್ರ ಪರಿಸರದಲ್ಲಿ ಮುಂಜಾನೆಯ ದಿವ್ಯ ದರ್ಶನ",
      caption: "Sacred and serene misty morning view of the temple complex"
    }
  ];

  const rawGallery = supabase ? dbGallery : (dbGallery && dbGallery.length > 0 ? dbGallery : defaultGalleryItems);
  const galleryItems = rawGallery.map((g, idx) => {
    const src = g.src || g.image_url || g.url || g.video_url || g.media_url || '';
    const isVideo = g.type === 'video' || 
                    (g.video_url ? true : false) || 
                    (typeof src === 'string' && (
                      src.endsWith('.mp4') || 
                      src.endsWith('.webm') || 
                      src.endsWith('.ogg') ||
                      src.includes('youtube.com') || 
                      src.includes('youtu.be')
                    ));
    return {
      id: g.id || idx,
      type: isVideo ? 'video' : 'image',
      src: src,
      caption: lang === 'kn' ? (g.caption_kn || g.caption || '') : (g.caption || g.caption_kn || ''),
      poster: g.poster || g.thumbnail_url || g.preview_url || undefined
    };
  });

  const displayEvents = events || [];

  const defaultTrustees = [
    {
      id: 't-1',
      role: "President / Founder Trustee",
      role_kn: "ಅಧ್ಯಕ್ಷರು ಮತ್ತು ಸಂಸ್ಥಾಪಕ ಧರ್ಮದರ್ಶಿಗಳು",
      name: "Sri. K Bhaskar",
      name_kn: "ಶ್ರೀ ಕೆ. ಭಾಸ್ಕರ್",
      photo_url: trusteePresidentPhoto,
      phone: "+91 99022 07990",
      email: "shanthamoorthyshaneshwara1995@gmil.com"
    },
    {
      id: 't-2',
      role: "Pradhana Archaka",
      role_kn: "ಪ್ರಧಾನ ಅರ್ಚಕರು",
      name: "Jayraj Saliyan",
      name_kn: "ಜಯರಾಜ್ ಸಾಲ್ಯಾನ್",
      photo_url: trusteeAdminPhoto,
      phone: "+91 87929 78777",
      email: "shanthamoorthyshaneshwara1995@gmil.com"
    }
  ];

  const rawTrustees = (trustees && trustees.length > 0) ? trustees : defaultTrustees;

  const displayTrustees = rawTrustees.map((member) => {
    const isPresident = member.id === 't-1' || 
                        (member.role && member.role.toLowerCase().includes('president')) ||
                        (member.role_kn && member.role_kn.includes('ಅಧ್ಯಕ್ಷರು'));
    
    if (isPresident) {
      return {
        ...member,
        name: member.name || "Sri. K Bhaskar",
        name_kn: member.name_kn || "ಶ್ರೀ ಕೆ. ಭಾಸ್ಕರ್",
        role: member.role || "President / Founder Trustee",
        role_kn: member.role_kn || "ಅಧ್ಯಕ್ಷರು ಮತ್ತು ಸಂಸ್ಥಾಪಕ ಧರ್ಮದರ್ಶಿಗಳು",
        photo_url: member.photo_url || trusteePresidentPhoto,
        phone: member.phone || "+91 99022 07990",
        email: member.email || "shanthamoorthyshaneshwara1995@gmil.com"
      };
    }

    const isSecretaryOrArchaka = member.id === 't-2' ||
                                 (member.role && (member.role.toLowerCase().includes('secretary') || member.role.toLowerCase().includes('archaka'))) ||
                                 (member.role_kn && (member.role_kn.includes('ಕಾರ್ಯದರ್ಶಿಗಳು') || member.role_kn.includes('ಅರ್ಚಕರು')));

    if (isSecretaryOrArchaka) {
      return {
        ...member,
        role: member.role || "Pradhana Archaka",
        role_kn: member.role_kn || "ಪ್ರಧಾನ ಅರ್ಚಕರು",
        name: member.name || "Jayraj Saliyan",
        name_kn: member.name_kn || "ಜಯರಾಜ್ ಸಾಲ್ಯಾನ್",
        photo_url: member.photo_url || trusteeAdminPhoto,
        phone: member.phone || "+91 87929 78777",
        email: member.email || "admin@haadikereshanitemple.org"
      };
    }

    return member;
  });

  const aboutFeaturesList = aboutFeatures.length > 0
    ? aboutFeatures.map((f, i) => ({
        title: lang === 'kn' ? (f.title_kn || f.title) : (f.title || f.title_kn),
        desc: lang === 'kn' ? (f.desc_kn || f.desc) : (f.desc || f.desc_kn)
      }))
    : t.about.features;

  const galleryImages = galleryItems.filter(item => item.type === 'image');
  const galleryVideos = galleryItems.filter(item => item.type === 'video');

  // Tracking Scroll to make navbar sticky and show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAppFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch((err) => console.log("Fullscreen request rejected:", err));
        } else if ((docEl as any).webkitRequestFullscreen) {
          (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).msRequestFullscreen) {
          (docEl as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed:", e);
    }
  };

  // Automatically exit full screen when lightbox item closes
  useEffect(() => {
    if (!activeLightboxItem && document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } catch (e) {
        console.warn("Exit fullscreen failed:", e);
      }
    }
  }, [activeLightboxItem]);

  // Language toggler
  const toggleLanguage = () => {
    setLang(prev => (prev === 'kn' ? 'en' : 'kn'));
    // Clear seva selections when language changes to ensure aligned localized data
    setSelectedSevas([]);
  };

  // Web Audio API Spiritual Bell Synth
  const playTempleBell = () => {
    try {
      setIsBellRinging(true);
      setTimeout(() => setIsBellRinging(false), 800);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Play a harmonious triple-tone temple bell
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(293.66, now); // D4 (Calming bell note)
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(369.99, now); // F#4 (Major third harmonic)
      
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(587.33, now); // D5 (Bright bell ring)

      gainNode.gain.setValueAtTime(0.4, now);
      // Exponential decay to create beautiful fading resonance
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc3.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 3.5);
      osc2.stop(now + 3.5);
      osc3.stop(now + 3.5);
    } catch (e) {
      console.warn("Audio Context not allowed or supported yet:", e);
    }
  };

  // Web Audio API Meditative Hum (Om Drone) player
  const startChantDrone = (frequency: number) => {
    try {
      stopChantDrone();

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.0); // smooth fade in
      gainNodeRef.current = gainNode;

      // Deep Root Drone (110Hz - A2)
      const droneOsc1 = ctx.createOscillator();
      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Low Perfect Fifth (165Hz - E3) for spiritual harmony
      const droneOsc2 = ctx.createOscillator();
      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime);

      // Subtle warm triangle overtone for voice feeling
      const overtoneOsc = ctx.createOscillator();
      overtoneOsc.type = 'triangle';
      overtoneOsc.frequency.setValueAtTime(frequency * 2.0, ctx.currentTime);

      droneOsc1.connect(gainNode);
      droneOsc2.connect(gainNode);
      overtoneOsc.connect(gainNode);
      gainNode.connect(ctx.destination);

      droneOsc1.start();
      droneOsc2.start();
      overtoneOsc.start();

      oscillatorsRef.current = [droneOsc1, droneOsc2, overtoneOsc];
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  const stopChantDrone = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      // Smooth fade out to prevent clicks
      try {
        gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      } catch (err) {}
    }

    setTimeout(() => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {}
      });
      oscillatorsRef.current = [];
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
        audioContextRef.current = null;
      }
    }, 550);
  };

  const toggleChant = (chantId: string) => {
    playTempleBell();
    if (playingChantId === chantId) {
      stopChantDrone();
      setPlayingChantId(null);
    } else {
      setPlayingChantId(chantId);
      // Select drone frequencies based on Sanskrit style mantras
      const baseFreq = chantId === 'shani-gayatri' ? 110 : chantId === 'shani-peeda-hara' ? 98 : 116.5; 
      startChantDrone(baseFreq);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
    };
  }, []);

  // Seva Booking Cart Operations
  const handleAddSeva = (seva: Seva) => {
    playTempleBell();
    if (selectedSevas.find(s => s.id === seva.id)) {
      setSelectedSevas(prev => prev.filter(s => s.id !== seva.id));
    } else {
      setSelectedSevas(prev => [...prev, seva]);
    }
  };

  const totalSevaCost = selectedSevas.reduce((sum, item) => sum + item.price, 0);

  const handleOpenSankalpa = () => {
    if (selectedSevas.length === 0) return;
    setIsSankalpaOpen(true);
    setSankalpaSuccess(false);
  };

  const handleSubmitSankalpa = async (e: FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    // Save to Supabase if available
    if (supabase) {
      try {
        await supabase.from('seva_bookings').insert([{
          devotee_name: devoteeName,
          gotra: devoteeGotra,
          nakshatra: devoteeNakshatra,
          sevas: selectedSevas.map(s => s.name),
          total_amount: totalSevaCost,
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.warn('Failed to save booking to Supabase:', err);
      }
    }

    setSankalpaSuccess(true);
    playTempleBell();
    setTimeout(() => {
      setIsSankalpaOpen(false);
      setSelectedSevas([]);
      setDevoteeName('');
      setDevoteeGotra('');
      setDevoteeNakshatra('');
      setSankalpaSuccess(false);
    }, 4000);
  };

  // Contact Form Validation Helpers
  const validateContactEmail = (val: string): boolean => {
    if (!val.trim()) return true;
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(val.trim());
  };

  const validateContactPhone = (val: string): boolean => {
    if (!val.trim()) return true;
    const cleaned = val.replace(/[\s\-\.\(\)]/g, '');
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  // Contact Form Submission with Spam Protection & Validation
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmittingContact) return; // Prevent double-submits

    // 1. Client-side field validation
    const errors: { name?: string; email?: string; phone?: string; message?: string } = {};

    if (!contactName.trim()) {
      errors.name = lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter your name';
    }

    if (!contactMessage.trim()) {
      errors.message = lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ' : 'Please enter your message';
    }

    if (contactEmail.trim() && !validateContactEmail(contactEmail)) {
      errors.email = lang === 'kn' ? 'ಮಾನ್ಯ ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Enter a valid email';
    }

    if (contactPhone.trim() && !validateContactPhone(contactPhone)) {
      errors.phone = lang === 'kn' ? 'ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (10 ಅಂಕಿಗಳು)' : 'Enter a valid Indian phone number (10 digits)';
    }

    setContactTouched({ name: true, email: true, phone: true, message: true });
    setContactFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // 2. Spam Protection: Honeypot check (silently reject if bot filled hidden field)
    if (contactHoneypot && contactHoneypot.trim() !== '') {
      console.warn('Spam rejection: honeypot triggered');
      setIsSubmittingContact(true);
      setTimeout(() => {
        setIsSubmittingContact(false);
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
        setContactHoneypot('');
        setContactFormErrors({});
        setContactTouched({});
        setTimeout(() => {
          setContactSuccess(false);
        }, 5000);
      }, 800);
      return;
    }

    // 3. Spam Protection: Time-based check (reject submissions completed in under 3 seconds)
    const timeElapsedMs = Date.now() - contactFormRenderTimeRef.current;
    if (timeElapsedMs < 3000) {
      console.warn('Spam rejection: submission under 3 seconds');
      setIsSubmittingContact(true);
      setTimeout(() => {
        setIsSubmittingContact(false);
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
        setContactHoneypot('');
        setContactFormErrors({});
        setContactTouched({});
        setTimeout(() => {
          setContactSuccess(false);
        }, 5000);
      }, 800);
      return;
    }

    // 4. Valid human submission
    setIsSubmittingContact(true);
    playTempleBell();

    // Save to Supabase if available
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert([{
          name: contactName.trim(),
          email: contactEmail.trim() || null,
          phone: contactPhone.trim() || null,
          message: contactMessage.trim(),
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        console.warn('Failed to save contact message:', err);
      }
    }

    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      setContactHoneypot('');
      setContactFormErrors({});
      setContactTouched({});

      setTimeout(() => {
        setContactSuccess(false);
      }, 5000);
    }, 1200);
  };

  // Page Navigation handler
  const navigateToPage = (page: PageType) => {
    setIsMenuOpen(false);
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const targetPath = page === 'home' ? '/' : page === 'privacy' ? '/privacy-policy' : page === 'notfound' ? '/404' : `/${page}`;
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ page }, '', targetPath);
        } catch (e) {
          window.location.hash = `#${targetPath.replace(/^\//, '')}`;
        }
      }
    }
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  const isHeaderSolid = isScrolled || currentPage !== 'home';

  // Dynamic SEO Metadata for Each Page in Kannada and English
  const getSeoMetadata = () => {
    if (lang === 'kn') {
      switch (currentPage) {
        case 'about':
          return {
            title: "ಕ್ಷೇತ್ರದ ಹಿನ್ನೆಲೆ ಮತ್ತು ಇತಿಹಾಸ - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರದ ಹಾಡಿಕೆರೆಯಲ್ಲಿ ನೆಲೆಸಿರುವ ಶಾಂತಮೂರ್ತಿ ಶನೀಶ್ವರ ಸ್ವಾಮಿಯ ಇತಿಹಾಸ ಮತ್ತು ಹಿನ್ನೆಲೆ. ಜಾತಕ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಎಳ್ಳೆಣ್ಣೆ ದೀಪಗಳ ಆರಾಧನೆ.",
            keywords: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಇತಿಹಾಸ, ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ, ಉಡುಪಿ, ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಕಲ್ಯಾಣ ಮಂಟಪ, ಧರ್ಮಸ್ಥಳ",
          };
        case 'gallery':
          return {
            title: "ಪವಿತ್ರ ಚಿತ್ರಸಂಪುಟ ಮತ್ತು ವೀಡಿಯೊಗಳು - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಸುಂದರ ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳ ಗ್ಯಾಲರಿ. ಮಹಾ ಪೂಜೆ, ದೀಪಾರಾಧನೆ ಮತ್ತು ಹಸಿರು ಪರಿಸರ.",
            keywords: "ಚಿತ್ರಸಂಪುಟ, ಫೋಟೋಗಳು, ವೀಡಿಯೊಗಳು, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ ಗ್ಯಾಲರಿ, ಪೂಜೆ",
          };
        case 'seva':
          return {
            title: "ಸೇವೆಗಳು ಮತ್ತು ವಿಶೇಷ ಪೂಜೆಗಳ ವಿವರ - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆಯಲ್ಲಿ ನಡೆಯುವ ವಿಶೇಷ ಸೇವೆಗಳು, ತೈಲಾಭಿಷೇಕ ಮತ್ತು ಪೂಜೆಗಳ ವಿವರಗಳು.",
            keywords: "ಸೇವೆಗಳು, ಪೂಜೆಗಳು, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ತೈಲಾಭಿಷೇಕ, ಸಂಕಲ್ಪ, ಸೇವಾ ಪಟ್ಟಿ",
          };
        case 'contact':
          return {
            title: "ಸಂಪರ್ಕ ಮಾಹಿತಿ, ವಿಳಾಸ ಮತ್ತು ಮಾರ್ಗಸೂಚಿ - ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಹಾಡಿಕೆರೆ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆಗಳು, ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಮತ್ತು ಗೂಗಲ್ ಮ್ಯಾಪ್ ಮೂಲಕ ದೇವಸ್ಥಾನ ತಲುಪುವ ಮಾರ್ಗಸೂಚಿಗಳು.",
            keywords: "ಸಂಪರ್ಕ, ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆ, ನಕ್ಷೆ, ಹಾಡಿಕೆರೆ ಮಾರ್ಗ, ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್, ಬ್ರಹ್ಮಾವರ ವಿಳಾಸ",
          };
        case 'privacy':
          return {
            title: "ಗೌಪ್ಯತಾ ನೀತಿ - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಅಧಿಕೃತ ಗೌಪ್ಯತಾ ನೀತಿ. ಭಕ್ತಾದಿಗಳ ಪವಿತ್ರ ಮಾಹಿತಿ ರಕ್ಷಣೆ ಮತ್ತು ಬದ್ಧತೆ.",
            keywords: "ಗೌಪ್ಯತಾ ನೀತಿ, ಭಕ್ತರ ರಕ್ಷಣೆ, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ, ಗೌಪ್ಯತೆ",
          };
        case 'notfound':
          return {
            title: "ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ (404) - ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಹಾಡಿಕೆರೆ",
            description: "ಕ್ಷಮಿಸಿ, ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವು ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಬದಲಾಗಿದೆ. ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ.",
            keywords: "404, ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ",
          };
        case 'home':
        default:
          return {
            title: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ | ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ",
            description: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರ ತಾಲೂಕಿನ ಪ್ರಶಾಂತ ಗ್ರಾಮವಾದ ಹಾಡಿಕೆರೆಯ ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನಕ್ಕೆ ತಮಗೆ ಆದರದ ಸ್ವಾಗತ. ದೇವಸ್ಥಾನದ ಇತಿಹಾಸ, ಸಮಯಗಳು ಮತ್ತು ಸೇವೆಗಳ ಮಾಹಿತಿ.",
            keywords: "ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ, ಉಡುಪಿ, ಮುಖಪುಟ, ಶನಿ ಪೂಜೆ, ದರ್ಶನ ಸಮಯ, ಅನ್ನದಾಸೋಹ",
          };
      }
    } else {
      switch (currentPage) {
        case 'about':
          return {
            title: "Temple Sanctuary & Holy History - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Learn about the history and sacred significance of the Peaceful Lord Shaneshwara (Shantamurthy) in Udupi. Light Ellu Bathi (sesame oil lamps) and seek relief from Shani Dosha.",
            keywords: "About Temple, History, Shantamurthy, Lord Shaneshwara, Haadikere, Udupi, Shani Dosha, Ellu Bathi",
          };
        case 'gallery':
          return {
            title: "Sacred Media Gallery & Videos - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "View beautiful photographs and videos of Shantamurthy Sri Shaneshwara Temple, including the sacred shrine, festive pujas, and lush green surroundings.",
            keywords: "Gallery, Photos, Videos, Holy Shrine, Pujas, Haadikere Gallery, Temple Pictures, South Indian Temple",
          };
        case 'seva':
          return {
            title: "Holy Seva Offerings & Poojas - Sri Shaneshwara Temple | Haadikere",
            description: "View details of special sevas, poojas, and tailabhisheka at Haadikere. Direct counter seva offerings.",
            keywords: "Seva, Poojas, Shani Puja, Tailabhisheka, Sankalpa, Sacred Blessings",
          };
        case 'contact':
          return {
            title: "Contact Information, Route Map & Directions - Sri Shaneshwara Temple | Haadikere",
            description: "Find temple address, phone numbers, contact form, and Google Maps direction to Shantamurthy Sri Shaneshwara Temple, Haadikere, Brahmavara Taluk, Udupi.",
            keywords: "Contact, Address, Phone, Google Maps, Location, Direction, Haadikere Brahmavara, Brahmavara Road Map",
          };
        case 'privacy':
          return {
            title: "Privacy Policy - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Official Privacy Policy of Shantamurthy Sri Shaneshwara Temple, Sri Kshetra Haadikere. Devotee data protection, confidentiality, and sacred trust.",
            keywords: "Privacy Policy, Devotee Privacy, Shaneshwara Temple, Haadikere, Data Protection, Trust Policy",
          };
        case 'notfound':
          return {
            title: "Page Not Found (404) - Shantamurthy Sri Shaneshwara Temple | Haadikere",
            description: "Sorry, the page you are looking for does not exist or has been moved. Return to the homepage of Sri Shaneshwara Temple.",
            keywords: "404, Page Not Found, Shaneshwara Temple, Haadikere",
          };
        case 'home':
        default:
          return {
            title: "Shantamurthy Sri Shaneshwara Temple | Sri Kshetra Haadikere, Udupi",
            description: "Welcome to Shantamurthy Sri Shaneshwara Temple at Haadikere, Udupi. Explore sevas, timings, kalyana mantapa, and holy sanctuary history.",
            keywords: "Sri Shaneshwara Temple, Haadikere, Udupi, Home, Darshan Timings, Shani Dev, Shantamurthy",
          };
      }
    }
  };

  const seo = getSeoMetadata();

  return (
    <div id="app-container" className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-saffron-100 selection:text-saffron-700">
      
      {/* Dynamic Document Metadata (SEO, Open Graph, Twitter Card) */}
      <Helmet 
        title={seo.title} 
        description={seo.description} 
        keywords={seo.keywords} 
      />
      
      {/* 1. STICKY NAVBAR */}
      <header 
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHeaderSolid 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-100 py-3' 
            : 'bg-stone-900/40 backdrop-blur-xs py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo and Temple Name */}
            <div 
              id="navbar-logo"
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigateToPage('home')}
            >
              <div className="relative">
                <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-saffron-600 to-yellow-500 opacity-70 blur-xs transition-transform duration-500 group-hover:scale-110 ${isBellRinging ? 'animate-ping' : ''}`} />
                <img 
                  src={settings?.logo_url || shaniDevLogo} 
                  alt="Lord Shaneshwara Logo" 
                  referrerPolicy="no-referrer"
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-amber-500/80 shadow-md group-hover:rotate-6 transition-transform duration-300"
                />
              </div>
              
              <div className="flex flex-col">
                <span className={`text-base sm:text-lg font-bold tracking-tight leading-tight transition-colors duration-300 ${isHeaderSolid ? 'text-stone-900' : 'text-white text-shadow'}`}>
                  {t.templeName}
                </span>
                <span className={`text-xs font-semibold tracking-wider uppercase ${isHeaderSolid ? 'text-saffron-600' : 'text-saffron-100'}`}>
                  {t.templeSub}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav" className="hidden md:flex items-center gap-5 lg:gap-7 font-medium">
              {(['home', 'about', 'gallery', 'seva', 'contact'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => navigateToPage(section)}
                  className={`text-sm tracking-wide transition-all duration-300 hover:text-saffron-600 relative py-1 cursor-pointer ${
                    currentPage === section 
                      ? isHeaderSolid ? 'text-saffron-600 font-semibold' : 'text-saffron-100 font-semibold'
                      : isHeaderSolid ? 'text-stone-600' : 'text-stone-200'
                  }`}
                >
                  {t.nav[section]}
                  {currentPage === section && (
                    <motion.span 
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Language Toggle & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {/* Language Toggle Button */}
              <button
                id="language-toggle-btn"
                onClick={toggleLanguage}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                  isHeaderSolid
                    ? 'bg-saffron-50 text-saffron-700 border-saffron-200 hover:bg-saffron-100 shadow-xs'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title="Toggle Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
              >
                <Globe className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{lang === 'kn' ? 'ENGLISH' : 'ಕನ್ನಡ'}</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md md:hidden transition-all cursor-pointer ${
                  isHeaderSolid ? 'text-stone-800 hover:bg-stone-100' : 'text-white hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-nav-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white/90 backdrop-blur-[12px] border-b border-stone-200/80 shadow-xl overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
                {(['home', 'about', 'gallery', 'seva', 'contact'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => navigateToPage(section)}
                    className={`gsap-mobile-nav-item w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                      currentPage === section
                        ? 'bg-saffron-50 text-saffron-700 border-l-4 border-saffron-600'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {t.nav[section]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PAGE CONTENT WITH SMOOTH MOBILE & DESKTOP TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="w-full min-h-screen"
        >
          {/* 2. HERO / LANDING SECTION & HOME PAGE SECTIONS */}
          {currentPage === 'home' && (
        <>
          {/* Elegant Scrolling Marquee for Announcements & Notifications */}
          {allNotifications && allNotifications.length > 0 && (
            <div id="temple-announcement-marquee" className="pt-20 bg-gradient-to-r from-amber-600 via-saffron-600 to-amber-600 text-white relative z-40 border-b border-amber-500/30 shadow-md overflow-hidden flex items-stretch">
              {/* Sticky Left Badge */}
              <div className="bg-stone-900/95 backdrop-blur-xs px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-extrabold text-amber-400 uppercase tracking-widest border-r border-amber-500/30 flex items-center gap-2 z-20 shrink-0 select-none shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
                <span className="animate-pulse">📢</span>
                <span>{lang === 'kn' ? 'ವಿಶೇಷ ಮಾಹಿತಿ' : 'Latest News'}</span>
              </div>

              {/* Scrolling Container */}
              <div className="relative flex-1 overflow-hidden flex items-center">
                {/* Seamless Scrolling Marquee */}
                <div className="flex overflow-hidden select-none w-full">
                  <div className="animate-marquee-scrolling flex items-center whitespace-nowrap gap-16 py-2.5">
                    {/* First copy */}
                    <div className="flex items-center gap-16">
                      {allNotifications.map((item, idx) => (
                        <div key={`copy1-${item.id}-${idx}`} className="flex items-center gap-4 text-stone-100 font-medium text-sm sm:text-base tracking-wide">
                          <span className="text-amber-300 drop-shadow-sm font-bold">🕉️</span>
                          <span>{item.text}</span>
                          {item.created_at && (
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-amber-100 uppercase tracking-widest">
                              {new Date(item.created_at).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Second copy for seamless looping */}
                    <div className="flex items-center gap-16" aria-hidden="true">
                      {allNotifications.map((item, idx) => (
                        <div key={`copy2-${item.id}-${idx}`} className="flex items-center gap-4 text-stone-100 font-medium text-sm sm:text-base tracking-wide">
                          <span className="text-amber-300 drop-shadow-sm font-bold">🕉️</span>
                          <span>{item.text}</span>
                          {item.created_at && (
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-amber-100 uppercase tracking-widest">
                              {new Date(item.created_at).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Left & Right Soft Fade Gradients */}
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-saffron-600 to-transparent pointer-events-none z-10" />
              </div>
            </div>
          )}
          <section 
            id="home" 
            className={`relative min-h-screen pb-16 flex items-center justify-center bg-stone-950 overflow-hidden ${
              allNotifications && allNotifications.length > 0 ? 'pt-6' : 'pt-24'
            }`}
          >
            {/* Background image with parallax alignment and automatic transition */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={currentSlide}
                  src={heroSlides[currentSlide].image} 
                  alt="Shri Kshetra Haadikere Temple Banner" 
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 0.88, scale: 1.03 }}
                  exit={{ opacity: 0, scale: 1.0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-105"
                />
              </AnimatePresence>
              {/* Elegant soft gradient overlay to preserve readability while letting the bright temple photo shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/50 pointer-events-none z-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60 pointer-events-none z-1" />
            </div>

            {/* Left Arrow Button for Manual Navigation */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-stone-950/40 hover:bg-stone-950/70 border border-white/10 hover:border-white/30 text-white hover:text-amber-400 cursor-pointer transition-all duration-300 backdrop-blur-xs flex items-center justify-center hover:scale-110 active:scale-95 group shadow-lg"
              title="Previous / ಹಿಂದಿನ ಚಿತ್ರ"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            {/* Right Arrow Button for Manual Navigation */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-stone-950/40 hover:bg-stone-950/70 border border-white/10 hover:border-white/30 text-white hover:text-amber-400 cursor-pointer transition-all duration-300 backdrop-blur-xs flex items-center justify-center hover:scale-110 active:scale-95 group shadow-lg"
              title="Next / ಮುಂದಿನ ಚಿತ್ರ"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            {/* Slide Indicator Dots and Captions */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-3 px-4">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-stone-200 text-shadow-md text-center max-w-2xl select-none">
                {lang === 'kn' ? heroSlides[currentSlide].captionKn : heroSlides[currentSlide].captionEn}
              </p>
              <div className="flex items-center gap-2 bg-stone-950/40 hover:bg-stone-950/60 transition-colors duration-300 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/5">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'bg-saffron-500 w-5' : 'bg-white/40 hover:bg-white/75'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div ref={heroTextRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-300 text-sm sm:text-base font-bold mb-6 tracking-wide">
                <span>{t.hero.welcome}</span>
              </div>

              <h1 className="text-2xl min-[380px]:text-3xl min-[480px]:text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-shadow-lg leading-tight mb-6 break-words">
                <span className="bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 bg-clip-text text-transparent">
                  {t.templeName}
                </span>
                <br />
                <span className="text-xl min-[380px]:text-2xl min-[480px]:text-3xl sm:text-4.5xl md:text-5xl text-saffron-400 font-sans mt-2 block font-semibold break-words">
                  {t.templeSub}
                </span>
              </h1>

              <p className="hidden sm:block max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-stone-100 mb-10 leading-relaxed font-normal">
                {t.hero.tagline}
              </p>

              {/* Action Callouts */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => navigateToPage('seva')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white font-semibold rounded-full shadow-lg hover:shadow-saffron-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t.hero.ctaSeva}</span>
                </button>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-saffron-400" />
                  <span>{t.hero.ctaContact}</span>
                </button>
              </div>

            </div>
          </section>

          {/* 3.5. HISTORY PREVIEW SECTION */}
          <section ref={historySectionRef} id="history-preview" className="py-20 bg-stone-50 border-b border-stone-200 relative overflow-hidden">
            {/* Background spiritual mandala watermark ornament */}
            <div className="absolute -right-8 -top-8 sm:-right-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none">
              <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Visual Photo on Left (5 Cols on large screen) */}
                <div className="lg:col-span-5 relative gsap-history-left">
                  <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-saffron-500/10 blur-xl opacity-80" />
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xl group">
                    <img 
                      src={aboutPreviewPhoto} 
                      alt="Scenic Haadikere Temple Shrine" 
                      referrerPolicy="no-referrer"
                      className="w-full h-72 sm:h-96 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Visual Overlay Banner */}
                    <div className="absolute top-4 left-4 bg-saffron-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 backdrop-blur-xs select-none">
                      <span>🕉️ {lang === 'kn' ? 'ಪವಿತ್ರ ಕ್ಷೇತ್ರ' : 'Holy Kshetra'}</span>
                    </div>
                  </div>
                </div>

                {/* Content Text on Right (7 Cols on large screen) */}
                <div className="lg:col-span-7 space-y-6 text-left gsap-history-right">
                  <div className="inline-block">
                    <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2 block">
                      {lang === 'kn' ? 'ಕ್ಷೇತ್ರದ ಹಿನ್ನೆಲೆ' : 'Sacred Heritage'}
                    </span>
                    <h2 className="text-2xl sm:text-4.5xl font-bold tracking-tight font-display text-stone-900 leading-tight">
                      {dbHistory && dbHistory.length > 0
                        ? (lang === 'kn' ? (dbHistory[0].title_kn || dbHistory[0].title) : (dbHistory[0].title || dbHistory[0].title_kn))
                        : t.historyPreview.title}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mt-2.5" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-850 leading-normal">
                      {dbHistory && dbHistory.length > 0 && dbHistory[0].subtitle_kn ? (
                        lang === 'kn' ? dbHistory[0].subtitle_kn : dbHistory[0].subtitle
                      ) : dbHistory && dbHistory.length > 0 && dbHistory[0].year ? (
                        `${lang === 'kn' ? 'ಇತಿಹಾಸದ ಕಾಲಾವಧಿ:' : 'Era:'} ${dbHistory[0].year}`
                      ) : (
                        t.historyPreview.subtitle
                      )}
                    </h3>
                    <p className="text-stone-700 text-base sm:text-lg md:text-xl leading-relaxed font-normal line-clamp-5">
                      {(() => {
                        const rawDesc = dbHistory && dbHistory.length > 0
                          ? (lang === 'kn'
                              ? (dbHistory[0].content_kn || dbHistory[0].description_kn || dbHistory[0].content || dbHistory[0].description)
                              : (dbHistory[0].content || dbHistory[0].description || dbHistory[0].content_kn || dbHistory[0].description_kn))
                          : t.historyPreview.desc;
                        
                        const cleaned = cleanSupabaseHtml(rawDesc);
                        const limit = 260;
                        if (cleaned && cleaned.length > limit) {
                          return cleaned.slice(0, limit).trim() + '...';
                        }
                        return cleaned;
                      })()}
                    </p>
                  </div>

                  {/* Read More Button linking to Full History (#about) */}
                  <div className="pt-4">
                    <button
                      onClick={() => navigateToPage('about')}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group focus:ring-2 focus:ring-saffron-500"
                    >
                      <span>{t.historyPreview.readMore}</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* GALLERY PREVIEW SECTION */}
          <section ref={homeGallerySectionRef} id="gallery-preview" className="py-20 bg-stone-100 border-b border-stone-200 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              {/* Header */}
              <div className="flex flex-col items-center mb-12 text-center gsap-home-gallery-item">
                <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
                  {lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರದ ಛಾಯಾಚಿತ್ರಗಳು' : 'Divine Snapshots'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-stone-900 mb-4">
                  {lang === 'kn' ? 'ದಿವ್ಯ ಸನ್ನಿಧಿಯ ದರ್ಶನ' : 'Glimpse of the Holy Shrine'}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mb-4" />
                <p className="text-stone-700 font-normal max-w-2xl text-base sm:text-lg md:text-xl">
                  {lang === 'kn' 
                    ? 'ಹಾಡಿಕೆರೆ ಶ್ರೀ ಶನೀಶ್ವರ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನದ ಪವಿತ್ರ ಕ್ಷಣಗಳು ಮತ್ತು ಧಾರ್ಮಿಕ ವಿಧಿವಿಧಾನಗಳ ಸುಂದರ ಚಿತ್ರಗಳು.' 
                    : 'Beautiful snapshots of sacred rituals, lamp offerings, and the serene temple atmosphere.'}
                </p>
              </div>

              {/* Grid of 3 selective preview images or States */}
              {isGalleryLoading ? (
                <div className="mb-12">
                  <LoadingSkeleton variant="gallery" count={3} lang={lang} />
                </div>
              ) : galleryError ? (
                <div className="mb-12">
                  <ErrorState message={galleryError} onRetry={fetchGalleryData} lang={lang} />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="mb-12">
                  <EmptyState 
                    icon="gallery" 
                    title={lang === 'kn' ? 'ಯಾವುದೇ ಚಿತ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No Gallery Items'} 
                    description={lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ಗ್ಯಾಲರಿಗೆ ಇನ್ನೂ ಚಿತ್ರಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No photos have been uploaded yet.'} 
                    lang={lang} 
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {galleryItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="gsap-home-gallery-item group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200/40 bg-white h-[280px]"
                    >
                      <img 
                        src={item.src} 
                        alt={item.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* Dark overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-950/80 to-transparent flex flex-col justify-end p-5" />

                      <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                        <p className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide leading-tight group-hover:text-yellow-300 transition-colors duration-300">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View More Button */}
              {galleryItems.length > 0 && (
                <div className="flex justify-center gsap-home-gallery-item">
                  <button
                    onClick={() => navigateToPage('gallery')}
                    className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group focus:ring-2 focus:ring-saffron-500"
                  >
                    <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ಚಿತ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ ➔' : 'View Full Divine Gallery ➔'}</span>
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* 3.5. UPCOMING EVENTS SECTION - Render only while loading or when real events exist */}
          {(isEventsLoading || (displayEvents && displayEvents.length > 0)) && (
            <section ref={homeEventsSectionRef} id="upcoming-events" className="py-20 bg-gradient-to-b from-stone-50 via-amber-50/10 to-stone-100 border-b border-stone-200 relative overflow-hidden">
              {/* Spiritual Mandala Watermark */}
              <div className="absolute -right-8 -top-8 sm:-right-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none">
                <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-14 text-center gsap-events-item">
                  <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-saffron-500 animate-pulse" />
                    {lang === 'kn' ? 'ಮಹೋತ್ಸವ ಮತ್ತು ವಿಶೇಷ ಕಾರ್ಯಕ್ರಮಗಳು' : 'Festivals & Special Events'}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-stone-900 mb-4">
                    {lang === 'kn' ? 'ಕ್ಷೇತ್ರದ ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು' : 'Upcoming Auspicious Events'}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mb-4" />
                  <p className="text-stone-700 font-normal max-w-2xl text-base sm:text-lg">
                    {lang === 'kn' 
                      ? 'ಶ್ರೀ ಕ್ಷೇತ್ರದಲ್ಲಿ ನಡೆಯಲಿರುವ ವಿಶೇಷ ಉತ್ಸವಗಳು, ಧಾರ್ಮಿಕ ಪೂಜಾ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಧರ್ಮಸಭೆಗಳ ವಿವರಗಳು.' 
                      : 'Join us for divine celebrations, grand festivals, and special devotional events at the Holy Shrine.'}
                  </p>
                </div>

                {/* Main Row / Slider or States */}
                {isEventsLoading ? (
                  <LoadingSkeleton variant="events" lang={lang} />
                ) : eventsError ? (
                  <ErrorState message={eventsError} onRetry={fetchEventsData} lang={lang} />
                ) : (
                  <div className="relative gsap-events-item">
                  <AnimatePresence mode="wait">
                    {displayEvents.map((event, idx) => {
                      if (idx !== activeEventIndex) return null;
                      
                      const titleText = lang === 'kn' ? (event.title_kn || event.title) : (event.title || event.title_kn);
                      const descText = lang === 'kn' ? (event.description_kn || event.description) : (event.description || event.description_kn);
                      const dateStr = event.event_date;
                      const timeStr = event.event_time;
                      const posterUrl = event.poster_url;
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl border border-stone-200/60 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-12 relative"
                        >
                          {/* Visual Corner Deco */}
                          <div className="absolute top-0 left-0">
                            <CornerRangoli size={80} colorClass="text-saffron-500/20" />
                          </div>
                          
                          {/* Invitation Photo / Poster (Left Column) */}
                          <div className="lg:col-span-5 flex flex-col justify-center items-center relative group">
                            <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-stone-100 group-hover:shadow-2xl transition-all duration-500 group-hover:border-saffron-300">
                              {posterUrl ? (
                                <img 
                                  src={posterUrl} 
                                  alt={titleText}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 cursor-pointer"
                                  onClick={() => setIsEventPosterZoomed(true)}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/50 flex flex-col items-center justify-center p-8 text-center">
                                  <Calendar className="w-16 h-16 text-saffron-500/40 mb-3" />
                                  <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">
                                    {lang === 'kn' ? 'ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ ಲಭ್ಯವಿಲ್ಲ' : 'Invitation Card Not Available'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Floating Zoom Badge */}
                              {posterUrl && (
                                <button 
                                  onClick={() => setIsEventPosterZoomed(true)}
                                  className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg hover:bg-saffron-600 hover:text-white hover:scale-110 transition-all duration-300 z-10 cursor-pointer"
                                  title={lang === 'kn' ? 'ದೊಡ್ಡದಾಗಿ ವೀಕ್ಷಿಸಿ' : 'View Full Image'}
                                >
                                  <ZoomIn className="w-5 h-5" />
                                </button>
                              )}
                              
                              {/* Ribbon */}
                              <div className="absolute top-4 left-4 bg-gradient-to-r from-saffron-600 to-amber-500 text-white font-extrabold text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-md tracking-wider uppercase">
                                {lang === 'kn' ? 'ಆಮಂತ್ರಣ ಪತ್ರ' : 'Auspicious Invitation'}
                              </div>
                            </div>
                          </div>

                          {/* Event Details (Right Column) */}
                          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                            {/* Decorative Spark */}
                            <div className="flex items-center gap-2">
                              <span className="h-px w-8 bg-saffron-400" />
                              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-3 py-1 rounded-full">
                                {lang === 'kn' ? 'ಮಹೋತ್ಸವ ಮಾಹಿತಿ' : 'Event Details'}
                              </span>
                              <span className="h-px w-8 bg-saffron-400" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
                              {titleText}
                            </h3>

                            {/* Date & Time Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Date */}
                              <div className="flex items-start gap-3 bg-stone-50 border border-stone-150 p-4 rounded-2xl shadow-xs">
                                <div className="bg-saffron-50 text-saffron-600 p-3 rounded-xl mt-0.5">
                                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider font-bold text-stone-500 mb-0.5">
                                    {lang === 'kn' ? 'ದಿನಾಂಕ' : 'Date'}
                                  </span>
                                  <span className="text-sm sm:text-base font-extrabold text-stone-800">
                                    {formatDate(dateStr, lang)}
                                  </span>
                                </div>
                              </div>

                              {/* Time */}
                              <div className="flex items-start gap-3 bg-stone-50 border border-stone-150 p-4 rounded-2xl shadow-xs">
                                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl mt-0.5">
                                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider font-bold text-stone-500 mb-0.5">
                                    {lang === 'kn' ? 'ಸಮಯ' : 'Timings'}
                                  </span>
                                  <span className="text-sm sm:text-base font-extrabold text-stone-800">
                                    {timeStr || (lang === 'kn' ? 'ದಿನವಿಡೀ' : 'Full Day')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description Box */}
                            <div className="bg-gradient-to-br from-stone-50 to-stone-100/50 p-5 rounded-2xl border border-stone-200/50">
                              <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                                {descText}
                              </p>
                            </div>

                            {/* Dynamic Interactive Call to Action buttons */}
                            <div className="flex flex-wrap gap-4 pt-2">
                              {/* Inquire on WhatsApp */}
                              <a
                                href={`https://wa.me/${settings?.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : "919902207990"}?text=${encodeURIComponent(
                                  lang === 'kn' 
                                    ? `ನಮಸ್ತೆ, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ ಹಾಡಿಕೆರೆಯ ${titleText} ಕಾರ್ಯಕ್ರಮದ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಬೇಕಾಗಿತ್ತು.`
                                    : `Namaste, I would like to inquire about the upcoming event: "${titleText}" at Sri Shaneshwara Temple Haadikere.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                              >
                                <span>💬 {lang === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ವಿಚಾರಿಸಿ' : 'Inquire on WhatsApp'}</span>
                              </a>
                              
                              {/* Share Invitation / Directions */}
                              <a
                                href={templeDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-850 text-white font-bold text-sm sm:text-base border border-stone-850 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                              >
                                <MapPin className="w-4 h-4 text-saffron-500" />
                                <span>{lang === 'kn' ? 'ಮಾರ್ಗಸೂಚಿ ಪಡೆಯಿರಿ' : 'Get Directions'}</span>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Multi-event arrows if displayEvents.length > 1 */}
                  {displayEvents.length > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setActiveEventIndex((prev) => (prev - 1 + displayEvents.length) % displayEvents.length)}
                        className="w-11 h-11 rounded-full bg-white border border-stone-200/80 shadow-md hover:shadow-lg flex items-center justify-center text-stone-700 hover:text-saffron-600 hover:border-saffron-300 transition-all cursor-pointer hover:scale-105"
                        aria-label="Previous event"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      {/* Dots */}
                      <div className="flex gap-2">
                        {displayEvents.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveEventIndex(i)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                              i === activeEventIndex 
                                ? 'bg-saffron-600 w-6' 
                                : 'bg-stone-300 hover:bg-stone-400'
                            }`}
                            aria-label={`Go to event ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveEventIndex((prev) => (prev + 1) % displayEvents.length)}
                        className="w-11 h-11 rounded-full bg-white border border-stone-200/80 shadow-md hover:shadow-lg flex items-center justify-center text-stone-700 hover:text-saffron-600 hover:border-saffron-300 transition-all cursor-pointer hover:scale-105"
                        aria-label="Next event"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              </div>
              
              {/* Clean Poster Full-Screen Zoom Modal */}
              <AnimatePresence>
                {isEventPosterZoomed && displayEvents[activeEventIndex]?.poster_url && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                  >
                    {/* Close button click-overlay */}
                    <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsEventPosterZoomed(false)} />
                    
                    <button
                      onClick={() => setIsEventPosterZoomed(false)}
                      className="absolute top-6 right-6 text-white bg-stone-900 hover:bg-stone-850 border border-stone-800 p-3 rounded-full transition-all hover:scale-105 shadow-xl z-50 cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                      className="relative max-w-full max-h-[85vh] aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl z-10"
                    >
                      <img
                        src={displayEvents[activeEventIndex].poster_url}
                        alt={lang === 'kn' ? displayEvents[activeEventIndex].title_kn : displayEvents[activeEventIndex].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
        </>
      )}

      {/* 4. ABOUT SECTION */}
      {currentPage === 'about' && (
        <section ref={aboutSectionRef} id="about" className="pt-28 pb-20 bg-white relative overflow-hidden">
          {/* Subtle background spiritual mandala watermark ornament */}
          <div className="absolute -right-8 -top-8 sm:-right-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none">
            <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb Navigation */}
            <Breadcrumb currentPage={currentPage} navigateToPage={navigateToPage} lang={lang} t={t} />
            
            {/* Header */}
            <div className="flex flex-col items-center mb-14 text-center gsap-about-item">
              <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
                {lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರ ಪರಿಚಯ' : 'Haadikere Shri Kshetra'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight font-display text-stone-900 mb-3">
                {lang === 'kn'
                  ? (settings?.about_title_kn || t.about.title)
                  : (settings?.about_title_en || settings?.about_title || t.about.title)}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full" />
            </div>

            {/* Responsive Text-wrapping Main Story Layout */}
            <div className="max-w-6xl mx-auto mb-16 text-stone-800 text-base sm:text-lg md:text-xl leading-relaxed flow-root">
              {/* Left Side: Beautiful Temple Image (Floated on medium+ screens) */}
              <div className="md:float-left md:mr-8 md:mb-6 w-full md:w-[45%] lg:w-[40%] relative mb-6 md:mb-4 gsap-about-item">
                <div className="absolute -inset-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-2xl blur-xs opacity-30"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-100 bg-white p-2">
                  <img 
                    src={settings?.about_image_url || aboutHeroPhoto} 
                    alt={lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರ ದೇಗುಲ' : 'Shri Kshetra Temple'} 
                    className="w-full h-[320px] sm:h-[380px] object-cover rounded-xl transition-transform duration-500 hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-xs py-2 px-3.5 rounded-lg border border-white/10 text-center">
                    <p className="text-white text-sm sm:text-base md:text-lg font-light">
                      {lang === 'kn' 
                        ? (settings?.about_image_caption_kn || 'ಹಸಿರಿನ ನಡುವೆ ಕಂಗೊಳಿಸುತ್ತಿರುವ ಸುಂದರ ದೇಗುಲ') 
                        : (settings?.about_image_caption_en || settings?.about_image_caption || 'Sacred sanctuary nestled amidst lush greenery')}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Content - direct block-level children so text wraps flawlessly around floated image */}
              {isHistoryLoading ? (
                <div className="space-y-4">
                  <LoadingSkeleton variant="about" lang={lang} />
                </div>
              ) : historyError ? (
                <div className="space-y-4">
                  <ErrorState message={historyError} onRetry={fetchHistoryData} lang={lang} />
                  <p className="text-justify text-stone-700 font-normal leading-relaxed text-base sm:text-lg md:text-xl whitespace-pre-line">
                    {cleanSupabaseHtml(lang === 'kn' ? t.about.intro : t.about.intro)}
                  </p>
                </div>
              ) : dbHistory && dbHistory.length > 0 ? (
                <>
                  {dbHistory.map((item: any, idx: number) => {
                    const itemTitle = lang === 'kn' ? (item.title_kn || item.title) : (item.title || item.title_kn);
                    const itemContent = lang === 'kn' ? (item.content_kn || item.description_kn || item.content || item.description) : (item.content || item.description || item.content_kn || item.description_kn);
                    const itemYear = item.year || item.era || item.time_period;
                    
                    return (
                      <div key={item.id || idx} className="mb-6 block">
                        {(itemTitle || itemYear) && (
                          <h4 className="font-extrabold text-stone-900 text-lg sm:text-xl md:text-2xl flex items-center gap-2 flex-wrap mb-2">
                            {itemYear && <span className="bg-saffron-100 text-saffron-800 text-xs sm:text-sm px-3 py-0.5 rounded-full font-mono font-bold">{itemYear}</span>}
                            {itemTitle && <span className="text-stone-900 font-display">{itemTitle}</span>}
                          </h4>
                        )}
                        <p className="text-justify text-stone-700 font-normal leading-relaxed text-base sm:text-lg md:text-xl whitespace-pre-line">
                          {cleanSupabaseHtml(itemContent)}
                        </p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <p className="font-extrabold text-stone-950 text-lg sm:text-xl md:text-2xl mb-5 block leading-relaxed whitespace-pre-line">
                    {cleanSupabaseHtml(lang === 'kn'
                      ? (settings?.about_intro_kn || t.about.intro)
                      : (settings?.about_intro_en || settings?.about_intro || t.about.intro))}
                  </p>
                  <p className="text-justify text-stone-700 font-normal leading-relaxed mb-4 block text-base sm:text-lg md:text-xl whitespace-pre-line">
                    {cleanSupabaseHtml(lang === 'kn'
                      ? (settings?.about_description1_kn || t.about.description1)
                      : (settings?.about_description1_en || settings?.about_description1 || t.about.description1))}
                  </p>
                  <p className="text-justify text-stone-700 font-normal leading-relaxed block text-base sm:text-lg md:text-xl whitespace-pre-line">
                    {cleanSupabaseHtml(lang === 'kn'
                      ? (settings?.about_description2_kn || t.about.description2)
                      : (settings?.about_description2_en || settings?.about_description2 || t.about.description2))}
                  </p>
                </>
              )}
            </div>

            {/* Extra Space & Beautiful Centered Additional Temple Information */}
            <div className="mt-16 border-t border-stone-100 pt-20">
              <div className="flex flex-col items-center mb-12 text-center gsap-about-card">
                <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
                  {lang === 'kn' ? 'ಸದ್ಭಕ್ತರ ಗಮನಕ್ಕೆ' : 'Pilgrim Notice & Timings'}
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-stone-900 font-display">
                  {lang === 'kn' ? 'ದರ್ಶನ ಮತ್ತು ಇತರ ಪವಿತ್ರ ವಿವರಗಳು' : 'Darshan Hours & Important Details'}
                </h3>
                <div className="w-16 h-[2px] bg-saffron-500 mt-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-200/60 shadow-xs gsap-about-card">
                  <div className="text-2xl mb-4">⏰</div>
                  <h4 className="text-lg font-bold text-stone-900 mb-2 font-display">
                    {lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ದರ್ಶನ ಸಮಯ' : 'Darshan Timings'}
                  </h4>
                  <ul className="text-stone-700 text-sm sm:text-base md:text-lg font-normal space-y-3">
                    <li className="flex justify-between border-b border-stone-100 pb-2">
                      <span>{lang === 'kn' ? 'ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ' : 'Monday & Saturday'}</span>
                      <span className="font-semibold text-stone-900">6 AM - 8 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-stone-100 pb-2">
                      <span>{lang === 'kn' ? 'ಇತರ ದಿನಗಳು (ಬೆಳಿಗ್ಗೆ)' : 'Other Days (Morning)'}</span>
                      <span className="font-semibold text-stone-900">7 AM - 1 PM</span>
                    </li>
                    <li className="flex justify-between text-saffron-700 font-semibold pt-1">
                      <span>{lang === 'kn' ? 'ಇತರ ದಿನಗಳು (ಸಂಜೆ)' : 'Other Days (Evening)'}</span>
                      <span className="bg-saffron-50 px-3 py-1 rounded-md text-sm sm:text-base">4:30 PM - 7:30 PM</span>
                    </li>
                  </ul>
                </div>

                {/* Rules & Guidelines */}
                <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-200/60 shadow-xs gsap-about-card">
                  <div className="text-2xl mb-4">📜</div>
                  <h4 className="text-lg font-bold text-stone-900 mb-2 font-display">
                    {lang === 'kn' ? 'ಸಾಂಪ್ರದಾಯಿಕ ನಿಯಮಗಳು' : 'Devotee Guidelines'}
                  </h4>
                  <ul className="text-stone-700 text-sm sm:text-base md:text-lg font-normal space-y-3">
                    <li className="flex items-start gap-1.5">
                      <span className="text-saffron-600">🔸</span>
                      <span>{lang === 'kn' ? 'ದೇವಾಲಯಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪಿನಲ್ಲಿ ಬರುವುದು ಕಡ್ಡಾಯ.' : 'Decent traditional Indian clothing is required.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-saffron-600">🔸</span>
                      <span>{lang === 'kn' ? 'ಗರ್ಭಗುಡಿಯೊಳಗೆ ಮೊಬೈಲ್ ಫೋಟೋಗ್ರಫಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.' : 'Mobile videography inside the inner sanctum is prohibited.'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-saffron-600">🔸</span>
                      <span>{lang === 'kn' ? 'ಸ್ವಚ್ಛತೆ ಹಾಗೂ ಪವಿತ್ರತೆಯನ್ನು ಕಾಪಾಡಿ.' : 'Cooperate to maintain the purity and cleanliness.'}</span>
                    </li>
                  </ul>
                </div>

                {/* Trust Contacts */}
                <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-200/60 shadow-xs gsap-about-card">
                  <div className="text-2xl mb-4">📞</div>
                  <h4 className="text-lg font-bold text-stone-900 mb-2 font-display">
                    {lang === 'kn' ? 'ಸಂಪರ್ಕ ಮತ್ತು ದೇಣಿಗೆ' : 'Trust Contact Info'}
                  </h4>
                  <ul className="text-stone-700 text-sm sm:text-base md:text-lg font-normal space-y-3">
                    <li>
                      <span className="font-semibold text-stone-800 block">{lang === 'kn' ? 'ದೇವಸ್ಥಾನ ಅಭಿವೃದ್ಧಿ ಟ್ರಸ್ಟ್ (R)' : 'Temple Development Trust (R)'}</span>
                      <span className="text-stone-500 text-xs sm:text-sm">Sri Kshetra Haadikere, Brahmavara, Udupi, Karnataka</span>
                    </li>
                    <li className="pt-2 border-t border-stone-200/40">
                      <span className="block text-xs sm:text-sm text-stone-500">{lang === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ:' : 'Phone Contact:'}</span>
                      <span className="font-mono text-saffron-700 font-semibold text-base sm:text-lg md:text-xl block mt-1">+91 99022 07990 / +91 87929 78777</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Kalyana Mantapa (Marriage Hall) Section */}
            <div className="mt-28 border-t border-stone-100 pt-20">
              <div className="flex flex-col items-center mb-14 text-center gsap-about-mantapa">
                <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
                  {lang === 'kn' ? 'ಮಂಗಳಕರ ಸೌಲಭ್ಯ' : 'Auspicious Facilities'}
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-stone-900 font-display">
                  {lang === 'kn' ? 'ಶಾಂತಮೂರ್ತಿ ಸಭಾಭವನ' : 'Shantamurthi Sabhabhavana'}
                </h3>
                <div className="w-16 h-[2px] bg-saffron-500 mt-3 mb-4" />
                <p className="text-stone-600 font-normal max-w-2xl text-base sm:text-lg md:text-xl">
                  {lang === 'kn'
                    ? 'ದೇವಸ್ಥಾನದ ಆವರಣದಲ್ಲೇ ಇರುವ ಸುಸಜ್ಜಿತ ಹಾಗೂ ವಿಶಾಲವಾದ ಶಾಂತಮೂರ್ತಿ ಸಭಾಭವನವು ಶುಭ ಸಮಾರಂಭಗಳಿಗೆ ಮುಕ್ತವಾಗಿದೆ.'
                    : 'A beautifully equipped, spacious community wedding hall within the temple complex, available for all auspicious ceremonies.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                {/* Left Side: Details and Info */}
                <div className="lg:col-span-7 space-y-6 gsap-about-mantapa">
                  <div className="space-y-4">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 font-display flex items-center gap-2">
                      <span className="text-saffron-600">🕉️</span>
                      <span>
                        {lang === 'kn' ? 'ಸಕಲ ಸೌಲಭ್ಯಗಳುಳ್ಳ ಮಂಗಲ ಭವನ' : 'Traditional Marriage & Event Hall'}
                      </span>
                    </h4>
                    <p className="text-stone-700 font-normal text-base sm:text-lg md:text-xl leading-relaxed">
                      {lang === 'kn'
                        ? 'ದೇವಸ್ಥಾನದ ಶ್ರೀ ಕ್ಷೇತ್ರ ಸನ್ನಿಧಿಯಲ್ಲಿ ಮದುವೆ ಹಾಗೂ ಇತರ ಧಾರ್ಮಿಕ ಸಮಾರಂಭಗಳನ್ನು ನೆರವೇರಿಸಲು ಎಲ್ಲಾ ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳೊಂದಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಶೈಲಿಯಲ್ಲಿ ಶಾಂತಮೂರ್ತಿ ಸಭಾಭವನವನ್ನು ನಿರ್ಮಿಸಲಾಗಿದೆ. ಇಲ್ಲಿ ಶುಭಕಾರ್ಯಗಳನ್ನು ನಡೆಸುವುದರಿಂದ ಸ್ವಾಮಿಯ ವಿಶೇಷ ಆಶೀರ್ವಾದ ಸದಾ ಇರುತ್ತದೆ ಎಂಬುದು ಭಕ್ತರ ನಂಬಿಕೆ.'
                        : 'Built in a traditional style with modern amenities, Shantamurthi Sabhabhavana offers an ideal spiritual ambiance for marriages and sacred ceremonies directly under the blessings of Lord Shaneshwara. Performing auspicious ceremonies here brings eternal peace and divine grace.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Capacity Item */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/50 flex gap-3.5">
                      <div className="text-2xl text-saffron-600 bg-saffron-50 p-2 rounded-lg h-fit">👥</div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-base sm:text-lg mb-1">
                          {lang === 'kn' ? 'ಒಟ್ಟು ಸಾಮರ್ಥ್ಯ' : 'Hall Capacity'}
                        </h5>
                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                          {lang === 'kn'
                            ? '೫೦೦+ ಆಸನಗಳ ವಿಶಾಲ ಮುಖ್ಯ ಸಭಾಂಗಣ ಮತ್ತು ೩೦೦+ ಭೋಜನ ಶಾಲೆ ಸಾಮರ್ಥ್ಯ.'
                            : '500+ seat main convention hall paired with a 300+ capacity dining hall.'}
                        </p>
                      </div>
                    </div>

                    {/* Amenities Item */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/50 flex gap-3.5">
                      <div className="text-2xl text-saffron-600 bg-saffron-50 p-2 rounded-lg h-fit">✨</div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-base sm:text-lg mb-1">
                          {lang === 'kn' ? 'ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು' : 'Amenities Offered'}
                        </h5>
                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                          {lang === 'kn'
                            ? 'ವಿಶಾಲ ವೇದಿಕೆ, ಸುಸಜ್ಜಿತ ವಧು-ವರರ ಕೊಠಡಿಗಳು, ನಿರಂತರ ನೀರು ಹಾಗೂ ವಿದ್ಯುತ್ ವ್ಯವಸ್ಥೆ.'
                            : 'Grand elevated stage, spacious bridal suite, continuous water, and power backup.'}
                        </p>
                      </div>
                    </div>

                    {/* Suitable Events */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/50 flex gap-3.5">
                      <div className="text-2xl text-saffron-600 bg-saffron-50 p-2 rounded-lg h-fit">🌸</div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-base sm:text-lg mb-1">
                          {lang === 'kn' ? 'ಸೂಕ್ತ ಸಮಾರಂಭಗಳು' : 'Suitable For'}
                        </h5>
                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                          {lang === 'kn'
                            ? 'ಮದುವೆ, ನಿಶ್ಚಿತಾರ್ಥ, ಜನಿವಾರ ಧರಿಸುವಿಕೆ (ಉಪನಯನ) ಮತ್ತು ಇತರೆ ಕೌಟುಂಬಿಕ ಶುಭಕಾರ್ಯಗಳು.'
                            : 'Weddings, engagements, Upanayana (thread ceremony), and sacred family rituals.'}
                        </p>
                      </div>
                    </div>

                    {/* Booking Inquiries */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/50 flex gap-3.5">
                      <div className="text-2xl text-saffron-600 bg-saffron-50 p-2 rounded-lg h-fit">📞</div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-base sm:text-lg mb-1">
                          {lang === 'kn' ? 'ಬುಕ್ಕಿಂಗ್ ಮತ್ತು ಸಂಪರ್ಕ' : 'Booking & Contact'}
                        </h5>
                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                          {lang === 'kn'
                            ? 'ಲಭ್ಯತೆ ಹಾಗೂ ಮುಂಗಡ ಕಾಯ್ದಿರಿಸುವಿಕೆಗಾಗಿ ದೇವಸ್ಥಾನದ ಆಡಳಿತ ಮಂಡಳಿಯನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.'
                            : 'For rental details, package options, and booking availability, please contact the trust office.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Marriage Hall Photo */}
                <div className="lg:col-span-5 relative gsap-about-mantapa">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-saffron-500 rounded-2xl blur-xs opacity-30"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-100 bg-white p-2">
                    <LazyImage 
                      src={marriageHallPhoto} 
                      alt={lang === 'kn' ? 'ಶಾಂತಮೂರ್ತಿ ಸಭಾಭವನ' : 'Shantamurthi Sabhabhavana'} 
                      imgClassName="transition-transform duration-500 hover:scale-[1.02]"
                      className="w-full h-[320px] sm:h-[380px] rounded-xl"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-xs py-2 px-3.5 rounded-lg border border-white/10 text-center">
                      <p className="text-white text-sm sm:text-base md:text-lg font-semibold">
                        {lang === 'kn' ? 'ಭವ್ಯ ಹಾಗೂ ಸುಸಜ್ಜಿತ ಮಂಗಲ ಭವನ' : 'The Grand and Holy Marriage Hall'}
                      </p>
                    </div>
                  </div>
                  {/* Beautiful decorative mandala element */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 text-saffron-500 opacity-60 pointer-events-none">
                    <CornerRangoli size={48} colorClass="text-amber-600/30" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4.5. GALLERY SECTION */}
      {currentPage === 'gallery' && (
        <section ref={gallerySectionRef} id="gallery" className="pt-28 pb-20 bg-stone-100 relative overflow-hidden">
          {/* Subtle background spiritual mandala watermark ornament */}
          <div className="absolute -left-8 -top-8 sm:-left-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none">
            <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb currentPage={currentPage} navigateToPage={navigateToPage} lang={lang} t={t} />
          
          <div className="flex flex-col items-center mb-10 text-center gsap-gallery-card">
            <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
              {lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರದ ಛಾಯಾಚಿತ್ರಗಳು ಮತ್ತು ದೃಶ್ಯಾವಳಿಗಳು' : 'Divine Gallery'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-stone-900 mb-4">
              {lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರ ಗ್ಯಾಲರಿ' : 'Temple Media Gallery'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mb-4" />
            <p className="text-stone-700 font-normal max-w-2xl text-base sm:text-lg md:text-xl">
              {lang === 'kn'
                ? 'ದೇವಸ್ಥಾನದ ಧಾರ್ಮಿಕ ವಿಧಿವಿಧಾನಗಳು, ವಿಶೇಷ ಅಲಂಕಾರಗಳು, ದಿವ್ಯ ದೃಶ್ಯಗಳು ಮತ್ತು ಪೂಜಾ ವೀಡಿಯೊಗಳು.'
                : 'Sacred visual snapshots, divine decors, and spiritual video highlights of Shri Shaneshwara Temple.'}
            </p>
          </div>

          {/* Image & Video Segment Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-10 gsap-gallery-card">
            <button
              onClick={() => setActiveGalleryTab('images')}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-extrabold tracking-wide transition-all shadow-xs cursor-pointer ${
                activeGalleryTab === 'images'
                  ? 'bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-md shadow-saffron-500/20 ring-1 ring-saffron-400/20'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <ImageIcon className="w-4.5 h-4.5" />
              <span>{lang === 'kn' ? 'ಚಿತ್ರಗಳು (Photos)' : 'Photos'}</span>
            </button>
            <button
              onClick={() => setActiveGalleryTab('videos')}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-extrabold tracking-wide transition-all shadow-xs cursor-pointer ${
                activeGalleryTab === 'videos'
                  ? 'bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-md shadow-saffron-500/20 ring-1 ring-saffron-400/20'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              <Video className="w-4.5 h-4.5" />
              <span>{lang === 'kn' ? 'ದೃಶ್ಯಾವಳಿಗಳು (Videos)' : 'Videos'}</span>
            </button>
          </div>

          {/* Gallery Items Grid */}
          {isGalleryLoading ? (
            <LoadingSkeleton variant="gallery" count={6} lang={lang} />
          ) : galleryError ? (
            <ErrorState message={galleryError} onRetry={fetchGalleryData} lang={lang} />
          ) : activeGalleryTab === 'images' ? (
            galleryImages.length === 0 ? (
              <EmptyState 
                icon="gallery" 
                title={lang === 'kn' ? 'ಯಾವುದೇ ಚಿತ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No Photos Available'} 
                description={lang === 'kn' ? "ದೇವಸ್ಥಾನದ 'gallery' ಕೋಷ್ಟಕಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ಚಿತ್ರಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ." : "No image items have been added to the 'gallery' table in Supabase yet."} 
                lang={lang} 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryImages.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: "easeOut" }}
                    onClick={() => handleMediaItemClick({ id: img.id, type: 'image', src: img.src, caption: img.caption })}
                    className="gsap-gallery-card group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/40 bg-white aspect-[4/3] w-full"
                  >
                    <LazyImage 
                      src={img.src} 
                      alt={img.caption}
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full object-cover object-top rounded-2xl"
                      className="w-full h-full aspect-[4/3] rounded-2xl"
                    />
                    
                    {/* Overlay with details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />
                    
                    {/* Soft constant gradient at bottom for text visibility */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone-950/70 to-transparent flex flex-col justify-end p-5" />
 
                    <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                      <p className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide leading-tight drop-shadow-sm group-hover:text-yellow-300 transition-colors duration-300">
                        {img.caption}
                      </p>
                      <span className="text-xs sm:text-sm text-stone-300 font-mono tracking-widest uppercase mt-1.5 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        🔍 {lang === 'kn' ? 'ದೊಡ್ಡದಾಗಿ ನೋಡಿ' : 'Click to zoom'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            galleryVideos.length === 0 ? (
              <EmptyState 
                icon="gallery" 
                title={lang === 'kn' ? 'ಯಾವುದೇ ದೃಶ್ಯಾವಳಿಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No Videos Available'} 
                description={lang === 'kn' ? "ದೇವಸ್ಥಾನದ 'gallery' ಕೋಷ್ಟಕಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ಪೂಜಾ ವೀಡಿಯೊಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ." : "No video items have been added to the 'gallery' table in Supabase yet."} 
                lang={lang} 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryVideos.map((vid, index) => (
                  <motion.div
                    key={vid.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: "easeOut" }}
                    onClick={() => handleMediaItemClick({ id: vid.id, type: 'video', src: vid.src, caption: vid.caption })}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/40 bg-stone-900 aspect-[4/3] w-full"
                  >
                    {/* Custom animated play button overlay */}
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-10">
                      <motion.div 
                        whileHover={{ scale: 1.15 }}
                        className="w-14 h-14 rounded-full bg-saffron-600/90 text-white flex items-center justify-center shadow-lg border border-saffron-400/40"
                      >
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </motion.div>
                    </div>
 
                    <LazyVideo 
                      src={vid.src} 
                      muted
                      loop
                      playsInline
                      className="w-full h-full aspect-[4/3] rounded-2xl"
                      videoClassName="w-full h-full object-cover object-top rounded-2xl"
                      poster={vid.poster}
                    />
 
                    {/* Caption & Title */}
                    <div className="absolute bottom-0 inset-x-0 p-5 z-20 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent">
                      <span className="text-xs font-bold bg-saffron-600 text-white px-2 py-0.5 rounded-md tracking-wider uppercase inline-block mb-2 font-mono">
                        VIDEO • {lang === 'kn' ? 'ವಿಡಿಯೋ' : 'PLAYBACK'}
                      </span>
                      <p className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide leading-tight drop-shadow-sm group-hover:text-yellow-300 transition-colors duration-300">
                        {vid.caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}

        </div>
      </section>
      )}

      {/* 5. SEVAS GRID & SANKALPA CALCULATOR */}
      {currentPage === 'seva' && (
        <section ref={sevaSectionRef} id="seva" className="pt-28 pb-20 bg-stone-50 relative overflow-hidden">
          {/* Subtle background spiritual mandala watermark ornament */}
          <div className="absolute -right-8 -top-8 sm:-right-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none">
            <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb currentPage={currentPage} navigateToPage={navigateToPage} lang={lang} t={t} />
          
          <div className="flex flex-col items-center mb-12 text-center gsap-seva-card">
            <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
              {lang === 'kn' ? 'ಶ್ರೀ ಸೇವಾ ಪಟ್ಟಿ' : 'Seva Offerings'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-stone-900 mb-4">
              {t.sevaSection.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mb-4" />
            <p className="text-stone-700 font-normal max-w-2xl text-base sm:text-lg md:text-xl">
              {lang === 'kn' 
                ? 'ದೇವಾಲಯದಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ನಡೆಸಲಾಗುವ ವಿವಿಧ ಪೂಜೆಗಳು ಮತ್ತು ಕಾಣಿಕೆ ವಿವರಗಳು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ.'
                : 'Below are the details of various sacred offerings and traditional poojas conducted at the temple.'}
            </p>
          </div>

          {isSevasLoading ? (
            <div className="max-w-4xl mx-auto">
              <LoadingSkeleton variant="sevas" lang={lang} />
            </div>
          ) : sevasError ? (
            <div className="max-w-4xl mx-auto">
              <ErrorState message={sevasError} onRetry={fetchSevasData} lang={lang} />
            </div>
          ) : sevas.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState 
                icon="sevas" 
                title={lang === 'kn' ? 'ಯಾವುದೇ ಸೇವೆಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No Sevas Available'} 
                description={lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ಸೇವಾ ಪಟ್ಟಿ ಸದ್ಯಕ್ಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪರಿಶೀಲಿಸಿ.' : 'No seva offerings are currently listed in the database. Please check back later.'} 
                lang={lang} 
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-stone-200/80 overflow-hidden relative gsap-seva-card">
              {/* Top decorative gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 via-amber-500 to-yellow-500" />
              
              <div className="overflow-x-auto pt-1.5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="py-4 px-6 text-sm sm:text-base md:text-lg font-extrabold text-stone-800 uppercase tracking-wider text-center w-20">
                        {lang === 'kn' ? 'ಕ್ರ.ಸಂ.' : 'S.No'}
                      </th>
                      <th className="py-4 px-6 text-sm sm:text-base md:text-lg font-extrabold text-stone-800 uppercase tracking-wider">
                        {lang === 'kn' ? 'ಸೇವೆಯ ಹೆಸರು' : 'Seva Name'}
                      </th>
                      <th className="py-4 px-6 text-sm sm:text-base md:text-lg font-extrabold text-stone-800 uppercase tracking-wider text-right w-36">
                        {lang === 'kn' ? 'ಕಾಣಿಕೆ' : 'Price'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sevas.map((seva, index) => (
                      <tr 
                        key={seva.id} 
                        className="hover:bg-saffron-50/20 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm sm:text-base md:text-lg font-mono text-stone-600 text-center font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-stone-900 text-base sm:text-lg md:text-xl">
                            {seva.name}
                          </div>
                          {seva.description && (
                            <div className="text-stone-600 text-sm sm:text-base mt-1.5 font-normal leading-relaxed">
                              {seva.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right font-extrabold text-saffron-700 text-base sm:text-lg md:text-xl whitespace-nowrap">
                          ₹{seva.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TEMPLE NOTICE BOARD SECTION */}
          <div className="max-w-4xl mx-auto mt-12 mb-8">
            <div className="bg-gradient-to-b from-stone-50 to-amber-50/20 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-saffron-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg sm:text-2xl tracking-tight font-display flex items-center gap-2">
                    {lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ಪ್ರಕಟಣಾ ಫಲಕ' : 'Temple Notice Board'}
                    <span className="text-saffron-500 text-xs sm:text-sm font-semibold border border-saffron-300 rounded-full px-2.5 py-0.5 bg-saffron-50 uppercase tracking-wider animate-pulse">
                      {lang === 'kn' ? 'ಮಾಹಿತಿ' : 'Notice'}
                    </span>
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm">
                    {lang === 'kn' ? 'ಭಕ್ತರಿಗೆ ಪ್ರಮುಖ ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಸೇವೆಗಳ ಮಾಹಿತಿ' : 'Important religious and community announcements for devotees'}
                  </p>
                </div>
              </div>

              {/* Notice Bullet Cards */}
              <div className="space-y-6 relative z-10">
                {/* Bullet 1 */}
                <div className="group bg-white hover:bg-amber-50/10 border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-300/60 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0 font-display font-extrabold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                    01
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md">
                        {lang === 'kn' ? 'ನಿತ್ಯ ಸೇವೆ' : 'Regular Service'}
                      </span>
                    </div>
                    {lang === 'kn' ? (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        ಕ್ಷೇತ್ರದಲ್ಲಿ ವಾರಕ್ಕೆ ಎರಡು ಬಾರಿ <span className="text-saffron-600 font-black">[ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ]</span> ಅನ್ನದಾನ ನಡೆಯುತ್ತಿದೆ. ಈ ಸೇವೆಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಲು ಕೌಂಟರ್ನಲ್ಲಿ ವಿಚಾರಿಸಬಹುದು.
                      </p>
                    ) : (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        At the temple, annadana (food offering) is conducted twice a week <span className="text-saffron-600 font-black">[on Monday and Saturday]</span>. Devotees who wish to participate in this service may inquire at the counter.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bullet 2 */}
                <div className="group bg-white hover:bg-amber-50/10 border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-300/60 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-display font-extrabold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                    02
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        {lang === 'kn' ? 'ವಿಶೇಷ ಸೇವೆ' : 'Special Offering'}
                      </span>
                    </div>
                    {lang === 'kn' ? (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        ವರ್ಷದಲ್ಲಿ ಮೂರು ಬಾರಿ ನಡೆಯುವ ಸಾಮೂಹಿಕ ಶನಿ ಶಾಂತಿ ಸೇವೆಯಲ್ಲಿ ಭಾಗವಹಿಸಲು ಭಕ್ತರು ಮುಂಚಿತವಾಗಿ ಕೌಂಟರ್ನಲ್ಲಿ ತಮ್ಮ ಹೆಸರು ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬೇಕು.
                      </p>
                    ) : (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        Three times a year, a collective Shani Shanti service is performed. Devotees who wish to take part must register their names in advance at the counter.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bullet 3 */}
                <div className="group bg-white hover:bg-amber-50/10 border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-300/60 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-display font-extrabold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                    03
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        {lang === 'kn' ? 'ಸತ್ಸಂಗ / ಚರಿತ್ರೆ ಪಠಣ' : 'Spiritual Discourse'}
                      </span>
                    </div>
                    {lang === 'kn' ? (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        ಕ್ಷೇತ್ರದಲ್ಲಿ ಶನಿ ಕಥಾ ಮಂಡಳಿ ಇದ್ದು, ಶ್ರೀಸ್ವಾಮಿಯ ಚರಿತ್ರೆಯನ್ನು ಮಾಡಿಸಲು ಆಸಕ್ತಿ ಹೊಂದಿರುವ ಭಕ್ತರು ಮುಂಚಿತವಾಗಿ ಕೌಂಟರ್ನಲ್ಲಿ ವಿಚಾರಿಸಬಹುದು.
                      </p>
                    ) : (
                      <p className="text-stone-900 text-base sm:text-lg font-extrabold leading-relaxed">
                        At the temple, a Shani Katha Mandali (storytelling group) is active. Devotees interested in narrating the story of the Lord may inquire in advance at the counter.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note Section below Seva Table */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex gap-4 items-start relative z-10">
                <span className="text-3xl sm:text-4xl shrink-0">⚠️</span>
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-stone-900 text-base sm:text-lg md:text-xl tracking-tight font-display">
                    {lang === 'kn' ? 'ಪ್ರಮುಖ ಸೂಚನೆ / Important Note' : 'Important Notice'}
                  </h4>
                  <p className="text-stone-800 text-sm sm:text-base md:text-lg leading-relaxed font-semibold">
                    {lang === 'kn' 
                      ? 'ಶ್ರೀ ಕ್ಷೇತ್ರದಲ್ಲಿ ಯಾವುದೇ ರೀತಿಯ ಆನ್‌ಲೈನ್ ಬುಕಿಂಗ್ ವ್ಯವಸ್ಥೆ ಇರುವುದಿಲ್ಲ. ಭಕ್ತಾದಿಗಳು ನೇರವಾಗಿ ದೇವಸ್ಥಾನದ ಕಾರ್ಯಾಲಯದ ಕೌಂಟರ್‌ನಲ್ಲಿ ನಿಗದಿತ ಕಾಣಿಕೆಯನ್ನು ಪಾವತಿಸಿ ರಶೀದಿಯನ್ನು ಪಡೆದುಕೊಂಡು ಸೇವೆಗಳನ್ನು ನಡೆಸಬೇಕಾಗಿ ವಿನಂತಿ.'
                      : 'There is no online booking facility or digital payment setup for sevas. Devotees are requested to directly visit the temple office counter, pay the prescribed seva amount, and obtain physical receipts to perform their offerings.'}
                  </p>
                  <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal italic">
                    {lang === 'kn'
                      ? 'ದೇವಸ್ಥಾನದ ಹೆಸರಿನಲ್ಲಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಹಣ ಕೇಳುವ ವಂಚಕರ ಬಗ್ಗೆ ಜಾಗರೂಕರಾಗಿರಿ.'
                      : 'Please be cautious of fraudulent online portals or individuals requesting digital transfers in the name of the temple.'}
                  </p>
                  <div className="pt-3 border-t border-amber-200/80 flex items-start sm:items-center gap-2 text-xs sm:text-sm text-stone-700">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      {lang === 'kn' ? (
                        <>
                          ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಯಾವುದೇ ಆನ್‌ಲೈನ್ ಬುಕಿಂಗ್, ಪಾವತಿ ಅಥವಾ ಗೋತ್ರ/ನಕ್ಷತ್ರ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ನಮ್ಮ{' '}
                          <button 
                            type="button" 
                            onClick={() => navigateToPage('privacy')}
                            className="text-saffron-700 hover:text-saffron-800 font-bold underline cursor-pointer inline"
                          >
                            ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು (Privacy Policy)
                          </button>{' '}
                          ಓದಿ.
                        </>
                      ) : (
                        <>
                          This website does not conduct online bookings, accept digital payments, or collect Gotra/Nakshatra details. For details, view our{' '}
                          <button 
                            type="button" 
                            onClick={() => navigateToPage('privacy')}
                            className="text-saffron-700 hover:text-saffron-800 font-bold underline cursor-pointer inline"
                          >
                            Privacy Policy
                          </button>
                          .
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </section>
      )}

      {/* 5. CONTACT SECTION & DIRECTIONS */}
      {currentPage === 'contact' && (
        <section ref={contactSectionRef} id="contact" className="pt-28 pb-20 bg-gradient-to-b from-stone-50 via-amber-50/35 to-stone-100 relative overflow-hidden">
          {/* Spiritual banner border along the top edge of contact section */}
          <SpiritualBannerBorder className="absolute top-0 left-0 right-0 opacity-40 z-10" />

          {/* Traditional Corner Rangoli designs for elegant visual framing */}
          <div className="absolute top-0 left-0 opacity-30 pointer-events-none z-10">
            <CornerRangoli size={120} colorClass="text-saffron-600/30" />
          </div>
          <div className="absolute top-0 right-0 opacity-30 pointer-events-none z-10 rotate-90">
            <CornerRangoli size={120} colorClass="text-saffron-600/30" />
          </div>

          {/* Subtle background spiritual mandala watermark ornament */}
          <div className="absolute -right-8 -top-8 sm:-right-20 sm:-top-20 opacity-20 sm:opacity-12 md:opacity-10 pointer-events-none z-0">
            <MandalaWatermark className="w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96" colorClass="text-saffron-600" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb currentPage={currentPage} navigateToPage={navigateToPage} lang={lang} t={t} />
          
          <div className="flex flex-col items-center mb-14 text-center gsap-contact-item">
            <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">Location & Reach</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-stone-900 mb-4">
              {t.contactSection.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full mb-4" />
            <p className="text-stone-700 font-normal max-w-2xl text-base sm:text-lg md:text-xl">
              {t.contactSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details & Address (5 of 12) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Address Card */}
              <div className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex gap-4 shadow-xs gsap-contact-item">
                <div className="w-11 h-11 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mb-2 uppercase tracking-wide">
                    {t.contactSection.addressLabel}
                  </h4>
                  <p className="text-stone-700 text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
                    {settings?.address || t.contactSection.address}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex gap-4 shadow-xs">
                <div className="w-11 h-11 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mb-2 uppercase tracking-wide">
                    {t.contactSection.phoneLabel}
                  </h4>
                  <div className="space-y-1.5">
                    {t.contactSection.phones.map((phone, idx) => {
                      const cleanPhone = phone.replace(/[^0-9+]/g, '');
                      return (
                        <a 
                          key={idx} 
                          href={`tel:${cleanPhone}`} 
                          className="block text-stone-800 hover:text-saffron-700 font-mono text-base sm:text-lg md:text-xl font-bold tracking-wide transition-colors cursor-pointer"
                        >
                          {phone}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <a 
                href={`mailto:${settings?.email || t.contactSection.email}`}
                className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex gap-4 hover:border-saffron-300 hover:bg-saffron-50/20 transition-all group cursor-pointer shadow-xs"
              >
                <div className="w-11 h-11 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center shrink-0 group-hover:bg-saffron-200/60 transition-colors">
                  <Mail className="w-5.5 h-5.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mb-2 uppercase tracking-wide">
                    {t.contactSection.emailLabel}
                  </h4>
                  <p className="text-stone-700 group-hover:text-saffron-700 text-sm sm:text-base md:text-lg font-bold break-all transition-colors">
                    {settings?.email || t.contactSection.email}
                  </p>
                </div>
              </a>

              {/* WhatsApp Card */}
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex gap-4 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group cursor-pointer shadow-xs"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-200/50 transition-colors">
                    <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.855-6.877C16.638 2.156 14.2 1.144 11.603 1.144c-5.439 0-9.865 4.37-9.868 9.73-.001 1.714.457 3.385 1.325 4.87l-.988 3.606 3.69-.968c1.452.793 2.872 1.191 4.285 1.191zm10.963-7.514c-.26-.13-1.538-.759-1.776-.847-.238-.086-.41-.13-.582.13-.172.26-.666.847-.818 1.02-.152.173-.304.195-.564.065-.26-.13-1.097-.404-2.09-1.288-.771-.687-1.292-1.536-1.443-1.796-.151-.26-.016-.4.114-.53.117-.117.26-.304.39-.456.13-.152.173-.26.26-.434.086-.173.043-.325-.021-.455-.065-.13-.582-1.4-.797-1.921-.21-.504-.44-.435-.604-.444-.156-.008-.337-.01-.518-.01-.18 0-.476.068-.724.34-.248.272-.947.926-.947 2.258 0 1.332.969 2.616 1.104 2.8.136.18 1.906 2.91 4.618 4.08.645.278 1.148.444 1.54.568.648.206 1.237.177 1.702.107.518-.078 1.538-.629 1.754-1.237.217-.609.217-1.13.152-1.237-.065-.107-.238-.173-.498-.303z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-base sm:text-lg mb-2 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">
                      {lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕ' : 'WhatsApp Contact'}
                    </h4>
                    <p className="text-stone-700 text-sm sm:text-base md:text-lg font-bold group-hover:text-emerald-600 transition-colors">
                      {settings.whatsapp_number}
                    </p>
                  </div>
                </a>
              )}

              {/* Contact Page Interactive Google Map with Direct Directions */}
              <div className="space-y-3 mt-6">
                <h4 className="font-extrabold text-stone-900 text-base sm:text-lg uppercase tracking-wide flex items-center gap-2">
                  <span>🗺️</span>
                  <span>{lang === 'kn' ? 'ನಕ್ಷೆ ಮತ್ತು ದಾರಿ ವಿವರ' : 'Interactive Map & Directions'}</span>
                </h4>
                <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-md h-72 bg-stone-100 group">
                  {/* Loading indicator for map iframe */}
                  {isMapLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-500 z-0">
                      <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-xs font-semibold text-stone-600">
                        {lang === 'kn' ? 'ನಕ್ಷೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading map...'}
                      </span>
                    </div>
                  )}

                  {/* Interactive Map Iframe */}
                  <iframe 
                    src={getValidMapEmbedUrl(settings?.google_maps_embed_url)} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shantamurti Shanishwar Convention Hall Map"
                    onLoad={() => setIsMapLoading(false)}
                    className={`w-full h-full pointer-events-none transition-opacity duration-300 ${isMapLoading ? 'opacity-0' : 'opacity-100'}`}
                  />
                  {/* Direct Clickable Map Overlay: Map container itself serves as effective trigger for directions */}
                  <a
                    href={CANONICAL_SHANTAMURTI_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={lang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ದಾರಿ ತಿಳಿಯಲು ನಕ್ಷೆ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click map to get directions on Google Maps'}
                    aria-label={lang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ದಾರಿ ಪಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Get directions to Shantamurti Shanishwar on Google Maps'}
                    className="absolute inset-0 z-10 flex items-start justify-end p-3.5 bg-black/0 hover:bg-black/15 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-stone-900 text-xs font-bold shadow-md border border-stone-200 group-hover:bg-saffron-50 group-hover:text-saffron-700 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                      <span>{lang === 'kn' ? 'ನಕ್ಷೆ ತೆರೆಯಿರಿ' : 'Open Map'} ➔</span>
                    </span>
                  </a>
                </div>
                {/* Clear visual 'Get Directions' button below the map */}
                <div className="flex flex-col gap-3 mt-2">
                  <a
                    href={CANONICAL_SHANTAMURTI_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    <MapPin className="w-5 h-5 text-white" />
                    <span>{lang === 'kn' ? 'ದಾರಿ ಪಡೆಯಿರಿ (Get Directions) ➔' : 'Get Directions ➔'}</span>
                  </a>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 font-medium px-1">
                    <span>📍 {lang === 'kn' ? 'ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ, ಕರ್ನಾಟಕ' : 'Haadikere, Brahmavara, Karnataka'}</span>
                  </div>
                </div>
              </div>


            </div>

            {/* Interactive Prayer & Inquiry Form (7 of 12) */}
            <div id="contact-form-container" className="lg:col-span-7 bg-stone-50 border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-md">
              
              <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl md:text-2xl mb-6 pb-2 border-b border-stone-200 flex items-center gap-2">
                <span>✍️</span>
                <span>{t.contactSection.formTitle}</span>
              </h3>

              {contactSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-xl sm:text-2xl">
                    {lang === 'kn' ? 'ಪ್ರಾರ್ಥನೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!' : 'Prayer Request Sent!'}
                  </h4>
                  <p className="text-stone-700 text-sm sm:text-base md:text-lg font-normal max-w-md mx-auto leading-relaxed">
                    {t.contactSection.formSuccess}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5" noValidate>
                  {/* Spam Protection Honeypot field (hidden from real users via CSS & off-screen coordinates) */}
                  <div
                    aria-hidden="true"
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      left: '-9999px',
                      height: 0,
                      width: 0,
                      zIndex: -1,
                      pointerEvents: 'none',
                      overflow: 'hidden'
                    }}
                  >
                    <label htmlFor="website_url_hp">Leave this field blank</label>
                    <input
                      id="website_url_hp"
                      type="text"
                      name="website"
                      value={contactHoneypot}
                      onChange={(e) => setContactHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-stone-700 uppercase mb-1.5">
                        {lang === 'kn' ? 'ಹೆಸರು' : 'Your Name'} *
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          if (contactTouched.name) {
                            if (!e.target.value.trim()) {
                              setContactFormErrors(prev => ({ ...prev, name: lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter your name' }));
                            } else {
                              setContactFormErrors(prev => ({ ...prev, name: undefined }));
                            }
                          }
                        }}
                        onBlur={() => {
                          setContactTouched(prev => ({ ...prev, name: true }));
                          if (!contactName.trim()) {
                            setContactFormErrors(prev => ({ ...prev, name: lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter your name' }));
                          } else {
                            setContactFormErrors(prev => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder={t.contactSection.placeholderName}
                        className={`w-full p-3.5 border ${contactTouched.name && contactFormErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-saffron-500 focus:ring-saffron-500'} rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-1 bg-white transition-colors`}
                      />
                      {contactTouched.name && contactFormErrors.name && (
                        <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
                          {contactFormErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-extrabold text-stone-700 uppercase mb-1.5">
                        {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
                      </label>
                      <input 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                          if (contactTouched.email) {
                            if (e.target.value.trim() && !validateContactEmail(e.target.value)) {
                              setContactFormErrors(prev => ({ ...prev, email: lang === 'kn' ? 'ಮಾನ್ಯ ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Enter a valid email' }));
                            } else {
                              setContactFormErrors(prev => ({ ...prev, email: undefined }));
                            }
                          }
                        }}
                        onBlur={() => {
                          setContactTouched(prev => ({ ...prev, email: true }));
                          if (contactEmail.trim() && !validateContactEmail(contactEmail)) {
                            setContactFormErrors(prev => ({ ...prev, email: lang === 'kn' ? 'ಮಾನ್ಯ ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Enter a valid email' }));
                          } else {
                            setContactFormErrors(prev => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder={t.contactSection.placeholderEmail}
                        className={`w-full p-3.5 border ${contactTouched.email && contactFormErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-saffron-500 focus:ring-saffron-500'} rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-1 bg-white transition-colors`}
                      />
                      {contactTouched.email && contactFormErrors.email && (
                        <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
                          {contactFormErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-stone-700 uppercase mb-1.5">
                      {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Phone Number'}
                    </label>
                    <input 
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => {
                        setContactPhone(e.target.value);
                        if (contactTouched.phone) {
                          if (e.target.value.trim() && !validateContactPhone(e.target.value)) {
                            setContactFormErrors(prev => ({ ...prev, phone: lang === 'kn' ? 'ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (10 ಅಂಕಿಗಳು)' : 'Enter a valid Indian phone number' }));
                          } else {
                            setContactFormErrors(prev => ({ ...prev, phone: undefined }));
                          }
                        }
                      }}
                      onBlur={() => {
                        setContactTouched(prev => ({ ...prev, phone: true }));
                        if (contactPhone.trim() && !validateContactPhone(contactPhone)) {
                          setContactFormErrors(prev => ({ ...prev, phone: lang === 'kn' ? 'ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (10 ಅಂಕಿಗಳು)' : 'Enter a valid Indian phone number' }));
                        } else {
                          setContactFormErrors(prev => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder={t.contactSection.placeholderPhone}
                      className={`w-full p-3.5 border ${contactTouched.phone && contactFormErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-saffron-500 focus:ring-saffron-500'} rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-1 bg-white transition-colors`}
                    />
                    {contactTouched.phone && contactFormErrors.phone && (
                      <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
                        {contactFormErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-extrabold text-stone-700 uppercase mb-1.5">
                      {lang === 'kn' ? 'ಸಂದೇಶ / ಪ್ರಾರ್ಥನೆ ವಿವರ' : 'Prayer / Inquiry Details'} *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => {
                        setContactMessage(e.target.value);
                        if (contactTouched.message) {
                          if (!e.target.value.trim()) {
                            setContactFormErrors(prev => ({ ...prev, message: lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ' : 'Please enter your message' }));
                          } else {
                            setContactFormErrors(prev => ({ ...prev, message: undefined }));
                          }
                        }
                      }}
                      onBlur={() => {
                        setContactTouched(prev => ({ ...prev, message: true }));
                        if (!contactMessage.trim()) {
                          setContactFormErrors(prev => ({ ...prev, message: lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ' : 'Please enter your message' }));
                        } else {
                          setContactFormErrors(prev => ({ ...prev, message: undefined }));
                        }
                      }}
                      placeholder={t.contactSection.placeholderMessage}
                      className={`w-full p-3.5 border ${contactTouched.message && contactFormErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-saffron-500 focus:ring-saffron-500'} rounded-xl text-sm sm:text-base focus:outline-hidden focus:ring-1 bg-white transition-colors`}
                    />
                    {contactTouched.message && contactFormErrors.message && (
                      <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
                        {contactFormErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 bg-stone-50 border border-stone-200/80 p-3 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {lang === 'kn' ? (
                        <>
                          ಸಂದೇಶವನ್ನು ಸಲ್ಲಿಸುವ ಮೂಲಕ, ನೀವು ನಮ್ಮ{' '}
                          <button
                            type="button"
                            onClick={() => navigateToPage('privacy')}
                            className="text-saffron-600 hover:text-saffron-700 underline font-bold cursor-pointer inline"
                          >
                            ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು (Privacy Policy)
                          </button>{' '}
                          ಒಪ್ಪುತ್ತೀರಿ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸಂಪೂರ್ಣ ಗೌಪ್ಯವಾಗಿ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ.
                        </>
                      ) : (
                        <>
                          By submitting, you agree to our{' '}
                          <button
                            type="button"
                            onClick={() => navigateToPage('privacy')}
                            className="text-saffron-600 hover:text-saffron-700 underline font-bold cursor-pointer inline"
                          >
                            Privacy Policy
                          </button>
                          . Your data is kept strictly confidential.
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingContact ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.contactSection.submitForm}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

          {/* Temple Authorities & Trustees Section */}
          <div className="mt-16 pt-16 border-t border-stone-200">
            <div className="flex flex-col items-center mb-12 text-center">
              <span className="text-saffron-600 font-bold tracking-widest text-sm sm:text-base uppercase mb-2">
                {lang === 'kn' ? 'ಆಡಳಿತ ಮಂಡಳಿ ಪದಾಧಿಕಾರಿಗಳು' : 'Temple Administration & Trust'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-stone-900 mb-3">
                {lang === 'kn' ? 'ಮುಖ್ಯ ಸಂಪರ್ಕ ಅಧಿಕಾರಿಗಳು' : 'Key Contact Officials'}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {displayTrustees.map((member) => {
                const role = lang === 'kn' ? (member.role_kn?.trim() ? member.role_kn : member.role) : member.role;
                const name = lang === 'kn' ? (member.name_kn?.trim() ? member.name_kn : member.name) : member.name;
                return (
                  <div key={member.id} className="gsap-trustee-card bg-stone-50 border border-stone-200/80 rounded-2xl p-6 sm:p-8 text-center shadow-md flex flex-col items-center group hover:shadow-lg transition-all duration-300">
                    {/* Designation on top */}
                    <span className="text-saffron-600 text-sm sm:text-base font-extrabold uppercase tracking-wider mb-4 block">
                      {role}
                    </span>
                      
                      {/* Rounded Photo below designation */}
                      <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-saffron-100 transition-colors duration-300 flex items-center justify-center bg-stone-100">
                        {member.photo_url ? (
                          <img 
                            src={member.photo_url} 
                            alt={name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as any).style.display = 'none';
                              const parent = (e.target as any).parentNode;
                              if (parent) {
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = "w-full h-full bg-stone-100 flex items-center justify-center text-stone-400";
                                fallbackDiv.innerHTML = `<svg class="w-12 h-12 stroke-current" fill="none" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>`;
                                parent.appendChild(fallbackDiv);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                            <svg className="w-12 h-12 stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Name below photo */}
                      <h4 className="font-extrabold text-stone-900 text-xl sm:text-2xl mb-1.5 font-display">
                        {name}
                      </h4>
                      
                      {/* Action Symbols Only (Phone Call, WhatsApp Chat, Email) */}
                      {(member.phone || member.email) && (() => {
                        const cleanPhone = member.phone ? member.phone.replace(/[^0-9+]/g, '') : '';
                        const waDigits = member.phone ? member.phone.replace(/[^0-9]/g, '') : '';
                        const waText = encodeURIComponent(
                          lang === 'kn'
                            ? `ನಮಸ್ತೆ ${name}, ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ ಹಾಡಿಕೆರೆಯ ವಿಚಾರಣೆಗಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ.`
                            : `Namaste ${name}, I am contacting you regarding Sri Shaneshwara Temple, Haadikere.`
                        );
                        const emailSubject = encodeURIComponent(
                          lang === 'kn' 
                            ? `ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ ಹಾಡಿಕೆರೆ - ವಿಚಾರಣೆ (${name})`
                            : `Sri Shaneshwara Temple Haadikere - Inquiry (${name})`
                        );

                        return (
                          <div className="flex items-center justify-center gap-3.5 sm:gap-4.5 mt-5 pt-1">
                            {/* 1. Phone Call Symbol */}
                            {member.phone && (
                              <a
                                href={`tel:${cleanPhone}`}
                                title={lang === 'kn' ? `ಕರೆ ಮಾಡಿ: ${member.phone}` : `Call: ${member.phone}`}
                                aria-label={lang === 'kn' ? `ಕರೆ ಮಾಡಿ: ${member.phone}` : `Call: ${member.phone}`}
                                className="w-12 h-12 rounded-full bg-amber-50 hover:bg-saffron-600 text-saffron-600 hover:text-white border border-amber-200 hover:border-saffron-600 flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                <Phone className="w-5 h-5 transition-transform" />
                              </a>
                            )}

                            {/* 2. WhatsApp Chat Symbol */}
                            {waDigits && (
                              <a
                                href={`https://wa.me/${waDigits}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={lang === 'kn' ? `ವಾಟ್ಸಾಪ್ ಚಾಟ್ (${member.phone})` : `WhatsApp (${member.phone})`}
                                aria-label={lang === 'kn' ? `ವಾಟ್ಸಾಪ್ ಚಾಟ್: ${member.phone}` : `WhatsApp: ${member.phone}`}
                                className="w-12 h-12 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.855-6.877C16.638 2.156 14.2 1.144 11.603 1.144c-5.439 0-9.865 4.37-9.868 9.73-.001 1.714.457 3.385 1.325 4.87l-.988 3.606 3.69-.968c1.452.793 2.872 1.191 4.285 1.191zm10.963-7.514c-.26-.13-1.538-.759-1.776-.847-.238-.086-.41-.13-.582.13-.172.26-.666.847-.818 1.02-.152.173-.304.195-.564.065-.26-.13-1.097-.404-2.09-1.288-.771-.687-1.292-1.536-1.443-1.796-.151-.26-.016-.4.114-.53.117-.117.26-.304.39-.456.13-.152.173-.26.26-.434.086-.173.043-.325-.021-.455-.065-.13-.582-1.4-.797-1.921-.21-.504-.44-.435-.604-.444-.156-.008-.337-.01-.518-.01-.18 0-.476.068-.724.34-.248.272-.947.926-.947 2.258 0 1.332.969 2.616 1.104 2.8.136.18 1.906 2.91 4.618 4.08.645.278 1.148.444 1.54.568.648.206 1.237.177 1.702.107.518-.078 1.538-.629 1.754-1.237.217-.609.217-1.13.152-1.237-.065-.107-.238-.173-.498-.303z"/>
                                </svg>
                              </a>
                            )}

                            {/* 3. Email Symbol */}
                            {member.email && (
                              <a
                                href={`mailto:${member.email}?subject=${emailSubject}`}
                                title={lang === 'kn' ? `ಇಮೇಲ್ ಕಳುಹಿಸಿ: ${member.email}` : `Send Email: ${member.email}`}
                                aria-label={lang === 'kn' ? `ಇಮೇಲ್ ಕಳುಹಿಸಿ: ${member.email}` : `Send Email: ${member.email}`}
                                className="w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                <Mail className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      </section>
      )}

      {/* 6. PRIVACY POLICY SECTION */}
      {currentPage === 'privacy' && (
        <div ref={privacySectionRef}>
          <PrivacyPolicy 
            lang={lang} 
            navigateToPage={navigateToPage} 
            settings={settings} 
          />
        </div>
      )}

      {/* 7. 404 NOT FOUND SECTION */}
      {currentPage === 'notfound' && (
        <NotFound 
          lang={lang} 
          navigateToPage={navigateToPage} 
          settings={settings} 
        />
      )}
        </motion.main>
      </AnimatePresence>

      {/* 7. FOOTER */}
      <footer id="footer" className="bg-stone-950 text-stone-200 pt-16 pb-24 sm:pb-20 border-t border-stone-800 relative z-10 overflow-hidden">
        {/* Traditional mango leaf (toran) style border decoration at the top edge of footer */}
        <SpiritualBannerBorder className="absolute top-0 left-0 right-0 opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Temple Info & Address & Socials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🕉️</span>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
                    {t.templeName}
                  </span>
                  <span className="text-xs text-saffron-400 uppercase tracking-wider font-bold">
                    {t.templeSub}
                  </span>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                {settings?.address || (lang === 'kn' 
                  ? 'ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ ತಾಲ್ಲೂಕು, ಉಡುಪಿ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ - 576221.'
                  : 'Shantamurthy Sri Shaneshwara Temple, Sri Kshetra Haadikere, Brahmavara Taluk, Udupi District, Karnataka - 576221.')}
              </p>

              {/* Social Real Icons */}
              <div className="flex items-center gap-3 pt-2">
                {/* WhatsApp */}
                <a 
                  href={settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}` : "https://wa.me/919902207990"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-green-500 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 shadow-sm"
                  title="WhatsApp Contact"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.855-6.877C16.638 2.156 14.2 1.144 11.603 1.144c-5.439 0-9.865 4.37-9.868 9.73-.001 1.714.457 3.385 1.325 4.87l-.988 3.606 3.69-.968c1.452.793 2.872 1.191 4.285 1.191zm10.963-7.514c-.26-.13-1.538-.759-1.776-.847-.238-.086-.41-.13-.582.13-.172.26-.666.847-.818 1.02-.152.173-.304.195-.564.065-.26-.13-1.097-.404-2.09-1.288-.771-.687-1.292-1.536-1.443-1.796-.151-.26-.016-.4.114-.53.117-.117.26-.304.39-.456.13-.152.173-.26.26-.434.086-.173.043-.325-.021-.455-.065-.13-.582-1.4-.797-1.921-.21-.504-.44-.435-.604-.444-.156-.008-.337-.01-.518-.01-.18 0-.476.068-.724.34-.248.272-.947.926-.947 2.258 0 1.332.969 2.616 1.104 2.8.136.18 1.906 2.91 4.618 4.08.645.278 1.148.444 1.54.568.648.206 1.237.177 1.702.107.518-.078 1.538-.629 1.754-1.237.217-.609.217-1.13.152-1.237-.065-.107-.238-.173-.498-.303z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/haadikere_shanitemple" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-300 shadow-sm"
                  title="Instagram Page"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com/haadikereshanitemple" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 shadow-sm"
                  title="Facebook Page"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>

                {/* Email */}
                <a 
                  href={`mailto:${settings?.email || 'shanthamoorthyshaneshwara1995@gmail.com'}`} 
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-saffron-500 hover:border-saffron-500/50 hover:bg-saffron-500/5 transition-all duration-300 shadow-sm"
                  title="Email Us"
                >
                  <Mail className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-white border-l-2 border-saffron-500 pl-3">
                {lang === 'kn' ? 'ತ್ವರಿತ ಸಂಪರ್ಕಗಳು' : 'Quick Navigation'}
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base">
                {(['home', 'about', 'gallery', 'seva', 'contact'] as const).map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => navigateToPage(section)}
                      className={`hover:text-saffron-400 transition-colors duration-200 cursor-pointer text-left ${
                        currentPage === section ? 'text-saffron-400 font-bold' : 'text-stone-300'
                      }`}
                    >
                      ✦ {t.nav[section]}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => navigateToPage('privacy')}
                    className={`hover:text-saffron-400 transition-colors duration-200 cursor-pointer text-left ${
                      currentPage === 'privacy' ? 'text-saffron-400 font-bold' : 'text-stone-300'
                    }`}
                  >
                    ✦ {t.nav.privacy || (lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ' : 'Privacy Policy')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Temple Timings */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-white border-l-2 border-saffron-500 pl-3">
                {lang === 'kn' ? 'ದರ್ಶನದ ಸಮಯ' : 'Temple Timings'}
              </h3>
              <div className="space-y-3.5 text-sm sm:text-base text-stone-300 font-normal">
                <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800">
                  <p className="font-extrabold text-yellow-400 mb-1">
                    {lang === 'kn' ? 'ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ (ವಿಶೇಷ ಪೂಜೆ)' : 'Monday & Saturday (Special Puja)'}
                  </p>
                  <p className="text-white font-medium">
                    {lang === 'kn' ? 'ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 8:00 ರವರೆಗೆ' : '6:00 AM to 8:00 PM'}
                  </p>
                </div>
                <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-850">
                  <p className="font-extrabold text-yellow-100 mb-1">
                    {lang === 'kn' ? 'ಇತರ ದಿನಗಳು' : 'Other Days'}
                  </p>
                  <p className="text-stone-200">
                    {lang === 'kn' 
                      ? 'ಬೆಳಿಗ್ಗೆ 7:00 - ಮಧ್ಯಾಹ್ನ 1:00 | ಸಂಜೆ 4:30 - ರಾತ್ರಿ 7:30' 
                      : '7:00 AM - 1:00 PM | 4:30 PM - 7:30 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 4: Google Map Integration */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-white border-l-2 border-saffron-500 pl-3">
                {lang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ ದಾರಿ' : 'Google Map Route'}
              </h3>
              <div className="rounded-xl overflow-hidden border border-stone-800 shadow-md h-32 w-full bg-stone-900 relative group">
                <iframe 
                  src={getValidMapEmbedUrl(settings?.google_maps_embed_url)} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shri Shaneshwara Temple Haadikere Map"
                  className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
                {/* Direct Clickable Map Overlay in Footer */}
                <a
                  href={CANONICAL_SHANTAMURTI_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === 'kn' ? 'ದೇವಸ್ಥಾನಕ್ಕೆ ಲೈವ್ ದಾರಿ ಪಡೆಯಿರಿ' : 'Get live directions to the temple'}
                  title={lang === 'kn' ? 'ದೇವಸ್ಥಾನಕ್ಕೆ ದಾರಿ ಪಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to get directions to temple'}
                  className="absolute inset-0 z-10 flex items-center justify-center p-2 bg-stone-950/20 group-hover:bg-stone-950/50 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold shadow-md transition-transform group-hover:scale-105">
                    <MapPin className="w-3.5 h-3.5 animate-bounce" />
                    <span>{lang === 'kn' ? 'ಲೈವ್ ದಾರಿ ಪಡೆಯಿರಿ' : 'Get Live Directions'} ➔</span>
                  </span>
                </a>
              </div>
              <a 
                href={CANONICAL_SHANTAMURTI_DIRECTIONS_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs sm:text-sm text-saffron-400 hover:text-saffron-300 flex items-center gap-1 hover:underline transition-all mt-1 cursor-pointer font-bold"
              >
                <MapPin className="w-4 h-4 text-saffron-500 animate-pulse" />
                <span>{lang === 'kn' ? 'ಲೈವ್ ದಾರಿ ನಕ್ಷೆ ಪಡೆಯಿರಿ' : 'Get Live Directions'} ➔</span>
              </a>
            </div>

          </div>

          <div className="h-px bg-stone-800 w-full my-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-center gap-2 text-sm sm:text-base text-stone-300 text-center px-4 sm:px-6 relative z-20 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-normal">
              <span>
                © 2026 {lang === 'kn' ? 'ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ದೇವಸ್ಥಾನ ಟ್ರಸ್ಟ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' : 'Shri Kshetra Haadikere Temple Trust. All rights reserved.'}
              </span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <button 
                onClick={() => navigateToPage('privacy')}
                className="text-stone-300 hover:text-saffron-400 underline transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)' : 'Privacy Policy'}
              </button>
            </div>
            <p className="font-semibold text-stone-200">
              Designed & Developed by{' '}
              <a 
                href="#" 
                /* Replace '#' with your portfolio URL e.g. 'https://your-portfolio.com' */
                title="Developer: Yashodhar Mogaveer"
                className="text-amber-400 font-bold tracking-wide hover:text-saffron-300 transition-colors duration-200 font-display no-underline"
              >
                Yashodhar Mogaveer
              </a>
              .
            </p>
          </div>

        </div>
      </footer>

      {/* Dynamic Lightbox Modal with Pan, Zoom, Touch Swipe, Download, Key Shortcuts */}
      {(() => {
        const activeList = activeGalleryTab === 'images' 
          ? galleryImages
          : galleryVideos;

        const handlePrevItem = () => {
          if (!activeLightboxItem) return;
          const currentIndex = activeList.findIndex(item => item.id === activeLightboxItem.id);
          if (currentIndex !== -1) {
            const prevIdx = (currentIndex - 1 + activeList.length) % activeList.length;
            setZoomLevel(1);
            setActiveLightboxItem({ ...activeList[prevIdx], id: activeList[prevIdx].id });
          }
        };

        const handleNextItem = () => {
          if (!activeLightboxItem) return;
          const currentIndex = activeList.findIndex(item => item.id === activeLightboxItem.id);
          if (currentIndex !== -1) {
            const nextIdx = (currentIndex + 1) % activeList.length;
            setZoomLevel(1);
            setActiveLightboxItem({ ...activeList[nextIdx], id: activeList[nextIdx].id });
          }
        };

        const handleDownload = async (src: string, filename: string) => {
          try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.warn("Blob fetch failed, falling back to window.open", error);
            const link = document.createElement('a');
            link.href = src;
            link.setAttribute('download', filename);
            link.setAttribute('target', '_blank');
            link.click();
          }
        };

        // Keyboard handler
        useEffect(() => {
          if (!activeLightboxItem) return;

          const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
              case 'ArrowRight':
                handleNextItem();
                break;
              case 'ArrowLeft':
                handlePrevItem();
                break;
              case 'Escape':
                setActiveLightboxItem(null);
                break;
              case 'f':
              case 'F':
                toggleAppFullScreen();
                break;
              case '+':
              case '=':
                setZoomLevel(z => Math.min(z + 0.5, 4));
                break;
              case '-':
              case '_':
                setZoomLevel(z => Math.max(z - 0.5, 1));
                break;
              case 'r':
              case 'R':
                setZoomLevel(1);
                break;
              case 'd':
              case 'D':
                handleDownload(activeLightboxItem.src, `${activeLightboxItem.type}_${activeLightboxItem.id}.${activeLightboxItem.type === 'image' ? 'jpg' : 'mp4'}`);
                break;
              default:
                break;
            }
          };

          window.addEventListener('keydown', handleKeyDown);
          return () => window.removeEventListener('keydown', handleKeyDown);
        }, [activeLightboxItem, activeGalleryTab]);

        return (
          <AnimatePresence>
            {activeLightboxItem && (
              <div 
                className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
              >
                {/* Overlay Backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-950/95 backdrop-blur-md cursor-pointer"
                  onClick={() => setActiveLightboxItem(null)}
                />

                {/* Lightbox Box */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative max-w-5xl w-full bg-transparent overflow-hidden z-10 flex flex-col items-center justify-center gap-4 focus:outline-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setActiveLightboxItem(null)}
                    className="absolute top-4 right-4 z-25 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white cursor-pointer transition-colors"
                    title="Close / ಮುಚ್ಚಿ"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={handlePrevItem}
                    className="absolute left-2 sm:left-4 p-2.5 sm:p-3.5 rounded-full bg-black/55 hover:bg-black/80 border border-white/10 text-white cursor-pointer transition-all hover:scale-105 active:scale-95 z-30"
                    title="Previous / ಹಿಂದಿನದು"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextItem}
                    className="absolute right-2 sm:right-4 p-2.5 sm:p-3.5 rounded-full bg-black/55 hover:bg-black/80 border border-white/10 text-white cursor-pointer transition-all hover:scale-105 active:scale-95 z-30"
                    title="Next / ಮುಂದಿನದು"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Media Content Area */}
                  <div className="relative max-h-[75vh] sm:max-h-[80vh] w-full flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 p-1.5 overflow-hidden shadow-2xl">
                    {activeLightboxItem.type === 'image' ? (
                      <div className="relative w-full max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center">
                        <motion.img 
                          ref={lightboxImageRef}
                          key={activeLightboxItem.src}
                          src={activeLightboxItem.src} 
                          alt="Gallery preview"
                          referrerPolicy="no-referrer"
                          drag={zoomLevel > 1}
                          dragConstraints={{ left: -250 * (zoomLevel - 1), right: 250 * (zoomLevel - 1), top: -250 * (zoomLevel - 1), bottom: 250 * (zoomLevel - 1) }}
                          dragElastic={0.15}
                          style={{ scale: zoomLevel }}
                          onClick={handleLightboxImageClick}
                          className="max-w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded-xl select-none transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center">
                        <video 
                          ref={lightboxVideoRef}
                          key={activeLightboxItem.src}
                          src={activeLightboxItem.src} 
                          controls
                          autoPlay
                          playsInline
                          preload="metadata"
                          className="max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Control Toolbar (Symbols Only) */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 bg-black/75 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/15 shadow-2xl z-30">
                    {/* Zoom controls for Images */}
                    {activeLightboxItem.type === 'image' && (
                      <>
                        <button
                          onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                          className="p-2 text-stone-300 hover:text-white transition-all hover:bg-white/15 rounded-full cursor-pointer active:scale-90"
                          title="Zoom In"
                          aria-label="Zoom In"
                        >
                          <ZoomIn className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                          className="p-2 text-stone-300 hover:text-white transition-all hover:bg-white/15 rounded-full cursor-pointer active:scale-90"
                          title="Zoom Out"
                          aria-label="Zoom Out"
                        >
                          <ZoomOut className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setZoomLevel(1)}
                          className="p-2 text-stone-300 hover:text-white transition-all hover:bg-white/15 rounded-full cursor-pointer active:scale-90"
                          title="Reset"
                          aria-label="Reset"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                        <div className="w-px h-5 bg-white/20 self-center mx-0.5" />
                      </>
                    )}

                    {/* Full Screen Symbol */}
                    <button
                      onClick={toggleAppFullScreen}
                      className="p-2 text-stone-300 hover:text-white transition-all hover:bg-white/15 rounded-full cursor-pointer active:scale-90"
                      title="Full Screen"
                      aria-label="Full Screen"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>

                    <div className="w-px h-5 bg-white/20 self-center mx-0.5" />

                    {/* Download Symbol */}
                    <button
                      onClick={() => handleDownload(activeLightboxItem.src, `${activeLightboxItem.type}_${activeLightboxItem.id}.${activeLightboxItem.type === 'image' ? 'jpg' : 'mp4'}`)}
                      className="p-2 text-stone-300 hover:text-white transition-all hover:bg-white/15 rounded-full cursor-pointer active:scale-90"
                      title="Download"
                      aria-label="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        );
      })()}

      {/* FLOATING ACTION BUTTONS (Back to Top & WhatsApp Support - Synchronized on Scroll rendered via Portal) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showBackToTop && (
            <motion.div 
              id="floating-actions-container"
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.85 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed z-[9999] flex flex-col items-end gap-3 pointer-events-auto select-none"
              style={{
                bottom: 'max(1.25rem, calc(1rem + env(safe-area-inset-bottom)))',
                right: 'max(1rem, calc(1rem + env(safe-area-inset-right)))'
              }}
            >
              {/* 1. Back to Top Floating Button */}
              <motion.button
                key="back-to-top-btn"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-xl hover:shadow-saffron-500/40 transition-all duration-300 cursor-pointer border-2 border-white/40 focus:ring-2 focus:ring-saffron-500 touch-manipulation active:scale-95"
                title={lang === 'kn' ? 'ಮೇಲಕ್ಕೆ ಹೋಗಿ' : 'Back to Top'}
                aria-label={lang === 'kn' ? 'ಮೇಲಕ್ಕೆ ಹೋಗಿ' : 'Back to Top'}
                id="back-to-top-btn"
              >
                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 animate-bounce-slow" />
              </motion.button>

              {/* 2. WhatsApp Floating Button */}
              <motion.a
                key="whatsapp-floating-btn"
                href={settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}` : "https://wa.me/919902207990"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 border-2 border-white/50 cursor-pointer focus:ring-2 focus:ring-[#25D366] touch-manipulation relative group"
                title={lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಸಹಾಯ' : 'WhatsApp Support'}
                aria-label={lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಸಹಾಯ' : 'WhatsApp Support'}
                id="whatsapp-floating-btn"
              >
                {/* Pulsing aura ring around WhatsApp */}
                <span className="absolute -inset-1 rounded-full bg-[#25D366]/50 animate-ping opacity-60 pointer-events-none" />
                
                <svg 
                  viewBox="0 0 448 512" 
                  className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10 shrink-0 drop-shadow-xs group-hover:scale-110 transition-transform duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Embedded Sound Wave Styling in JSX Styles */}
      <style>{`
        @keyframes sound-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-sound-wave {
          animation: sound-wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>

    </div>
  );
}
