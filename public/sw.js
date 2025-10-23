const CACHE_NAME = 'biomath-core-v2';
const RUNTIME_CACHE = 'biomath-runtime-v2';
const IMAGE_CACHE = 'biomath-images-v2';
const API_CACHE = 'biomath-api-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/biomathcore_emblem_1024.png',
  '/bmcore-logo11.png'
];

const API_CACHE_DURATION = 5 * 60 * 1000;
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 50;
const PREFETCH_PAGES = ['/about', '/services', '/pricing', '/faq'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(PREFETCH_PAGES);
      })
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(imageStrategy(request));
  } else if (url.hostname.includes('supabase') || url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (url.origin === location.origin) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const fallbackResponse = await cache.match('/index.html');
    return fallbackResponse || new Response('Offline', { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function imageStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const age = Date.now() - new Date(cachedResponse.headers.get('date')).getTime();
    if (age < IMAGE_CACHE_DURATION) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await trimCache(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Image unavailable', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

async function trimCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > MAX_CACHE_SIZE) {
    const keysToDelete = keys.slice(0, keys.length - MAX_CACHE_SIZE);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

async function syncData() {
  const db = await openDB();
  const pendingData = await db.getAll('pending-sync');

  for (const item of pendingData) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body
      });
      await db.delete('pending-sync', item.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('biomath-offline-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-sync')) {
        db.createObjectStore('pending-sync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'BioMath Core';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/biomathcore_emblem_1024.png',
    badge: '/biomathcore_emblem_1024.png',
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' }
    ],
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    renotify: true,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
