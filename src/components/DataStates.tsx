import React from 'react';
import { RefreshCw, AlertCircle, Sparkles, Inbox, Calendar, Image as ImageIcon, Users, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface LoadingSkeletonProps {
  variant?: 'table' | 'grid-cards' | 'gallery' | 'timeline' | 'banner' | 'card' | 'events';
  count?: number;
  className?: string;
  lang?: Language;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'grid-cards',
  count = 3,
  className = '',
  lang = 'kn'
}) => {
  const loadingText = lang === 'kn' ? 'ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading details...';

  if (variant === 'banner') {
    return (
      <div className={`w-full py-3 px-4 bg-stone-900/90 flex items-center justify-center gap-3 animate-pulse ${className}`}>
        <div className="w-4 h-4 rounded-full bg-amber-400/40 animate-spin" />
        <div className="h-4 bg-stone-700/80 rounded w-48 sm:w-72" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`w-full bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs p-6 ${className}`}>
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="h-5 bg-amber-100/70 rounded-md w-32 animate-pulse" />
          <div className="h-5 bg-stone-200/80 rounded-md w-24 animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: count || 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-50 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-amber-50/80 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-2/5" />
                <div className="h-3 bg-stone-100 rounded w-4/5" />
              </div>
              <div className="w-16 h-5 bg-amber-100/60 rounded shrink-0" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-stone-400 text-xs font-medium">
          <div className="w-3.5 h-3.5 border-2 border-saffron-500/50 border-t-transparent rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  if (variant === 'gallery') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: count || 6 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs h-64 sm:h-72 relative flex flex-col justify-end p-4 animate-pulse"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-stone-100 to-amber-50/40" />
              <div className="relative z-10 space-y-2">
                <div className="h-4 bg-stone-300/70 rounded w-3/4" />
                <div className="h-3 bg-stone-200/70 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-stone-500 text-xs sm:text-sm font-medium pt-2">
          <div className="w-4 h-4 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      </div>
    );
  }

  if (variant === 'events') {
    return (
      <div className={`bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-md ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse">
          <div className="lg:col-span-5 aspect-[3/4] max-w-[340px] mx-auto w-full bg-stone-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-12 h-12 text-stone-300" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-4 bg-amber-100 rounded w-28" />
            <div className="h-8 bg-stone-200 rounded w-4/5" />
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-11/12" />
              <div className="h-4 bg-stone-100 rounded w-3/4" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-amber-100/70 rounded-full w-32" />
              <div className="h-10 bg-stone-100 rounded-full w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: count || 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-stone-200/70 shadow-xs animate-pulse space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-6 bg-amber-100 rounded-full" />
              <div className="h-6 bg-stone-200 rounded w-1/3" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Grid of cards (Trustees, Features, etc.)
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count || 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col items-center text-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-stone-200" />
          <div className="h-4 bg-amber-100 rounded w-1/2 mt-2" />
          <div className="h-5 bg-stone-200 rounded w-3/4" />
          <div className="h-3 bg-stone-100 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  icon?: 'inbox' | 'calendar' | 'gallery' | 'users' | 'history' | 'sparkles';
  title?: string;
  description?: string;
  lang?: Language;
  className?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  lang = 'kn',
  className = '',
  actionText,
  onAction
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return <Calendar className="w-10 h-10 text-amber-600/70" />;
      case 'gallery':
        return <ImageIcon className="w-10 h-10 text-amber-600/70" />;
      case 'users':
        return <Users className="w-10 h-10 text-amber-600/70" />;
      case 'history':
        return <BookOpen className="w-10 h-10 text-amber-600/70" />;
      case 'sparkles':
        return <Sparkles className="w-10 h-10 text-amber-600/70" />;
      case 'inbox':
      default:
        return <Inbox className="w-10 h-10 text-amber-600/70" />;
    }
  };

  const defaultTitle = lang === 'kn' ? 'ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ' : 'No Information Available';
  const defaultDesc = lang === 'kn' 
    ? 'ಪ್ರಸ್ತುತ ಈ ವಿಭಾಗಕ್ಕೆ ಯಾವುದೇ ವಿವರಗಳು ಸೇರಿಸಲಾಗಿಲ್ಲ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ದೇವಸ್ಥಾನದ ಕಾರ್ಯಾಲಯವನ್ನು ಸಂಪರ್ಕಿಸಿ.'
    : 'No active records found for this section at the moment. Please check back later or contact the temple office.';

  return (
    <div className={`py-12 px-6 text-center bg-stone-50/70 border border-stone-200/80 rounded-3xl max-w-xl mx-auto shadow-xs relative overflow-hidden ${className}`}>
      {/* Subtle top saffron accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full" />
      
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 mx-auto flex items-center justify-center mb-4 shadow-2xs">
        {getIcon()}
      </div>

      <h4 className="text-lg sm:text-xl font-extrabold text-stone-900 mb-2 font-display">
        {title || defaultTitle}
      </h4>

      <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
        {description || defaultDesc}
      </p>

      {actionText && onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  lang?: Language;
  className?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  lang = 'kn',
  className = '',
  compact = false
}) => {
  const defaultMessage = lang === 'kn'
    ? 'ಮಾಹಿತಿಯನ್ನು ಪಡೆಯುವಾಗ ದೋಷ ಕಂಡುಬಂದಿದೆ.'
    : 'Unable to load content at this time.';

  const retryText = lang === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry';

  if (compact) {
    return (
      <div className={`flex items-center justify-between gap-3 p-3 bg-amber-50/90 border border-amber-300/80 rounded-xl text-xs sm:text-sm text-stone-800 ${className}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">{message || defaultMessage}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{retryText}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`py-10 px-6 text-center bg-amber-50/60 border border-amber-200/90 rounded-3xl max-w-lg mx-auto shadow-xs ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 mx-auto flex items-center justify-center mb-3 shadow-2xs">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-display">
        {lang === 'kn' ? 'ಮಾಹಿತಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ' : 'Could Not Load Details'}
      </h4>

      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-5">
        {message || defaultMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
};
