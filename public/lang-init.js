// Pick the language before first paint to avoid a DE→EN flash (same rules as src/store.ts).
// External (not inline) so the CSP needs no script hash. Loaded blocking from datenschutz.html <head>.
(function () {
  var q = new URLSearchParams(location.search).get('lang'), s = null;
  try { s = localStorage.getItem('lang'); } catch (e) {}
  var l = q === 'de' || q === 'en' ? q : s === 'de' || s === 'en' ? s : navigator.language.toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  document.documentElement.lang = l;
})();
