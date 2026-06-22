# Nigiriidesalmon Twitch VAFT

This is Nigiriidesalmon's local Chrome Manifest V3 wrapper around `vaft/vaft.user.js` from the archived `pixeltris/twitchadsolutions` repo.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder: `C:\Users\Pau\Documents\Tema Discord\twitchadsolutions`.
5. Open a Twitch live stream.
6. Open DevTools and check the console for `hookWorkerFetch (vaft)`.
7. Run `vaftLocalStatus()` in the console.

If that log line appears, the script is being injected early enough for the Twitch worker hook to run.

Use the desktop Twitch site (`www.twitch.tv`). The archived VAFT script is not designed for `m.twitch.tv`; `vaftLocalStatus()` reports `isMobileHost` and `supportedHost` to make that obvious.

## Current shape

- Uses the archived `vaft` script directly.
- Blocks Twitch CSAI ad calls to `edge.ads.twitch.tv/ads` with a local Declarative Net Request rule.
- Runs in the page `MAIN` world at `document_start`.
- Does not include popup UI or per-site settings yet.
- Targets Chrome first. Firefox MV3 support for `world: "MAIN"` is not equivalent.

## Next useful work

- Add a small diagnostics content script that reports whether the worker hook installed.
- Split configurable VAFT options into a local config block.
- Add a popup toggle that disables injection by host.
- Track Twitch player/network breakages as small patches instead of editing the whole userscript blindly.
