// Apply the stored preference before the page paints. First visits default to dark.
(function () {
  var theme = 'dark';
  try {
    var stored = localStorage.getItem('shadow-fpv-theme');
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch (_) { /* Storage is optional; the theme still works in memory. */ }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
