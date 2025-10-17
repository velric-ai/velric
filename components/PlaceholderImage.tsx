import React from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  text: string;
  className?: string;
}

export default function PlaceholderImage({ width, height, text, className = "" }: PlaceholderImageProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-purple-900/30 to-purple-600/30 flex items-center justify-center text-white/60 text-sm font-medium border border-purple-500/20 ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-2 opacity-40">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
}