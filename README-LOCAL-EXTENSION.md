# Nigiriidesalmon Twitch VAFT

This is Nigiriidesalmon's local Brave/Chrome Manifest V3 wrapper around `vaft/vaft.user.js` from the archived `pixeltris/twitchadsolutions` repo. The current build is `0.2.0`.

## Load in Brave or Chrome

1. Open `brave://extensions` or `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder: `C:\Users\Pau\Documents\Tema Discord\twitchadsolutions`.
5. Open a Twitch live stream.
6. Open DevTools and check the console for `hookWorkerFetch (vaft)`.
7. Run `vaftLocalStatus()` in the console.

If that log line appears, the script is being injected early enough for the Twitch worker hook to run.

Use the desktop Twitch site (`www.twitch.tv`). The extension no longer injects into unsupported Twitch subdomains such as `m.twitch.tv`.

## Current shape

- Uses the archived `vaft` script directly.
- Blocks Twitch CSAI ad calls to `edge.ads.twitch.tv/ads` with a local Declarative Net Request rule.
- Runs in the page `MAIN` world at `document_start`.
- Removes terminated player workers from its internal registry.
- Accepts plain header objects, `Headers`, `URL`, and `Request` inputs in its network hook.
- Does not include popup UI or per-site settings yet.
- Targets Chromium browsers, with Brave and Chrome tested. Firefox MV3 support for `world: "MAIN"` is not equivalent.

## Release process

Pushing a tag such as `v0.2.0` creates the GitHub Release and extension ZIP automatically. The tag version must match `manifest.json`.
