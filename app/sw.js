/* UNICESD Studenti - service worker dell'app (/app/). Generato da build_pages.py */
const V = 'uo-app-d68b23ffe1';
const SHELL = ["/app/", "/assets/css/site.css?v=65c12b47", "/assets/js/site.js?v=c68dcb09", "/assets/icons/app-192.png", "/assets/icons/icon.svg", "/assets/icons/icon-192.png", "/assets/logo-light-480.webp"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('uo-app-') && n !== V).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;          // video: sempre dalla rete
  const u = new URL(r.url);
  if (/supabase\.co$/.test(u.hostname)) return;                      // dati dello studente: mai in cache
  if (r.mode === 'navigate') {                                       // la pagina: rete, e se manca la copia salvata
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put('/app/', c)); return res })
      .catch(() => caches.match('/app/')));
    return;
  }
  const ok = (u.origin === location.origin && u.pathname.startsWith('/assets/')) ||
             /^(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);
  if (!ok || /\.mp4$/.test(u.pathname)) return;
  e.respondWith(caches.open(V).then(c => c.match(r).then(hit => {    // file statici: subito dalla cache, aggiornati in background
    const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res }).catch(() => hit);
    return hit || net;
  })));
});
