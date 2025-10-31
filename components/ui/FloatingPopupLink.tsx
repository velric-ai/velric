"use client";
import React, { useState } from "react";
import { X, ExternalLink, BookOpen } from "lucide-react";

export const FloatingPopupLink = ({ 
  externalLink = "https://mahir-s-site-699c.thinkific.com/products/courses/master-self-presentation-course",
  title = "Master Self-Presentation",
  description = "Learn how to present yourself with confidence and impact",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-40">
      {/* Popup Modal */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-8 w-80 mb-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-blue-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 pr-8">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4">
              {description}
            </p>

            {/* CTA Button */}
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-white px-4 py-2.5 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Enroll Now
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-400/10 rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-400/10 rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
      >
        <BookOpen className="w-6 h-6" />

        {/* Pulse animation */}
        <div
          className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-50 animate-pulse"
        ></div>

        {/* Tooltip on hover */}
        <div
          className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        >
          {title}
        </div>
      </button>
    </div>
  );
};

export default FloatingPopupLink;