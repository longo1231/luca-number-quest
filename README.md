# Luca Number Quest

A tiny static web app for young kids who love numbers and are beginning to read. It is designed to run well on GitHub Pages and be saved to an iPad home screen like an app.

This repo already maps to the GitHub Pages project `luca-number-quest`.

The current version is tuned to Connecticut kindergarten number goals.

## What's included

- Count It, including tap-to-count rounds where the child taps each object and the app counts aloud
- Compare Numbers
- Number Pairs, with the child's name woven into the story problems
- Teen Numbers
- Big Numbers: hundred-chart mystery cells, decade crossings, and missing-number patterns up to 100
- Write It: finger-tracing numerals on a canvas with live progress feedback
- A rocket journey: every 10 stars blasts off to a new planet with its own color theme
- A sticker book: each planet landing awards a collectible sticker (34 to find)
- A tappable buddy mascot (robot, dino, or cat) that reacts to answers
- One gentle retry before the answer is revealed on a wrong tap
- Word Trail: Luca's twenty summer trail words, taught through meet, find, build, and read activities
- Trail Passport: a seven-stop summer map where each word earns Meet, Find, Build, and Hear It stamps, with a camp patch for finishing every stop
- Sound hints that connect trail words to their first letter sounds without blocking word practice
- Math Compass: a gentle skill map that adapts number challenges from individual skills, not just a broad difficulty tier
- A parent Learning Report with the number map and word-by-word Word Trail progress
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
