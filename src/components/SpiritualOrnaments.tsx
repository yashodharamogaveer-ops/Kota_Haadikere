import React from 'react';
import { motion } from 'motion/react';

interface OrnamentProps {
  className?: string;
  size?: number | string;
  colorClass?: string;
}

export const MandalaWatermark: React.FC<OrnamentProps> = ({ 
  className = '', 
  size, 
  colorClass = 'text-saffron-500' 
}) => {
  const style: React.CSSProperties = {};
  if (size) {
    const responsiveSize = typeof size === 'number' ? `clamp(160px, 45vw, ${size}px)` : size;
    style.width = responsiveSize;
    style.height = responsiveSize;
  }

  const defaultSizeClass = (!size && !className.includes('w-')) 
    ? 'w-44 sm:w-64 md:w-80 lg:w-96 h-44 sm:h-64 md:h-80 lg:h-96' 
    : '';

  return (
    <motion.div
      className={`pointer-events-none select-none shrink-0 ${defaultSizeClass} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      style={style}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${colorClass}`}
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
      >
        {/* Outer dotted circle */}
        <circle cx="50" cy="50" r="48" strokeDasharray="1,2" />
        <circle cx="50" cy="50" r="45" />

        {/* 16 Petals pattern */}
        {Array.from({ length: 16 }).map((_, idx) => {
          const angle = (idx * 360) / 16;
          return (
            <path
              key={`petal-outer-${idx}`}
              d="M 50 5 Q 53 25 50 45 Q 47 25 50 5"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}

        {/* Outer scallop / wave border */}
        {Array.from({ length: 32 }).map((_, idx) => {
          const angle = (idx * 360) / 32;
          return (
            <path
              key={`scallop-${idx}`}
              d="M 50 2 Q 51.5 5 53 2"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}

        {/* Mid circles */}
        <circle cx="50" cy="50" r="38" strokeDasharray="2,2" />
        <circle cx="50" cy="50" r="32" />

        {/* Inner star / triangle geometric layer */}
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * 360) / 8;
          return (
            <path
              key={`star-${idx}`}
              d="M 50 18 L 62 40 L 38 40 Z"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}

        {/* Inner petals */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const angle = (idx * 360) / 12;
          return (
            <path
              key={`petal-inner-${idx}`}
              d="M 50 24 Q 52 35 50 42 Q 48 35 50 24"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}

        {/* Center Lotus */}
        <circle cx="50" cy="50" r="14" />
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * 360) / 8;
          return (
            <path
              key={`lotus-${idx}`}
              d="M 50 38 C 53 43 53 47 50 50 C 47 47 47 43 50 38"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}
        <circle cx="50" cy="50" r="4" className="fill-current" />
      </svg>
    </motion.div>
  );
};

export const CornerRangoli: React.FC<OrnamentProps> = ({
  className = '',
  size = 150,
  colorClass = 'text-amber-500/10'
}) => {
  return (
    <div 
      className={`pointer-events-none select-none ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${colorClass}`}
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
      >
        {/* Corner fan-out petals */}
        <path d="M 0 0 C 30 0 50 20 50 50 C 20 50 0 30 0 0 Z" />
        <path d="M 0 0 C 20 0 40 10 40 40 C 10 40 0 20 0 0 Z" strokeDasharray="1,1" />
        
        {/* Radiating arcs */}
        <circle cx="0" cy="0" r="10" />
        <circle cx="0" cy="0" r="20" strokeDasharray="2,2" />
        <circle cx="0" cy="0" r="30" />
        <circle cx="0" cy="0" r="40" />
        <circle cx="0" cy="0" r="50" strokeDasharray="3,3" />
        <circle cx="0" cy="0" r="65" />
        <circle cx="0" cy="0" r="80" />

        {/* Small teardrops along 45 degree axis */}
        <path d="M 0 0 L 56 56" strokeDasharray="1,2" />
        <path d="M 45 45 C 50 50 55 50 60 60 C 50 55 50 50 45 45 Z" className="fill-current" />
        <path d="M 28 28 C 32 32 35 32 38 38 C 32 35 32 32 28 28 Z" className="fill-current" />
        
        {/* Little decorative flowers */}
        <g transform="translate(15, 60) scale(0.6)">
          <circle cx="0" cy="0" r="4" />
          <path d="M-4,0 Q0,-8 4,0 Q0,8 -4,0" />
          <path d="M0,-4 Q8,0 0,4 Q-8,0 0,-4" />
        </g>
        <g transform="translate(60, 15) scale(0.6)">
          <circle cx="0" cy="0" r="4" />
          <path d="M-4,0 Q0,-8 4,0 Q0,8 -4,0" />
          <path d="M0,-4 Q8,0 0,4 Q-8,0 0,-4" />
        </g>
      </svg>
    </div>
  );
};

export const SpiritualBannerBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-4 overflow-hidden flex justify-center text-saffron-500/20 select-none pointer-events-none ${className}`}>
      <div className="flex shrink-0 gap-6">
        {Array.from({ length: 40 }).map((_, i) => (
          <svg key={i} viewBox="0 0 40 20" className="w-10 h-5" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M 0 0 Q 10 15 20 0 Q 30 15 40 0" />
            <path d="M 10 5 Q 10 12 13 12 Q 13 5 10 5" fill="currentColor" />
            <path d="M 30 5 Q 30 12 33 12 Q 33 5 30 5" fill="currentColor" />
            <circle cx="20" cy="11" r="2.5" className="fill-current" />
          </svg>
        ))}
      </div>
    </div>
  );
};
