// Pick the language before first paint to avoid a DE→EN flash (same rules as src/store.ts).
// External (not inline) so the CSP needs no script hash. Loaded blocking from datenschutz.html <head>.
(function () {
  var ok = function (v) { return v === 'en' || v === 'de' || v === 'el'; };
  var q = new URLSearchParams(location.search).get('lang'), s = null, n = navigator.language.toLowerCase().slice(0, 2);
  try { s = localStorage.getItem('lang'); } catch (e) {}
  document.documentElement.lang = ok(q) ? q : ok(s) ? s : ok(n) ? n : 'en';
})();
