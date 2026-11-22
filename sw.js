const C="praxisplaner-v7",F=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
// Online: immer die neueste Version laden (max. 4 Sekunden warten), offline: gespeicherte Version
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(e.request.method!="GET"||u.origin!=location.origin)return;
 e.respondWith(
  Promise.race([fetch(e.request,{cache:"no-cache"}),new Promise((_,j)=>setTimeout(j,4000))])
  .then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r})
  .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))))});
