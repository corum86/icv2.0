// Pick the language before first paint to avoid a DE→EN flash (same rules as src/store.ts).
// External (not inline) so the CSP needs no script hash. Loaded blocking from the <head> of portfolio.html, cv.html and datenschutz.html.
(function () {
  var ok = function (v) { return v === 'en' || v === 'de' || v === 'el'; };
  var p = (location.pathname.match(/^\/(en|de|el)\//) || [])[1]; // language URL: /de/portfolio.html
  var q = new URLSearchParams(location.search).get('lang'), s = null, n = navigator.language.toLowerCase().slice(0, 2);
  try { s = localStorage.getItem('lang'); } catch (e) {}
  document.documentElement.lang = ok(p) ? p : ok(q) ? q : ok(s) ? s : ok(n) ? n : 'en';
})();
