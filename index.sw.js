// Helper link
// https://bitsofco.de/setting-up-a-basic-service-worker/

const cacheVersion = 'v1.15';
const cacheFiles = [
	'./',
	'./assets/icons/1.png?v=' + cacheVersion,
	'./assets/icons/2.png?v=' + cacheVersion,
	'./assets/icons/3.png?v=' + cacheVersion,
	'./index.html?v=' + cacheVersion,
	'./index.css?v=' + cacheVersion,
	'./index.js?v=' + cacheVersion,
]

// SW: Service Worker

self.addEventListener('install', e => {
	console.log('SW:: Install');
	e.waitUntil(
		caches.open(cacheVersion).then(cache => {
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
					const cache = await caches.open(cacheVersion);
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
					if (key !== cacheVersion) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});