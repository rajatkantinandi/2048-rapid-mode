importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  workbox.routing.registerRoute(
    "/",
    new workbox.strategies.StaleWhileRevalidate()
  );
  workbox.routing.registerRoute(
    new RegExp('/icons'),
    new workbox.strategies.StaleWhileRevalidate()
  );
  workbox.routing.registerRoute(/\.(?:js|css|html)$/, new workbox.strategies.StaleWhileRevalidate());
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}