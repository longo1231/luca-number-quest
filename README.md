# Luca Number Quest

A tiny static web app for young kids who love numbers. It is designed to run well on GitHub Pages and be saved to an iPad home screen like an app.

This repo already maps to the GitHub Pages project `luca-number-quest`.

The current version is tuned to Connecticut kindergarten number goals.

## What's included

- Count It
- Compare Numbers
- Number Pairs
- Teen Numbers
- Parent settings for child name, round length, voice praise, and silly sounds
- Optional timed rounds, with the timer off by default for calmer practice
- Saved progress on the device so score and skill progress survive reloads
- PWA files for installability and basic offline support
- A standards-alignment guide in `CONNECTICUT_KINDERGARTEN_NUMBER_GUIDE.md`

## Files

- `index.html`: app shell
- `styles.css`: layout and visual design
- `app.js`: game logic
- `manifest.webmanifest`: install metadata
- `sw.js`: offline caching
- `assets/`: icons

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Choose the `main` branch and `/ (root)` folder, then save.
6. Wait a minute or two for GitHub to publish it.
7. Open the Pages URL on the iPad in Safari.
8. Tap `Share` -> `Add to Home Screen`.

## Local preview

Open `index.html` in a browser for a quick look. For the service worker and manifest to behave exactly like production, use any simple static server.
