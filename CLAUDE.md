# Luca Number Quest

A static, no-build web app: a child-friendly integrated **Number Quest** (math), **Word Trail** (early reading), **Math Compass** (adaptive skill map), and **Trail Passport** (reading progress home). Built for Luca, ~5 years old. Runs on GitHub Pages and installs to an iPad home screen as a PWA.

**Before changing anything, read `Luca_Numbers_handoff.md`** — it carries the full product intent, feature state, the 20 Word Trail words, camp/passport structure, and design guardrails. Then inspect the current code and `git log`; treat the source as the source of truth over the handoff note.

## Run it locally

Serve as static files (the service worker and manifest need a real server, not `file://`):

```
python3 -m http.server 4173
```

Then open http://localhost:4173. This is also wired as the `static` launch config in `.claude/launch.json`.

## Files

- `index.html` — app shell
- `app.js` — all game logic (single file, ~3.9k lines, self-documenting function names, no build step)
- `styles.css` — layout and visual design
- `manifest.webmanifest` / `sw.js` — PWA install + offline caching
- `assets/` — icons

## Deploy

GitHub Pages deploys from `main` at the repo root. Repo: <https://github.com/longo1231/luca-number-quest> · Live: <https://longo1231.github.io/luca-number-quest/>. Pushing to `main` publishes.

## Guardrails (from the handoff)

- Adventure, not school. Math can be challenging; reading stays visual, gentle, low-pressure.
- Keep sessions ~3–5 minutes. Prefer world-building rewards (map, stickers, scenes) over points/timers/streaks.
- **Preserve saved progress** — the app persists settings and skill/word progress in `localStorage`. Add new fields backward-compatibly; never wipe existing progress.
- Keep it touch-friendly, especially on iPad. Verify responsive behavior before publishing.
