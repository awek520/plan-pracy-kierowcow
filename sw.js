self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) { data = {body: event.data ? event.data.text() : 'Nowa wiadomość'}; }
  const title = data.title || 'PLAN PRACY';
  const options = {
    body: data.body || 'Nowa wiadomość',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'plan-pracy-chat',
    renotify: true,
    vibrate: [250,120,250,120,500],
    requireInteraction: true,
    data: { url: '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
