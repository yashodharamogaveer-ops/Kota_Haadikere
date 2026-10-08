import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps extends React.ComponentPropsWithoutRef<'img'> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  rootMargin?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export function LazyImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  rootMargin = '200px',
  referrerPolicy = 'no-referrer',
  ...props
}: LazyImageProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [isIntersected, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-stone-100 ${className}`}
    >
      {/* Dynamic Spiritual Spinner / Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200/50 animate-pulse flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-saffron-500/20 border-t-saffron-600 rounded-full animate-spin" />
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono font-bold animate-pulse">🕉️ Loading</span>
          </div>
        </div>
      )}

      {isIntersected ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-95 blur-md'
          } ${imgClassName}`}
          {...props}
        />
      ) : (
        // Minimal spacer matching the aspect ratio of the image block
        <div className="w-full h-full" />
      )}
    </div>
  );
}
