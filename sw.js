// Service worker de Brújula Sonora: guarda la app para usarla sin internet.
// Si cambias index.html o los audios, sube el número de VERSION para que los celulares se actualicen.
const VERSION = "brujula-sonora-v9";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./audios/audio1-motor.mp3",
  "./audios/audio2-silencio.mp3",
  "./audios/audio3-avas.mp3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Audios: primero lo guardado. Si el reproductor pide un pedazo (Range), lo cortamos del archivo guardado.
async function responderAudio(req) {
  const guardado = await caches.match(req.url, { ignoreSearch: true });
  if (!guardado) return fetch(req);
  const rango = req.headers.get("range");
  if (!rango) return guardado;
  const datos = await guardado.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(rango) || [];
  const ini = m[1] ? parseInt(m[1], 10) : 0;
  const fin = m[2] ? Math.min(parseInt(m[2], 10), datos.byteLength - 1) : datos.byteLength - 1;
  return new Response(datos.slice(ini, fin + 1), {
    status: 206,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Range": "bytes " + ini + "-" + fin + "/" + datos.byteLength,
      "Content-Length": String(fin - ini + 1),
      "Accept-Ranges": "bytes"
    }
  });
}

// Lo demás: primero internet (para recibir cambios); si no hay, lo guardado.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.endsWith(".mp3")) { e.respondWith(responderAudio(e.request)); return; }
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp.status === 200) {
          const copia = resp.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copia));
        }
        return resp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./index.html")))
  );
});
