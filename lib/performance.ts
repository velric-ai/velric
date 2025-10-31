// PERFORMANCE: Utility functions for performance optimization

/**
 * Throttle function to limit the rate of function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function to delay function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const criticalResources = [
    '/assets/logo.png',
    // Add other critical resources here
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.endsWith('.png') || resource.endsWith('.jpg') || resource.endsWith('.webp') ? 'image' : 'fetch';
    link.href = resource;
    document.head.appendChild(link);
  });
}

/**
 * Optimize scroll performance
 */
export function optimizeScrollPerformance() {
  let ticking = false;

  function updateScrollPosition() {
    // Add scroll-based optimizations here
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device supports hover
 */
export function supportsHover(): boolean {
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Performance monitoring
 */
export function measurePerformance(name: string, fn: () => void) {
  if ('performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
}

/**
 * Web Vitals monitoring (simplified)
 */
export function initWebVitals() {
  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
}

/**
 * Optimize animations for performance
 */
export function optimizeAnimations() {
  // Disable animations on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }

  // Disable animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
}