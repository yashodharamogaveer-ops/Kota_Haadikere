import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  ArrowLeft, 
  Compass, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Language, PageType } from '../types';
import { 
  SpiritualBannerBorder, 
  CornerRangoli, 
  MandalaWatermark 
} from './SpiritualOrnaments';
import shaniDevLogo from '../assets/images/shani_dev_logo_1784204786723.jpg';

interface NotFoundProps {
  lang: Language;
  navigateToPage: (page: PageType) => void;
  settings?: any;
}

export const NotFound: React.FC<NotFoundProps> = ({
  lang,
  navigateToPage,
  settings
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const logoSrc = settings?.logo_url || shaniDevLogo;

  return (
    <section 
      id="not-found-section" 
      className="pt-28 pb-20 bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100 relative overflow-hidden min-h-[80vh] flex items-center justify-center"
    >
      {/* Spiritual banner top border */}
      <SpiritualBannerBorder className="absolute top-0 left-0 right-0 opacity-40 z-10" />

      {/* Traditional Corner Rangoli designs */}
      <div className="absolute top-0 left-0 opacity-25 pointer-events-none z-10">
        <CornerRangoli size={100} colorClass="text-saffron-600/30" />
      </div>
      <div className="absolute top-0 right-0 opacity-25 pointer-events-none z-10 rotate-90">
        <CornerRangoli size={100} colorClass="text-saffron-600/30" />
      </div>

      {/* Background Spiritual Mandala */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0">
        <MandalaWatermark className="w-96 sm:w-[32rem] h-96 sm:h-[32rem]" colorClass="text-saffron-600" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        {/* Breadcrumb Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-2 text-stone-500 text-xs sm:text-sm font-medium mb-8 bg-white border border-stone-200/80 py-1.5 px-3.5 rounded-full mx-auto w-fit shadow-xs"
          aria-label="Breadcrumb"
        >
          <button 
            onClick={() => navigateToPage('home')}
            className="hover:text-saffron-600 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-stone-600"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>{lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-saffron-600 font-bold">
            404
          </span>
        </motion.nav>

        {/* Central Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/80 rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden"
        >
          {/* Subtle glowing radial background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Temple Logo & 404 Visual Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-saffron-500 via-amber-400 to-yellow-500 shadow-md flex items-center justify-center relative">
              <img 
                src={logoSrc} 
                alt="Lord Shani Dev Temple Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-stone-900 text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-full border-2 border-amber-400 shadow-xs flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400 animate-spin-slow" />
                <span>404</span>
              </div>
            </div>
          </div>

          {/* 404 Large Display Heading */}
          <div className="mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200/70 text-saffron-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              <span>{lang === 'kn' ? 'ದೋಷ ೪೦೪' : 'Error 404'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
              {lang === 'kn' ? 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ' : 'Page Not Found'}
            </h1>
          </div>

          {/* Short Descriptive Message */}
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-medium">
            {lang === 'kn'
              ? 'ಕ್ಷಮಿಸಿ, ನೀವು ವೀಕ್ಷಿಸಲು ಬಯಸಿದ ವೆಬ್ ಪುಟವು ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಬದಲಾಗಿದೆ. ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ ದರ್ಶನ, ಸೇವೆಗಳು ಹಾಗೂ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಿರಿ.'
              : 'Sorry, the page you are looking for does not exist or may have been moved. Please return to the homepage to explore temple history, sevas, and darshan details.'}
          </p>

          {/* Primary Call-To-Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateToPage('home')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Homepage'}</span>
            </button>
          </div>

          {/* Quick Helpful Nav Links */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-600">
            <span className="font-semibold text-stone-400">
              {lang === 'kn' ? 'ಉಪಯುಕ್ತ ಪುಟಗಳು:' : 'Quick links:'}
            </span>
            <button
              onClick={() => navigateToPage('about')}
              className="text-stone-700 hover:text-saffron-600 underline font-medium cursor-pointer"
            >
              {lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ಬಗ್ಗೆ' : 'About Temple'}
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={() => navigateToPage('seva')}
              className="text-stone-700 hover:text-saffron-600 underline font-medium cursor-pointer"
            >
              {lang === 'kn' ? 'ಸೇವೆಗಳು' : 'Sevas'}
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={() => navigateToPage('gallery')}
              className="text-stone-700 hover:text-saffron-600 underline font-medium cursor-pointer"
            >
              {lang === 'kn' ? 'ಗ್ಯಾಲರಿ' : 'Gallery'}
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={() => navigateToPage('contact')}
              className="text-stone-700 hover:text-saffron-600 underline font-medium cursor-pointer"
            >
              {lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಿ' : 'Contact Us'}
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
