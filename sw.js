// sw.js — cache-first app shell, versioned
const VERSION = '2026.08.09-b1';   // bump on EVERY deploy to ship updates
const CACHE   = 'html-vault-' + VERSION;

// All same-origin. Every file here must exist or install() fails.
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './vendor/dexie.min.js',
  './vendor/highlight.min.js',
  './vendor/fonts/lexend-400.woff2',
  './vendor/fonts/lexend-700.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('html-vault-') && k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;   // ignore anything off-origin

  // Navigations use network-first so a fresh deploy lands on the FIRST launch instead
  // of the second. Everything else stays cache-first with a background refresh.
  if (e.request.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        // Bounded: never let a slow or captive network stall an offline-first launch.
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 2500);
        let net;
        try { net = await fetch(e.request, { signal: ctl.signal }); }
        finally { clearTimeout(timer); }
        if (net && net.ok && net.type === 'basic') cache.put(e.request, net.clone());
        return net;
      } catch (_) {
        return (await cache.match(e.request)) || (await cache.match('./index.html'))
            || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Cache-first, with a background refresh and an offline navigation fallback.
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const fromNet = fetch(e.request)
      .then(r => {
        if (r && r.ok && r.type === 'basic') cache.put(e.request, r.clone());
        return r;
      })
      .catch(() => null);

    if (cached) {
      e.waitUntil(fromNet);
      return cached;
    }

    const fresh = await fromNet;
    if (fresh) return fresh;
    if (e.request.mode === 'navigate') {
      return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
    }
    return Response.error();
  })());
});
