import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileText, 
  EyeOff, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
  MessageSquare
} from 'lucide-react';
import { Language, PageType } from '../types';
import { 
  SpiritualBannerBorder, 
  CornerRangoli, 
  MandalaWatermark 
} from './SpiritualOrnaments';

interface PrivacyPolicyProps {
  lang: Language;
  navigateToPage: (page: PageType) => void;
  settings?: any;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  lang,
  navigateToPage,
  settings
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const templeEmail = settings?.email || 'shanthamoorthyshaneshwara1995@gmail.com';
  const templePhone = settings?.phone_number || '+91 99022 07990 / +91 87929 78777';
  const templeAddress = settings?.address || (lang === 'kn'
    ? 'ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ ತಾಲ್ಲೂಕು, ಉಡುಪಿ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ - 576221.'
    : 'Shantamurthy Sri Shaneshwara Temple, Sri Kshetra Haadikere, Brahmavara Taluk, Udupi District, Karnataka - 576221.');

  return (
    <section 
      id="privacy-policy-section" 
      className="pt-28 pb-20 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 relative overflow-hidden min-h-screen"
    >
      {/* Spiritual banner top border */}
      <SpiritualBannerBorder className="absolute top-0 left-0 right-0 opacity-40 z-10" />

      {/* Traditional Corner Rangoli designs */}
      <div className="absolute top-0 left-0 opacity-30 pointer-events-none z-10">
        <CornerRangoli size={120} colorClass="text-saffron-600/30" />
      </div>
      <div className="absolute top-0 right-0 opacity-30 pointer-events-none z-10 rotate-90">
        <CornerRangoli size={120} colorClass="text-saffron-600/30" />
      </div>

      {/* Background Spiritual Mandala */}
      <div className="absolute -right-12 top-24 opacity-15 pointer-events-none z-0">
        <MandalaWatermark className="w-72 sm:w-96 h-72 sm:h-96" colorClass="text-saffron-600" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm font-medium mb-8 bg-white border border-stone-200/80 py-2 px-3.5 rounded-full w-fit shadow-xs relative z-20"
          aria-label="Breadcrumb"
        >
          <button 
            onClick={() => navigateToPage('home')}
            className="hover:text-saffron-600 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-stone-600"
          >
            <span>{lang === 'kn' ? 'ಮುಖ್ಯ ಪುಟ' : 'Home'}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-saffron-600 font-bold">
            {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ' : 'Privacy Policy'}
          </span>
        </motion.nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-50 border border-saffron-200/70 text-saffron-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-saffron-600" />
            <span>{lang === 'kn' ? 'ಪವಿತ್ರ ಗೌಪ್ಯತೆ ಮತ್ತು ರಕ್ಷಣೆ' : 'Devotee Privacy & Trust'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight font-display mb-4">
            {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ' : 'Privacy Policy'}
          </h1>

          <p className="text-base sm:text-lg text-stone-700 font-medium leading-relaxed">
            {lang === 'kn'
              ? 'ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನದ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನ ಮಾಹಿತಿ ಗೌಪ್ಯತೆ ಮತ್ತು ಭಕ್ತರ ವಿವರಗಳ ರಕ್ಷಣಾ ನೀತಿ.'
              : 'Official Privacy Policy of Shantamurthy Sri Shaneshwara Temple website (Sri Kshetra Haadikere), explaining how we handle contact inquiries with complete confidentiality.'}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-stone-500">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{lang === 'kn' ? 'ಕೊನೆಯ ನವೀಕರಣ: ೨೦೨೬' : 'Last Updated: 2026'}</span>
          </div>
        </div>

        {/* Devotional Introduction Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-2 border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex flex-col sm:flex-row gap-5 items-start relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <HeartHandshake className="w-7 h-7 text-amber-600" />
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
                <span>{lang === 'kn' ? 'ಭಕ್ತರ ನಂಬಿಕೆ ಮತ್ತು ಪಾರದರ್ಶಕತೆ' : 'Our Commitment to Transparency'}</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {lang === 'kn'
                  ? 'ಈ ವೆಬ್‌ಸೈಟ್ ಕೇವಲ ಮಾಹಿತಿ ಮತ್ತು ವಿಚಾರಣಾ ಉದ್ದೇಶಗಳಿಗಾಗಿ ರಚಿಸಲಾದ ವೇದಿಕೆಯಾಗಿದೆ. ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಯಾವುದೇ ಆನ್‌ಲೈನ್ ಪೂಜಾ/ಸೇವಾ ಬುಕಿಂಗ್, ಆನ್‌ಲೈನ್ ಪಾವತಿ, ಅಥವಾ ಭಕ್ತರ ಗೋತ್ರ ಮತ್ತು ಜನ್ಮ ನಕ್ಷತ್ರಗಳ ಸಂಗ್ರಹಣೆ ಇರುವುದಿಲ್ಲ. ಭಕ್ತಾದಿಗಳು ಸಂಪರ್ಕ ಪುಟದಲ್ಲಿ ವಿಚಾರಣೆಗಾಗಿ ನೀಡುವ ಸೀಮಿತ ವಿವರಗಳನ್ನು ಮಾತ್ರ ನಾವು ಸಂಪೂರ್ಣ ಗೌಪ್ಯವಾಗಿ ರಕ್ಷಿಸುತ್ತೇವೆ.'
                  : 'This website serves solely as an informational portal for devotees. We do not provide online seva/pooja bookings, we do not accept digital payments online, and we do not collect personal astrological data such as Gotra or Nakshatra. We only receive basic contact information voluntarily submitted by devotees via our Contact page to respond to inquiries.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Structured Policy Sections */}
        <div className="space-y-8">
          
          {/* Section 1: Exactly What Data is Collected via Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center font-bold text-lg shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' 
                  ? '೧. ನಾವು ಸಂಗ್ರಹಿಸುವ ಸೀಮಿತ ಮಾಹಿತಿ (ಸಂಪರ್ಕ ಪುಟದಲ್ಲಿ ಮಾತ್ರ)' 
                  : '1. Information We Collect (Contact Page Only)'}
              </h3>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {lang === 'kn'
                ? 'ಭಕ್ತಾದಿಗಳು ನಮ್ಮ "ಸಂಪರ್ಕಿಸಿ" (Contact Us) ಫಾರ್ಮ್ ಮೂಲಕ ಸ್ವಯಂಪ್ರೇರಿತರಾಗಿ ಸಂದೇಶ ಕಳುಹಿಸಿದಾಗ ಮಾತ್ರ ಈ ಕೆಳಗಿನ ೪ ವಿವರಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ:'
                : 'When a devotee voluntarily submits an inquiry through our "Contact Us" form, we receive only the following 4 basic details:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {lang === 'kn' ? '೧. ಭಕ್ತರ ಹೆಸರು (Name)' : '1. Devotee Name'}
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    {lang === 'kn' 
                      ? 'ನಿಮ್ಮ ವಿಚಾರಣೆಗೆ ಮರ್ಯಾದೆಯಿಂದ ಉತ್ತರಿಸಲು ಮತ್ತು ನಿಮ್ಮನ್ನು ಸಂಭೋದಿಸಲು ಮಾತ್ರ.' 
                      : 'Used solely to address and greet you respectfully in our reply.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {lang === 'kn' ? '೨. ಇಮೇಲ್ ವಿಳಾಸ (Email Address)' : '2. Email Address'}
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    {lang === 'kn' 
                      ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಲಿಖಿತ ಉತ್ತರ ಅಥವಾ ದೇವಸ್ಥಾನದ ವಿವರಗಳನ್ನು ಇಮೇಲ್ ಮೂಲಕ ಕಳುಹಿಸಲು.' 
                      : 'To send you a written response or detailed information about your inquiry.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {lang === 'kn' ? '೩. ದೂರವಾಣಿ ಸಂಖ್ಯೆ (Phone / Mobile)' : '3. Phone / Mobile Number'}
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    {lang === 'kn' 
                      ? 'ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ದರ್ಶನ ಸಮಯ ಅಥವಾ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಿಮ್ಮೊಂದಿಗೆ ನೇರವಾಗಿ ಮಾತನಾಡಲು.' 
                      : 'To call or message you back regarding darshan timings or temple directions if requested.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {lang === 'kn' ? '೪. ವಿಚಾರಣಾ ಸಂದೇಶ (Message / Inquiry)' : '4. Inquiry Message'}
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    {lang === 'kn' 
                      ? 'ನೀವು ದೇವಸ್ಥಾನಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ಬರೆದು ಕಳುಹಿಸಿದ ಪ್ರಶ್ನೆ ಅಥವಾ ಸಂದೇಶ.' 
                      : 'The specific question or feedback regarding temple visits, hall booking, or timings.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: What We DO NOT Collect */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' 
                  ? '೨. ನಾವು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸದ ವಿವರಗಳು (ಪ್ರಮುಖ ಸ್ಪಷ್ಟೀಕರಣ)' 
                  : '2. Information We DO NOT Collect on This Website'}
              </h3>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {lang === 'kn'
                ? 'ಭಕ್ತರ ಸಂಪೂರ್ಣ ಸ್ಪಷ್ಟತೆಗಾಗಿ, ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಈ ಕೆಳಗಿನ ಯಾವುದೇ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ:'
                : 'For complete transparency and peace of mind, our website explicitly DOES NOT collect:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    {lang === 'kn' ? 'ಗೋತ್ರ ಮತ್ತು ನಕ್ಷತ್ರ ಸಂಗ್ರಹವಿಲ್ಲ' : 'No Gotra / Nakshatra'}
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    {lang === 'kn' 
                      ? 'ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಯಾವುದೇ ಗೋತ್ರ, ನಕ್ಷತ್ರ ಅಥವಾ ಜಾತಕ ವಿವರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.' 
                      : 'We do not ask for or store Gotra, Nakshatra, or astrological data online.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    {lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ಸೇವಾ ಬುಕಿಂಗ್ ಇಲ್ಲ' : 'No Online Seva Bookings'}
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    {lang === 'kn' 
                      ? 'ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಯಾವುದೇ ಪೂಜಾ ಅಥವಾ ಸೇವಾ ಬುಕಿಂಗ್ ವ್ಯವಸ್ಥೆ ಇರುವುದಿಲ್ಲ. ಎಲ್ಲಾ ಸೇವೆಗಳು ಕೇವಲ ದೇವಸ್ಥಾನದ ನೇರ ಕೌಂಟರ್‌ನಲ್ಲಿ ಮಾತ್ರ.' 
                      : 'All sevas and poojas must be booked physically at the temple office counter in Haadikere.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    {lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ಪಾವತಿ / ಹಣಕಾಸು ವಿವರಗಳಿಲ್ಲ' : 'No Payment / Bank Data'}
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    {lang === 'kn' 
                      ? 'ಯಾವುದೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್, ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಅಥವಾ ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳನ್ನು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕೇಳಲಾಗುವುದಿಲ್ಲ.' 
                      : 'We never ask for credit cards, bank accounts, or financial transactions online.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Why We Use Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' ? '೩. ಸಂಪರ್ಕ ಮಾಹಿತಿಯ ಬಳಕೆಯ ಉದ್ದೇಶ' : '3. Purpose of Using Contact Details'}
              </h3>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {lang === 'kn'
                ? 'ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಮೂಲಕ ಭಕ್ತರು ನೀಡಿದ ಹೆಸರನ್ನು, ಇಮೇಲ್ ಮತ್ತು ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ಕೇವಲ ಈ ಕೆಳಗಿನ ಸೀಮಿತ ಉದ್ದೇಶಗಳಿಗೆ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ:'
                : 'Devotee contact information is used exclusively for the following specific purposes:'}
            </p>

            <ul className="space-y-3 text-stone-700 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'kn' ? 'ಪ್ರಶ್ನೆಗಳಿಗೆ ನೇರ ಪ್ರತಿಕ್ರಿಯೆ:' : 'Direct Response to Inquiries:'}</strong>{' '}
                  {lang === 'kn' 
                    ? 'ಭಕ್ತಾದಿಗಳು ಕೇಳಿದ ದರ್ಶನ ಸಮಯ, ವಿಶೇಷ ದಿನಗಳು, ರಸ್ತೆ ಮಾರ್ಗಸೂಚಿ ಅಥವಾ ದೇವಸ್ಥಾನದ ಸೇವೆಗಳ ಬಗೆಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸೂಕ್ತ ಮಾಹಿತಿ ನೀಡಲು.'
                    : 'To reply to your questions regarding darshan timings, temple directions, festival schedules, and facilities.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'kn' ? 'ಕಲ್ಯಾಣ ಮಂಟಪ ವಿಚಾರಣೆ:' : 'Kalyana Mantapa Hall Inquiries:'}</strong>{' '}
                  {lang === 'kn'
                    ? 'ಕಲ್ಯಾಣ ಮಂಟಪ ಸಭಾಭವನದ ಲಭ್ಯತೆ ಮತ್ತು ನಿಯಮಗಳ ಕುರಿತ ವಿಚಾರಣೆಗಳಿಗೆ ಸ್ಪಷ್ಟನೆ ನೀಡಲು.'
                    : 'To provide information regarding marriage hall availability, dining hall facilities, and booking guidelines.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'kn' ? 'ಯಾವುದೇ ಅನಗತ್ಯ ಪ್ರಚಾರವಿಲ್ಲ:' : 'Zero Spam & Promotional Messages:'}</strong>{' '}
                  {lang === 'kn'
                    ? 'ನಾವು ಯಾವುದೇ ವಾಣಿಜ್ಯ ಜಾಹೀರಾತು, ಪ್ರಚಾರ ಅಥವಾ ಸ್ಪ್ಯಾಮ್ ಸಂದೇಶಗಳನ್ನು ಭಕ್ತರಿಗೆ ಕಳುಹಿಸುವುದಿಲ್ಲ.'
                    : 'We do not send unsolicited marketing, automated promotional calls, or third-party advertisements.'}
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Section 4: Strict Zero-Sharing & No-Sale Policy */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-amber-50/50 border-2 border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' ? '೪. ಮಾಹಿತಿ ಮಾರಾಟ ಮಾಡದಿರುವಿಕೆ & ಗೌಪ್ಯತೆ (No-Sale Policy)' : '4. Strict Zero-Sharing & No-Sale Policy'}
              </h3>
            </div>

            <div className="space-y-3 text-stone-800 text-sm sm:text-base leading-relaxed">
              <p className="font-bold text-stone-900">
                {lang === 'kn'
                  ? '🔒 ನಾವು ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಭಕ್ತರ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ, ಬಾಡಿಗೆಗೆ ಕೊಡುವುದಿಲ್ಲ ಅಥವಾ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ.'
                  : '🔒 We strictly NEVER sell, rent, commercialize, or share your contact details with any third-party advertisers, agencies, or external organizations.'}
              </p>
              <p>
                {lang === 'kn'
                  ? 'ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಮೂಲಕ ನೀವು ಹಂಚಿಕೊಂಡ ವಿವರಗಳನ್ನು ಕೇವಲ ದೇವಸ್ಥಾನದ ಅಧಿಕೃತ ಆಡಳಿತ ಮಂಡಳಿಯು ಮಾತ್ರ ನಿರ್ವಹಿಸುತ್ತದೆ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸಂಪೂರ್ಣ ಗೌಪ್ಯವಾಗಿ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತವಾಗಿ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ.'
                  : 'Information shared via our contact page is handled solely by authorized temple trust staff for the purpose of answering your queries. Your privacy is treated with reverent sanctity.'}
              </p>
            </div>
          </motion.div>

          {/* Section 5: Data Retention */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' ? '೫. ಮಾಹಿತಿಯನ್ನು ಎಷ್ಟು ಕಾಲ ಇರಿಸಲಾಗುತ್ತದೆ?' : '5. Data Retention Period'}
              </h3>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {lang === 'kn'
                ? 'ಭಕ್ತರು ಕಳುಹಿಸಿದ ಸಂದೇಶಗಳಿಗೆ ಉತ್ತರಿಸುವವರೆಗೆ ಮಾತ್ರ ಅವರ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಇರಿಸಲಾಗುತ್ತದೆ. ವಿಚಾರಣೆ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಅಂತಹ ತಾತ್ಕಾಲಿಕ ಸಂದೇಶಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ ಅಥವಾ ಆಡಳಿತ ದಾಖಲೆಯಲ್ಲಿ ಗೌಪ್ಯವಾಗಿ ಇರಿಸಲಾಗುತ್ತದೆ.'
                : 'Devotee contact messages are retained only as long as necessary to address and resolve your inquiry. Once the communication is complete, temporary messages are securely archived or deleted.'}
            </p>
          </motion.div>

          {/* Section 6: Cookies and Language Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-lg shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                {lang === 'kn' ? '೬. ವೆಬ್‌ಸೈಟ್ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಭಾಷಾ ಆಯ್ಕೆ' : '6. Website Technology & Language Preferences'}
              </h3>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {lang === 'kn'
                ? 'ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಯಾವುದೇ ಆಕ್ರಮಣಕಾರಿ ಮೂರನೇ ವ್ಯಕ್ತಿ ಟ್ರ್ಯಾಕರ್ ಅಥವಾ ವಾಣಿಜ್ಯ ಜಾಹೀರಾತು ಕುಕೀಗಳನ್ನು ಬಳಸುವುದಿಲ್ಲ. ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯನ್ನು (ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್) ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ನೆನಪಿಟ್ಟುಕೊಳ್ಳಲು ಮಾತ್ರ ಕನಿಷ್ಠ ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಸಂಗ್ರಹವನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.'
                : 'We do not use invasive third-party ad pixels or tracking cookies. The website only uses minimal local browser storage to remember your chosen language preference (Kannada or English) for a smooth browsing experience.'}
            </p>
          </motion.div>

          {/* Section 7: Contact for Privacy Queries */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border-2 border-saffron-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                  {lang === 'kn' ? '೭. ಗೌಪ್ಯತೆ ಕುರಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ದೇವಸ್ಥಾನದ ಸಂಪರ್ಕ' : '7. Contact Us Regarding Privacy'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಮಾಹಿತಿ ಅಥವಾ ಗೌಪ್ಯತೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ನಮ್ಮನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'For any questions or concerns regarding your contact details, reach out to the temple management'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Email Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-saffron-600 font-bold text-xs uppercase tracking-wider">
                    <Mail className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಅಧಿಕೃತ ಇಮೇಲ್' : 'Official Email'}</span>
                  </div>
                  <a 
                    href={`mailto:${templeEmail}`}
                    className="text-stone-900 font-bold text-xs sm:text-sm hover:text-saffron-600 break-all transition-colors block pt-1"
                  >
                    {templeEmail}
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Phone Numbers'}</span>
                  </div>
                  <p className="text-stone-900 font-bold text-xs sm:text-sm pt-1">
                    {templePhone}
                  </p>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-600 font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ದೇವಸ್ಥಾನದ ವಿಳಾಸ' : 'Temple Address'}</span>
                  </div>
                  <p className="text-stone-700 text-xs sm:text-sm pt-1 leading-relaxed">
                    {templeAddress}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between">
              <button
                onClick={() => navigateToPage('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <span>{lang === 'kn' ? 'ಸಂಪರ್ಕ ಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Visit Contact Page'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateToPage('seva')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <span>{lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಳ ಮಾಹಿತಿ' : 'Explore Sevas Information'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
