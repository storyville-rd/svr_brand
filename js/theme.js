/* Storyville RD light/dark mode. Load in <head>, before the stylesheet, on every app:
   <script src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.1.0/js/theme.js"></script>
   Follows the device setting until someone picks a theme; the pick is remembered for this app (localStorage "svr-theme").
   API: svrTheme.get() → "light" | "dark", svrTheme.set("light" | "dark"), svrTheme.toggle(), svrTheme.reset() (back to the device setting).
   Fires a "svr-themechange" event on window with { detail: { theme } } whenever the theme changes. */
(function () {
  var KEY = 'svr-theme', root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false };
  function stored() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; } }
  function get() { return stored() || (mq.matches ? 'dark' : 'light'); }
  function apply() {
    // Always set the resolved theme, so Tailwind's dark: variant and [data-theme] rules match. The saved
    // choice (or its absence) stays in localStorage, so a device-setting change still follows through.
    root.setAttribute('data-theme', get());
    try { window.dispatchEvent(new CustomEvent('svr-themechange', { detail: { theme: get() } })); } catch (e) {}
  }
  function set(t) { try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch (e) {} apply(); }
  if (mq.addEventListener) mq.addEventListener('change', function () { if (!stored()) apply(); });
  window.svrTheme = { get: get, set: set, toggle: function () { set(get() === 'dark' ? 'light' : 'dark'); }, reset: function () { set(null); } };
  apply();
})();
