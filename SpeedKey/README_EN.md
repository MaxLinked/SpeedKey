<p align="center">
  <img src="icons/icon_original.png" alt="SpeedKey Logo" width="128" />
</p>

<h2 align="center">SpeedKey · Video Speed Controller for Chrome/Edge</h2>

<p align="center">
  <a href="README.md">中文</a> · <strong>English</strong>
  <br/>
  Manifest V3 · HTML5 Video · Keyboard Acceleration · WSL2 Friendly
</p>

## Overview

SpeedKey is a professional yet lightweight browser extension that delivers a “hold-to-speed, release-to-restore” experience for HTML5 `<video>`.
It supports custom trigger keys, ±0.1× wheel fine-tuning, overlay indicator, and i18n (English/Chinese). Works on Chromium-based browsers: Chrome/Edge.

## Key Features

- Hold to speed up; release to restore the original playback rate
- Wheel fine-tuning while holding (±0.1×), range 0.5×~5.0×
- Customizable trigger key: Shift/Ctrl/Alt/Space/letters/F-keys or fully custom
- On-screen overlay showing current speed (toggle in settings)
- Settings sync via `chrome.storage.sync` across tabs
- i18n: English and Simplified Chinese
- Works with all standard HTML5 `<video>` elements; handles dynamically added videos

## Installation

### Load unpacked (recommended)

1) Clone or download this repository

```bash
git clone https://github.com/MaxLinked/SpeedKey.git
```

2) Open the extensions page

- Chrome: `chrome://extensions/`
- Edge: `edge://extensions/`

3) Enable “Developer mode” (top-right)

4) Click “Load unpacked”, select directory `SpeedKey/SpeedKey`

### Windows + WSL2

Load the WSL2 path directly in Windows Chrome/Edge:

```
\\wsl$\Ubuntu\home\maxlinked\max_projects\SpeedKey\SpeedKey
```

This lets you edit in WSL2 while testing UI in Windows. Click “Refresh” on the extension card to reload after changes.

### Launch Chrome inside WSL2 and remote-debug (optional)

For Linux-side reproduction/automation:

```bash
google-chrome-stable \
  --user-data-dir=/tmp/speedkey-prof \
  --remote-debugging-address=0.0.0.0 \
  --remote-debugging-port=9222 \
  --load-extension=/home/<user>/max_projects/SpeedKey/SpeedKey
```

Then in Windows Chrome open `chrome://inspect/#devices`, add `localhost:9222`, and Inspect Remote Targets (pages/Service Worker).

## Usage

- Trigger key (default: Left Shift):
  - Hold: all `<video>` play at the configured speed
  - Release: restore original speed
- Wheel fine-tuning: ±0.1× while holding
- Overlay: top-right speed indicator (toggle in settings)
- Popup & Options: toolbar icon → adjust speed, key, language, import/export, reset

## Browser-level Commands

Declared in `manifest.json`:

- `toggle-speed` (default: Alt+Shift+S): toggle speed mode for the active tab

Rebind via “Keyboard shortcuts” on the extensions page.

## Permissions

- `storage`: persist extension settings (speed, key, language, overlay)
- `activeTab`: communicate with the active tab (toggle speed, update UI)

No analytics, no external network calls. Only required scripts are injected.

## Architecture & Layout

- `manifest.json`: MV3 manifest
- `background.js`: defaults, save/broadcast settings, commands (Service Worker)
- `content.js`: page script, keyboard/mouse handling, `<video>` control, MutationObserver, blur/visibility guards, overlay
- `popup.html/.js/.css`: quick UI
- `options.html/.js/.css`: full settings (custom key, language, import/export, reset)
- `i18n.js`: simple i18n (en-US/zh-CN)
- `icons/`: extension icons

## Development

- After changes, click “Refresh” on the extension card to reload
- Content logs in the target page console; background logs in the Service Worker inspector
- MV3 background is an on-demand Service Worker; trigger it (open popup/save settings/send message) before inspecting

## FAQ

- Not seeing Chinese?
  - Switch language in popup/options; or run `chrome.storage.sync.set({ currentLanguage: 'zh-CN' })` and refresh
- Not visible in Windows extensions page?
  - You likely loaded the extension inside WSL. Windows and WSL Chrome are separate instances. Load via the `\\wsl$` path above
- Speed not applied?
  - Ensure standard HTML5 `<video>`; some sites might override `playbackRate`

## Version & License

- Version: v1.0.0 (MV3)
- License: MIT

## Contributing

PRs and issues are welcome. Please keep changes minimal, well-scoped, and explain motivation and impact.

---

Make video watching more efficient ⚡


