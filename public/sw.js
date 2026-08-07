const CACHE_NAME = 'rajinkerja-v2.5-cache';
const DYNAMIC_CACHE_NAME = 'rajinkerja-data-v2.5';

// Pre-cache essential static app shell and CDN resources for complete offline support
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/favicon.ico',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// 1. Install Event - Pre-cache essential app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static app shell & CDN assets');
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`[SW] Failed to pre-cache ${url}:`, err))
        )
      );
    })
  );
});

// 2. Activate Event - Clean up stale cache versions & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('[SW] Clearing legacy cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Check if request URL is a CDN or static asset
function isStaticAsset(url) {
  return (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.json')
  );
}

// 3. Fetch Event - Intelligent caching strategy (Cache-First / Stale-While-Revalidate / SPA Fallback)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore chrome-extension or dev server websocket connections
  if (url.protocol.startsWith('chrome-extension') || url.pathname.includes('/vite/') || url.pathname.includes('ws')) {
    return;
  }

  // Strategy A: Navigation requests (SPA Mode) -> Network First with Offline /index.html Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW] Offline mode: Serving index.html for navigation request:', request.url);
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Strategy B: Static assets, JS/CSS bundles, Fonts, & CDN scripts -> Stale-While-Revalidate (or Cache First)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // Cache valid responses including opaque cross-origin CDN responses (status 0/opaque or 200)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('[SW] Asset fetch failed, serving from cache if available:', request.url, err);
          });

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy C: API / Dynamic Data requests -> Network First, falling back to Dynamic Cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return empty offline JSON fallback if JSON requested
          if (request.headers.get('accept')?.includes('application/json')) {
            return new Response(JSON.stringify({ offline: true, message: 'Disambungkan kembali saat online.' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
      })
  );
});

// 4. Message Event - Allow manual triggering of skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

