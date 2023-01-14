// Helper link
// https://bitsofco.de/setting-up-a-basic-service-worker/

let cacheName = 'v1.12';
let cacheFiles = [
	'./',
	'./assets/icons/1.png',
	'./assets/icons/2.png',
	'./assets/icons/3.png',
	'./index.html',
	'./index.css',
	'./index.js'
]

// SW: Service Worker

self.addEventListener('install', e => {
	console.log('SW:: Install');
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log('SW:: Caching all: app shell and content');
			return cache.addAll(cacheFiles);
		})
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(r => {
			// if (e.request.url.indexOf("socket.io") > -1) return;
			console.log('SW:: Fetching resource: ' + e.request.url);
			return (
				r ||
				fetch(e.request).then(async response => {
					const cache = await caches.open(cacheName);
					console.log('SW:: Caching new resource: ' + e.request.url);
					cache.put(e.request, response.clone());
					return response;
				})
			);
		})
	);
});

self.addEventListener('activate', e => {
	console.log('SW:: Activated');
	e.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(
				keyList.map(key => {
					if (key !== cacheName) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});