# Luca Numbers: Project Handoff

This note preserves the useful context from the Codex tasks associated with the original project path:

`/Users/stephen/Develop/repos/Kids/Luca_Numbers`

The folder was intentionally removed as part of a disk reorganization. The project itself was pushed to GitHub, so it can be cloned into any new location.

## Repository and live app

- GitHub repository: `git@github.com:longo1231/luca-number-quest.git`
- GitHub web URL: <https://github.com/longo1231/luca-number-quest>
- Live GitHub Pages app: <https://longo1231.github.io/luca-number-quest/>
- Previously used branch: `main`

When creating the new local copy, use the location you prefer; the old path is not meaningful to the project itself. Confirm the new checkout is clean and that GitHub Pages is configured to deploy from `main` before making changes.

## What the app is

Luca Number Quest is a child-friendly browser game for Luca, who was nearly five in summer 2026. It began as a math game and was expanded into a connected math-and-early-reading experience. It is one integrated app, not separate sites:

- **Number Quest** is the math track.
- **Word Trail** is the early-reading track based on Luca's summer trail words.
- **Trail Passport** is Word Trail's visual progress home.

The app already shared a round engine, progress store, rocket/stars/stickers, voice prompts, and parent settings. New work was deliberately integrated into those existing systems rather than built as a parallel app.

## Current feature state

### Number Quest and Math Compass

Math was reframed around individual skills, instead of only broad per-mode difficulty tiers. The game records skill states as:

`new -> practicing -> ready -> secure`

Math Compass tracks and adapts around:

- subitizing small groups
- numeral recognition from 0 to 20
- count-on; before, after, and between
- comparing quantities and numerals
- composing/decomposing 5 and 10
- small addition/subtraction stories
- equal-sign meaning and missing parts
- teen numbers as ten plus ones
- number-line reasoning
- skip-counting by 2s, 5s, and 10s

Luca counts reliably and is comparatively advanced in math. The design goal is deeper number sense and satisfying challenges rather than merely raising the highest number.

### Word Trail

Word Trail is first in the home menu. It uses the following 20 summer words:

`map`, `park`, `trail`, `river`, `road`, `loop`, `hill`, `oak`, `pine`, `field`, `deer`, `brook`, `dam`, `rock`, `cave`, `pier`, `east`, `west`, `dog`, `bike`

Each word progresses through four child-facing activities:

1. **Meet**: picture, spoken word, and large printed word.
2. **Find**: choose the printed word from two or three choices.
3. **Build**: put its letters in order when appropriate.
4. **Read / Hear It**: recognize it without picture/audio, then in a simple trail context.

The initial word-camp sequence is:

| Camp | Words |
| --- | --- |
| 1 | `map`, `dog`, `dam` |
| 2 | `hill`, `rock`, `west` |
| 3 | `cave`, `pine`, `bike` |
| 4 | `park`, `river`, `road`, `loop` |
| 5 | `oak`, `trail`, `brook`, `deer` |
| 6 | `field`, `pier`, `east` |

The design is intentionally low pressure: no timed drills, streak pressure, or punitive failure states. A normal session should alternate a new word, an easy familiar win, a math-confidence round, and a return to a word.

There is also a small optional **Sound Trail** support layer. It can ask about initial sounds, rhymes, or simple blending but must never block a child from progressing through words. Some later words have non-simple vowel patterns and should be introduced as familiar trail words, not falsely presented as easy phonics words.

### Voice

Word Trail is first in the home menu. The browser speech was changed to be slower and clearer, with a parent setting for:

- Extra slow
- Slow and clear
- Natural pace

Word prompts repeat the target with a real pause. The app prefers enhanced/premium system English voices when they exist. For the best result on Luca's iPad, download an enhanced or premium English system voice; the app will favor it automatically. Parent-recorded word audio was discussed as a high-value future upgrade but was not implemented.

### Trail Passport

Trail Passport is the visual Word Trail home. It was implemented and pushed after the first Word Trail release.

- It presents a seven-stop illustrated summer map.
- Each word has a card showing its picture/word and stamps for Meet, Find, Build, and Hear It.
- A word earns a stamp when the corresponding activity is completed.
- Completing Meet and Find for every word in a camp opens the next camp.
- Completing all four stamps gives a word a gold explorer border.
- Completing a camp earns a visual map piece or camp patch; it is a celebration, not a gate.
- The Passport offers one clear next action and can launch the relevant focused Word Trail round directly.

Passport stops and patches:

| Camp | Stop | Patch |
| --- | --- | --- |
| 1 | Base Camp | compass |
| 2 | Hill Lookout | rock |
| 3 | Pine Cave | pinecone |
| 4 | River Park | bridge |
| 5 | Oak Loop | oak leaf |
| 6 | Deer Brook | deer track |
| 7 | Field Pier | lighthouse |

Only a small extra state for already-shown patch celebrations should be needed beyond the existing `meets`, `finds`, `builds`, and `reads` word-progress data.

## Files and implementation shape

The main implementation files previously changed were:

- `index.html`
- `app.js`
- `styles.css`
- `README.md`

The app was tested in a browser along the Word Trail, Math Compass, parent-report, and Trail Passport flows. Static syntax and whitespace checks were also run. Re-inspect the code after cloning rather than treating this note as a substitute for the source of truth.

## Historical deployment checkpoints

These are recorded task-history checkpoints, not a substitute for `git log` in the new checkout:

- `e2d2fe2`: Word Trail and Math Compass release, pushed to `main`.
- `bc79605`: Word Trail moved first and speech pacing/naturalness work, pushed to `main`.
- `5358a08`: Trail Passport, pushed to `main`.

## Product direction and guardrails

- Make the experience feel like an adventure, not practice or school.
- Math can be challenging; reading must remain visual, gentle, repeatable, and low pressure.
- Keep sessions short: approximately three to five minutes.
- Prefer visible world-building rewards (map, cards, campsite/scene additions) over points, coins, timers, or streaks.
- Never make one weak reading response feel like failure or compare reading ability with math ability.
- Preserve saved progress whenever changing the progress model; add fields backward-compatibly.
- Keep the app touch-friendly, especially on iPad.

## Good next ideas, not yet implemented

These were brainstormed but intentionally left for later:

- Parent-recorded audio for the 20 words.
- A daily mixed expedition: a couple trail-word wins, a couple math puzzles, and a compass badge.
- Real-world scavenger prompts that connect words to outdoor objects.
- A growing campsite or trail scene as the visible reward.
- Optional mascot choices and occasional, sparse comments.
- Math power-ups such as binocular count, number-line flashlight, or rocket boost.
- Reading mini-games: word detective, rhyme trail, silly one-letter swaps, and reading trail signs.

## New-chat starter prompt

Paste this into the first task for the newly mounted project:

> This is the relocated Luca Number Quest repository. Read `Luca_Numbers_handoff.md`, then inspect the current code and Git status before changing anything. The app is a child-friendly integrated Number Quest, Word Trail, Math Compass, and Trail Passport experience. Preserve saved progress and the gentle five-year-old-friendly tone. Verify responsive touch behavior and the live deployment path before publishing. Start by summarizing the current implementation versus the handoff, then wait for my next feature request unless I explicitly ask you to make changes.

