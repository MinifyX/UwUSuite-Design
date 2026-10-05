// bootScript("uwusuite-design.settings") as a file, not an inline script, so the page runs under
// a strict Content-Security-Policy (script-src 'self') like uwu.minifyx.de's.
(function () {
  try {
    var s = JSON.parse(localStorage.getItem("uwusuite-design.settings") || "{}");
    var m = function (q) {
      return matchMedia(q).matches;
    };
    var r = document.documentElement;
    var t = s.theme || "system";
    r.dataset.theme = t === "system" ? (m("(prefers-color-scheme: dark)") ? "dark" : "light") : t;
    var c = s.contrast || "system";
    r.dataset.contrast = c === "system" ? (m("(prefers-contrast: more)") ? "high" : "normal") : c;
    var o = s.motion || "system";
    r.dataset.motion =
      o === "system" ? (m("(prefers-reduced-motion: reduce)") ? "reduced" : "full") : o === "on" ? "full" : "reduced";
  } catch (e) {}
})();
