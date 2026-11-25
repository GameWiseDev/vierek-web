// Vercel Routing Middleware: elige el idioma cuando alguien entra a la raíz del sitio.
// 1) Si eligió un idioma en el selector, se respeta (cookie vk_lang).
// 2) Si no, se usa el país de su IP (encabezado x-vercel-ip-country).
// 3) Si no hay país, se usa el idioma del navegador. Si nada coincide, español.

export const config = { matcher: '/' };

const LANGS = ['es', 'en'];

const SPANISH = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT', 'HN',
  'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
]);

function fromCountry(country) {
  if (!country) return null;
  if (SPANISH.has(country)) return 'es';
  return 'en';
}

function fromBrowser(acceptLanguage) {
  for (const part of acceptLanguage.split(',')) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (LANGS.includes(code)) return code;
  }
  return null;
}

export default function middleware(request) {
  const cookie = request.headers.get('cookie') || '';
  const chosen = cookie.match(/(?:^|;\s*)vk_lang=(es|en)(?:;|$)/)?.[1];

  const lang =
    chosen ||
    fromCountry((request.headers.get('x-vercel-ip-country') || '').toUpperCase()) ||
    fromBrowser(request.headers.get('accept-language') || '') ||
    'es';

  const url = new URL(request.url);
  url.pathname = `/${lang}/`;
  return new Response(null, {
    status: 307,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie, Accept-Language',
    },
  });
}
