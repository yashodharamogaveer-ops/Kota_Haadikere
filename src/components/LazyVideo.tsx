import React, { useState, useEffect, useRef } from 'react';

export interface LazyVideoProps extends React.ComponentPropsWithoutRef<'video'> {
  src: string;
  className?: string;
  videoClassName?: string;
  rootMargin?: string;
  poster?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: 'none' | 'metadata' | 'auto' | '';
}

export function LazyVideo({
  src,
  className = '',
  videoClassName = '',
  rootMargin = '250px',
  poster,
  ...props
}: LazyVideoProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Once video metadata is ready and first frame is available
  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-stone-950 ${className}`}
    >
      {/* Loading Skeleton / Spinner placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-900 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-saffron-500/20 border-t-saffron-600 rounded-full animate-spin" />
            <span className="text-[10px] text-saffron-400 uppercase tracking-widest font-mono font-bold animate-pulse">🕉️ Loading Video</span>
          </div>
        </div>
      )}

      {isIntersected ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onLoadedData={handleLoadedData}
          onLoadedMetadata={handleLoadedData}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-70 group-hover:opacity-90' : 'opacity-0'
          } ${videoClassName}`}
          {...props}
        />
      ) : poster ? (
        // Render a placeholder poster preview if available
        <img
          src={poster}
          alt="Video preview placeholder"
          className="w-full h-full object-cover opacity-30 blur-xs"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-stone-900" />
      )}
    </div>
  );
}
