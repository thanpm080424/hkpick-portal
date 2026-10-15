// Service Worker - Secure Web App PWA
// Khi bạn muốn phát hành bản cập nhật mới, chỉ cần đổi APP_VERSION (ví dụ: 'v1.0.1')
const APP_VERSION = 'v1.0.0';
const CACHE_NAME = `secure-app-cache-${APP_VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

// Cài đặt Service Worker và lưu cache các file tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`[Service Worker] Đang nạp cache phiên bản: ${APP_VERSION}`);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Xóa cache cũ khi có phiên bản mới
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('secure-app-cache-')) {
            console.log(`[Service Worker] Đã dọn dẹp cache cũ: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[Service Worker] Đã kích hoạt phiên bản mới: ${APP_VERSION}`);
      return self.clients.claim();
    })
  );
});

// Chiến lược Fetch: 
// - Với trang index.html: Network First (ưu tiên mạng để lấy bản mới nhất, mất mạng thì dùng cache)
// - Với các file tĩnh: Stale While Revalidate (dùng cache ngay cho nhanh, đồng thời tải bản mới ngầm)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Không can thiệp nếu là request ngoài cùng domain
  if (url.origin !== self.location.origin) {
    return;
  }

  // Đối với request tải trang HTML chính
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request) || caches.match('./index.html'))
    );
    return;
  }

  // Đối với CSS, JS, Icon
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Lắng nghe lệnh SKIP_WAITING từ app.js để áp dụng cập nhật ngay
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: APP_VERSION });
    }
  }
});
