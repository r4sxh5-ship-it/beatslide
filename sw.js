// BeatSlide service worker: オフラインでも開けるようにします。
// ネットがあるときは、いつも最新のファイルを取りにいき、ないときだけ、保存済みを使います。
const V='beatslide-v2',FILES=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'index.html':r,cp));return res}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r)))});
