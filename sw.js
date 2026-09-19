const CACHE="footballer-quiz-v3";
self.addEventListener("install",e=>e.waitUntil(self.skipWaiting()));
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!=="footballer-quiz-v3").map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(fetch(e.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return response;
  }).catch(()=>caches.match(e.request)));
});
