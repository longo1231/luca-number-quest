const STORAGE_KEY = "luca-number-quest-settings-v1";
const PROGRESS_KEY = "luca-number-quest-progress-v1";

const defaultSettings = {
  playerName: "Luca",
  roundSeconds: 20,
  timerEnabled: false,
  voicePraise: true,
  soundEffects: true,
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
};

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
  "Super job!",
  "You got it!",
  "Math rocket!",
  "Kindergarten power!",
  "Amazing thinking!",
];

const state = {
  settings: loadSettings(),
  mode: null,
  score: savedProgress.score,
  streak: savedProgress.streak,
  stars: savedProgress.stars,
  roundActive: false,
  timerId: null,
  timerDeadline: 0,
  nextRoundTimeoutId: null,
  currentRound: null,
  modeStats: savedProgress.modeStats,
  audioContext: null,
  availableVoices: [],
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
  timerBar: document.querySelector("#timer-bar"),
  timerFill: document.querySelector("#timer-fill"),
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
  soundToggle: document.querySelector("#sound-toggle"),
  saveSettings: document.querySelector("#save-settings"),
  resetProgress: document.querySelector("#reset-progress"),
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

  const round = generateRound(state.mode);
  state.currentRound = round;
  renderRound(round);
  startTimer();
}

function generateRound(mode) {
  if (mode === "count") {
    return generateCountRound();
  }

  if (mode === "compare") {
    return generateCompareRound();
  }

  if (mode === "pairs") {
    return generatePairsRound();
  }

  return generateTeenRound();
}

function generateCountRound() {
  const profile = getCountProfile();
  const roll = Math.random();

  if (profile.allowTens && roll < 0.18) {
    return generateCountByTensRound();
  }

  if (profile.allowSequence && roll < 0.46) {
    return generateCountOnRound(profile);
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

function generateCountObjectsRound(profile) {
  const item = pickRandom(countItems);
  const target = randomInt(profile.minTarget, profile.maxTarget);
  const layout = pickRandom(["line-layout", "array-layout", "scatter-layout"]);
  const choices = buildNearbyChoices(target, profile.answerCount, 20, { min: 0 });

  return {
    type: "scene-choice",
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

function generateCountOnRound(profile) {
  const start = randomInt(1, profile.sequenceMax - 1);
  const correct = start + 1;
  const choices = buildNearbyChoices(correct, 3, profile.sequenceMax + 2, { min: 1 });

  return {
    type: "choice",
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
  const useSubtraction = profile.allowSubtraction && Math.random() > 0.5;

  if (useSubtraction) {
    const total = randomInt(3, profile.storyMax);
    const takenAway = randomInt(1, total - 1);
    const correct = total - takenAway;
    const choices = buildNearbyChoices(correct, profile.answerCount, profile.storyMax, { min: 0 });

    return {
      type: "scene-choice",
      kicker: "Take away to subtract.",
      title: `${total} ${pluralize(item, total)}, ${takenAway} go away. How many are left?`,
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
    kicker: "Put together to add.",
    title: `${first} ${pluralize(item, first)} and ${second} more. How many now?`,
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

function buildChoiceButton(choice, round) {
  const button = document.createElement("button");
  button.className = ["choice-button", choice.className].filter(Boolean).join(" ");
  button.type = "button";
  button.innerHTML = choice.html;
  button.addEventListener("click", () => {
    if (!state.roundActive) {
      return;
    }

    playSoundEffect("tap");
    if (choice.correct) {
      handleCorrect(round.successMessage);
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
  recordModeResult(true);
  endRound();
  state.score += 1;
  state.streak += 1;
  state.stars += 1;
  persistProgress();
  updateStats();
  playSoundEffect("success");
  showFeedback("success", customMessage || pickRandom(praiseLines));
  speakPraise();
  queueNextRound(950);
}

function handleIncorrect(message) {
  recordModeResult(false);
  endRound();
  state.streak = 0;
  persistProgress();
  updateStats();
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
  endRound();
  stopSpeech();
  state.mode = null;
  state.currentRound = null;
  updateReadPromptButton();
  clearFeedback();
  refreshHeader();
  showScreen("home");
}

function openSettings() {
  clearQueuedRound();
  endRound();
  stopSpeech();
  populateSettingsForm();
  showScreen("settings");
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
    soundEffects: elements.soundToggle.checked,
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
  elements.soundToggle.checked = Boolean(state.settings.soundEffects);
}

function syncTimerSettingsState() {
  elements.roundSeconds.disabled = !elements.timerToggle.checked;
}

function refreshHeader() {
  const name = state.settings.playerName || defaultSettings.playerName;
  document.title = `${name} Number Quest`;
  elements.appTitle.textContent = `${name} Number Quest`;
  elements.heroMessage.textContent = `${name} can practice kindergarten number skills and help the rocket blast off.`;
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
  clearQueuedRound();
  endRound();
  stopSpeech();
  state.score = 0;
  state.streak = 0;
  state.stars = 0;
  state.mode = null;
  state.currentRound = null;
  state.modeStats = createModeStats();
  updateReadPromptButton();
  persistProgress();
  updateStats();
  clearFeedback();
  closeSettings();
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
      soundEffects: Boolean(savedSettings.soundEffects),
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
      modeStats: createModeStats(),
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

    return {
      score: Number(parsed.score) || 0,
      streak: Number(parsed.streak) || 0,
      stars: Number(parsed.stars) || 0,
      modeStats: nextModeStats,
    };
  } catch {
    return {
      score: 0,
      streak: 0,
      stars: 0,
      modeStats: createModeStats(),
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
        modeStats: state.modeStats,
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

  const utterance = new SpeechSynthesisUtterance(pickRandom(praiseLines));
  speakUtterance(utterance, "praise");
}

function readCurrentPrompt() {
  if (!state.currentRound || !canSpeak()) {
    return;
  }

  const speechParts = [
    state.currentRound.kicker,
    state.currentRound.title,
  ];

  if (state.currentRound.subtitle) {
    speechParts.push(state.currentRound.subtitle);
  }

  const utterance = new SpeechSynthesisUtterance(speechParts.join(" "));
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

  utterance.rate = kind === "praise" ? 0.98 : 0.9;
  utterance.pitch = kind === "praise" ? 1.12 : 1;

  stopSpeech();
  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if (!canSpeak()) {
    return;
  }

  window.speechSynthesis.cancel();
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
