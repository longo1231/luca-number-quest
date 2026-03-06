const STORAGE_KEY = "luca-number-quest-settings-v1";

const defaultSettings = {
  playerName: "Luca",
  roundSeconds: 8,
  voicePraise: true,
};

const modes = {
  bigger: {
    label: "Bigger Number",
    kicker: "Which one is bigger?",
  },
  count: {
    label: "Count & Tap",
    kicker: "Tap the right amount",
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

const giantPrompts = [
  [100, 1000],
  [1000, 1000000],
  [1000000, 1000000000],
  [20, 200],
  [500, 5000],
  [2500, 250000],
  [75000, 750000],
  [100000, 1000000],
  [1000000, 100000000],
];

const praiseLines = [
  "Super job!",
  "You got it!",
  "Rocket power!",
  "Big number win!",
  "Amazing counting!",
];

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
  const pair = giantPrompts[randomInt(0, giantPrompts.length - 1)];
  const shuffled = Math.random() > 0.5 ? pair : [pair[1], pair[0]];

  return {
    type: "choice",
    kicker: modes.giant.kicker,
    title: "Which number is huge?",
    subtitle: "Some numbers are really, really big.",
    choices: shuffled.map((value) => ({
      value,
      label: giantLabel(value),
      correct: value === Math.max(...pair),
    })),
  };
}

function generateCountRound() {
  const item = countItems[randomInt(0, countItems.length - 1)];
  const target = randomInt(3, state.stars > 8 ? 10 : 8);
  const total = target + randomInt(2, 5);
  const items = Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    used: false,
    emoji: item.emoji,
  }));

  return {
    type: "count",
    kicker: modes.count.kicker,
    title: `Tap ${target} ${item.word}`,
    subtitle: `0 of ${target} tapped`,
    target,
    tapped: 0,
    itemWord: item.word,
    items,
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
      button.className = "choice-button";
      button.type = "button";
      button.innerHTML = `
        <span class="choice-value">${formatNumber(choice.value)}</span>
        <span class="choice-label">${choice.label}</span>
      `;
      button.addEventListener("click", () => {
        if (!state.roundActive) {
          return;
        }
        choice.correct ? handleCorrect() : handleIncorrect(`The bigger number was ${formatNumber(getCorrectChoice(round).value)}.`);
      });
      elements.choices.appendChild(button);
    });

    return;
  }

  elements.choices.className = "choices count-grid";

  round.items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "count-item";
    button.type = "button";
    button.textContent = item.emoji;
    button.addEventListener("click", () => handleCountTap(button, item.id));
    elements.choices.appendChild(button);
  });
}

function handleCountTap(button, itemId) {
  if (!state.roundActive || !state.currentRound || state.currentRound.type !== "count") {
    return;
  }

  const tappedItem = state.currentRound.items.find((item) => item.id === itemId);
  if (!tappedItem || tappedItem.used) {
    return;
  }

  tappedItem.used = true;
  state.currentRound.tapped += 1;
  button.classList.add("used");

  elements.promptSubtitle.textContent = `${state.currentRound.tapped} of ${state.currentRound.target} tapped`;

  if (state.currentRound.tapped === state.currentRound.target) {
    handleCorrect(`You found ${state.currentRound.target} ${state.currentRound.itemWord}!`);
    return;
  }

  if (state.currentRound.tapped > state.currentRound.target) {
    handleIncorrect(`That was too many. You needed ${state.currentRound.target}.`);
  }
}

function handleCorrect(customMessage) {
  endRound();
  state.score += 1;
  state.streak += 1;
  state.stars += 1;
  updateStats();
  showFeedback("success", customMessage || praiseLines[randomInt(0, praiseLines.length - 1)]);
  speakPraise();
  window.setTimeout(nextRound, 950);
}

function handleIncorrect(message) {
  endRound();
  state.streak = 0;
  updateStats();
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
  };

  persistSettings();
  refreshHeader();
  closeSettings();
}

function populateSettingsForm() {
  elements.nameInput.value = state.settings.playerName;
  elements.roundSeconds.value = String(state.settings.roundSeconds);
  elements.voiceToggle.checked = Boolean(state.settings.voicePraise);
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
