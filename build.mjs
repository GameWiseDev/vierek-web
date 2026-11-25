// Arma el sitio de VIEREK en cada idioma: src/template.html + src/i18n/<idioma>.json → dist/<idioma>/index.html
// Uso: node build.mjs   (sin dependencias)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://vierek.com.ar';
const LANGS = ['es', 'en']; // el primero es el idioma por defecto
const OUT = 'dist';

const template = readFileSync('src/template.html', 'utf8');
const dicts = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(readFileSync(`src/i18n/${l}.json`, 'utf8'))]));

// Todos los idiomas tienen que tener las mismas claves
const base = Object.keys(dicts[LANGS[0]]).sort();
for (const l of LANGS.slice(1)) {
  const keys = Object.keys(dicts[l]).sort();
  const missing = base.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !base.includes(k));
  if (missing.length || extra.length) {
    throw new Error(`${l}.json no coincide con ${LANGS[0]}.json. Faltan: ${missing.join(', ') || '-'} · Sobran: ${extra.join(', ') || '-'}`);
  }
}

const hreflangLinks = [
  ...LANGS.map((l) => `  <link rel="alternate" hreflang="${dicts[l].html_lang}" href="${SITE_URL}/${l}/">`),
  `  <link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`,
].join('\n');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('public', OUT, { recursive: true });

// Íconos de Font Awesome Free (src/icons) → un solo sprite en línea
const ICONS = {
  arrow: 'arrow-right', external: 'arrow-up-right-from-square', mail: 'envelope', check: 'check',
  code: 'code', mobile: 'mobile-screen', gamepad: 'gamepad', chip: 'microchip', trophy: 'trophy',
  users: 'users', pin: 'location-dot', calendar: 'calendar-check', shield: 'file-shield', globe: 'globe',
};
const iconSprite = [
  '  <svg class="sprite" width="0" height="0" aria-hidden="true">',
  '    <!-- Font Awesome Free by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0) -->',
  ...Object.entries(ICONS).map(([id, file]) => {
    const svg = readFileSync(`src/icons/${file}.svg`, 'utf8');
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const paths = svg.replace(/<!--[\s\S]*?-->/g, '').match(/<path[^>]*\/>/g).join('');
    return `    <symbol id="i-${id}" viewBox="${viewBox}" fill="currentColor">${paths.replace(/\s*fill="[^"]*"/g, '')}</symbol>`;
  }),
  '  </svg>',
].join('\n');

const used = new Set();
for (const lang of LANGS) {
  const langLinks = LANGS.map((l) => {
    const current = l === lang ? ' aria-current="true"' : '';
    return `        <a href="/${l}/" hreflang="${dicts[l].html_lang}" lang="${dicts[l].html_lang}" data-lang="${l}" title="${dicts[l].lang_name}"${current}>${dicts[l].lang_short}</a>`;
  }).join('\n');

  const vars = {
    ...dicts[lang],
    lang,
    site_url: SITE_URL,
    page_url: `${SITE_URL}/${lang}/`,
    hreflang_links: hreflangLinks,
    lang_links: langLinks,
    icon_sprite: iconSprite,
  };

  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Falta la clave "${key}" para ${lang}`);
    used.add(key);
    return vars[key];
  });

  mkdirSync(join(OUT, lang), { recursive: true });
  writeFileSync(join(OUT, lang, 'index.html'), html);
}

// Claves que ningún texto usa (avisa, no corta el build). Las og_* se usan para la imagen de redes.
const unused = base.filter((k) => !used.has(k) && !k.startsWith('og_line') && k !== 'og_sub' && k !== 'lang_name' && k !== 'lang_short');
if (unused.length) console.warn('Claves sin usar:', unused.join(', '));

// Raíz: normalmente la resuelve middleware.js (redirige por país o por la cookie del selector).
// Este archivo es el respaldo si el middleware no corre: elige por el idioma del navegador.
writeFileSync(join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VIEREK</title>
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/png" href="/assets/favicon.png">
${hreflangLinks}
  <link rel="stylesheet" href="/styles.css">
  <script src="/lang.js"></script>
</head>
<body class="fallback">
  <p>${LANGS.map((l) => `<a href="/${l}/">${dicts[l].lang_name}</a>`).join('')}</p>
</body>
</html>
`);

console.log(`Listo: ${LANGS.map((l) => `/${l}/`).join(' ')} en ${OUT}/ (${readdirSync(OUT).length} entradas)`);
