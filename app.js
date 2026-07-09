const STORAGE_KEY = "luca-number-quest-settings-v1";
const PROGRESS_KEY = "luca-number-quest-progress-v1";

const defaultSettings = {
  playerName: "Luca",
  roundSeconds: 20,
  timerEnabled: false,
  voicePraise: true,
  voicePace: "slow",
  soundEffects: true,
  mascot: "robot",
};

const VOICE_PACE_PROFILES = {
  "extra-slow": { prompt: 0.7, word: 0.64, count: 0.76, praise: 0.9 },
  slow: { prompt: 0.82, word: 0.74, count: 0.88, praise: 0.98 },
  natural: { prompt: 0.94, word: 0.86, count: 0.96, praise: 1.04 },
};

const modes = {
  count: {
    label: "Count It",
    kicker: "How many are there?",
  },
  compare: {
    label: "Compare Numbers",
    kicker: "Which side is greater?",
  },
  pairs: {
    label: "Number Pairs",
    kicker: "Numbers can snap together.",
  },
  teen: {
    label: "Teen Numbers",
    kicker: "Ten and some more ones.",
  },
  bignum: {
    label: "Big Numbers",
    kicker: "Numbers go past 20!",
  },
  write: {
    label: "Write It",
    kicker: "Use your finger!",
  },
  word: {
    label: "Word Trail",
    kicker: "Follow the trail words.",
  },
  compass: {
    label: "Math Compass",
    kicker: "Try a number challenge.",
  },
};

const STARS_PER_PLANET = 10;

const PLANETS = [
  { name: "Earth Base", emoji: "🌍" },
  { name: "The Moon", emoji: "🌕" },
  { name: "Mars", emoji: "🔴" },
  { name: "Star Cove", emoji: "⭐" },
  { name: "Saturn Rings", emoji: "🪐" },
  { name: "Ice Planet", emoji: "❄️" },
  { name: "Volcano World", emoji: "🌋" },
  { name: "Rainbow Nebula", emoji: "🌈" },
  { name: "Robot Station", emoji: "🤖" },
  { name: "Dino Planet", emoji: "🦕" },
  { name: "Candy Comet", emoji: "🍭" },
  { name: "Galaxy's Edge", emoji: "🌌" },
];

const STICKERS = [
  { id: "rocket", emoji: "🚀", name: "Rocket" },
  { id: "ufo", emoji: "🛸", name: "UFO" },
  { id: "alien", emoji: "👽", name: "Alien" },
  { id: "star", emoji: "🌟", name: "Gold Star" },
  { id: "comet", emoji: "☄️", name: "Comet" },
  { id: "astronaut", emoji: "👩‍🚀", name: "Astronaut" },
  { id: "moon", emoji: "🌙", name: "Moon" },
  { id: "telescope", emoji: "🔭", name: "Telescope" },
  { id: "trex", emoji: "🦖", name: "T-Rex" },
  { id: "bronto", emoji: "🦕", name: "Brontosaurus" },
  { id: "dragon", emoji: "🐉", name: "Dragon" },
  { id: "egg", emoji: "🥚", name: "Dino Egg" },
  { id: "volcano", emoji: "🌋", name: "Volcano" },
  { id: "bone", emoji: "🦴", name: "Dino Bone" },
  { id: "lion", emoji: "🦁", name: "Lion" },
  { id: "panda", emoji: "🐼", name: "Panda" },
  { id: "fox", emoji: "🦊", name: "Fox" },
  { id: "octopus", emoji: "🐙", name: "Octopus" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  { id: "whale", emoji: "🐳", name: "Whale" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly" },
  { id: "turtle", emoji: "🐢", name: "Turtle" },
  { id: "icecream", emoji: "🍦", name: "Ice Cream" },
  { id: "donut", emoji: "🍩", name: "Donut" },
  { id: "cupcake", emoji: "🧁", name: "Cupcake" },
  { id: "strawberry", emoji: "🍓", name: "Strawberry" },
  { id: "watermelon", emoji: "🍉", name: "Watermelon" },
  { id: "cookie", emoji: "🍪", name: "Cookie" },
  { id: "soccer", emoji: "⚽", name: "Soccer Ball" },
  { id: "balloon", emoji: "🎈", name: "Balloon" },
  { id: "art", emoji: "🎨", name: "Paint Set" },
  { id: "guitar", emoji: "🎸", name: "Guitar" },
  { id: "trophy", emoji: "🏆", name: "Trophy" },
  { id: "circus", emoji: "🎪", name: "Circus Tent" },
];

const MASCOT_ORDER = ["robot", "dino", "cat"];

const MASCOTS = {
  robot: {
    name: "Beep",
    body: `
      <line x1="60" y1="18" x2="60" y2="30" stroke="#4d9fd6" stroke-width="3"/>
      <circle class="m-antenna" cx="60" cy="14" r="5" fill="#ffd84d" stroke="#d99e06" stroke-width="2"/>
      <rect x="22" y="30" width="76" height="72" rx="20" fill="#aee0ff" stroke="#4d9fd6" stroke-width="3"/>
      <rect x="34" y="102" width="14" height="8" rx="4" fill="#4d9fd6"/>
      <rect x="72" y="102" width="14" height="8" rx="4" fill="#4d9fd6"/>
    `,
  },
  dino: {
    name: "Rex",
    body: `
      <path d="M40 36 L46 22 L52 36 Z" fill="#4caf6d"/>
      <path d="M54 32 L60 17 L66 32 Z" fill="#4caf6d"/>
      <path d="M68 36 L74 22 L80 36 Z" fill="#4caf6d"/>
      <ellipse cx="60" cy="70" rx="40" ry="38" fill="#9fe3a9" stroke="#4caf6d" stroke-width="3"/>
      <ellipse cx="60" cy="92" rx="20" ry="13" fill="#d6f5d9"/>
    `,
  },
  cat: {
    name: "Whiskers",
    body: `
      <path d="M30 44 L36 16 L54 34 Z" fill="#ffd9a8" stroke="#e8a857" stroke-width="3" stroke-linejoin="round"/>
      <path d="M90 44 L84 16 L66 34 Z" fill="#ffd9a8" stroke="#e8a857" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="68" r="40" fill="#ffd9a8" stroke="#e8a857" stroke-width="3"/>
      <line x1="14" y1="66" x2="34" y2="69" stroke="#e8a857" stroke-width="2"/>
      <line x1="14" y1="78" x2="34" y2="75" stroke="#e8a857" stroke-width="2"/>
      <line x1="106" y1="66" x2="86" y2="69" stroke="#e8a857" stroke-width="2"/>
      <line x1="106" y1="78" x2="86" y2="75" stroke="#e8a857" stroke-width="2"/>
      <path d="M56 68 L64 68 L60 73 Z" fill="#e8a857"/>
    `,
  },
};

const WORD_TRAIL_WORDS = [
  { word: "map", emoji: "🗺️", camp: 1, sound: "/m/", pattern: "short a" },
  { word: "dog", emoji: "🐕", camp: 1, sound: "/d/", pattern: "short o" },
  { word: "dam", emoji: "🦫", camp: 1, sound: "/d/", pattern: "short a" },
  { word: "hill", emoji: "⛰️", camp: 2, sound: "/h/", pattern: "short i" },
  { word: "rock", emoji: "🪨", camp: 2, sound: "/r/", pattern: "short o" },
  { word: "west", emoji: "🌇", camp: 2, sound: "/w/", pattern: "short e" },
  { word: "cave", emoji: "🕳️", camp: 3, sound: "/k/", pattern: "magic e" },
  { word: "pine", emoji: "🌲", camp: 3, sound: "/p/", pattern: "magic e" },
  { word: "bike", emoji: "🚲", camp: 3, sound: "/b/", pattern: "magic e" },
  { word: "park", emoji: "🌳", camp: 4, sound: "/p/", pattern: "r sound" },
  { word: "river", emoji: "🌊", camp: 4, sound: "/r/", pattern: "two beats" },
  { word: "road", emoji: "🛣️", camp: 4, sound: "/r/", pattern: "oa" },
  { word: "loop", emoji: "➰", camp: 5, sound: "/l/", pattern: "oo" },
  { word: "oak", emoji: "🌳", camp: 5, sound: "/ō/", pattern: "oa" },
  { word: "trail", emoji: "🥾", camp: 5, sound: "/t/", pattern: "ai" },
  { word: "brook", emoji: "💧", camp: 6, sound: "/b/", pattern: "oo" },
  { word: "deer", emoji: "🦌", camp: 6, sound: "/d/", pattern: "ee" },
  { word: "east", emoji: "🌅", camp: 6, sound: "/ē/", pattern: "ea" },
  { word: "field", emoji: "🌾", camp: 7, sound: "/f/", pattern: "ie" },
  { word: "pier", emoji: "🛟", camp: 7, sound: "/p/", pattern: "ie" },
];

const TRAIL_PASSPORT_CAMPS = [
  { id: 1, name: "Base Camp", emoji: "⛺", patch: "🧭", patchName: "Compass Patch" },
  { id: 2, name: "Hill Lookout", emoji: "⛰️", patch: "🪨", patchName: "Rock Patch" },
  { id: 3, name: "Pine Cave", emoji: "🌲", patch: "🦇", patchName: "Cave Patch" },
  { id: 4, name: "River Park", emoji: "🌊", patch: "🌉", patchName: "Bridge Patch" },
  { id: 5, name: "Oak Loop", emoji: "🌳", patch: "🍃", patchName: "Oak Leaf Patch" },
  { id: 6, name: "Deer Brook", emoji: "🦌", patch: "👣", patchName: "Deer Track Patch" },
  { id: 7, name: "Field Pier", emoji: "🛟", patch: "⚓", patchName: "Harbor Patch" },
];

const PASSPORT_STAMPS = [
  { key: "meets", label: "Meet", emoji: "👋" },
  { key: "finds", label: "Find", emoji: "👀" },
  { key: "builds", label: "Build", emoji: "🔤" },
  { key: "reads", label: "Hear It", emoji: "🔊" },
];

const MATH_SKILLS = {
  "one-to-one": { label: "Touch and count", shortLabel: "Counting" },
  cardinality: { label: "How many?", shortLabel: "How many" },
  subitize: { label: "Quick groups", shortLabel: "Quick groups" },
  "numeral-match": { label: "Numerals and amounts", shortLabel: "Numerals" },
  "count-on": { label: "Counting on", shortLabel: "Count on" },
  "number-sequence": { label: "Number order", shortLabel: "Number order" },
  "compare-groups": { label: "More, fewer, same", shortLabel: "Groups" },
  "compare-numerals": { label: "Compare numerals", shortLabel: "Compare" },
  "number-bonds": { label: "Parts make a whole", shortLabel: "Number pairs" },
  "make-ten": { label: "Friends of ten", shortLabel: "Make 10" },
  "add-subtract": { label: "Add and take away", shortLabel: "Stories" },
  equals: { label: "Equals means the same", shortLabel: "Equals" },
  "teen-numbers": { label: "Tens and ones", shortLabel: "Teen numbers" },
  "number-line": { label: "Number line", shortLabel: "Number line" },
  "skip-count": { label: "Skip counting", shortLabel: "Skip count" },
  "numeral-writing": { label: "Writing numerals", shortLabel: "Writing" },
};

const COMPASS_SKILL_IDS = [
  "subitize",
  "numeral-match",
  "count-on",
  "number-line",
  "number-bonds",
  "equals",
  "teen-numbers",
  "skip-count",
];

const savedProgress = loadProgress();

const countItems = [
  { emoji: "🧸", singular: "bear", plural: "bears" },
  { emoji: "🚀", singular: "rocket", plural: "rockets" },
  { emoji: "⭐", singular: "star", plural: "stars" },
  { emoji: "🦕", singular: "dinosaur", plural: "dinosaurs" },
  { emoji: "🍎", singular: "apple", plural: "apples" },
  { emoji: "⚽", singular: "ball", plural: "balls" },
];

const praiseLines = [
  "Woohoo, you got it!",
  "Yes! That's right!",
  "Amazing! You're a math star!",
  "Fantastic thinking!",
  "Oh yeah! Super smart!",
  "You nailed it!",
  "Incredible! Way to go!",
  "Boom! Correct!",
  "You're on fire!",
  "That's it! Brilliant!",
  "Math hero!",
  "Spectacular!",
  "Yes yes yes! You did it!",
  "Super duper smart!",
  "Kindergarten champion!",
  "Number ninja! Correct!",
  "You rock!",
  "Hooray! Perfect answer!",
  "Smart brain! Yes!",
  "You crushed it!",
  "Gold star for you!",
  "Math magic! Correct!",
  "Awesome job!",
  "Like a rocket! Correct!",
  "Magnificent thinking!",
  "{name}, you're a superstar!",
  "Go {name}, go!",
  "Wow, {name}! Amazing!",
  "{name} nails it again!",
  "High five, {name}!",
  "Super job, {name}!",
];

const retryLines = [
  "Hmm, not that one. Try again!",
  "So close! Look one more time.",
  "Almost, {name}! Try again.",
  "Try once more. You can do it!",
  "Not quite. Take another look!",
];

const milestonePraise = [
  "Five in a row! You are amazing!",
  "Unstoppable! Five correct!",
  "You are a math superstar!",
  "Five in a row! Incredible!",
  "Woohoo! Five in a row!",
  "{name} is unstoppable! Five in a row!",
  "Five in a row, {name}! Wow!",
];

const state = {
  settings: loadSettings(),
  mode: null,
  score: savedProgress.score,
  streak: savedProgress.streak,
  stars: savedProgress.stars,
  stickers: savedProgress.stickers,
  roundActive: false,
  retryUsed: false,
  mascotTimeoutId: null,
  timerId: null,
  timerDeadline: 0,
  nextRoundTimeoutId: null,
  currentRound: null,
  modeStats: savedProgress.modeStats,
  wordProgress: savedProgress.wordProgress,
  mathSkills: savedProgress.mathSkills,
  compassIndex: savedProgress.compassIndex,
  passportPatchesSeen: savedProgress.passportPatchesSeen,
  passportCampId: null,
  passportTargetWord: null,
  passportRewardTimeoutId: null,
  audioContext: null,
  availableVoices: [],
};

const MUSIC_NOTES = [
  { freq: 523.25, dur: 0.18 }, // C5
  { freq: 659.25, dur: 0.18 }, // E5
  { freq: 783.99, dur: 0.18 }, // G5
  { freq: 659.25, dur: 0.18 }, // E5
  { freq: 523.25, dur: 0.28 }, // C5 (held)
  { freq: 0,      dur: 0.10 }, // rest
  { freq: 392.00, dur: 0.18 }, // G4
  { freq: 440.00, dur: 0.18 }, // A4
  { freq: 523.25, dur: 0.18 }, // C5
  { freq: 587.33, dur: 0.18 }, // D5
  { freq: 659.25, dur: 0.28 }, // E5 (held)
  { freq: 0,      dur: 0.18 }, // rest
];

const music = {
  nextNoteTime: 0,
  noteIndex: 0,
  schedulerInterval: null,
  playing: false,
};

const elements = {
  appTitle: document.querySelector("#app-title"),
  heroMessage: document.querySelector("#hero-message"),
  heroRocket: document.querySelector(".hero-rocket"),
  statsPanel: document.querySelector(".stats-panel"),
  score: document.querySelector("#score-value"),
  streak: document.querySelector("#streak-value"),
  stars: document.querySelector("#stars-value"),
  screens: {
    home: document.querySelector("#screen-home"),
    game: document.querySelector("#screen-game"),
    settings: document.querySelector("#screen-settings"),
    stickers: document.querySelector("#screen-stickers"),
    passport: document.querySelector("#screen-passport"),
  },
  stickersButton: document.querySelector("#stickers-button"),
  passportButton: document.querySelector("#passport-button"),
  passportHomeStatus: document.querySelector("#passport-home-status"),
  passportHomePatches: document.querySelector("#passport-home-patches"),
  closePassport: document.querySelector("#close-passport"),
  passportIntro: document.querySelector("#passport-intro"),
  passportMap: document.querySelector("#passport-map"),
  passportCampHead: document.querySelector("#passport-camp-head"),
  passportWordGrid: document.querySelector("#passport-word-grid"),
  stickerCount: document.querySelector("#sticker-count"),
  stickerGrid: document.querySelector("#sticker-grid"),
  closeStickers: document.querySelector("#close-stickers"),
  launchSticker: document.querySelector("#launch-sticker"),
  trailRewardOverlay: document.querySelector("#trail-reward-overlay"),
  trailRewardIcon: document.querySelector("#trail-reward-icon"),
  trailRewardTitle: document.querySelector("#trail-reward-title"),
  trailRewardDetail: document.querySelector("#trail-reward-detail"),
  modeChip: document.querySelector("#mode-chip"),
  fuelChip: document.querySelector("#fuel-chip"),
  journeyEmoji: document.querySelector("#journey-planet-emoji"),
  journeyName: document.querySelector("#journey-planet-name"),
  journeyNextEmoji: document.querySelector("#journey-next-emoji"),
  fuelFill: document.querySelector("#fuel-fill"),
  fuelText: document.querySelector("#fuel-text"),
  launchOverlay: document.querySelector("#launch-overlay"),
  launchMessage: document.querySelector("#launch-message"),
  launchPlanet: document.querySelector("#launch-planet"),
  timerText: document.querySelector("#timer-text"),
  timerBar: document.querySelector("#timer-bar"),
  timerFill: document.querySelector("#timer-fill"),
  mascot: document.querySelector("#mascot"),
  promptKicker: document.querySelector("#prompt-kicker"),
  promptTitle: document.querySelector("#prompt-title"),
  promptSubtitle: document.querySelector("#prompt-subtitle"),
  readPrompt: document.querySelector("#read-prompt"),
  choices: document.querySelector("#choices"),
  feedback: document.querySelector("#feedback"),
  parentsButton: document.querySelector("#parents-button"),
  backButton: document.querySelector("#back-button"),
  closeSettings: document.querySelector("#close-settings"),
  nameInput: document.querySelector("#name-input"),
  roundSeconds: document.querySelector("#round-seconds"),
  timerToggle: document.querySelector("#timer-toggle"),
  voiceToggle: document.querySelector("#voice-toggle"),
  voicePace: document.querySelector("#voice-pace"),
  soundToggle: document.querySelector("#sound-toggle"),
  saveSettings: document.querySelector("#save-settings"),
  resetProgress: document.querySelector("#reset-progress"),
  skillReportGrid: document.querySelector("#skill-report-grid"),
  mathSkillReportGrid: document.querySelector("#math-skill-report-grid"),
  wordReportGrid: document.querySelector("#word-report-grid"),
  wordTrailReportNote: document.querySelector("#word-trail-report-note"),
};

init();

function init() {
  bindEvents();
  populateSettingsForm();
  syncTimerSettingsState();
  updateTimerVisual();
  syncAvailableVoices();
  updateReadPromptButton();
  refreshHeader();
  updateStats();
  updateStreakVisuals();
  applyPlanetTheme(currentPlanetIndex());
  updateJourney();
  updatePassportHomeButton();
  renderMascot();
  backfillStickers();
  updateStickerCount();
  createBackgroundParticles();
  showScreen("home");
  registerServiceWorker();
}

function bindEvents() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => startMode(button.dataset.mode));
  });

  elements.parentsButton.addEventListener("click", openSettings);
  elements.closeSettings.addEventListener("click", closeSettings);
  elements.stickersButton.addEventListener("click", openStickers);
  elements.closeStickers.addEventListener("click", closeStickers);
  elements.passportButton.addEventListener("click", openPassport);
  elements.closePassport.addEventListener("click", closePassport);
  elements.mascot.addEventListener("click", cycleMascot);
  elements.backButton.addEventListener("click", goHome);
  elements.readPrompt.addEventListener("click", readCurrentPrompt);
  elements.timerToggle.addEventListener("change", syncTimerSettingsState);
  elements.saveSettings.addEventListener("click", saveSettings);
  elements.resetProgress.addEventListener("click", resetProgress);

  if (canSpeak()) {
    window.speechSynthesis.addEventListener("voiceschanged", syncAvailableVoices);
  }
}

function createModeStats() {
  const stats = {};

  Object.keys(modes).forEach((modeKey) => {
    stats[modeKey] = { wins: 0, misses: 0, streak: 0 };
  });

  return stats;
}

function createWordProgress() {
  return Object.fromEntries(
    WORD_TRAIL_WORDS.map((word) => [
      word.word,
      { meets: 0, finds: 0, builds: 0, reads: 0, wins: 0, misses: 0 },
    ])
  );
}

function createMathSkillProgress() {
  return Object.fromEntries(
    Object.keys(MATH_SKILLS).map((skill) => [
      skill,
      { wins: 0, misses: 0, cleanWins: 0, streak: 0 },
    ])
  );
}

function getWordProgress(word) {
  if (!state.wordProgress[word]) {
    state.wordProgress[word] = { meets: 0, finds: 0, builds: 0, reads: 0, wins: 0, misses: 0 };
  }
  return state.wordProgress[word];
}

function getMathSkillProgress(skill) {
  if (!state.mathSkills[skill]) {
    state.mathSkills[skill] = { wins: 0, misses: 0, cleanWins: 0, streak: 0 };
  }
  return state.mathSkills[skill];
}

function getUnlockedWordTrailWords() {
  const camps = [...new Set(WORD_TRAIL_WORDS.map((word) => word.camp))];
  let unlockedThrough = 1;

  for (let index = 1; index < camps.length; index += 1) {
    const previousCamp = camps[index - 1];
    const previousWords = WORD_TRAIL_WORDS.filter((word) => word.camp === previousCamp);
    const previousCampIsReady = previousWords.every((word) => {
      const progress = getWordProgress(word.word);
      return progress.meets >= 1 && progress.finds >= 1;
    });

    if (!previousCampIsReady) {
      break;
    }
    unlockedThrough = camps[index];
  }

  return WORD_TRAIL_WORDS.filter((word) => word.camp <= unlockedThrough);
}

function getTrailPassportCamp(campId) {
  return TRAIL_PASSPORT_CAMPS.find((camp) => camp.id === Number(campId)) || null;
}

function getTrailCampWords(campId) {
  return WORD_TRAIL_WORDS.filter((word) => word.camp === Number(campId));
}

function getNextPassportStamp(word) {
  const progress = getWordProgress(word.word);
  return PASSPORT_STAMPS.find((stamp) => progress[stamp.key] < 1) || null;
}

function isPassportWordComplete(word) {
  return !getNextPassportStamp(word);
}

function getPassportCampState(camp) {
  const words = getTrailCampWords(camp.id);
  const unlockedCamps = new Set(getUnlockedWordTrailWords().map((word) => word.camp));
  const stampCount = words.reduce(
    (total, word) => total + PASSPORT_STAMPS.filter((stamp) => getWordProgress(word.word)[stamp.key] >= 1).length,
    0
  );
  const nextWord = words.find((word) => !isPassportWordComplete(word)) || words[0];

  return {
    camp,
    words,
    stampCount,
    stampTotal: words.length * PASSPORT_STAMPS.length,
    isOpen: unlockedCamps.has(camp.id),
    isComplete: words.every(isPassportWordComplete),
    nextWord,
    nextStamp: nextWord ? getNextPassportStamp(nextWord) : null,
  };
}

function getRecommendedPassportCamp() {
  const states = TRAIL_PASSPORT_CAMPS.map(getPassportCampState);
  return states.find((campState) => campState.isOpen && !campState.isComplete)
    || states.filter((campState) => campState.isOpen).pop()
    || states[0];
}

function updatePassportHomeButton() {
  const nextCamp = getRecommendedPassportCamp();
  const earnedPatches = TRAIL_PASSPORT_CAMPS.filter((camp) => getPassportCampState(camp).isComplete).length;
  elements.passportHomePatches.textContent = `${earnedPatches} / ${TRAIL_PASSPORT_CAMPS.length} 🏅`;

  if (nextCamp.isComplete) {
    elements.passportHomeStatus.textContent = "Every camp is complete — pick any trail word to explore again.";
    return;
  }

  elements.passportHomeStatus.textContent = `Next: ${nextCamp.nextWord.emoji} ${nextCamp.nextWord.word} — ${nextCamp.nextStamp.label} stamp`;
}

function openPassport() {
  clearQueuedRound();
  endRound();
  stopSpeech();
  stopBackgroundMusic();
  state.mode = null;
  state.currentRound = null;
  state.passportTargetWord = null;
  state.passportCampId = getRecommendedPassportCamp().camp.id;
  updateReadPromptButton();
  renderTrailPassport();
  showScreen("passport");
}

function closePassport() {
  state.passportTargetWord = null;
  goHome();
}

function renderTrailPassport() {
  const campStates = TRAIL_PASSPORT_CAMPS.map(getPassportCampState);
  let selected = campStates.find((campState) => campState.camp.id === state.passportCampId);
  if (!selected || !selected.isOpen) {
    selected = getRecommendedPassportCamp();
    state.passportCampId = selected.camp.id;
  }

  const earnedPatches = campStates.filter((campState) => campState.isComplete).length;
  elements.passportIntro.textContent = `${earnedPatches} of ${TRAIL_PASSPORT_CAMPS.length} camp patches earned. Tap an open map stop or a word card to play its next trail step.`;
  elements.passportMap.innerHTML = "";

  campStates.forEach((campState) => {
    const { camp } = campState;
    const stop = document.createElement("button");
    stop.type = "button";
    stop.className = [
      "passport-stop",
      campState.isOpen ? "open" : "locked",
      campState.isComplete ? "complete" : "",
      selected.camp.id === camp.id ? "selected" : "",
    ].filter(Boolean).join(" ");
    stop.disabled = !campState.isOpen;
    stop.innerHTML = `
      <span class="passport-stop-marker">${campState.isOpen ? camp.emoji : "🔒"}</span>
      <span class="passport-stop-number">${camp.id}</span>
      <strong>${camp.name}</strong>
      <small>${campState.isComplete ? `${camp.patch} ${camp.patchName}` : `${campState.stampCount} / ${campState.stampTotal} stamps`}</small>
    `;
    stop.addEventListener("click", () => {
      state.passportCampId = camp.id;
      renderTrailPassport();
    });
    elements.passportMap.appendChild(stop);
  });

  const nextText = selected.isComplete
    ? "Every word has its explorer border. Tap one for a review adventure."
    : `Next trail step: ${selected.nextWord.emoji} ${selected.nextWord.word} — ${selected.nextStamp.emoji} ${selected.nextStamp.label}.`;
  elements.passportCampHead.innerHTML = `
    <div>
      <p class="passport-kicker">Camp ${selected.camp.id}</p>
      <h3>${selected.camp.emoji} ${selected.camp.name}</h3>
      <p>${nextText}</p>
    </div>
    <span class="passport-patch ${selected.isComplete ? "earned" : ""}">
      ${selected.isComplete ? selected.camp.patch : "🏅"}
      <span>${selected.isComplete ? selected.camp.patchName : "Camp patch"}</span>
    </span>
  `;

  elements.passportWordGrid.innerHTML = "";
  selected.words.forEach((word) => {
    const progress = getWordProgress(word.word);
    const complete = isPassportWordComplete(word);
    const nextStamp = getNextPassportStamp(word);
    const card = document.createElement("button");
    card.type = "button";
    card.className = ["passport-word-card", complete ? "complete" : ""].filter(Boolean).join(" ");
    card.setAttribute("aria-label", `${word.word}. ${complete ? "All stamps earned. Review this word." : `Next: ${nextStamp.label}.`}`);
    card.innerHTML = `
      <span class="passport-word-picture">${word.emoji}</span>
      <strong>${word.word}</strong>
      <span class="passport-stamp-row">
        ${PASSPORT_STAMPS.map((stamp) => `
          <span class="passport-stamp ${progress[stamp.key] >= 1 ? "earned" : ""}" title="${stamp.label}">
            ${progress[stamp.key] >= 1 ? stamp.emoji : "·"}
          </span>
        `).join("")}
      </span>
      <span class="passport-word-next">${complete ? "⭐ Trail star earned" : `${nextStamp.emoji} Next: ${nextStamp.label}`}</span>
    `;
    card.addEventListener("click", () => startPassportWord(word.word));
    elements.passportWordGrid.appendChild(card);
  });
}

function startPassportWord(wordKey) {
  const word = WORD_TRAIL_WORDS.find((item) => item.word === wordKey);
  const isUnlocked = getUnlockedWordTrailWords().some((item) => item.word === wordKey);
  if (!word || !isUnlocked) {
    return;
  }

  state.passportCampId = word.camp;
  state.passportTargetWord = word.word;
  startMode("word");
}

function showTrailReward(reward) {
  if (!reward?.isNewStamp && !reward?.earnedCampPatch) {
    return 0;
  }

  const camp = reward.camp || getTrailPassportCamp(reward.wordData?.camp);
  const stamp = reward.stamp;
  const hasPatch = Boolean(reward.earnedCampPatch);
  elements.trailRewardIcon.textContent = hasPatch ? camp.patch : stamp.emoji;
  elements.trailRewardTitle.textContent = hasPatch ? `${camp.patchName} earned!` : `New ${stamp.label} stamp!`;
  elements.trailRewardDetail.textContent = hasPatch
    ? `${camp.name} is complete!`
    : `${reward.word} goes in your Trail Passport.`;
  elements.trailRewardOverlay.classList.remove("hidden");

  if (state.passportRewardTimeoutId) {
    window.clearTimeout(state.passportRewardTimeoutId);
  }
  state.passportRewardTimeoutId = window.setTimeout(() => {
    elements.trailRewardOverlay.classList.add("hidden");
    state.passportRewardTimeoutId = null;
  }, hasPatch ? 1550 : 1000);

  return hasPatch ? 1450 : 850;
}

function clearTrailReward() {
  if (state.passportRewardTimeoutId) {
    window.clearTimeout(state.passportRewardTimeoutId);
    state.passportRewardTimeoutId = null;
  }
  elements.trailRewardOverlay.classList.add("hidden");
}

function startMode(mode) {
  if (!modes[mode]) {
    return;
  }

  clearQueuedRound();
  state.mode = mode;
  state.roundActive = true;
  elements.modeChip.textContent = modes[mode].label;
  clearFeedback();
  showScreen("game");
  playSoundEffect("start");
  startBackgroundMusic();
  nextRound();
}

function nextRound() {
  if (!state.mode) {
    return;
  }

  clearQueuedRound();
  clearTimer();
  stopSpeech();
  clearFeedback();
  state.retryUsed = false;
  setMascotState("idle");

  const round = generateRound(state.mode);
  state.currentRound = round;
  renderRound(round);
  animateSceneItems();
  startTimer();
  autoReadPrompt();
}

function generateRound(mode) {
  if (mode === "word") {
    return generateWordTrailRound();
  }

  if (mode === "compass") {
    return generateCompassRound();
  }

  if (mode === "count") {
    return generateCountRound();
  }

  if (mode === "compare") {
    return generateCompareRound();
  }

  if (mode === "pairs") {
    return generatePairsRound();
  }

  if (mode === "bignum") {
    return generateBigNumRound();
  }

  if (mode === "write") {
    return generateWriteRound();
  }

  return generateTeenRound();
}

function generateWordTrailRound() {
  const requestedWord = WORD_TRAIL_WORDS.find((word) => word.word === state.passportTargetWord);
  const unlocked = new Set(getUnlockedWordTrailWords().map((word) => word.word));
  const word = requestedWord && unlocked.has(requestedWord.word)
    ? requestedWord
    : chooseWordTrailWord();
  state.passportTargetWord = null;
  const progress = getWordProgress(word.word);

  if (progress.meets === 0) {
    return generateWordMeetRound(word);
  }

  if (progress.finds === 0) {
    return generateWordFindRound(word);
  }

  if (progress.builds === 0) {
    return generateWordBuildRound(word);
  }

  return generateWordReadRound(word);
}

function chooseWordTrailWord() {
  const unlocked = getUnlockedWordTrailWords();
  const newWord = unlocked.find((word) => getWordProgress(word.word).meets === 0);

  if (newWord) {
    return newWord;
  }

  const stillLearning = unlocked.filter((word) => {
    const progress = getWordProgress(word.word);
    return progress.finds === 0 || progress.builds === 0 || progress.reads === 0;
  });

  if (stillLearning.length) {
    return pickRandom(stillLearning);
  }

  return pickRandom(unlocked);
}

function generateWordMeetRound(word) {
  return {
    type: "scene-choice",
    kicker: `Word Trail · Camp ${word.camp}`,
    title: "Meet a new trail word!",
    spokenPrompt: `Let's meet a new word. ${word.word}. ... ${word.word}.`,
    subtitle: "Look, listen, and tap the word when you are ready.",
    sceneClassName: "word-meet-scene",
    sceneHtml: buildWordTrailSceneHtml(word, { showWord: true, showHint: true }),
    layoutClass: "single-choice-grid",
    word: word.word,
    wordStep: "meets",
    choices: [
      createChoice({
        correct: true,
        className: "word-choice",
        html: buildWordChoiceHtml(word.word, "tap the trail word"),
      }),
    ],
    successMessage: `You met ${word.word}!`,
  };
}

function generateWordFindRound(word) {
  return {
    type: "scene-choice",
    kicker: `Word Trail · Camp ${word.camp}`,
    title: `Find the word for this ${word.emoji}.`,
    spokenPrompt: `Find the word, ${word.word}.`,
    subtitle: "Look at the letters, then tap the matching word.",
    sceneClassName: "word-picture-scene",
    sceneHtml: buildWordTrailSceneHtml(word),
    layoutClass: "word-choice-grid",
    word: word.word,
    wordStep: "finds",
    choices: buildWordChoices(word).map((choiceWord) =>
      createChoice({
        correct: choiceWord.word === word.word,
        className: "word-choice",
        html: buildWordChoiceHtml(choiceWord.word, "trail word"),
      })
    ),
    successMessage: `Yes! ${word.word} matches the picture.`,
    failureMessage: `This one says ${word.word}.`,
  };
}

function generateWordBuildRound(word) {
  return {
    type: "word-build",
    kicker: `Word Trail · Camp ${word.camp}`,
    title: `Build the word ${word.word}.`,
    spokenPrompt: `Build the word, ${word.word}.`,
    subtitle: "Tap the letters in the order they belong.",
    word: word.word,
    wordData: word,
    wordStep: "builds",
    successMessage: `You built ${word.word}!`,
    failureMessage: `Let's look at ${word.word} together.`,
  };
}

function generateWordReadRound(word) {
  return {
    type: "scene-choice",
    kicker: `Word Trail · Camp ${word.camp}`,
    title: "Which trail word did you hear?",
    spokenPrompt: `Listen carefully. The word is, ${word.word}. ... ${word.word}.`,
    subtitle: "Try it from memory. You can use Read It for a hint.",
    sceneClassName: "word-read-scene",
    sceneHtml: `<div class="word-read-badge">👀<span>Look at every letter.</span></div>`,
    layoutClass: "word-choice-grid",
    word: word.word,
    wordStep: "reads",
    choices: buildWordChoices(word).map((choiceWord) =>
      createChoice({
        correct: choiceWord.word === word.word,
        className: "word-choice",
        html: buildWordChoiceHtml(choiceWord.word, "trail word"),
      })
    ),
    successMessage: `You read ${word.word}!`,
    failureMessage: `The word was ${word.word}.`,
  };
}

function buildWordChoices(targetWord) {
  const choices = getUnlockedWordTrailWords().filter((word) => word.word !== targetWord.word);
  const distractors = shuffleArray(choices).slice(0, 2);
  return shuffleArray([targetWord, ...distractors]);
}

function generateCompassRound() {
  const skill = getNextCompassSkill();
  let round;

  if (skill === "subitize") {
    round = generateSubitizeRound();
  } else if (skill === "numeral-match") {
    round = generateNumeralMatchRound();
  } else if (skill === "count-on") {
    round = generateCompassSequenceRound();
  } else if (skill === "number-line") {
    round = generateNumberLineRound();
  } else if (skill === "number-bonds") {
    round = generateBondRound({ maxTarget: 10, answerCount: 4 });
  } else if (skill === "equals") {
    round = generateEqualsRound();
  } else if (skill === "teen-numbers") {
    round = generateTeenMatchRound({ minTeen: 11, maxTeen: 19, answerCount: 4 });
  } else {
    round = generateCompassSkipCountRound();
  }

  round.skill = skill;
  round.kicker = `Math Compass · ${MATH_SKILLS[skill].shortLabel}`;
  return round;
}

function getNextCompassSkill() {
  const unseen = COMPASS_SKILL_IDS.filter((skill) => getMathSkillProgress(skill).wins + getMathSkillProgress(skill).misses === 0);
  if (unseen.length) {
    const skill = unseen[0];
    state.compassIndex += 1;
    return skill;
  }

  const sorted = [...COMPASS_SKILL_IDS].sort((first, second) => {
    const firstProgress = getMathSkillProgress(first);
    const secondProgress = getMathSkillProgress(second);
    const firstAttempts = firstProgress.wins + firstProgress.misses;
    const secondAttempts = secondProgress.wins + secondProgress.misses;
    const firstAccuracy = firstAttempts ? firstProgress.wins / firstAttempts : 0;
    const secondAccuracy = secondAttempts ? secondProgress.wins / secondAttempts : 0;
    return firstAccuracy - secondAccuracy || firstAttempts - secondAttempts;
  });

  return sorted[0];
}

function generateSubitizeRound() {
  const target = randomInt(2, 6);
  const choices = buildNearbyChoices(target, 3, 7, { min: 1 });

  return {
    type: "scene-choice",
    kicker: "Quick groups",
    title: "How many stars do you see?",
    subtitle: "Take a quick look. You do not have to count if you know it!",
    sceneClassName: "subitize-scene",
    sceneHtml: buildSubitizeSceneHtml(target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, "stars"),
      })
    ),
    successMessage: `Yes! You saw ${target} stars.`,
    failureMessage: `There are ${target} stars.`,
  };
}

function generateNumeralMatchRound() {
  const target = randomInt(0, 20);
  const choices = buildNearbyChoices(target, 4, 20, { min: 0 });

  return {
    type: "scene-choice",
    kicker: "Numerals and amounts",
    title: "Which number matches this group?",
    subtitle: "Match the amount to its number.",
    sceneClassName: "numeral-match-scene",
    sceneHtml: buildQuantitySceneHtml(target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, "number"),
      })
    ),
    successMessage: `Yes! That group shows ${target}.`,
    failureMessage: `That group shows ${target}.`,
  };
}

function generateCompassSequenceRound() {
  const kind = pickRandom(["after", "before", "between"]);
  const start = randomInt(2, 18);
  let title;
  let correct;

  if (kind === "before") {
    correct = start - 1;
    title = `What number comes before ${start}?`;
  } else if (kind === "between") {
    correct = start;
    title = `What number comes between ${start - 1} and ${start + 1}?`;
  } else {
    correct = start + 1;
    title = `What number comes after ${start}?`;
  }

  const choices = buildNearbyChoices(correct, 3, 20, { min: 0 });
  return {
    type: "choice",
    kicker: "Number order",
    title,
    subtitle: "Imagine the number path.",
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "number"),
      })
    ),
    successMessage: `Yes! ${correct} is in that spot.`,
    failureMessage: `The answer is ${correct}.`,
  };
}

function generateNumberLineRound() {
  const start = Math.random() < 0.5 ? 0 : 10;
  const target = randomInt(start + 1, start + 9);
  const choices = buildNearbyChoices(target, 3, start + 10, { min: start });

  return {
    type: "scene-choice",
    kicker: "Number line",
    title: "What number is hiding on the path?",
    subtitle: "The numbers move by one as you walk along.",
    sceneClassName: "number-line-scene",
    sceneHtml: buildNumberLineHtml(start, target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, "path number"),
      })
    ),
    successMessage: `Yes! ${target} belongs there.`,
    failureMessage: `${target} belongs in that spot.`,
  };
}

function generateEqualsRound() {
  const first = randomInt(1, 5);
  const second = randomInt(1, 5);
  const total = first + second;
  const wrong = total + pickRandom([-2, -1, 1, 2]);
  const choices = shuffleArray([
    { value: total, correct: true },
    { value: Math.max(0, wrong), correct: false },
  ]);

  return {
    type: "choice",
    kicker: "Equals means the same",
    title: `What makes ${first} + ${second} = ? true?`,
    subtitle: "The two sides of an equals sign have the same amount.",
    layoutClass: "two-choice-grid",
    choices: choices.map((choice) =>
      createChoice({
        correct: choice.correct,
        className: "equation-choice",
        html: `<span class="choice-equation">${first} + ${second} = ${choice.value}</span><span class="choice-label">equation</span>`,
      })
    ),
    successMessage: `Yes! ${first} plus ${second} is ${total}.`,
    failureMessage: `${first} plus ${second} is ${total}.`,
  };
}

function generateCompassSkipCountRound() {
  const step = pickRandom([2, 5, 10]);
  const start = step === 10 ? randomInt(0, 6) * 10 : randomInt(0, 4) * step;
  const correct = start + step;
  const max = step === 10 ? 100 : 30;
  const choices = buildNearbyChoices(correct, 3, max, {
    min: 0,
    offsets: [step, -step, step * 2, -step * 2, 1, -1],
  });

  return {
    type: "scene-choice",
    kicker: "Skip counting",
    title: `What comes next when you count by ${step}s?`,
    subtitle: "Say the rhythm as you jump along.",
    sceneClassName: "sequence-scene-card",
    sceneHtml: buildSequenceSceneHtml([start, start + step, correct, correct + step], 2),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "next number"),
      })
    ),
    successMessage: `Yes! ${correct} comes next.`,
    failureMessage: `When you count by ${step}s, ${correct} comes next.`,
  };
}

function generateCountRound() {
  const profile = getCountProfile();
  const roll = Math.random();

  if (profile.allowTens && roll < 0.15) {
    return generateCountByTensRound();
  }

  if (profile.allowSequence && roll < 0.4) {
    return generateCountOnRound(profile);
  }

  if (Math.random() < 0.5) {
    return generateTapCountRound(profile);
  }

  return generateCountObjectsRound(profile);
}

function generateCompareRound() {
  const profile = getCompareProfile();
  const roll = Math.random();

  if (profile.allowEqual && roll < 0.2) {
    return generateSameAmountRound(profile);
  }

  if (profile.allowObjectCompare && roll < 0.58) {
    return generateCompareObjectsRound(profile);
  }

  return generateCompareNumeralsRound(profile);
}

function generatePairsRound() {
  const profile = getPairsProfile();
  const roll = Math.random();

  if (profile.allowMakeTen && roll < 0.28) {
    return generateMakeTenRound(profile);
  }

  if (profile.allowStories && roll < 0.62) {
    return generateStoryRound(profile);
  }

  return generateBondRound(profile);
}

function generateTeenRound() {
  const profile = getTeenProfile();
  const roll = Math.random();

  if (profile.allowOnesQuestion && roll < 0.3) {
    return generateTeenOnesRound(profile);
  }

  if (roll < 0.62) {
    return generateTeenCountRound(profile);
  }

  return generateTeenMatchRound(profile);
}

function getCountProfile() {
  const stats = state.modeStats.count;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.6) {
    return {
      minTarget: 1,
      maxTarget: 6,
      answerCount: 3,
      allowSequence: false,
      allowTens: false,
      sequenceMax: 10,
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      minTarget: 6,
      maxTarget: 20,
      answerCount: 4,
      allowSequence: true,
      allowTens: stats.wins >= 8,
      sequenceMax: 20,
    };
  }

  return {
    minTarget: 4,
    maxTarget: 10,
    answerCount: 4,
    allowSequence: true,
    allowTens: false,
    sequenceMax: 20,
  };
}

function getCompareProfile() {
  const stats = state.modeStats.compare;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.6) {
    return {
      numeralMax: 5,
      objectMax: 5,
      allowObjectCompare: true,
      allowEqual: false,
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      numeralMax: 20,
      objectMax: 10,
      allowObjectCompare: true,
      allowEqual: true,
    };
  }

  return {
    numeralMax: 10,
    objectMax: 8,
    allowObjectCompare: true,
    allowEqual: false,
  };
}

function getPairsProfile() {
  const stats = state.modeStats.pairs;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.58) {
    return {
      maxTarget: 5,
      answerCount: 3,
      allowMakeTen: false,
      allowStories: true,
      storyMax: 5,
      allowSubtraction: false,
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      maxTarget: 10,
      answerCount: 4,
      allowMakeTen: true,
      allowStories: true,
      storyMax: 10,
      allowSubtraction: true,
    };
  }

  return {
    maxTarget: 8,
    answerCount: 4,
    allowMakeTen: true,
    allowStories: true,
    storyMax: 8,
    allowSubtraction: true,
  };
}

function getTeenProfile() {
  const stats = state.modeStats.teen;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.6) {
    return {
      minTeen: 11,
      maxTeen: 14,
      answerCount: 3,
      allowOnesQuestion: false,
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      minTeen: 11,
      maxTeen: 19,
      answerCount: 4,
      allowOnesQuestion: true,
    };
  }

  return {
    minTeen: 11,
    maxTeen: 17,
    answerCount: 4,
    allowOnesQuestion: false,
  };
}

function getBigNumProfile() {
  const stats = state.modeStats.bignum;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.6) {
    return {
      maxNumber: 30,
      answerCount: 3,
      decadeFocus: false,
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      maxNumber: 100,
      answerCount: 4,
      decadeFocus: true,
    };
  }

  return {
    maxNumber: 60,
    answerCount: 4,
    decadeFocus: true,
  };
}

function generateBigNumRound() {
  const profile = getBigNumProfile();
  const roll = Math.random();

  if (roll < 0.4) {
    return generateChartHiddenRound(profile);
  }

  if (roll < 0.7) {
    return generateNextBigNumberRound(profile);
  }

  return generateMissingNumberRound(profile);
}

function generateChartHiddenRound(profile) {
  const target = randomInt(11, profile.maxNumber);
  const rowStart = Math.floor((target - 1) / 10) * 10 + 1;
  const chartStart = rowStart > 10 ? rowStart - 10 : rowStart;
  const choices = buildNearbyChoices(target, profile.answerCount, 100, { min: 1 });

  return {
    type: "scene-choice",
    skill: "number-sequence",
    kicker: "Find the hiding number.",
    title: "What number is hiding?",
    subtitle: "The chart counts by ones, row by row.",
    sceneClassName: "chart-scene-card",
    sceneHtml: buildChartSceneHtml(chartStart, target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, "hiding number"),
      })
    ),
    successMessage: `Yes! The hiding number is ${formatNumber(target)}.`,
    failureMessage: `The hiding number is ${formatNumber(target)}.`,
  };
}

function generateNextBigNumberRound(profile) {
  const crossDecade = profile.decadeFocus && Math.random() < 0.4;
  const start = crossDecade
    ? randomInt(2, Math.floor(profile.maxNumber / 10)) * 10 - 1
    : randomInt(10, profile.maxNumber - 1);
  const correct = start + 1;
  const choices = buildNearbyChoices(correct, profile.answerCount, profile.maxNumber + 2, { min: 1 });

  return {
    type: "choice",
    skill: "number-sequence",
    kicker: "Keep on counting!",
    title: `What number comes after ${formatNumber(start)}?`,
    subtitle: crossDecade
      ? "A new row of ten starts here."
      : "Count on by one.",
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "next number"),
      })
    ),
    successMessage: `Yes! ${formatNumber(correct)} comes after ${formatNumber(start)}.`,
    failureMessage: `After ${formatNumber(start)} comes ${formatNumber(correct)}.`,
  };
}

function generateMissingNumberRound(profile) {
  const start = randomInt(1, profile.maxNumber - 3);
  const missingIndex = randomInt(1, 2);
  const numbers = [start, start + 1, start + 2, start + 3];
  const correct = numbers[missingIndex];
  const choices = buildNearbyChoices(correct, profile.answerCount, profile.maxNumber + 3, { min: 1 });

  return {
    type: "scene-choice",
    skill: "number-sequence",
    kicker: "Fix the number pattern.",
    title: "Which number is missing?",
    subtitle: "Say the numbers in order to find the gap.",
    sceneClassName: "sequence-scene-card",
    sceneHtml: buildSequenceSceneHtml(numbers, missingIndex),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "missing number"),
      })
    ),
    successMessage: `Yes! ${formatNumber(correct)} fills the gap.`,
    failureMessage: `The missing number is ${formatNumber(correct)}.`,
  };
}

function generateWriteRound() {
  const digit = randomInt(0, 9);

  return {
    type: "trace",
    skill: "numeral-writing",
    kicker: modes.write.kicker,
    title: `Trace the number ${digit}!`,
    subtitle: "Color in the whole number with your finger.",
    digit,
    successMessage: `Yes! You wrote ${digit}!`,
  };
}

function generateCountObjectsRound(profile) {
  const item = pickRandom(countItems);
  const target = randomInt(profile.minTarget, profile.maxTarget);
  const layout = pickRandom(["line-layout", "array-layout", "scatter-layout"]);
  const choices = buildNearbyChoices(target, profile.answerCount, 20, { min: 0 });

  return {
    type: "scene-choice",
    skill: "cardinality",
    kicker: modes.count.kicker,
    title: `How many ${item.plural}?`,
    subtitle: getCountSubtitle(layout),
    sceneClassName: "count-scene-card",
    sceneHtml: buildCountSceneHtml(item.emoji, target, layout),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, pluralize(item, value)),
      })
    ),
    successMessage: `Yes! There are ${target} ${pluralize(item, target)}.`,
    failureMessage: `Count again. There are ${target} ${pluralize(item, target)}.`,
  };
}

function generateTapCountRound(profile) {
  const item = pickRandom(countItems);
  const target = randomInt(profile.minTarget, Math.min(profile.maxTarget, 14));

  return {
    type: "tap-count",
    skill: "one-to-one",
    kicker: "Touch and count!",
    title: `Tap and count the ${item.plural}!`,
    subtitle: "Touch every one exactly one time.",
    item,
    target,
    successMessage: `Yes! There are ${target} ${pluralize(item, target)}!`,
  };
}

function generateCountOnRound(profile) {
  const start = randomInt(1, profile.sequenceMax - 1);
  const correct = start + 1;
  const choices = buildNearbyChoices(correct, 3, profile.sequenceMax + 2, { min: 1 });

  return {
    type: "choice",
    skill: "count-on",
    kicker: "Count on by one.",
    title: `What number comes after ${formatNumber(start)}?`,
    subtitle: "Try not to restart at 1.",
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "next number"),
      })
    ),
    successMessage: `Yes! ${formatNumber(correct)} comes after ${formatNumber(start)}.`,
    failureMessage: `The next number after ${formatNumber(start)} is ${formatNumber(correct)}.`,
  };
}

function generateCountByTensRound() {
  const start = randomInt(1, 9) * 10;
  const correct = start + 10;
  const tensChoices = buildNearbyChoices(correct, 3, 100, {
    min: 10,
    offsets: [10, -10, 20, -20, 30, -30],
  });

  return {
    type: "choice",
    skill: "skip-count",
    kicker: "Count by tens.",
    title: `What comes after ${formatNumber(start)}?`,
    subtitle: "Ten more keeps the pattern going.",
    layoutClass: "answer-choice-grid",
    choices: tensChoices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "next ten"),
      })
    ),
    successMessage: `Yes! ${formatNumber(correct)} comes after ${formatNumber(start)}.`,
    failureMessage: `When you count by tens after ${formatNumber(start)}, the next number is ${formatNumber(correct)}.`,
  };
}

function generateCompareNumeralsRound(profile) {
  let first = randomInt(1, profile.numeralMax);
  let second = randomInt(1, profile.numeralMax);

  while (first === second) {
    second = randomInt(1, profile.numeralMax);
  }

  const greater = Math.max(first, second);
  const smaller = Math.min(first, second);

  return {
    type: "choice",
    skill: "compare-numerals",
    kicker: modes.compare.kicker,
    title: "Which number is greater?",
    subtitle: "The greater number means more.",
    layoutClass: "two-choice-grid",
    choices: shuffleArray([
      createChoice({
        correct: first > second,
        html: buildNumberChoiceHtml(first, "number"),
      }),
      createChoice({
        correct: second > first,
        html: buildNumberChoiceHtml(second, "number"),
      }),
    ]),
    successMessage: `Yes! ${formatNumber(greater)} is greater than ${formatNumber(smaller)}.`,
    failureMessage: `${formatNumber(greater)} is greater than ${formatNumber(smaller)}.`,
  };
}

function generateCompareObjectsRound(profile) {
  const item = pickRandom(countItems);
  let left = randomInt(1, profile.objectMax);
  let right = randomInt(1, profile.objectMax);

  while (left === right) {
    right = randomInt(1, profile.objectMax);
  }

  const larger = Math.max(left, right);

  return {
    type: "choice",
    skill: "compare-groups",
    kicker: "Which group has more?",
    title: `Tap the group with more ${item.plural}.`,
    subtitle: "You can match one object at a time in your head.",
    layoutClass: "two-choice-grid",
    choices: shuffleArray([
      createChoice({
        correct: left > right,
        className: "emoji-choice",
        html: buildEmojiChoiceHtml(item.emoji, left, item.plural),
      }),
      createChoice({
        correct: right > left,
        className: "emoji-choice",
        html: buildEmojiChoiceHtml(item.emoji, right, item.plural),
      }),
    ]),
    successMessage: `Yes! The group with ${larger} ${item.plural} has more.`,
    failureMessage: `Count again. The bigger group has ${larger} ${item.plural}.`,
  };
}

function generateSameAmountRound(profile) {
  const item = pickRandom(countItems);
  const left = randomInt(1, profile.objectMax);
  const isSame = Math.random() > 0.5;
  const right = isSame ? left : clamp(left + pickRandom([-2, -1, 1, 2]), 1, profile.objectMax);

  return {
    type: "scene-choice",
    skill: "compare-groups",
    kicker: "Equal means the same amount.",
    title: "Do both sides show the same number?",
    subtitle: "Count each side and compare.",
    sceneClassName: "compare-scene-card",
    sceneHtml: buildEqualSceneHtml(item.emoji, left, right),
    layoutClass: "binary-choice-grid",
    choices: [
      createChoice({
        correct: isSame,
        className: "compact-choice",
        html: buildWordChoiceHtml("Same", "equal groups"),
      }),
      createChoice({
        correct: !isSame,
        className: "compact-choice",
        html: buildWordChoiceHtml("Not Same", "different groups"),
      }),
    ],
    successMessage: isSame
      ? "Yes! Both sides show the same amount."
      : "Yes! The sides do not match.",
    failureMessage: isSame
      ? "These groups are equal."
      : "These groups are not equal.",
  };
}

function generateBondRound(profile) {
  const target = randomInt(3, profile.maxTarget);
  const choices = buildBondChoices(target, profile.answerCount);
  const correctPair = choices.find((choice) => choice.correct);

  return {
    type: "choice",
    skill: "number-bonds",
    kicker: modes.pairs.kicker,
    title: `Which pair makes ${formatNumber(target)}?`,
    subtitle: "Different parts can make one whole number.",
    layoutClass: "answer-choice-grid",
    choices: choices.map((choice) =>
      createChoice({
        correct: choice.correct,
        className: "equation-choice",
        html: buildEquationChoiceHtml(choice.first, choice.second),
      })
    ),
    successMessage: `Yes! ${correctPair.first} and ${correctPair.second} make ${formatNumber(target)}.`,
    failureMessage: `${correctPair.first} and ${correctPair.second} make ${formatNumber(target)}.`,
  };
}

function generateMakeTenRound(profile) {
  const first = randomInt(1, 9);
  const correct = 10 - first;
  const choices = buildNearbyChoices(correct, profile.answerCount, 10, { min: 0 });

  return {
    type: "scene-choice",
    skill: "make-ten",
    kicker: "Friends of 10.",
    title: `What makes 10 with ${formatNumber(first)}?`,
    subtitle: "Fill the whole ten frame.",
    sceneClassName: "ten-scene-card",
    sceneHtml: buildMakeTenSceneHtml(first),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "more"),
      })
    ),
    successMessage: `Yes! ${first} and ${correct} make 10.`,
    failureMessage: `${first} needs ${correct} more to make 10.`,
  };
}

function generateStoryRound(profile) {
  const item = pickRandom(countItems);
  const playerName = state.settings.playerName || defaultSettings.playerName;
  const useSubtraction = profile.allowSubtraction && Math.random() > 0.5;

  if (useSubtraction) {
    const total = randomInt(3, profile.storyMax);
    const takenAway = randomInt(1, total - 1);
    const correct = total - takenAway;
    const choices = buildNearbyChoices(correct, profile.answerCount, profile.storyMax, { min: 0 });

    return {
      type: "scene-choice",
      skill: "add-subtract",
      kicker: "Take away to subtract.",
      title: `${playerName} has ${total} ${pluralize(item, total)}. ${takenAway} go away. How many are left?`,
      subtitle: "Look at what stays.",
      sceneClassName: "story-scene-card",
      sceneHtml: buildStorySceneHtml(item.emoji, total, takenAway, "subtract"),
      layoutClass: "answer-choice-grid",
      choices: choices.map((value) =>
        createChoice({
          correct: value === correct,
          html: buildNumberChoiceHtml(value, pluralize(item, value)),
        })
      ),
      successMessage: `Yes! ${correct} ${pluralize(item, correct)} are left.`,
      failureMessage: `After ${takenAway} go away, ${correct} ${pluralize(item, correct)} are left.`,
    };
  }

  const first = randomInt(1, Math.max(2, profile.storyMax - 2));
  const second = randomInt(1, profile.storyMax - first);
  const correct = first + second;
  const choices = buildNearbyChoices(correct, profile.answerCount, profile.storyMax, { min: 1 });

  return {
    type: "scene-choice",
    skill: "add-subtract",
    kicker: "Put together to add.",
    title: `${playerName} has ${first} ${pluralize(item, first)} and gets ${second} more. How many now?`,
    subtitle: "Count both groups together.",
    sceneClassName: "story-scene-card",
    sceneHtml: buildStorySceneHtml(item.emoji, first, second, "add"),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, pluralize(item, value)),
      })
    ),
    successMessage: `Yes! ${first} and ${second} make ${correct}.`,
    failureMessage: `${first} and ${second} make ${correct}.`,
  };
}

function generateTeenMatchRound(profile) {
  const target = randomInt(profile.minTeen, profile.maxTeen);
  const correctOnes = target - 10;
  const onesChoices = buildNearbyChoices(correctOnes, profile.answerCount, 9, { min: 1 });

  return {
    type: "choice",
    skill: "teen-numbers",
    kicker: modes.teen.kicker,
    title: `How is ${formatNumber(target)} built?`,
    subtitle: "Teen numbers are 10 ones and some more ones.",
    layoutClass: "answer-choice-grid",
    choices: onesChoices.map((value) =>
      createChoice({
        correct: value === correctOnes,
        className: "equation-choice",
        html: buildEquationChoiceHtml(10, value),
      })
    ),
    successMessage: `Yes! ${target} is 10 and ${correctOnes} more.`,
    failureMessage: `${target} is 10 and ${correctOnes} more.`,
  };
}

function generateTeenCountRound(profile) {
  const target = randomInt(profile.minTeen, profile.maxTeen);
  const choices = buildNearbyChoices(target, profile.answerCount, 19, { min: 11 });

  return {
    type: "scene-choice",
    skill: "teen-numbers",
    kicker: modes.teen.kicker,
    title: "Which teen number do you see?",
    subtitle: "Look for 1 full ten and extra ones.",
    sceneClassName: "ten-scene-card",
    sceneHtml: buildTeenSceneHtml(target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === target,
        html: buildNumberChoiceHtml(value, "teen number"),
      })
    ),
    successMessage: `Yes! That picture shows ${target}.`,
    failureMessage: `That picture shows ${target}: 10 and ${target - 10} more.`,
  };
}

function generateTeenOnesRound(profile) {
  const target = randomInt(profile.minTeen, profile.maxTeen);
  const correct = target - 10;
  const choices = buildNearbyChoices(correct, profile.answerCount, 9, { min: 1 });

  return {
    type: "scene-choice",
    skill: "teen-numbers",
    kicker: "Count the extra ones.",
    title: `${target} is 10 and how many more ones?`,
    subtitle: "The teen number has one full ten first.",
    sceneClassName: "ten-scene-card",
    sceneHtml: buildTeenSceneHtml(target),
    layoutClass: "answer-choice-grid",
    choices: choices.map((value) =>
      createChoice({
        correct: value === correct,
        html: buildNumberChoiceHtml(value, "ones"),
      })
    ),
    successMessage: `Yes! ${target} is 10 and ${correct} ones.`,
    failureMessage: `${target} is 10 and ${correct} ones.`,
  };
}

function renderRound(round) {
  elements.promptKicker.textContent = round.kicker;
  elements.promptTitle.textContent = round.title;
  elements.promptSubtitle.textContent = round.subtitle;
  updateReadPromptButton();
  elements.choices.innerHTML = "";

  if (round.type === "tap-count") {
    renderTapCountRound(round);
    return;
  }

  if (round.type === "trace") {
    renderTraceRound(round);
    return;
  }

  if (round.type === "word-build") {
    renderWordBuildRound(round);
    return;
  }

  if (round.type === "choice") {
    elements.choices.className = `choices ${round.layoutClass || "answer-choice-grid"}`;

    round.choices.forEach((choice) => {
      elements.choices.appendChild(buildChoiceButton(choice, round));
    });

    return;
  }

  elements.choices.className = "choices scene-choice-layout";

  const scene = document.createElement("div");
  scene.className = ["scene-card", round.sceneClassName].filter(Boolean).join(" ");
  scene.innerHTML = round.sceneHtml;
  elements.choices.appendChild(scene);

  const answerGrid = document.createElement("div");
  answerGrid.className = round.layoutClass || "answer-choice-grid";

  round.choices.forEach((choice) => {
    answerGrid.appendChild(buildChoiceButton(choice, round));
  });

  elements.choices.appendChild(answerGrid);
}

function renderTapCountRound(round) {
  elements.choices.className = "choices scene-choice-layout";

  const scene = document.createElement("div");
  scene.className = "scene-card tap-count-card";

  const counter = document.createElement("div");
  counter.className = "tap-counter";
  counter.textContent = "0";

  const grid = document.createElement("div");
  grid.className = "tap-grid";

  let counted = 0;

  for (let index = 0; index < round.target; index += 1) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "tap-item";
    item.textContent = round.item.emoji;

    item.addEventListener("click", () => {
      if (!state.roundActive || item.classList.contains("counted")) {
        return;
      }

      counted += 1;
      item.classList.add("counted");

      const badge = document.createElement("span");
      badge.className = "tap-badge";
      badge.textContent = String(counted);
      item.appendChild(badge);

      playCountTone(counted);
      speakNumber(counted);

      counter.textContent = String(counted);
      counter.classList.remove("popping");
      void counter.offsetWidth;
      counter.classList.add("popping");

      if (counted === round.target) {
        counter.classList.add("complete");
        window.setTimeout(() => {
          if (state.roundActive) {
            handleCorrect(round.successMessage);
          }
        }, 650);
      }
    });

    grid.appendChild(item);
  }

  scene.appendChild(counter);
  scene.appendChild(grid);
  elements.choices.appendChild(scene);
}

function renderTraceRound(round) {
  elements.choices.className = "choices scene-choice-layout";

  const scene = document.createElement("div");
  scene.className = "scene-card trace-card";

  const canvas = document.createElement("canvas");
  canvas.className = "trace-canvas";

  const progressBar = document.createElement("div");
  progressBar.className = "trace-progress";
  const progressFill = document.createElement("div");
  progressFill.className = "trace-progress-fill";
  progressBar.appendChild(progressFill);

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "small-button trace-clear";
  clearButton.textContent = "Start Over";

  scene.appendChild(canvas);
  scene.appendChild(progressBar);
  scene.appendChild(clearButton);
  elements.choices.appendChild(scene);

  setupTracing(canvas, progressFill, clearButton, round);
}

function renderWordBuildRound(round) {
  elements.choices.className = "choices scene-choice-layout";

  const scene = document.createElement("div");
  scene.className = "scene-card word-build-card";
  scene.innerHTML = buildWordTrailSceneHtml(round.wordData, { showWord: true, showHint: true });

  const builtWord = document.createElement("div");
  builtWord.className = "word-build-answer";
  const letters = round.word.split("");
  const built = [];
  let mistakes = 0;

  const tiles = document.createElement("div");
  tiles.className = "letter-tile-grid";
  const tileButtons = shuffleArray(
    letters.map((letter, index) => ({ letter, index }))
  ).map(({ letter, index }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-tile";
    button.textContent = letter;
    button.dataset.letterIndex = String(index);
    return button;
  });

  const controls = document.createElement("div");
  controls.className = "word-build-controls";
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "small-button";
  backButton.textContent = "Back";
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "small-button";
  resetButton.textContent = "Start Over";
  controls.append(backButton, resetButton);

  function updateBuiltWord() {
    builtWord.innerHTML = letters
      .map((_, index) => `<span class="word-build-slot">${built[index]?.letter || ""}</span>`)
      .join("");
  }

  function syncTiles() {
    const usedIndices = new Set(built.map((item) => item.index));
    tileButtons.forEach((button) => {
      button.disabled = usedIndices.has(Number(button.dataset.letterIndex));
    });
  }

  function resetBuild(showMessage = false) {
    built.length = 0;
    updateBuiltWord();
    syncTiles();
    if (showMessage) {
      showFeedback("retry", "Almost. Put the letters back in trail order.");
    }
  }

  tileButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.roundActive || button.disabled) {
        return;
      }

      const item = {
        letter: button.textContent,
        index: Number(button.dataset.letterIndex),
      };
      built.push(item);
      updateBuiltWord();
      syncTiles();
      playSoundEffect("tap");

      if (built.length !== letters.length) {
        return;
      }

      if (built.map((item) => item.letter).join("") === round.word) {
        window.setTimeout(() => {
          if (state.roundActive) {
            handleCorrect(round.successMessage);
          }
        }, 320);
        return;
      }

      mistakes += 1;
      if (mistakes >= 2) {
        handleIncorrect(round.failureMessage);
        return;
      }

      window.setTimeout(() => resetBuild(true), 450);
    });
  });

  backButton.addEventListener("click", () => {
    if (!built.length || !state.roundActive) {
      return;
    }
    built.pop();
    updateBuiltWord();
    syncTiles();
  });

  resetButton.addEventListener("click", () => resetBuild());

  tileButtons.forEach((button) => tiles.appendChild(button));
  scene.append(builtWord, tiles, controls);
  elements.choices.appendChild(scene);
  updateBuiltWord();
}

function setupTracing(canvas, progressFill, clearButton, round) {
  const size = Math.max(220, Math.min(360, canvas.parentElement.clientWidth - 36));
  const dpr = window.devicePixelRatio || 1;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const GRID = 26;
  const cellSize = size / GRID;
  const digitCells = new Set();
  const coveredCells = new Set();
  let lastPoint = null;
  let done = false;

  drawGhostDigit();

  // Sample the ghost digit's pixels into a coarse grid so any font works.
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let cy = 0; cy < GRID; cy += 1) {
    for (let cx = 0; cx < GRID; cx += 1) {
      const px = Math.floor((cx + 0.5) * cellSize * dpr);
      const py = Math.floor((cy + 0.5) * cellSize * dpr);
      const alpha = imageData.data[(py * canvas.width + px) * 4 + 3];
      if (alpha > 20) {
        digitCells.add(cy * GRID + cx);
      }
    }
  }

  function drawGhostDigit() {
    ctx.clearRect(0, 0, size, size);
    ctx.font = `900 ${size * 0.92}px "Avenir Next", "Trebuchet MS", "Verdana", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(145, 85, 33, 0.18)";
    ctx.fillText(String(round.digit), size / 2, size * 0.54);
  }

  function markCovered(x, y) {
    const cx = Math.floor(x / cellSize);
    const cy = Math.floor(y / cellSize);

    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) {
          continue;
        }
        const key = ny * GRID + nx;
        if (digitCells.has(key)) {
          coveredCells.add(key);
        }
      }
    }
  }

  function updateProgress() {
    const ratio = digitCells.size ? coveredCells.size / digitCells.size : 0;
    progressFill.style.width = `${Math.min(100, ratio * 100)}%`;

    if (!done && ratio >= 0.6) {
      done = true;
      progressFill.classList.add("complete");
      playSoundEffect("success");
      window.setTimeout(() => {
        if (state.roundActive) {
          handleCorrect(round.successMessage);
        }
      }, 450);
    }
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function drawStroke(from, to) {
    ctx.strokeStyle = "#ff7a45";
    ctx.lineWidth = size * 0.085;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (!state.roundActive || done) {
      return;
    }
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers reject capture for synthetic or already-released pointers.
    }
    lastPoint = pointFromEvent(event);
    drawStroke(lastPoint, lastPoint);
    markCovered(lastPoint.x, lastPoint.y);
    updateProgress();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!lastPoint || !state.roundActive || done) {
      return;
    }
    const point = pointFromEvent(event);
    drawStroke(lastPoint, point);
    markCovered(point.x, point.y);
    lastPoint = point;
    updateProgress();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    canvas.addEventListener(eventName, () => {
      lastPoint = null;
    });
  });

  clearButton.addEventListener("click", () => {
    if (done) {
      return;
    }
    coveredCells.clear();
    lastPoint = null;
    drawGhostDigit();
    progressFill.style.width = "0%";
  });
}

function buildChoiceButton(choice, round) {
  const button = document.createElement("button");
  button.className = ["choice-button", choice.className].filter(Boolean).join(" ");
  button.type = "button";
  button.innerHTML = choice.html;
  button.addEventListener("click", () => {
    if (!state.roundActive) {
      return;
    }

    button.classList.remove("tapped");
    void button.offsetWidth;
    button.classList.add("tapped");
    setTimeout(() => button.classList.remove("tapped"), 300);

    playSoundEffect("tap");
    if (choice.correct) {
      button.classList.add("correct-flash");
      handleCorrect(round.successMessage);
      return;
    }

    button.classList.add("wrong-flash");
    shakeGameScreen();

    if (!state.retryUsed) {
      state.retryUsed = true;
      button.disabled = true;
      button.classList.add("used");
      playSoundEffect("retry");
      const line = applyName(pickRandom(retryLines));
      showFeedback("retry", line);
      speakCustom(line);
      setMascotState("encourage", 2200);
      return;
    }

    handleIncorrect(round.failureMessage);
  });

  return button;
}

function createChoice({ correct, html, className = "" }) {
  return { correct, html, className };
}

function handleCorrect(customMessage) {
  const usedRetry = state.retryUsed;
  recordModeResult(true, usedRetry);
  const passportReward = recordRoundLearningResult(state.currentRound, true, usedRetry);
  endRound();
  const previousPlanet = currentPlanetIndex();
  state.score += 1;
  state.streak += 1;
  state.stars += 1;
  persistProgress();
  updatePassportHomeButton();
  updateStats(true);
  updateStreakVisuals();
  updateJourney();

  if (currentPlanetIndex() > previousPlanet) {
    setMascotState("celebrate", 2800);
    showLaunchCelebration(currentPlanetIndex());
    return;
  }

  const passportDelay = showTrailReward(passportReward);

  const isMilestone = state.streak > 0 && state.streak % 5 === 0;

  if (isMilestone) {
    setMascotState("celebrate", 1800);
    playSoundEffect("milestone");
    launchConfetti(70);
    elements.statsPanel.classList.remove("milestone");
    void elements.statsPanel.offsetWidth;
    elements.statsPanel.classList.add("milestone");
    const msg = state.mode === "word"
      ? "Five trail stars! You are a word explorer!"
      : applyName(pickRandom(milestonePraise));
    showFeedback("success", msg);
    speakCustom(msg);
    queueNextRound(1800 + passportDelay);
  } else {
    setMascotState("happy", 1000);
    playSoundEffect(pickRandom(["success", "success2", "success3"]));
    launchConfetti(28);
    const message = applyName(customMessage || pickRandom(praiseLines));
    showFeedback("success", message);
    if (state.mode === "word") {
      speakCustom(message);
    } else {
      speakPraise();
    }
    queueNextRound(1000 + passportDelay);
  }
}

function showLaunchCelebration(planetIndex) {
  const planet = getPlanet(planetIndex);
  const sticker = awardSticker();

  applyPlanetTheme(planetIndex);
  updateJourney();
  elements.launchMessage.textContent = `Welcome to ${planet.name}!`;
  elements.launchPlanet.textContent = planet.emoji;
  elements.launchSticker.textContent = `You found a sticker: ${sticker.emoji} ${sticker.name}!`;
  elements.launchOverlay.classList.remove("hidden");
  playSoundEffect("milestone");
  launchConfetti(90);
  showFeedback("success", `🚀 Blast off to ${planet.name}!`);
  speakCustom(`Blast off! Welcome to ${planet.name}! You found a ${sticker.name} sticker!`);

  window.setTimeout(() => {
    elements.launchOverlay.classList.add("hidden");
  }, 2700);

  queueNextRound(2900);
}

function handleIncorrect(message) {
  recordModeResult(false);
  recordRoundLearningResult(state.currentRound, false);
  endRound();
  state.streak = 0;
  persistProgress();
  updateStats();
  updateStreakVisuals();
  setMascotState("encourage", 1400);
  playSoundEffect("fail");
  showFeedback("fail", message || "Try again!");
  queueNextRound(1200);
}

function endRound() {
  state.roundActive = false;
  clearTimer();
  stopSpeech();
  updateReadPromptButton();
}

function queueNextRound(delay) {
  clearQueuedRound();
  state.nextRoundTimeoutId = window.setTimeout(() => {
    state.nextRoundTimeoutId = null;
    nextRound();
  }, delay);
}

function clearQueuedRound() {
  if (state.nextRoundTimeoutId) {
    window.clearTimeout(state.nextRoundTimeoutId);
    state.nextRoundTimeoutId = null;
  }
}

function startTimer() {
  state.roundActive = true;
  updateReadPromptButton();

  if (!state.settings.timerEnabled) {
    updateTimerVisual();
    return;
  }

  const seconds = state.settings.roundSeconds;
  state.timerDeadline = Date.now() + seconds * 1000;
  updateTimerVisual(seconds);

  state.timerId = window.setInterval(() => {
    const remainingMs = Math.max(0, state.timerDeadline - Date.now());
    const remainingSeconds = remainingMs / 1000;
    updateTimerVisual(remainingSeconds);

    if (remainingMs <= 0) {
      handleIncorrect("Time's up. Try the next one!");
    }
  }, 100);
}

function updateTimerVisual(secondsLeft = state.settings.roundSeconds) {
  if (!state.settings.timerEnabled) {
    elements.timerText.textContent = "No timer";
    elements.timerText.classList.add("off");
    elements.timerBar.classList.add("hidden");
    elements.timerFill.style.width = "100%";
    elements.timerFill.style.background = "linear-gradient(90deg, #7ce0a3, #5dc6ff)";
    return;
  }

  const total = state.settings.roundSeconds;
  const ratio = Math.max(0, Math.min(1, secondsLeft / total));
  elements.timerText.textContent = `${Math.ceil(secondsLeft)}s`;
  elements.timerText.classList.remove("off");
  elements.timerBar.classList.remove("hidden");
  elements.timerFill.style.width = `${ratio * 100}%`;
  elements.timerFill.style.background =
    ratio < 0.35
      ? "linear-gradient(90deg, #ff8e66, #ff5b6e)"
      : "linear-gradient(90deg, #7ce0a3, #5dc6ff)";
}

function clearTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateReadPromptButton() {
  const supported = canSpeak();
  elements.readPrompt.classList.toggle("hidden", !supported);
  elements.readPrompt.disabled = !supported || !state.currentRound || !state.roundActive;
}

function showScreen(name) {
  Object.entries(elements.screens).forEach(([screenName, element]) => {
    element.classList.toggle("active", screenName === name);
  });
}

function goHome() {
  clearQueuedRound();
  clearTrailReward();
  endRound();
  stopSpeech();
  stopBackgroundMusic();
  state.mode = null;
  state.currentRound = null;
  updateReadPromptButton();
  clearFeedback();
  refreshHeader();
  showScreen("home");
}

function openSettings() {
  clearQueuedRound();
  clearTrailReward();
  endRound();
  stopSpeech();
  stopBackgroundMusic();
  populateSettingsForm();
  renderSkillReport();
  showScreen("settings");
}

function renderSkillReport() {
  const grid = elements.skillReportGrid;
  grid.innerHTML = "";

  Object.entries(modes)
    .filter(([modeKey]) => modeKey !== "word" && modeKey !== "compass")
    .forEach(([modeKey, mode]) => {
      const stats = state.modeStats[modeKey];
      const attempts = stats.wins + stats.misses;
      const accuracy = attempts ? stats.wins / attempts : 0;

      let status = "Just starting";
      let statusClass = "starting";
      if (attempts >= 5) {
        if (accuracy >= 0.85) {
          status = "Strong";
          statusClass = "strong";
        } else if (accuracy >= 0.6) {
          status = "Practicing";
          statusClass = "practicing";
        } else {
          status = "Needs help";
          statusClass = "helping";
        }
      }

      const tierText = modeKey === "write" ? "" : ` · difficulty ${getModeTier(modeKey)} of 3`;
      const detail = attempts
        ? `${stats.wins} correct · ${stats.misses} missed${tierText}`
        : "No rounds played yet";

      const row = document.createElement("div");
      row.className = "skill-row";
      row.innerHTML = `
        <div class="skill-row-head">
          <span class="skill-name">${mode.label}</span>
          <span class="skill-status ${statusClass}">${status}</span>
        </div>
        <div class="skill-bar">
          <div class="skill-bar-fill ${statusClass}" style="width: ${Math.round(accuracy * 100)}%"></div>
        </div>
        <span class="skill-detail">${detail}</span>
      `;
      grid.appendChild(row);
    });

  renderMathSkillReport();
  renderWordTrailReport();
}

function renderMathSkillReport() {
  const grid = elements.mathSkillReportGrid;
  grid.innerHTML = "";

  Object.entries(MATH_SKILLS).forEach(([skillId, skill]) => {
    const progress = getMathSkillProgress(skillId);
    const attempts = progress.wins + progress.misses;
    const accuracy = attempts ? progress.wins / attempts : 0;
    const status = getMathSkillStatus(progress);
    const row = document.createElement("div");
    row.className = "math-skill-chip";
    row.innerHTML = `
      <span class="math-skill-chip-name">${skill.shortLabel}</span>
      <span class="math-skill-chip-status ${status.className}">${status.label}</span>
      <span class="math-skill-chip-detail">${attempts ? `${progress.wins}/${attempts}` : "not tried"}</span>
    `;
    row.style.setProperty("--skill-progress", `${Math.round(accuracy * 100)}%`);
    grid.appendChild(row);
  });
}

function getMathSkillStatus(progress) {
  const attempts = progress.wins + progress.misses;
  const accuracy = attempts ? progress.wins / attempts : 0;

  if (progress.cleanWins >= 4 && accuracy >= 0.8) {
    return { label: "Secure", className: "secure" };
  }
  if (progress.wins >= 2 && accuracy >= 0.6) {
    return { label: "Growing", className: "growing" };
  }
  if (attempts >= 3 && accuracy < 0.6) {
    return { label: "Practice", className: "practice" };
  }
  return { label: "New", className: "new" };
}

function renderWordTrailReport() {
  const grid = elements.wordReportGrid;
  const unlocked = new Set(getUnlockedWordTrailWords().map((word) => word.word));
  grid.innerHTML = "";

  WORD_TRAIL_WORDS.forEach((word) => {
    const progress = getWordProgress(word.word);
    const status = getWordTrailStatus(progress);
    const card = document.createElement("div");
    card.className = ["word-report-card", status.className, unlocked.has(word.word) ? "unlocked" : "locked"]
      .filter(Boolean)
      .join(" ");
    card.innerHTML = `
      <span class="word-report-emoji">${unlocked.has(word.word) ? word.emoji : "🔒"}</span>
      <strong>${word.word}</strong>
      <span>${status.label}</span>
    `;
    grid.appendChild(card);
  });

  const unlockedCamps = new Set(getUnlockedWordTrailWords().map((word) => word.camp)).size;
  elements.wordTrailReportNote.textContent = `Camp ${unlockedCamps} is open. Words move from meet → find → build → read.`;
}

function getWordTrailStatus(progress) {
  if (progress.reads >= 2) {
    return { label: "Reading", className: "reading" };
  }
  if (progress.reads >= 1) {
    return { label: "Read once", className: "read-once" };
  }
  if (progress.builds >= 1) {
    return { label: "Building", className: "building" };
  }
  if (progress.finds >= 1) {
    return { label: "Finding", className: "finding" };
  }
  if (progress.meets >= 1) {
    return { label: "Met", className: "met" };
  }
  return { label: "Next", className: "next" };
}

function getModeTier(modeKey) {
  // Mirrors the tier rules in the get*Profile functions.
  const stats = state.modeStats[modeKey];
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (stats.wins < 4 || accuracy < 0.6) {
    return 1;
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return 3;
  }

  return 2;
}

function closeSettings() {
  stopSpeech();
  state.mode = null;
  state.currentRound = null;
  updateReadPromptButton();
  refreshHeader();
  showScreen("home");
}

function saveSettings() {
  const nextName = elements.nameInput.value.trim() || defaultSettings.playerName;
  const nextRoundSeconds =
    Number(elements.roundSeconds.value) || defaultSettings.roundSeconds;

  state.settings = {
    playerName: nextName,
    roundSeconds: nextRoundSeconds,
    timerEnabled: elements.timerToggle.checked,
    voicePraise: elements.voiceToggle.checked,
    voicePace: normalizeVoicePace(elements.voicePace.value),
    soundEffects: elements.soundToggle.checked,
    mascot: state.settings.mascot,
  };

  persistSettings();
  updateTimerVisual();
  refreshHeader();
  closeSettings();
}

function populateSettingsForm() {
  elements.nameInput.value = state.settings.playerName;
  elements.roundSeconds.value = String(state.settings.roundSeconds);
  elements.timerToggle.checked = Boolean(state.settings.timerEnabled);
  elements.voiceToggle.checked = Boolean(state.settings.voicePraise);
  elements.voicePace.value = normalizeVoicePace(state.settings.voicePace);
  elements.soundToggle.checked = Boolean(state.settings.soundEffects);
}

function syncTimerSettingsState() {
  elements.roundSeconds.disabled = !elements.timerToggle.checked;
}

function refreshHeader() {
  const name = state.settings.playerName || defaultSettings.playerName;
  document.title = `${name} Number Quest`;
  elements.appTitle.textContent = `${name} Number Quest`;
  elements.heroMessage.textContent = `${name} can practice number skills, follow the Word Trail, and help the rocket blast off.`;
}

function updateStats(animate = false) {
  elements.score.textContent = String(state.score);
  elements.streak.textContent = String(state.streak);
  elements.stars.textContent = String(state.stars);
  if (animate) {
    [elements.score, elements.streak, elements.stars].forEach((el) => {
      el.classList.remove("popping");
      void el.offsetWidth;
      el.classList.add("popping");
    });
  }
}

function showFeedback(type, message) {
  elements.feedback.className = `feedback ${type}`;
  elements.feedback.textContent = message;
  void elements.feedback.offsetWidth;
  elements.feedback.classList.add("animate");
}

function clearFeedback() {
  elements.feedback.className = "feedback";
  elements.feedback.textContent = "";
}

function resetProgress() {
  clearQueuedRound();
  endRound();
  stopSpeech();
  state.score = 0;
  state.streak = 0;
  state.stars = 0;
  state.mode = null;
  state.currentRound = null;
  state.modeStats = createModeStats();
  state.wordProgress = createWordProgress();
  state.mathSkills = createMathSkillProgress();
  state.compassIndex = 0;
  state.passportPatchesSeen = {};
  state.passportCampId = null;
  state.passportTargetWord = null;
  state.stickers = {};
  updateReadPromptButton();
  persistProgress();
  updateStats();
  updateStreakVisuals();
  applyPlanetTheme(currentPlanetIndex());
  updateJourney();
  updateStickerCount();
  updatePassportHomeButton();
  clearFeedback();
  closeSettings();
}

function recordModeResult(didWin, usedRetry = false) {
  if (!state.mode) {
    return;
  }

  const stats = state.modeStats[state.mode];
  if (!stats) {
    return;
  }

  if (didWin) {
    stats.wins += 1;
    // A win that needed a retry should not push difficulty up.
    stats.streak = usedRetry ? 0 : stats.streak + 1;
    return;
  }

  stats.misses += 1;
  stats.streak = 0;
}

function recordRoundLearningResult(round, didWin, usedRetry = false) {
  if (!round) {
    return null;
  }

  let passportReward = null;

  if (round.skill && MATH_SKILLS[round.skill]) {
    const progress = getMathSkillProgress(round.skill);
    if (didWin) {
      progress.wins += 1;
      progress.cleanWins += usedRetry ? 0 : 1;
      progress.streak = usedRetry ? 0 : progress.streak + 1;
    } else {
      progress.misses += 1;
      progress.streak = 0;
    }
  }

  if (round.word && round.wordStep) {
    const progress = getWordProgress(round.word);
    if (didWin) {
      const wasNewStamp = (Number(progress[round.wordStep]) || 0) < 1;
      progress.wins += 1;
      progress[round.wordStep] = (Number(progress[round.wordStep]) || 0) + 1;

      const wordData = round.wordData || WORD_TRAIL_WORDS.find((word) => word.word === round.word);
      const camp = getTrailPassportCamp(wordData?.camp);
      const justEarnedPatch = camp
        && getPassportCampState(camp).isComplete
        && !state.passportPatchesSeen[camp.id];

      if (justEarnedPatch) {
        state.passportPatchesSeen[camp.id] = true;
      }

      passportReward = {
        word: round.word,
        wordData,
        stamp: PASSPORT_STAMPS.find((stamp) => stamp.key === round.wordStep),
        camp,
        isNewStamp: wasNewStamp,
        earnedCampPatch: Boolean(justEarnedPatch),
      };
    } else {
      progress.misses += 1;
    }
  }

  return passportReward;
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultSettings };
    }

    const savedSettings = { ...defaultSettings, ...JSON.parse(raw) };
    const allowedRoundSeconds = [15, 20, 30, 45];
    const nextRoundSeconds = allowedRoundSeconds.includes(Number(savedSettings.roundSeconds))
      ? Number(savedSettings.roundSeconds)
      : defaultSettings.roundSeconds;

    return {
      playerName: String(savedSettings.playerName || defaultSettings.playerName),
      roundSeconds: nextRoundSeconds,
      timerEnabled: Boolean(savedSettings.timerEnabled),
      voicePraise: Boolean(savedSettings.voicePraise),
      voicePace: normalizeVoicePace(savedSettings.voicePace),
      soundEffects: Boolean(savedSettings.soundEffects),
      mascot: MASCOT_ORDER.includes(savedSettings.mascot)
        ? savedSettings.mascot
        : defaultSettings.mascot,
    };
  } catch {
    return { ...defaultSettings };
  }
}

function persistSettings() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
  } catch {
    // Ignore storage failures in private browsing or restrictive webviews.
  }
}

function loadProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const fallback = {
      score: 0,
      streak: 0,
      stars: 0,
      stickers: {},
      modeStats: createModeStats(),
      wordProgress: createWordProgress(),
      mathSkills: createMathSkillProgress(),
      compassIndex: 0,
      passportPatchesSeen: {},
    };

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const nextModeStats = createModeStats();

    Object.keys(nextModeStats).forEach((modeKey) => {
      const savedModeStats = parsed.modeStats?.[modeKey];
      if (!savedModeStats) {
        return;
      }

      nextModeStats[modeKey] = {
        wins: Number(savedModeStats.wins) || 0,
        misses: Number(savedModeStats.misses) || 0,
        streak: Number(savedModeStats.streak) || 0,
      };
    });

    const stickers = {};
    if (parsed.stickers && typeof parsed.stickers === "object") {
      STICKERS.forEach((sticker) => {
        const count = Math.floor(Number(parsed.stickers[sticker.id])) || 0;
        if (count > 0) {
          stickers[sticker.id] = count;
        }
      });
    }

    const wordProgress = createWordProgress();
    WORD_TRAIL_WORDS.forEach((word) => {
      const saved = parsed.wordProgress?.[word.word];
      if (!saved) {
        return;
      }
      wordProgress[word.word] = {
        meets: Math.max(0, Number(saved.meets) || 0),
        finds: Math.max(0, Number(saved.finds) || 0),
        builds: Math.max(0, Number(saved.builds) || 0),
        reads: Math.max(0, Number(saved.reads) || 0),
        wins: Math.max(0, Number(saved.wins) || 0),
        misses: Math.max(0, Number(saved.misses) || 0),
      };
    });

    const mathSkills = createMathSkillProgress();
    Object.keys(mathSkills).forEach((skill) => {
      const saved = parsed.mathSkills?.[skill];
      if (!saved) {
        return;
      }
      mathSkills[skill] = {
        wins: Math.max(0, Number(saved.wins) || 0),
        misses: Math.max(0, Number(saved.misses) || 0),
        cleanWins: Math.max(0, Number(saved.cleanWins) || 0),
        streak: Math.max(0, Number(saved.streak) || 0),
      };
    });

    const passportPatchesSeen = {};
    if (parsed.passportPatchesSeen && typeof parsed.passportPatchesSeen === "object") {
      TRAIL_PASSPORT_CAMPS.forEach((camp) => {
        if (parsed.passportPatchesSeen[camp.id]) {
          passportPatchesSeen[camp.id] = true;
        }
      });
    }

    return {
      score: Number(parsed.score) || 0,
      streak: Number(parsed.streak) || 0,
      stars: Number(parsed.stars) || 0,
      stickers,
      modeStats: nextModeStats,
      wordProgress,
      mathSkills,
      compassIndex: Math.max(0, Math.floor(Number(parsed.compassIndex) || 0)),
      passportPatchesSeen,
    };
  } catch {
    return {
      score: 0,
      streak: 0,
      stars: 0,
      stickers: {},
      modeStats: createModeStats(),
      wordProgress: createWordProgress(),
      mathSkills: createMathSkillProgress(),
      compassIndex: 0,
      passportPatchesSeen: {},
    };
  }
}

function persistProgress() {
  try {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        score: state.score,
        streak: state.streak,
        stars: state.stars,
        stickers: state.stickers,
        modeStats: state.modeStats,
        wordProgress: state.wordProgress,
        mathSkills: state.mathSkills,
        compassIndex: state.compassIndex,
        passportPatchesSeen: state.passportPatchesSeen,
      })
    );
  } catch {
    // Ignore storage failures in private browsing or restrictive webviews.
  }
}

function speakPraise() {
  if (!state.settings.voicePraise || !canSpeak()) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(applyName(pickRandom(praiseLines)));
  speakUtterance(utterance, "praise");
}

function speakNumber(value) {
  if (!state.settings.voicePraise || !canSpeak()) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(String(value));
  speakUtterance(utterance, "count");
}

function applyName(text) {
  const name = state.settings.playerName || defaultSettings.playerName;
  return text.replaceAll("{name}", name);
}

function readCurrentPrompt() {
  if (!state.currentRound || !canSpeak()) {
    return;
  }

  const text = state.currentRound.spokenPrompt || state.currentRound.title;
  const utterance = new SpeechSynthesisUtterance(text);
  speakUtterance(utterance, "prompt");
}

function canSpeak() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function syncAvailableVoices() {
  if (!canSpeak()) {
    state.availableVoices = [];
    return;
  }

  state.availableVoices = window.speechSynthesis
    .getVoices()
    .slice()
    .sort(compareSpeechVoices);
}

function compareSpeechVoices(first, second) {
  const scoreDelta = scoreSpeechVoice(second) - scoreSpeechVoice(first);
  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  return (first.name || "").localeCompare(second.name || "");
}

function scoreSpeechVoice(voice) {
  const name = (voice.name || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  let score = 0;

  if (lang.startsWith("en-us")) {
    score += 30;
  } else if (lang.startsWith("en")) {
    score += 22;
  }

  if (voice.localService) {
    score += 8;
  }

  if (voice.default) {
    score += 6;
  }

  [
    ["premium", 48],
    ["enhanced", 42],
    ["natural", 36],
    ["samantha", 40],
    ["ava", 32],
    ["allison", 32],
    ["daniel", 28],
    ["moira", 26],
    ["karen", 24],
    ["siri", 22],
    ["google us english", 18],
    ["google uk english female", 16],
    ["microsoft aria", 16],
    ["microsoft guy", 14],
    ["victoria", 12],
    ["alex", 10],
  ].forEach(([token, bonus]) => {
    if (name.includes(token)) {
      score += bonus;
    }
  });

  return score;
}

function getBestAvailableVoice() {
  if (!state.availableVoices.length) {
    syncAvailableVoices();
  }

  return state.availableVoices[0] || null;
}

function speakUtterance(utterance, kind = "prompt") {
  if (!canSpeak()) {
    return;
  }

  const voice = getBestAvailableVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }

  const pace = VOICE_PACE_PROFILES[normalizeVoicePace(state.settings.voicePace)];
  const isWordPrompt = kind === "prompt" && Boolean(state.currentRound?.word);
  utterance.rate = isWordPrompt ? pace.word : pace[kind] || pace.prompt;
  utterance.pitch = kind === "praise" ? 1.08 : 1;

  stopSpeech();
  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if (!canSpeak()) {
    return;
  }

  window.speechSynthesis.cancel();
}

function normalizeVoicePace(value) {
  return Object.prototype.hasOwnProperty.call(VOICE_PACE_PROFILES, value)
    ? value
    : defaultSettings.voicePace;
}

function playSoundEffect(effectName) {
  if (!state.settings.soundEffects) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  const patterns = {
    tap: [
      { delay: 0, frequency: 800, endFrequency: 900, duration: 0.05, type: "sine", volume: 0.045 },
    ],
    start: [
      { delay: 0,    frequency: 330,  endFrequency: 660,  duration: 0.12, type: "triangle", volume: 0.10 },
      { delay: 0.10, frequency: 440,  endFrequency: 880,  duration: 0.12, type: "triangle", volume: 0.11 },
      { delay: 0.20, frequency: 523,  endFrequency: 1046, duration: 0.18, type: "sine",     volume: 0.12 },
      { delay: 0.20, frequency: 659,  endFrequency: 1319, duration: 0.18, type: "triangle", volume: 0.07 },
    ],
    success: [
      { delay: 0,    frequency: 392,  endFrequency: 392,  duration: 0.10, type: "sine",     volume: 0.11 },
      { delay: 0.10, frequency: 523,  endFrequency: 523,  duration: 0.10, type: "sine",     volume: 0.11 },
      { delay: 0.20, frequency: 659,  endFrequency: 659,  duration: 0.10, type: "sine",     volume: 0.12 },
      { delay: 0.30, frequency: 784,  endFrequency: 784,  duration: 0.24, type: "sine",     volume: 0.13 },
      { delay: 0.30, frequency: 988,  endFrequency: 988,  duration: 0.24, type: "triangle", volume: 0.07 },
      { delay: 0.30, frequency: 523,  endFrequency: 523,  duration: 0.24, type: "sine",     volume: 0.07 },
    ],
    success2: [
      { delay: 0,    frequency: 440,  endFrequency: 440,  duration: 0.09, type: "sine",     volume: 0.10 },
      { delay: 0.09, frequency: 554,  endFrequency: 554,  duration: 0.09, type: "sine",     volume: 0.11 },
      { delay: 0.18, frequency: 659,  endFrequency: 659,  duration: 0.10, type: "sine",     volume: 0.11 },
      { delay: 0.28, frequency: 880,  endFrequency: 880,  duration: 0.26, type: "sine",     volume: 0.13 },
      { delay: 0.28, frequency: 554,  endFrequency: 554,  duration: 0.26, type: "triangle", volume: 0.07 },
    ],
    success3: [
      { delay: 0,    frequency: 330,  endFrequency: 330,  duration: 0.10, type: "sine",     volume: 0.10 },
      { delay: 0.08, frequency: 440,  endFrequency: 440,  duration: 0.10, type: "sine",     volume: 0.10 },
      { delay: 0.16, frequency: 554,  endFrequency: 554,  duration: 0.10, type: "sine",     volume: 0.11 },
      { delay: 0.24, frequency: 659,  endFrequency: 659,  duration: 0.10, type: "sine",     volume: 0.12 },
      { delay: 0.34, frequency: 880,  endFrequency: 880,  duration: 0.26, type: "sine",     volume: 0.14 },
      { delay: 0.34, frequency: 659,  endFrequency: 659,  duration: 0.26, type: "triangle", volume: 0.07 },
    ],
    fail: [
      { delay: 0,    frequency: 350,  endFrequency: 260,  duration: 0.14, type: "sine",     volume: 0.07 },
      { delay: 0.15, frequency: 260,  endFrequency: 200,  duration: 0.18, type: "sine",     volume: 0.06 },
    ],
    retry: [
      { delay: 0,    frequency: 330,  endFrequency: 330,  duration: 0.12, type: "sine",     volume: 0.07 },
      { delay: 0.13, frequency: 415,  endFrequency: 415,  duration: 0.16, type: "sine",     volume: 0.08 },
    ],
    milestone: [
      { delay: 0,    frequency: 392,  endFrequency: 392,  duration: 0.10, type: "sine",     volume: 0.12 },
      { delay: 0.10, frequency: 523,  endFrequency: 523,  duration: 0.10, type: "sine",     volume: 0.12 },
      { delay: 0.20, frequency: 659,  endFrequency: 659,  duration: 0.10, type: "sine",     volume: 0.12 },
      { delay: 0.30, frequency: 784,  endFrequency: 784,  duration: 0.10, type: "sine",     volume: 0.13 },
      { delay: 0.40, frequency: 988,  endFrequency: 988,  duration: 0.28, type: "sine",     volume: 0.14 },
      { delay: 0.40, frequency: 523,  endFrequency: 523,  duration: 0.28, type: "sine",     volume: 0.08 },
      { delay: 0.40, frequency: 1319, endFrequency: 1319, duration: 0.28, type: "triangle", volume: 0.06 },
      { delay: 0.70, frequency: 784,  endFrequency: 784,  duration: 0.38, type: "sine",     volume: 0.12 },
      { delay: 0.70, frequency: 988,  endFrequency: 988,  duration: 0.38, type: "sine",     volume: 0.10 },
      { delay: 0.70, frequency: 1319, endFrequency: 1319, duration: 0.38, type: "triangle", volume: 0.07 },
    ],
  };

  const pattern = patterns[effectName];
  if (!pattern) {
    return;
  }

  const startAt = audioContext.currentTime + 0.01;
  pattern.forEach((note) => {
    scheduleTone(audioContext, {
      ...note,
      startAt: startAt + note.delay,
    });
  });
}

function playCountTone(step) {
  if (!state.settings.soundEffects) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  // Each tap climbs one semitone so counting sounds like a rising scale.
  const frequency = 440 * Math.pow(2, (step - 1) / 12);

  scheduleTone(audioContext, {
    frequency,
    endFrequency: frequency * 1.18,
    duration: 0.12,
    type: "triangle",
    volume: 0.1,
    startAt: audioContext.currentTime + 0.01,
  });
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextClass();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume().catch(() => {
      // Ignore audio resume failures when autoplay restrictions apply.
    });
  }

  return state.audioContext;
}

function scheduleTone(audioContext, note) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = note.type;
  oscillator.frequency.setValueAtTime(note.frequency, note.startAt);
  oscillator.frequency.exponentialRampToValueAtTime(
    note.endFrequency,
    note.startAt + note.duration
  );

  gain.gain.setValueAtTime(0.0001, note.startAt);
  gain.gain.exponentialRampToValueAtTime(note.volume, note.startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, note.startAt + note.duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(note.startAt);
  oscillator.stop(note.startAt + note.duration + 0.03);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignore registration failures and keep the app usable online.
    });
  });
}

function launchConfetti(count = 30) {
  const colors = ["#ff7a45", "#4db6ff", "#ffd84d", "#7ce0a3", "#ff5b6e", "#c084fc", "#fb923c", "#34d399"];
  const shapes = ["", "round"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = `confetti-piece ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${10 + Math.random() * 80}vw`;
    piece.style.top = `${15 + Math.random() * 55}vh`;
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty("--dy", `${-70 - Math.random() * 230}px`);
    piece.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.22}s`;
    piece.style.width = `${6 + Math.random() * 10}px`;
    piece.style.height = `${6 + Math.random() * 10}px`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1300);
  }
}

function startBackgroundMusic() {
  if (!state.settings.soundEffects) {
    return;
  }

  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  if (music.playing) {
    return;
  }

  music.playing = true;
  music.nextNoteTime = audioContext.currentTime + 0.9;
  music.noteIndex = 0;
  scheduleMusicNotes();
  music.schedulerInterval = setInterval(scheduleMusicNotes, 150);
}

function stopBackgroundMusic() {
  music.playing = false;

  if (music.schedulerInterval) {
    clearInterval(music.schedulerInterval);
    music.schedulerInterval = null;
  }
}

function scheduleMusicNotes() {
  const audioContext = state.audioContext;

  if (!audioContext || !music.playing) {
    return;
  }

  const lookAhead = 0.35;
  const VOL = 0.011;

  while (music.nextNoteTime < audioContext.currentTime + lookAhead) {
    const note = MUSIC_NOTES[music.noteIndex % MUSIC_NOTES.length];

    if (note.freq > 0) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, music.nextNoteTime);
      gain.gain.setValueAtTime(0.0001, music.nextNoteTime);
      gain.gain.exponentialRampToValueAtTime(VOL, music.nextNoteTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, music.nextNoteTime + note.dur - 0.025);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(music.nextNoteTime);
      osc.stop(music.nextNoteTime + note.dur);
    }

    music.nextNoteTime += note.dur;
    music.noteIndex += 1;
  }
}

function speakCustom(text) {
  if (!state.settings.voicePraise || !canSpeak()) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  speakUtterance(utterance, "praise");
}

function autoReadPrompt() {
  if (!state.settings.voicePraise || !canSpeak() || !state.currentRound) {
    return;
  }

  setTimeout(() => {
    if (!state.currentRound || !state.roundActive) {
      return;
    }

    const text = state.currentRound.spokenPrompt || state.currentRound.title;
    const utterance = new SpeechSynthesisUtterance(text);
    speakUtterance(utterance, "prompt");
  }, 350);
}

function createBackgroundParticles() {
  const colors = [
    "rgba(255,122,69,0.10)", "rgba(77,182,255,0.10)", "rgba(255,216,77,0.13)",
    "rgba(124,224,163,0.10)", "rgba(255,91,110,0.08)", "rgba(192,132,252,0.08)",
  ];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    const isStar = Math.random() > 0.6;
    particle.className = `bg-particle${isStar ? " star" : ""}`;
    const size = 8 + Math.random() * 36;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${14 + Math.random() * 22}s`;
    particle.style.animationDelay = `${-Math.random() * 25}s`;
    document.body.appendChild(particle);
  }
}

function animateSceneItems() {
  const items = elements.choices.querySelectorAll(
    ".scene-emoji-item, .mini-emoji-item, .emoji-choice-item, .story-item, .ten-cell, .ones-chip, .tap-item"
  );

  items.forEach((item, i) => {
    item.classList.add("pop-item");
    item.style.animationDelay = `${i * 0.04}s`;
  });
}

function shakeGameScreen() {
  const screen = elements.screens.game;
  screen.classList.remove("game-shake");
  void screen.offsetWidth;
  screen.classList.add("game-shake");
  setTimeout(() => screen.classList.remove("game-shake"), 500);
}

function buildMascotSvg(key) {
  const face = `
    <g class="m-eyes">
      <circle cx="45" cy="58" r="6.5" fill="#2b2018"/>
      <circle cx="75" cy="58" r="6.5" fill="#2b2018"/>
      <circle cx="47" cy="56" r="2.2" fill="#fff"/>
      <circle cx="77" cy="56" r="2.2" fill="#fff"/>
    </g>
    <g class="m-star-eyes">
      <text x="45" y="65" text-anchor="middle" font-size="19">⭐</text>
      <text x="75" y="65" text-anchor="middle" font-size="19">⭐</text>
    </g>
    <path class="m-mouth-smile" d="M48 78 Q60 88 72 78" fill="none" stroke="#2b2018" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse class="m-mouth-open" cx="60" cy="83" rx="10" ry="8" fill="#7a3b2e"/>
    <circle class="m-mouth-o" cx="60" cy="83" r="5.5" fill="#7a3b2e"/>
  `;

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${MASCOTS[key].body}${face}</svg>`;
}

function renderMascot() {
  const key = state.settings.mascot;
  elements.mascot.innerHTML = buildMascotSvg(key);
  elements.mascot.setAttribute("aria-label", `Your buddy ${MASCOTS[key].name}. Tap to change.`);
}

function cycleMascot() {
  const currentIndex = MASCOT_ORDER.indexOf(state.settings.mascot);
  const nextKey = MASCOT_ORDER[(currentIndex + 1) % MASCOT_ORDER.length];

  state.settings.mascot = nextKey;
  persistSettings();
  renderMascot();
  playSoundEffect("tap");
  setMascotState("happy", 1100);
  speakCustom(`Hi! I'm ${MASCOTS[nextKey].name}!`);
}

function setMascotState(stateName, duration = 0) {
  if (state.mascotTimeoutId) {
    window.clearTimeout(state.mascotTimeoutId);
    state.mascotTimeoutId = null;
  }

  elements.mascot.dataset.state = stateName;

  if (duration > 0) {
    state.mascotTimeoutId = window.setTimeout(() => {
      state.mascotTimeoutId = null;
      elements.mascot.dataset.state = "idle";
    }, duration);
  }
}

function awardSticker() {
  const unowned = STICKERS.filter((sticker) => !state.stickers[sticker.id]);
  const pool = unowned.length ? unowned : STICKERS;
  const sticker = pickRandom(pool);

  state.stickers[sticker.id] = (state.stickers[sticker.id] || 0) + 1;
  persistProgress();
  updateStickerCount();

  return sticker;
}

function backfillStickers() {
  // Planets visited before the sticker book existed still earn stickers,
  // capped so there is plenty left to collect.
  const owned = Object.values(state.stickers).reduce((sum, count) => sum + count, 0);
  const earned = Math.min(currentPlanetIndex(), 12);

  for (let index = owned; index < earned; index += 1) {
    awardSticker();
  }
}

function updateStickerCount() {
  const ownedKinds = STICKERS.filter((sticker) => state.stickers[sticker.id]).length;
  elements.stickerCount.textContent = `${ownedKinds} / ${STICKERS.length}`;
}

function renderStickerBook() {
  elements.stickerGrid.innerHTML = "";

  STICKERS.forEach((sticker) => {
    const count = state.stickers[sticker.id] || 0;
    const slot = document.createElement("div");
    slot.className = count ? "sticker-slot owned" : "sticker-slot";

    if (count) {
      slot.innerHTML = `
        <span class="sticker-emoji">${sticker.emoji}</span>
        <span class="sticker-name">${sticker.name}</span>
        ${count > 1 ? `<span class="sticker-dup">×${count}</span>` : ""}
      `;
    } else {
      slot.innerHTML = `
        <span class="sticker-emoji mystery">?</span>
        <span class="sticker-name">&nbsp;</span>
      `;
    }

    elements.stickerGrid.appendChild(slot);
  });
}

function openStickers() {
  clearQueuedRound();
  clearTrailReward();
  endRound();
  stopSpeech();
  stopBackgroundMusic();
  state.mode = null;
  state.currentRound = null;
  updateReadPromptButton();
  renderStickerBook();
  showScreen("stickers");
}

function closeStickers() {
  refreshHeader();
  showScreen("home");
}

function currentPlanetIndex() {
  return Math.floor(state.stars / STARS_PER_PLANET);
}

function getPlanet(index) {
  return PLANETS[index % PLANETS.length];
}

function applyPlanetTheme(index) {
  const themeIndex = index % PLANETS.length;

  Array.from(document.body.classList)
    .filter((className) => className.startsWith("planet-theme-"))
    .forEach((className) => document.body.classList.remove(className));

  document.body.classList.add(`planet-theme-${themeIndex}`);
}

function updateJourney() {
  const index = currentPlanetIndex();
  const planet = getPlanet(index);
  const nextPlanet = getPlanet(index + 1);
  const starsIntoTrip = state.stars % STARS_PER_PLANET;

  elements.journeyEmoji.textContent = planet.emoji;
  elements.journeyName.textContent = planet.name;
  elements.journeyNextEmoji.textContent = nextPlanet.emoji;
  elements.fuelFill.style.width = `${(starsIntoTrip / STARS_PER_PLANET) * 100}%`;
  elements.fuelText.textContent = `${starsIntoTrip} / ${STARS_PER_PLANET} ⭐ to ${nextPlanet.name}`;
  elements.fuelChip.textContent = `🚀 ${starsIntoTrip}/${STARS_PER_PLANET}`;
}

function updateStreakVisuals() {
  const streakCard = elements.streak.closest(".stat-card");
  const rocket = elements.heroRocket;

  streakCard.classList.remove("streak-warm", "streak-hot", "streak-fire");
  rocket.classList.remove("streak-mid", "streak-high", "streak-super");

  if (state.streak >= 10) {
    streakCard.classList.add("streak-fire");
    rocket.classList.add("streak-super");
  } else if (state.streak >= 5) {
    streakCard.classList.add("streak-hot");
    rocket.classList.add("streak-high");
  } else if (state.streak >= 3) {
    streakCard.classList.add("streak-warm");
    rocket.classList.add("streak-mid");
  }
}

function buildNearbyChoices(
  correctValue,
  answerCount,
  maxValue,
  { min = 1, offsets = [1, -1, 2, -2, 3, -3, 4, -4] } = {}
) {
  const values = new Set([correctValue]);

  shuffleArray(offsets).forEach((offset) => {
    if (values.size >= answerCount) {
      return;
    }

    const candidate = correctValue + offset;
    if (candidate >= min && candidate <= maxValue) {
      values.add(candidate);
    }
  });

  while (values.size < answerCount) {
    values.add(randomInt(min, maxValue));
  }

  return shuffleArray([...values]);
}

function buildBondChoices(target, answerCount) {
  const correctPair = randomPairForTotal(target);
  const choices = [
    {
      first: correctPair[0],
      second: correctPair[1],
      correct: true,
    },
  ];
  const seen = new Set([`${correctPair[0]}-${correctPair[1]}`]);

  while (choices.length < answerCount) {
    const first = randomInt(1, Math.min(9, target));
    const second = randomInt(1, Math.min(9, target + 2));
    const key = `${first}-${second}`;

    if (first + second === target || seen.has(key)) {
      continue;
    }

    seen.add(key);
    choices.push({
      first,
      second,
      correct: false,
    });
  }

  return shuffleArray(choices);
}

function randomPairForTotal(target) {
  const first = randomInt(1, target - 1);
  return [first, target - first];
}

function buildNumberChoiceHtml(value, label) {
  return `
    <span class="choice-value">${formatNumber(value)}</span>
    <span class="choice-label">${label}</span>
  `;
}

function buildWordChoiceHtml(word, label) {
  return `
    <span class="choice-word">${word}</span>
    <span class="choice-label">${label}</span>
  `;
}

function buildWordTrailSceneHtml(word, { showWord = false, showHint = false } = {}) {
  return `
    <div class="word-trail-scene">
      <span class="word-trail-emoji" aria-hidden="true">${word.emoji}</span>
      ${showWord ? `<strong class="trail-word-display">${word.word}</strong>` : ""}
      ${showHint ? `<span class="trail-word-hint">Starts with ${word.word[0].toUpperCase()} (${word.sound}) · ${word.pattern}</span>` : ""}
    </div>
  `;
}

function buildSubitizeSceneHtml(target) {
  const arrangements = {
    2: ["25% 50%", "75% 50%"],
    3: ["50% 22%", "27% 72%", "73% 72%"],
    4: ["25% 25%", "75% 25%", "25% 75%", "75% 75%"],
    5: ["50% 18%", "22% 42%", "78% 42%", "28% 78%", "72% 78%"],
    6: ["24% 22%", "76% 22%", "24% 50%", "76% 50%", "24% 78%", "76% 78%"],
  };
  const stars = (arrangements[target] || []).map(
    (position) => `<span class="subitize-star" style="left:${position.split(" ")[0]};top:${position.split(" ")[1]}">⭐</span>`
  );
  return `<div class="subitize-board">${stars.join("")}</div>`;
}

function buildQuantitySceneHtml(target) {
  if (target === 0) {
    return `<div class="quantity-scene zero-scene"><span>🌌</span><strong>No stars yet!</strong></div>`;
  }

  return `
    <div class="quantity-scene">
      <div class="quantity-grid">
        ${buildEmojiRun("⭐", target, "quantity-star")}
      </div>
    </div>
  `;
}

function buildNumberLineHtml(start, target) {
  const markers = Array.from({ length: 11 }, (_, index) => {
    const value = start + index;
    const label = value === target ? "?" : value;
    return `<span class="number-line-marker${value === target ? " mystery" : ""}"><i></i>${label}</span>`;
  });
  return `<div class="number-line">${markers.join("")}</div>`;
}

function buildEquationChoiceHtml(first, second) {
  return `
    <span class="choice-equation">${formatNumber(first)} + ${formatNumber(second)}</span>
    <span class="choice-label">number pair</span>
  `;
}

function buildEmojiChoiceHtml(emoji, count, label) {
  return `
    <div class="emoji-choice-grid">
      ${buildEmojiRun(emoji, count, "emoji-choice-item")}
    </div>
    <span class="choice-label">${label}</span>
  `;
}

function buildCountSceneHtml(emoji, count, layoutClass) {
  return `
    <div class="scene-emoji-grid ${layoutClass}">
      ${buildEmojiRun(emoji, count, "scene-emoji-item")}
    </div>
  `;
}

function buildEqualSceneHtml(emoji, leftCount, rightCount) {
  return `
    <div class="compare-scene">
      <div class="compare-side">
        <span class="compare-label">Left</span>
        <div class="mini-emoji-grid">
          ${buildEmojiRun(emoji, leftCount, "mini-emoji-item")}
        </div>
      </div>
      <div class="compare-divider">vs</div>
      <div class="compare-side">
        <span class="compare-label">Right</span>
        <div class="mini-emoji-grid">
          ${buildEmojiRun(emoji, rightCount, "mini-emoji-item")}
        </div>
      </div>
    </div>
  `;
}

function buildMakeTenSceneHtml(filledCount) {
  return `
    <div class="ten-scene">
      ${buildTenFrameHtml(filledCount)}
      <p class="scene-caption">${filledCount} spots are full. How many more fill all 10?</p>
    </div>
  `;
}

function buildTeenSceneHtml(target) {
  const ones = target - 10;

  return `
    <div class="teen-scene">
      <div class="teen-block">
        <span class="teen-label">1 ten</span>
        ${buildTenFrameHtml(10)}
      </div>
      <div class="teen-block">
        <span class="teen-label">${ones} ones</span>
        <div class="ones-strip">
          ${buildEmojiRun("●", ones, "ones-chip")}
        </div>
      </div>
    </div>
  `;
}

function buildTenFrameHtml(filledCount) {
  return `
    <div class="ten-frame">
      ${Array.from({ length: 10 }, (_, index) => {
        const filled = index < filledCount ? " filled" : "";
        return `<span class="ten-cell${filled}"></span>`;
      }).join("")}
    </div>
  `;
}

function buildChartSceneHtml(chartStart, target) {
  const cellCount = Math.min(20, 101 - chartStart);
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const value = chartStart + index;
    if (value === target) {
      return `<span class="chart-cell mystery">?</span>`;
    }
    return `<span class="chart-cell">${value}</span>`;
  }).join("");

  return `<div class="hundred-chart">${cells}</div>`;
}

function buildSequenceSceneHtml(numbers, missingIndex) {
  const chips = numbers
    .map((value, index) => {
      if (index === missingIndex) {
        return `<span class="seq-chip mystery">?</span>`;
      }
      return `<span class="seq-chip">${value}</span>`;
    })
    .join("");

  return `<div class="sequence-strip">${chips}</div>`;
}

function buildStorySceneHtml(emoji, firstCount, secondCount, operation) {
  const operator = operation === "subtract" ? "−" : "+";
  const secondClass = operation === "subtract" ? "story-pack muted" : "story-pack";

  return `
    <div class="story-scene">
      <div class="story-pack">
        ${buildEmojiRun(emoji, firstCount, "story-item")}
      </div>
      <div class="story-operator">${operator}</div>
      <div class="${secondClass}">
        ${buildEmojiRun(emoji, secondCount, "story-item")}
      </div>
    </div>
  `;
}

function buildEmojiRun(emoji, count, className) {
  return Array.from({ length: count }, () => `<span class="${className}">${emoji}</span>`).join("");
}

function getCountSubtitle(layoutClass) {
  const subtitles = {
    "line-layout": "Touch each one once as you count.",
    "array-layout": "Rows still count one by one.",
    "scatter-layout": "Say one number for each object you see.",
  };

  return subtitles[layoutClass] || "Count carefully.";
}

function pluralize(item, count) {
  return count === 1 ? item.singular : item.plural;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function pickRandom(values) {
  return values[randomInt(0, values.length - 1)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shuffleArray(values) {
  const next = [...values];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}
