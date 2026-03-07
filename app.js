const STORAGE_KEY = "luca-number-quest-settings-v1";

const defaultSettings = {
  playerName: "Luca",
  roundSeconds: 8,
  voicePraise: true,
  soundEffects: true,
};

const modes = {
  bigger: {
    label: "Bigger Number",
    kicker: "Which one is bigger?",
  },
  count: {
    label: "How Many?",
    kicker: "How many do you see?",
  },
  giant: {
    label: "Giant Numbers",
    kicker: "Find the huge number",
  },
};

const countItems = [
  { emoji: "🧸", word: "bears" },
  { emoji: "🚀", word: "rockets" },
  { emoji: "⭐", word: "stars" },
  { emoji: "🦕", word: "dinosaurs" },
  { emoji: "🍎", word: "apples" },
  { emoji: "⚽", word: "balls" },
];

const giantTiers = [
  {
    subtitle: "Look for the one with more zeros.",
    prompts: [
      [10, 100],
      [20, 200],
      [50, 500],
      [90, 900],
      [100, 1000],
    ],
  },
  {
    subtitle: "The giant one has an extra zero.",
    prompts: [
      [100, 1000],
      [250, 2500],
      [500, 5000],
      [900, 9000],
      [1000, 10000],
    ],
  },
  {
    subtitle: "More places means a much bigger number.",
    prompts: [
      [1000, 10000],
      [2000, 20000],
      [5000, 50000],
      [9000, 90000],
      [10000, 100000],
    ],
  },
  {
    subtitle: "Huge numbers still follow the zero pattern.",
    prompts: [
      [10000, 100000],
      [25000, 250000],
      [50000, 500000],
      [100000, 1000000],
    ],
  },
  {
    subtitle: "Mega round. Count the commas and zeros.",
    prompts: [
      [250000, 2500000],
      [500000, 5000000],
      [1000000, 10000000],
    ],
  },
];

const praiseLines = [
  "Super job!",
  "You got it!",
  "Rocket power!",
  "Big number win!",
  "Amazing counting!",
];

function createModeStats() {
  return {
    bigger: { wins: 0, misses: 0, streak: 0 },
    count: { wins: 0, misses: 0, streak: 0 },
    giant: { wins: 0, misses: 0, streak: 0 },
  };
}

const state = {
  settings: loadSettings(),
  mode: null,
  score: 0,
  streak: 0,
  stars: 0,
  roundActive: false,
  timerId: null,
  timerDeadline: 0,
  currentRound: null,
  modeStats: createModeStats(),
  audioContext: null,
};

const elements = {
  appTitle: document.querySelector("#app-title"),
  heroMessage: document.querySelector("#hero-message"),
  score: document.querySelector("#score-value"),
  streak: document.querySelector("#streak-value"),
  stars: document.querySelector("#stars-value"),
  screens: {
    home: document.querySelector("#screen-home"),
    game: document.querySelector("#screen-game"),
    settings: document.querySelector("#screen-settings"),
  },
  modeChip: document.querySelector("#mode-chip"),
  timerText: document.querySelector("#timer-text"),
  timerFill: document.querySelector("#timer-fill"),
  promptKicker: document.querySelector("#prompt-kicker"),
  promptTitle: document.querySelector("#prompt-title"),
  promptSubtitle: document.querySelector("#prompt-subtitle"),
  choices: document.querySelector("#choices"),
  feedback: document.querySelector("#feedback"),
  parentsButton: document.querySelector("#parents-button"),
  backButton: document.querySelector("#back-button"),
  closeSettings: document.querySelector("#close-settings"),
  nameInput: document.querySelector("#name-input"),
  roundSeconds: document.querySelector("#round-seconds"),
  voiceToggle: document.querySelector("#voice-toggle"),
  soundToggle: document.querySelector("#sound-toggle"),
  saveSettings: document.querySelector("#save-settings"),
  resetProgress: document.querySelector("#reset-progress"),
};

init();

function init() {
  bindEvents();
  populateSettingsForm();
  refreshHeader();
  updateStats();
  showScreen("home");
  registerServiceWorker();
}

function bindEvents() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => startMode(button.dataset.mode));
  });

  elements.parentsButton.addEventListener("click", openSettings);
  elements.closeSettings.addEventListener("click", closeSettings);
  elements.backButton.addEventListener("click", goHome);
  elements.saveSettings.addEventListener("click", saveSettings);
  elements.resetProgress.addEventListener("click", resetProgress);
}

function startMode(mode) {
  state.mode = mode;
  state.roundActive = true;
  elements.modeChip.textContent = modes[mode].label;
  clearFeedback();
  showScreen("game");
  playSoundEffect("start");
  nextRound();
}

function nextRound() {
  if (!state.mode) {
    return;
  }

  clearTimer();
  clearFeedback();

  const round = generateRound(state.mode);
  state.currentRound = round;
  renderRound(round);
  startTimer(state.settings.roundSeconds);
}

function generateRound(mode) {
  if (mode === "bigger") {
    return generateBiggerRound();
  }

  if (mode === "count") {
    return generateCountRound();
  }

  return generateGiantRound();
}

function generateBiggerRound() {
  const max = state.stars < 5 ? 20 : state.stars < 12 ? 100 : 1000;
  let first = randomInt(1, max);
  let second = randomInt(1, max);

  while (first === second) {
    second = randomInt(1, max);
  }

  return {
    type: "choice",
    kicker: modes.bigger.kicker,
    title: "Tap the bigger number",
    subtitle: "Go fast and trust your eyes.",
    choices: [
      { value: first, label: describeNumber(first), correct: first > second },
      { value: second, label: describeNumber(second), correct: second > first },
    ],
  };
}

function generateGiantRound() {
  const tier = getGiantTier();
  const pair = tier.prompts[randomInt(0, tier.prompts.length - 1)];
  const shuffled = Math.random() > 0.5 ? pair : [pair[1], pair[0]];

  return {
    type: "choice",
    kicker: modes.giant.kicker,
    title: "Which number is huge?",
    subtitle: tier.subtitle,
    choices: shuffled.map((value) => ({
      value,
      label: giantLabel(value),
      correct: value === Math.max(...pair),
    })),
  };
}

function generateCountRound() {
  const item = countItems[randomInt(0, countItems.length - 1)];
  const profile = getCountProfile();
  const target = randomInt(profile.minTarget, profile.maxTarget);
  const choiceValues = buildCountChoices(target, profile);

  return {
    type: "count-select",
    kicker: modes.count.kicker,
    title: `How many ${item.word}?`,
    subtitle: profile.subtitle,
    target,
    itemWord: item.word,
    items: Array.from({ length: target }, () => item.emoji),
    choices: choiceValues.map((value) => ({
      value,
      label: item.word,
      correct: value === target,
    })),
  };
}

function renderRound(round) {
  elements.promptKicker.textContent = round.kicker;
  elements.promptTitle.textContent = round.title;
  elements.promptSubtitle.textContent = round.subtitle;
  elements.choices.innerHTML = "";

  if (round.type === "choice") {
    elements.choices.className = "choices two-choice-grid";

    round.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = `choice-button${state.mode === "giant" ? " giant-choice" : ""}`;
      button.type = "button";
      button.dataset.digits = String(choice.value).length;
      button.innerHTML = `
        <span class="choice-value">${formatNumber(choice.value)}</span>
        <span class="choice-label">${choice.label}</span>
      `;
      button.addEventListener("click", () => {
        if (!state.roundActive) {
          return;
        }
        playSoundEffect("tap");
        choice.correct ? handleCorrect() : handleIncorrect(`The bigger number was ${formatNumber(getCorrectChoice(round).value)}.`);
      });
      elements.choices.appendChild(button);
    });

    return;
  }

  elements.choices.className = "choices count-select-layout";

  const scene = document.createElement("div");
  scene.className = "count-scene";
  scene.innerHTML = `
    <div class="count-scene-grid" aria-hidden="true">
      ${round.items.map((emoji) => `<span class="count-scene-item">${emoji}</span>`).join("")}
    </div>
  `;
  elements.choices.appendChild(scene);

  const answerGrid = document.createElement("div");
  answerGrid.className = "count-answer-grid";

  round.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button count-choice";
    button.type = "button";
    button.innerHTML = `
      <span class="choice-value">${formatNumber(choice.value)}</span>
      <span class="choice-label">${choice.label}</span>
    `;
    button.addEventListener("click", () => {
      if (!state.roundActive) {
        return;
      }
      playSoundEffect("tap");
      choice.correct
        ? handleCorrect(`Yes! There are ${round.target} ${round.itemWord}.`)
        : handleIncorrect(`Not quite. There are ${round.target} ${round.itemWord}.`);
    });
    answerGrid.appendChild(button);
  });

  elements.choices.appendChild(answerGrid);
}

function handleCorrect(customMessage) {
  recordModeResult(true);
  endRound();
  state.score += 1;
  state.streak += 1;
  state.stars += 1;
  updateStats();
  playSoundEffect("success");
  showFeedback("success", customMessage || praiseLines[randomInt(0, praiseLines.length - 1)]);
  speakPraise();
  window.setTimeout(nextRound, 950);
}

function handleIncorrect(message) {
  recordModeResult(false);
  endRound();
  state.streak = 0;
  updateStats();
  playSoundEffect("fail");
  showFeedback("fail", message || "Try again!");
  window.setTimeout(nextRound, 1200);
}

function endRound() {
  state.roundActive = false;
  clearTimer();
}

function startTimer(seconds) {
  state.roundActive = true;
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

function updateTimerVisual(secondsLeft) {
  const total = state.settings.roundSeconds;
  const ratio = Math.max(0, Math.min(1, secondsLeft / total));
  elements.timerText.textContent = `${Math.ceil(secondsLeft)}s`;
  elements.timerFill.style.width = `${ratio * 100}%`;
  elements.timerFill.style.background = ratio < 0.35
    ? "linear-gradient(90deg, #ff8e66, #ff5b6e)"
    : "linear-gradient(90deg, #7ce0a3, #5dc6ff)";
}

function clearTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function showScreen(name) {
  Object.entries(elements.screens).forEach(([screenName, element]) => {
    element.classList.toggle("active", screenName === name);
  });
}

function goHome() {
  endRound();
  state.mode = null;
  clearFeedback();
  refreshHeader();
  showScreen("home");
}

function openSettings() {
  endRound();
  populateSettingsForm();
  showScreen("settings");
}

function closeSettings() {
  refreshHeader();
  showScreen("home");
}

function saveSettings() {
  const nextName = elements.nameInput.value.trim() || defaultSettings.playerName;
  const nextRoundSeconds = Number(elements.roundSeconds.value) || defaultSettings.roundSeconds;

  state.settings = {
    playerName: nextName,
    roundSeconds: nextRoundSeconds,
    voicePraise: elements.voiceToggle.checked,
    soundEffects: elements.soundToggle.checked,
  };

  persistSettings();
  refreshHeader();
  closeSettings();
}

function populateSettingsForm() {
  elements.nameInput.value = state.settings.playerName;
  elements.roundSeconds.value = String(state.settings.roundSeconds);
  elements.voiceToggle.checked = Boolean(state.settings.voicePraise);
  elements.soundToggle.checked = Boolean(state.settings.soundEffects);
}

function refreshHeader() {
  const name = state.settings.playerName || defaultSettings.playerName;
  document.title = `${name} Number Quest`;
  elements.appTitle.textContent = `${name} Number Quest`;
  elements.heroMessage.textContent = `${name} can pick a game and help the rocket blast off.`;
}

function updateStats() {
  elements.score.textContent = String(state.score);
  elements.streak.textContent = String(state.streak);
  elements.stars.textContent = String(state.stars);
}

function showFeedback(type, message) {
  elements.feedback.className = `feedback ${type}`;
  elements.feedback.textContent = message;
}

function clearFeedback() {
  elements.feedback.className = "feedback";
  elements.feedback.textContent = "";
}

function resetProgress() {
  state.score = 0;
  state.streak = 0;
  state.stars = 0;
  state.modeStats = createModeStats();
  updateStats();
  clearFeedback();
  closeSettings();
}

function getCorrectChoice(round) {
  return round.choices.find((choice) => choice.correct);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function giantLabel(value) {
  if (value >= 1000000000) {
    return "billion";
  }
  if (value >= 1000000) {
    return "million";
  }
  if (value >= 1000) {
    return "thousand";
  }
  if (value >= 100) {
    return "hundreds";
  }
  return "number";
}

function describeNumber(value) {
  if (value < 10) {
    return "tiny";
  }
  if (value < 100) {
    return "big";
  }
  return "huge";
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(values) {
  const next = [...values];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getGiantTier() {
  const wins = state.modeStats.giant.wins;

  if (wins < 2) {
    return giantTiers[0];
  }
  if (wins < 5) {
    return giantTiers[1];
  }
  if (wins < 8) {
    return giantTiers[2];
  }
  if (wins < 12) {
    return giantTiers[3];
  }

  return giantTiers[4];
}

function getCountProfile() {
  const stats = state.modeStats.count;
  const attempts = stats.wins + stats.misses;
  const accuracy = attempts ? stats.wins / attempts : 1;

  if (attempts < 3 || accuracy < 0.55) {
    return {
      minTarget: 3,
      maxTarget: 6,
      answerCount: 3,
      subtitle: "Count each one, then tap the number.",
      preferredOffsets: [3, -3, 2, -2, 4, -4, 1, -1],
    };
  }

  if (stats.streak >= 4 || accuracy > 0.82) {
    return {
      minTarget: 5,
      maxTarget: 10,
      answerCount: 4,
      subtitle: "Look closely. The answers are sneaky now.",
      preferredOffsets: [1, -1, 2, -2, 3, -3],
    };
  }

  return {
    minTarget: 4,
    maxTarget: 8,
    answerCount: 4,
    subtitle: "Count them, then choose the answer.",
    preferredOffsets: [2, -2, 1, -1, 3, -3],
  };
}

function buildCountChoices(target, profile) {
  const maxChoice = Math.max(12, profile.maxTarget + 3);
  const values = new Set([target]);
  const offsetPool = shuffleArray(profile.preferredOffsets);

  offsetPool.forEach((offset) => {
    if (values.size >= profile.answerCount) {
      return;
    }

    const candidate = target + offset;

    if (candidate >= 1 && candidate <= maxChoice) {
      values.add(candidate);
    }
  });

  while (values.size < profile.answerCount) {
    const candidate = randomInt(1, maxChoice);
    if (candidate !== target) {
      values.add(candidate);
    }
  }

  return shuffleArray([...values]);
}

function recordModeResult(didWin) {
  if (!state.mode) {
    return;
  }

  const stats = state.modeStats[state.mode];
  if (!stats) {
    return;
  }

  if (didWin) {
    stats.wins += 1;
    stats.streak += 1;
    return;
  }

  stats.misses += 1;
  stats.streak = 0;
}

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultSettings };
    }

    return { ...defaultSettings, ...JSON.parse(raw) };
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

function speakPraise() {
  if (!state.settings.voicePraise || !("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(
    praiseLines[randomInt(0, praiseLines.length - 1)]
  );
  utterance.rate = 0.95;
  utterance.pitch = 1.25;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
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
      { delay: 0, frequency: 520, endFrequency: 430, duration: 0.035, type: "square", volume: 0.012 },
      { delay: 0.03, frequency: 620, endFrequency: 760, duration: 0.04, type: "triangle", volume: 0.012 },
    ],
    start: [
      { delay: 0, frequency: 210, endFrequency: 520, duration: 0.09, type: "triangle", volume: 0.04 },
      { delay: 0.05, frequency: 520, endFrequency: 260, duration: 0.07, type: "sine", volume: 0.02 },
      { delay: 0.11, frequency: 360, endFrequency: 780, duration: 0.08, type: "square", volume: 0.022 },
    ],
    success: [
      { delay: 0, frequency: 240, endFrequency: 420, duration: 0.07, type: "sine", volume: 0.022 },
      { delay: 0.06, frequency: 420, endFrequency: 660, duration: 0.08, type: "triangle", volume: 0.04 },
      { delay: 0.15, frequency: 660, endFrequency: 980, duration: 0.08, type: "square", volume: 0.03 },
      { delay: 0.24, frequency: 980, endFrequency: 720, duration: 0.11, type: "triangle", volume: 0.028 },
      { delay: 0.32, frequency: 540, endFrequency: 1240, duration: 0.1, type: "square", volume: 0.02 },
    ],
    fail: [
      { delay: 0, frequency: 480, endFrequency: 240, duration: 0.1, type: "sawtooth", volume: 0.03 },
      { delay: 0.09, frequency: 240, endFrequency: 120, duration: 0.15, type: "triangle", volume: 0.03 },
      { delay: 0.22, frequency: 150, endFrequency: 90, duration: 0.16, type: "sine", volume: 0.024 },
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
  oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, note.startAt + note.duration);

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
