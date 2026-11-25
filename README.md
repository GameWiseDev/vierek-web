# VIEREK — sitio institucional

Sitio de VIEREK S.A.S. en español e inglés: qué hace la empresa, sus productos (GAMEWISE), una sección para inversores y el equipo. HTML, CSS y JavaScript sin dependencias: un script de Node arma una página por idioma y Vercel publica el resultado.

- Producción: https://vierek.com.ar
- Idiomas: `/es/` y `/en/`

## Cómo está armado

| Archivo | Qué es |
| --- | --- |
| `src/template.html` | La página, con los textos como `{{clave}}` |
| `src/i18n/es.json`, `en.json` | Los textos de cada idioma (los dos tienen que tener las mismas claves) |
| `src/icons/` | Íconos de Font Awesome Free (CC BY 4.0) que se usan en el sitio |
| `build.mjs` | Arma `dist/es/` y `dist/en/`, copia `public/` y genera la raíz de respaldo |
| `middleware.js` | En la raíz `/`, elige el idioma: elección guardada (cookie `vk_lang`), país de la IP o idioma del navegador |
| `public/` | Estilos, JS, fuentes Exo 2 y Montserrat, logos oficiales e imágenes para redes |

## Cambios frecuentes

- **Un texto:** cambialo en `src/i18n/es.json` y `en.json`.
- **El mail de contacto:** está en `src/template.html` (sección Contacto) y en las claves `mail_meeting` y `mail_project` de cada idioma.
- **Un proyecto nuevo:** sumalo en la sección Productos de `src/template.html`, con sus textos en los dos idiomas.

## Reglas de marca

Manual de VIEREK v1.0: base azul marino `#0B0F24`, azul VIEREK `#0066FF` para botones y bloques, violeta `#8A00FF` solo como acento gráfico (nunca texto sobre oscuro), cian `#00D4FF` para datos y destacados. Exo 2 en títulos y Montserrat en textos. GAMEWISE aparece solo como nombre: los logos de VIEREK y GAMEWISE no se combinan.

Los números de la ronda (monto, porcentaje, valuación y uso de fondos) no van en el sitio público: se comparten en la reunión o en el data room con NDA.

## Verlo en local

```
node build.mjs
npx serve dist
```
