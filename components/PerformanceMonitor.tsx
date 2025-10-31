import { useEffect } from 'react';

/**
 * PERFORMANCE: Component to monitor and report performance metrics
 */
const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const reportWebVitals = () => {
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              console.log('FID:', entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            console.log('CLS:', clsValue);
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring not supported:', error);
        }
      }
    };

    // Monitor page load performance
    const reportPageLoad = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            console.log('Performance Metrics:', {
              'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
              'TCP Connection': navigation.connectEnd - navigation.connectStart,
              'Request': navigation.responseStart - navigation.requestStart,
              'Response': navigation.responseEnd - navigation.responseStart,
              'DOM Processing': navigation.domContentLoadedEventStart - navigation.responseEnd,
              'Total Load Time': navigation.loadEventEnd - navigation.navigationStart,
            });
          }, 0);
        });
      }
    };

    // Monitor memory usage (if available)
    const reportMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          'Used JS Heap Size': `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          'Total JS Heap Size': `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          'JS Heap Size Limit': `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        });
      }
    };

    // Initialize monitoring
    reportWebVitals();
    reportPageLoad();
    
    // Report memory usage every 30 seconds
    const memoryInterval = setInterval(reportMemoryUsage, 30000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;