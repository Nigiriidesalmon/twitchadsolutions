# Nigiriidesalmon Twitch VAFT

Chrome Manifest V3 extension fork based on the archived
[`pixeltris/twitchadsolutions`](https://github.com/pixeltris/twitchadsolutions)
project.

This fork packages the `vaft` script as a local unpacked Chrome extension, adds
a Declarative Net Request rule for Twitch CSAI ad calls, and exposes small
diagnostics helpers to verify whether the Twitch player worker was hooked.

## Espanol

### Que es

`Nigiriidesalmon Twitch VAFT` es una version local en formato extension de
Chrome MV3 basada en el script `vaft` del repo original archivado.

Incluye:

- Inyeccion de `vaft/vaft.user.js` en `document_start` y `MAIN world`.
- Bloqueo local de llamadas CSAI a `edge.ads.twitch.tv/ads`.
- Diagnostico desde consola con `vaftLocalStatus()`.
- Indicador de estado de anuncios con logs `VAFT ad state`.

### Instalacion en Chrome

1. Abre `chrome://extensions`.
2. Activa `Developer mode`.
3. Pulsa `Load unpacked`.
4. Selecciona la carpeta del repo.
5. Abre un directo en `https://www.twitch.tv`.
6. Abre DevTools y busca `hookWorkerFetch (vaft)`.
7. Ejecuta:

```js
vaftLocalStatus()
```

Si ves `installed: true` y `hookedTwitchWorkerCount` mayor que `0`, la extension
esta inyectada y el worker del reproductor esta enganchado.

### Notas

- Usa la web de escritorio: `www.twitch.tv`.
- `m.twitch.tv` no esta soportado por el script original.
- No combines varios bloqueadores especificos de Twitch si ves buffering,
  pantallas negras o recargas constantes.
- Twitch cambia a menudo su reproductor y su sistema de anuncios, asi que esto
  puede dejar de funcionar sin aviso.

## English

### What This Is

`Nigiriidesalmon Twitch VAFT` is a local Chrome MV3 extension wrapper around the
archived upstream `vaft` script.

It includes:

- `vaft/vaft.user.js` injection at `document_start` in the page `MAIN` world.
- A local Declarative Net Request rule blocking `edge.ads.twitch.tv/ads`.
- Console diagnostics through `vaftLocalStatus()`.
- Ad state logging through `VAFT ad state`.

### Chrome Installation

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this repository folder.
5. Open a live stream on `https://www.twitch.tv`.
6. Open DevTools and look for `hookWorkerFetch (vaft)`.
7. Run:

```js
vaftLocalStatus()
```

If you see `installed: true` and `hookedTwitchWorkerCount` above `0`, the
extension is injected and the Twitch player worker has been hooked.

### Notes

- Use the desktop site: `www.twitch.tv`.
- `m.twitch.tv` is not supported by the original script.
- Avoid combining multiple Twitch-specific ad blockers if you see buffering,
  black screens, or repeated player reloads.
- Twitch frequently changes its player and ad delivery, so this can break at
  any time.

## Project Layout

```text
manifest.json                 Chrome MV3 extension manifest
rules/twitch-ads.json          Declarative Net Request rules
vaft/vaft.user.js              VAFT userscript with local diagnostics
README-LOCAL-EXTENSION.md      Short local install notes
full-list.md                   Upstream list of Twitch ad solutions
issues.md                      Upstream troubleshooting notes
```

## Attribution

This fork is based on the archived `pixeltris/twitchadsolutions` project and the
work credited in that repository. The original project was archived on
2026-03-05.

## Disclaimer

This is an experimental local browser extension. Use it at your own risk.
Streaming platforms may change behavior, block techniques, or apply their own
terms of service.
