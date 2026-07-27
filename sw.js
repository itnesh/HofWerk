const CACHE = "hofwerk-shell-v2";
const SHELL = ["./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (SHELL.some((f) => url.pathname.endsWith(f.replace("./", "")))) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
