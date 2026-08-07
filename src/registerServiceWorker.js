/* eslint-disable no-console */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New content is available and will be used when all tabs are closed.');
              } else {
                console.log('[PWA] Content is cached for offline use.');
              }
            }
          };
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });

  // Global connection state listeners
  window.addEventListener('online', () => {
    console.log('[PWA] Internet connection restored.');
    window.dispatchEvent(new CustomEvent('app-connection-changed', { detail: { online: true } }));
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Device went offline. App running in offline mode.');
    window.dispatchEvent(new CustomEvent('app-connection-changed', { detail: { online: false } }));
  });
}

