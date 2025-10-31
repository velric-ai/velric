import { useEffect, useCallback, useRef } from 'react';

/**
 * PERFORMANCE: Custom hook for performance optimizations
 */
export function usePerformanceOptimization() {
  const rafId = useRef<number>();

  // PERFORMANCE: Optimized scroll handler
  const useOptimizedScroll = useCallback((callback: (scrollY: number) => void) => {
    useEffect(() => {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          rafId.current = requestAnimationFrame(() => {
            callback(window.scrollY);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
      };
    }, [callback]);
  }, []);

  // PERFORMANCE: Intersection Observer for animations
  const useIntersectionObserver = useCallback((
    callback: (isIntersecting: boolean) => void,
    options?: IntersectionObserverInit
  ) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          callback(entry.isIntersecting);
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
          ...options,
        }
      );

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }, [callback, options]);

    return elementRef;
  }, []);

  // PERFORMANCE: Debounced resize handler
  const useOptimizedResize = useCallback((callback: () => void, delay = 250) => {
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
      };
    }, [callback, delay]);
  }, []);

  // PERFORMANCE: Prefers reduced motion check
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // PERFORMANCE: Device capabilities check
  const getDeviceCapabilities = useCallback(() => {
    return {
      supportsHover: window.matchMedia('(hover: hover)').matches,
      prefersReducedMotion: prefersReducedMotion(),
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      connectionSpeed: (navigator as any).connection?.effectiveType || 'unknown',
    };
  }, [prefersReducedMotion]);

  return {
    useOptimizedScroll,
    useIntersectionObserver,
    useOptimizedResize,
    prefersReducedMotion,
    getDeviceCapabilities,
  };
}

/**
 * PERFORMANCE: Hook for managing will-change property
 */
export function useWillChange() {
  const elementRef = useRef<HTMLElement>(null);

  const setWillChange = useCallback((properties: string) => {
    if (elementRef.current) {
      elementRef.current.style.willChange = properties;
    }
  }, []);

  const clearWillChange = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, []);

  return {
    elementRef,
    setWillChange,
    clearWillChange,
  };
}

/**
 * PERFORMANCE: Hook for lazy loading content
 */
export function useLazyLoad<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const isVisible = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible.current) {
          isVisible.current = true;
          element.classList.add('loaded');
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return {
    elementRef,
    isVisible: isVisible.current,
  };
}