// Respaldo de la raíz si el middleware no corre: cookie del selector o idioma del navegador.
(function () {
  var langs = ['es', 'en'];
  var m = document.cookie.match(/(?:^|;\s*)vk_lang=(es|en)(?:;|$)/);
  var lang = m && m[1];
  if (!lang) {
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length && !lang; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (langs.indexOf(code) !== -1) lang = code;
    }
  }
  location.replace('/' + (lang || 'es') + '/');
})();
