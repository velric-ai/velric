// SMART SERVICE WORKER: Development-friendly with production caching
// Detects environment and behaves accordingly

const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const CACHE_NAME = 'velric-v1';
const STATIC_CACHE_NAME = 'velric-static-v1';

// Assets to cache in production only
const STATIC_ASSETS = [
  '/',
  '/assets/logo.png',
  '/manifest.json',
];

console.log(`Service Worker: Running in ${isDevelopment ? 'development' : 'production'} mode`);

// Install event
self.addEventListener('install', (event) => {
  if (isDevelopment) {
    console.log('Service Worker: Development mode - skipping cache setup');
    self.skipWaiting();
    return;
  }

  // Production mode - cache static assets
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (isDevelopment || (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME)) {
              console.log('Service Worker: Deleting cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Development mode - pass through to network
  if (isDevelopment) {
    // Don't intercept requests in development to avoid HMR issues
    return;
  }

  // Production mode - use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});