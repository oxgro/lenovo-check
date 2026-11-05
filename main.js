// --- DOM Helpers ---
const selectOne = (selector) => document.querySelector(selector);
const selectAll = (selector) => [...document.querySelectorAll(selector)];

// --- Application State ---
const prefersReducedMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
const testState = {
  keyboard: null,
  audio: null,
  camera: null,
  drivers: null
};

const SECTION_TITLES = {
  keyboard: "Keyboard",
  audio: "Speakers and mics",
  camera: "Camera"
};

// --- Navigation & State Management ---
const LEGACY_SECTION_HASHES = {
  kb: "keyboard",
  keys: "keyboard",
  speakers: "audio",
  speaker: "audio",
  microphone: "audio",
  microphones: "audio",
  mic: "audio",
  headset: "audio",
  video: "camera",
  vid: "camera",
  cam: "camera",
  driver: "drivers",
  lenovo: "drivers",
  update: "drivers",
  updates: "drivers"
};

function scrollToSection(sectionId) {
  selectOne("#" + sectionId).scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });
}

function redirectLegacySectionHash() {
  const legacyHash = location.hash.slice(1).toLowerCase();
  const sectionId = LEGACY_SECTION_HASHES[legacyHash];
  if (!sectionId) return;

  history.replaceState(null, "", `#${sectionId}`);
  scrollToSection(sectionId);
}

addEventListener("hashchange", redirectLegacySectionHash);
redirectLegacySectionHash();

function completeSection(sectionKey, passed, nextSectionId, forceUpdate = false) {
  // Prevent overriding unless forced or passing a previously failed step
  if (!forceUpdate && (testState[sectionKey] === true || (testState[sectionKey] === false && !passed))) {
    return;
  }

  testState[sectionKey] = passed;
  const chipElement = selectOne(`.chip[data-s=${sectionKey}]`);
  chipElement.classList.remove("ok", "bad");
  chipElement.classList.add(passed ? "ok" : "bad");

  setTimeout(() => scrollToSection(nextSectionId), 700);
  renderSummary();
  updateGlobalStatusBar();
}

function continueToNext(currentSectionKey, nextSectionId) {
  if (testState[currentSectionKey] === null) {
    completeSection(currentSectionKey, false, nextSectionId);
  } else {
    scrollToSection(nextSectionId);
  }
}

function updateGlobalStatusBar() {
  const allTestsPassed = [
    testState.keyboard,
    testState.audio,
    testState.camera,
    testState.drivers
  ].every((status) => status === true);

  document.body.classList.toggle("all", allTestsPassed);
}

function renderSummary() {
  selectOne("#sum").innerHTML = Object.keys(SECTION_TITLES)
    .map((key) => {
      const stateVal = testState[key];
      const statusText = stateVal === null ? "not tested" : stateVal ? "passed" : "failed";
      return `<li>${SECTION_TITLES[key]}: ${statusText}</li>`;
    })
    .join("");
}

// --- Keyboard Layout Builder ---
const createKeyDefinition = (code, label, width = 1, alternateCodes = [], subLabel = "", isSkipped = false) => ({
  code,
  label,
  width,
  alternateCodes,
  subLabel,
  isSkipped
});

const createFunctionKey = (num, secondaryCode, subLabel, alternateCodes) =>
  createKeyDefinition("F" + num, "F" + num, 0.8, alternateCodes, subLabel);

const createLetterKeys = (charString) =>
  [...charString].map((char) => createKeyDefinition("Key" + char, char));

const numberKeys = [..."1234567890"].map((num) => createKeyDefinition("Digit" + num, num));

const KEYBOARD_LAYOUT = [
  [
    createKeyDefinition("Escape", "Esc", 0.8),
    { spacer: 0.3 },
    createFunctionKey(1, 0, "mute", ["AudioVolumeMute", "VolumeMute"]),
    createFunctionKey(2, 0, "vol −", ["AudioVolumeDown", "VolumeDown"]),
    createFunctionKey(3, 0, "vol +", ["AudioVolumeUp", "VolumeUp"]),
    createFunctionKey(4, 0, "mic", ["MicrophoneToggle", "MicrophoneMuteToggle", "MediaMicMute"]),
    { spacer: 0.25 },
    createFunctionKey(5, 0, "dim", ["BrightnessDown"]),
    createFunctionKey(6, 0, "bright", ["BrightnessUp"]),
    createFunctionKey(7, 0, "display", [
      "Display",
      "VideoModeNext",
      "SwitchVideoMode",
      "LaunchScreenSaver",
      "ZoomToggle"
    ]),
    createFunctionKey(8, 0, "wifi", [
      "WLAN",
      "WLANToggle",
      "AirplaneMode",
      "WirelessToggle",
      "Wireless"
    ]),
    { spacer: 0.25 },
    createFunctionKey(9, 0, "settings", ["LaunchApp1", "LaunchSettings", "Settings"]),
    createFunctionKey(10, 0, "call", ["LaunchPhone", "Call", "Phone", "LaunchApp2"]),
    createFunctionKey(11, 0, "hang up", ["HangUp", "EndCall", "Hangup"]),
    createFunctionKey(12, 0, "star", ["Favorites", "BrowserFavorites", "LaunchApp3", "Star"]),
    { spacer: 0.25 },
    createKeyDefinition("Home", "Hm", 0.8),
    createKeyDefinition("End", "End", 0.8),
    createKeyDefinition("Insert", "Ins", 0.8),
    createKeyDefinition("Delete", "Del", 0.8)
  ],
  [
    createKeyDefinition("Backquote", "`"),
    ...numberKeys,
    createKeyDefinition("Minus", "-"),
    createKeyDefinition("Equal", "="),
    createKeyDefinition("Backspace", "Backspace", 2)
  ],
  [
    createKeyDefinition("Tab", "Tab", 1.5),
    ...createLetterKeys("QWERTYUIOP"),
    createKeyDefinition("BracketLeft", "["),
    createKeyDefinition("BracketRight", "]"),
    createKeyDefinition("Backslash", "\\", 1.5)
  ],
  [
    createKeyDefinition("CapsLock", "Caps Lock", 1.75),
    ...createLetterKeys("ASDFGHJKL"),
    createKeyDefinition("Semicolon", ";"),
    createKeyDefinition("Quote", "'"),
    createKeyDefinition("Enter", "Enter", 2.25)
  ],
  [
    createKeyDefinition("ShiftLeft", "Shift", 2.25),
    ...createLetterKeys("ZXCVBNM"),
    createKeyDefinition("Comma", ","),
    createKeyDefinition("Period", "."),
    createKeyDefinition("Slash", "/"),
    createKeyDefinition("ShiftRight", "Shift", 2.75)
  ],
  [
    createKeyDefinition("Fn", "Fn", 1, [], "", true),
    createKeyDefinition("ControlLeft", "Ctrl", 1.25),
    createKeyDefinition("Meta", "Win", 1, [], "", true),
    createKeyDefinition("AltLeft", "Alt"),
    createKeyDefinition("Space", "Space", 4.75),
    createKeyDefinition("AltRight", "Alt"),
    createKeyDefinition("PrintScreen", "PrtSc", 1, [], "", true),
    createKeyDefinition("ControlRight", "Ctrl"),
    {
      cluster: [
        createKeyDefinition("PageUp", "PgUp"),
        createKeyDefinition("ArrowUp", "↑"),
        createKeyDefinition("PageDown", "PgDn"),
        createKeyDefinition("ArrowLeft", "←"),
        createKeyDefinition("ArrowDown", "↓"),
        createKeyDefinition("ArrowRight", "→")
      ],
      width: 3
    }
  ]
];

// --- Keyboard Logic ---
const codeToKeyMap = {};
const keyElementsMap = {};
let totalTrackableKeys = 0;
const testedKeysSet = new Set();
const keyboardContainer = selectOne("#keyboard-keys");

function buildKeyNode(keyDef) {
  const keyEl = document.createElement("div");
  keyEl.className = "k" + (keyDef.isSkipped ? " off" : "");
  keyEl.style.setProperty("--w", keyDef.width);
  keyEl.innerHTML = keyDef.label + (keyDef.subLabel ? `<small>${keyDef.subLabel}</small>` : "");
  keyEl.title = keyDef.isSkipped ? "Skipped" : keyDef.code;

  if (!keyDef.isSkipped) {
    [keyDef.code, ...keyDef.alternateCodes].forEach((codeVariant) => {
      codeToKeyMap[codeVariant] = keyDef.code;
    });
    keyElementsMap[keyDef.code] = keyEl;
    totalTrackableKeys++;
    keyEl.addEventListener("dblclick", () => markKeyAsTested(keyDef.code));
  }
  return keyEl;
}

function markKeyAsTested(keyCode) {
  if (testState.keyboard === true || testedKeysSet.has(keyCode)) return;

  testedKeysSet.add(keyCode);
  keyElementsMap[keyCode].classList.add("on");
  selectOne("#count").textContent = `${testedKeysSet.size} of ${totalTrackableKeys} keys tested`;

  if (testedKeysSet.size === totalTrackableKeys) {
    completeSection("keyboard", true, "audio");
  }
}

// Generate keyboard DOM layout
KEYBOARD_LAYOUT.forEach((rowDefs) => {
  const rowElement = document.createElement("div");
  rowElement.className = "row";

  rowDefs.forEach((item) => {
    if (item.spacer) {
      const spacerEl = document.createElement("div");
      spacerEl.style.flex = item.spacer + " 1 0";
      rowElement.append(spacerEl);
      return;
    }
    if (item.cluster) {
      const clusterEl = document.createElement("div");
      clusterEl.className = "cluster";
      clusterEl.style.setProperty("--w", item.width);
      item.cluster.forEach((k) => clusterEl.append(buildKeyNode(k)));
      rowElement.append(clusterEl);
      return;
    }
    if (item.stack) {
      const stackEl = document.createElement("div");
      stackEl.className = "stack";
      stackEl.style.setProperty("--w", item.width);
      item.stack.forEach((k) => stackEl.append(buildKeyNode(k)));
      rowElement.append(stackEl);
      return;
    }
    rowElement.append(buildKeyNode(item));
  });

  keyboardContainer.append(rowElement);
});

let isKeyboardInView = true;

function isKeyboardCaptureActive(evt) {
  return (
    testState.keyboard !== true &&
    isKeyboardInView &&
    !/^(SELECT|INPUT|BUTTON|A)$/.test(evt.target.tagName)
  );
}

new IntersectionObserver(
  ([entry]) => {
    isKeyboardInView = entry.isIntersecting;
  },
  { threshold: 0.3 }
).observe(selectOne("#keyboard"));

addEventListener(
  "keydown",
  (evt) => {
    if (!isKeyboardCaptureActive(evt)) return;
    evt.preventDefault();

    selectOne("#last").textContent = `code: ${evt.code || "—"}  key: ${evt.key}`;
    const mappedKeyCode = codeToKeyMap[evt.code] || codeToKeyMap[evt.key];

    if (mappedKeyCode) {
      keyElementsMap[mappedKeyCode].classList.add("dn");
      if (!evt.repeat) {
        markKeyAsTested(mappedKeyCode);
      }
      setTimeout(() => {
        if (keyElementsMap[mappedKeyCode]) {
          keyElementsMap[mappedKeyCode].classList.remove("dn");
        }
      }, 160);
    }
  },
  true
);

addEventListener(
  "keyup",
  (evt) => {
    const mappedKeyCode = codeToKeyMap[evt.code] || codeToKeyMap[evt.key];
    if (mappedKeyCode && keyElementsMap[mappedKeyCode]) {
      keyElementsMap[mappedKeyCode].classList.remove("dn");
    }
    if (isKeyboardCaptureActive(evt)) {
      evt.preventDefault();
    }
  },
  true
);

selectOne("#count").textContent = `0 of ${totalTrackableKeys} keys tested`;
selectOne("#board").focus();

addEventListener("load", () => {
  selectOne("#board").focus();
  setTimeout(() => {
    selectOne("#kbSkip").hidden = false;
  }, 20000);
});

selectOne("#kbSkip").onclick = () => continueToNext("keyboard", "audio");

// --- Audio Testing Logic ---
let audioContext;
let activeMicStreams = {};

const audioSelectors = {
  micLaptop: selectOne("#micL"),
  micHeadset: selectOne("#micH"),
  speakerLaptop: selectOne("#outL"),
  speakerHeadset: selectOne("#outH")
};

const TEST_TONE_FREQUENCY = 880;
const TEST_TONE_GAIN = 0.98;
const STEREO_PAN = { Left: -1, Right: 1 };
const AUDIO_ITEMS = [
  { name: "Laptop speaker · left", type: "speaker", device: "laptop", channel: "Left" },
  { name: "Laptop speaker · right", type: "speaker", device: "laptop", channel: "Right" },
  { name: "Laptop microphone", type: "mic", device: "laptop" },
  { name: "Headset microphone", type: "mic", device: "headset" }
].map((item) => ({ ...item, status: null }));

function renderAudioResultsTable() {
  selectOne("#res").innerHTML = AUDIO_ITEMS.map((item) => {
    const status = item.status;
    let cssClass = "n";
    if (status === true) cssClass = "y";
    else if (status !== false) cssClass = "w";

    let iconText = "—";
    if (status === true) iconText = "✓";
    else if (status === "running") iconText = "…";
    else if (status === false) iconText = "X";

    return `<tr><td>${item.name}</td><td class="${cssClass}">${iconText}</td></tr>`;
  }).join("");
}

function stopMicrophones() {
  Object.values(activeMicStreams).forEach(({ stream }) => {
    stream.getTracks().forEach((track) => track.stop());
  });
  activeMicStreams = {};
}

async function attachMicrophone(deviceId) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: { exact: deviceId },
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    }
  });

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2 ** 13;
  analyser.smoothingTimeConstant = 0;
  audioContext.createMediaStreamSource(stream).connect(analyser);

  return { analyser, stream };
}

async function initializeMicrophones() {
  if (!audioContext) audioContext = new AudioContext();
  await audioContext.resume();
  stopMicrophones();

  activeMicStreams = {
    laptop: await attachMicrophone(audioSelectors.micLaptop.value),
    headset: await attachMicrophone(audioSelectors.micHeadset.value)
  };
}

async function playFrequencyTone(freq, panValue, sinkId) {
  const toneCtx = new AudioContext();
  try {
    if (sinkId && toneCtx.setSinkId) {
      await toneCtx.setSinkId(sinkId);
    }
  } catch (err) {
    selectOne("#auNote").textContent = "Couldn’t route to that output: " + err.message;
  }

  const osc = toneCtx.createOscillator();
  const gain = toneCtx.createGain();
  const panner = toneCtx.createStereoPanner();

  osc.type = "sine";
  osc.frequency.value = freq;
  panner.pan.value = panValue;
  gain.gain.setValueAtTime(0, toneCtx.currentTime);
  gain.gain.linearRampToValueAtTime(TEST_TONE_GAIN, toneCtx.currentTime + 0.01);

  osc.connect(gain).connect(panner).connect(toneCtx.destination);
  osc.start();

  // Return a cleanup callback function to stop the tone
  return () => {
    const curTime = toneCtx.currentTime;
    gain.gain.cancelScheduledValues(curTime);
    gain.gain.setValueAtTime(TEST_TONE_GAIN, curTime);
    gain.gain.linearRampToValueAtTime(0, curTime + 0.01);
    osc.stop(curTime + 0.02);
    setTimeout(() => toneCtx.close(), 150);
  };
}

async function playHeadsetJingle(panValue, sinkId) {
  const jingleCtx = new AudioContext();
  try {
    if (sinkId && jingleCtx.setSinkId) {
      await jingleCtx.setSinkId(sinkId);
    }
  } catch (err) {
    selectOne("#auNote").textContent = "Couldn’t route to that output: " + err.message;
  }

  const masterGain = jingleCtx.createGain();
  const panner = jingleCtx.createStereoPanner();
  panner.pan.value = panValue;
  masterGain.gain.value = 0.35;
  masterGain.connect(panner).connect(jingleCtx.destination);

  const notes = [262, 330, 392]; // C4, E4, G4 triad
  notes.forEach((freq, idx) => {
    const osc = jingleCtx.createOscillator();
    const noteGain = jingleCtx.createGain();
    const noteStart = jingleCtx.currentTime + 0.25 * idx;

    osc.frequency.value = freq;
    osc.connect(noteGain).connect(masterGain);

    noteGain.gain.setValueAtTime(0, noteStart);
    noteGain.gain.linearRampToValueAtTime(1, noteStart + 0.01);
    noteGain.gain.setValueAtTime(1, noteStart + 0.19);
    noteGain.gain.linearRampToValueAtTime(0, noteStart + 0.2);

    osc.start(noteStart);
    osc.stop(noteStart + 0.21);
  });

  await sleep(900);
  jingleCtx.close();
}

function calculateFrequencyLevels(analyser, targetFreq) {
  const binCount = analyser.frequencyBinCount;
  const frequencyData = new Float32Array(binCount);
  analyser.getFloatFrequencyData(frequencyData);

  const targetBin = Math.round(targetFreq / (audioContext.sampleRate / 2 / binCount));
  let peakSignal = -300;
  let noiseSum = 0;
  let noiseSampleCount = 0;

  for (let bin = Math.max(0, targetBin - 2); bin <= Math.min(binCount - 1, targetBin + 2); bin++) {
    peakSignal = Math.max(peakSignal, frequencyData[bin]);
  }

  for (let bin = Math.max(1, targetBin - 60); bin <= Math.min(binCount - 1, targetBin + 60); bin++) {
    if (Math.abs(bin - targetBin) > 8) {
      noiseSum += frequencyData[bin];
      noiseSampleCount++;
    }
  }

  return {
    targetLevel: peakSignal,
    prominence: peakSignal - noiseSum / noiseSampleCount
  };
}

audioSelectors.micLaptop.onchange = audioSelectors.micHeadset.onchange = stopMicrophones;

selectOne("#btnDev").onclick = async () => {
  try {
    const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    permissionStream.getTracks().forEach((track) => track.stop());

    const deviceList = await navigator.mediaDevices.enumerateDevices();

    const fillDropdown = (selectElement, deviceKind, preferHeadset) => {
      const matchingDevices = deviceList.filter((dev) => dev.kind === deviceKind);
      selectElement.innerHTML =
        matchingDevices
          .map((dev) => `<option value="${dev.deviceId}">${dev.label || deviceKind}</option>`)
          .join("") || '<option value="">(none found)</option>';

      const headsetIndex = matchingDevices.findIndex((dev) =>
        /head(set|phone)|usb|bluetooth|hands-free/i.test(dev.label)
      );
      const defaultIndex = matchingDevices.findIndex(
        (dev) =>
          !/head(set|phone)|usb|bluetooth|hands-free/i.test(dev.label) &&
          dev.deviceId !== "communications"
      );

      const targetIndex = preferHeadset ? headsetIndex : defaultIndex;
      if (targetIndex >= 0) {
        selectElement.value = matchingDevices[targetIndex].deviceId;
      }
    };

    fillDropdown(audioSelectors.speakerLaptop, "audiooutput", false);
    fillDropdown(audioSelectors.micLaptop, "audioinput", false);
    fillDropdown(audioSelectors.speakerHeadset, "audiooutput", true);
    fillDropdown(audioSelectors.micHeadset, "audioinput", true);

    stopMicrophones();
    selectOne("#btnRun").disabled = false;
    selectOne("#auNote").textContent =
      "setSinkId" in AudioContext.prototype
        ? "Check that each box points at the right device, then run the test."
        : "This browser can’t choose output devices, so tones will play on the default output only. Chrome or Edge works best.";
  } catch (err) {
    selectOne("#auNote").textContent = "Microphone access was blocked: " + err.message;
  }
};

const sleep = (durationMs) => new Promise((resolve) => setTimeout(resolve, durationMs));

async function sampleMicrophoneLevels(frequency, durationMs) {
  const peakReadings = {
    laptop: [],
    headset: []
  };
  for (let elapsed = 0; elapsed < durationMs; elapsed += 60) {
    await sleep(60);
    for (const micType of ["laptop", "headset"]) {
      peakReadings[micType].push(
        calculateFrequencyLevels(activeMicStreams[micType].analyser, frequency)
      );
    }
  }
  return peakReadings;
}

const DETECTION_THRESHOLD = 12;
const BACKGROUND_SAMPLE_MS = 480;
const TONE_SAMPLE_MS = 900;
const TONE_SETTLE_MS = 240;

function detectedTone(toneSamples, backgroundSamples) {
  const backgroundPeak = Math.max(...backgroundSamples.map(({ targetLevel }) => targetLevel));
  return toneSamples.some(
    ({ targetLevel, prominence }) =>
      targetLevel - backgroundPeak >= DETECTION_THRESHOLD &&
      prominence >= DETECTION_THRESHOLD
  );
}

async function testSpeaker(item) {
  item.status = "running";
  renderAudioResultsTable();

  const backgroundLevels = await sampleMicrophoneLevels(TEST_TONE_FREQUENCY, BACKGROUND_SAMPLE_MS);
  const stopTone = await playFrequencyTone(
    TEST_TONE_FREQUENCY,
    STEREO_PAN[item.channel],
    audioSelectors.speakerLaptop.value
  );

  let toneLevels;
  try {
    await sleep(TONE_SETTLE_MS);
    toneLevels = await sampleMicrophoneLevels(TEST_TONE_FREQUENCY, TONE_SAMPLE_MS);
  } finally {
    stopTone();
  }

  const heardBy = {
    laptop: detectedTone(toneLevels.laptop, backgroundLevels.laptop),
    headset: detectedTone(toneLevels.headset, backgroundLevels.headset)
  };
  item.status = heardBy.laptop || heardBy.headset;
  renderAudioResultsTable();
  await sleep(300);

  return heardBy;
}

function updateMicrophoneResults(confirmedDetections) {
  AUDIO_ITEMS.filter((item) => item.type === "mic").forEach((item) => {
    item.status = confirmedDetections[item.device] > 0;
  });
}

async function runAudioTest() {
  const runButton = selectOne("#btnRun");
  const noteElement = selectOne("#auNote");
  runButton.disabled = true;

  try {
    await initializeMicrophones();
  } catch (err) {
    noteElement.textContent = "Couldn’t open microphones: " + err.message;
    runButton.disabled = false;
    return;
  }

  noteElement.textContent =
    audioSelectors.micLaptop.value === audioSelectors.micHeadset.value
      ? "Both microphones are the same device. Pick different ones for a meaningful result."
      : "";

  AUDIO_ITEMS.forEach((item) => (item.status = null));
  renderAudioResultsTable();

  const confirmedDetections = { laptop: 0, headset: 0 };
  for (const item of AUDIO_ITEMS.filter((audioItem) => audioItem.type === "speaker")) {
    const heardBy = await testSpeaker(item);
    if (heardBy.laptop) confirmedDetections.laptop++;
    if (heardBy.headset) confirmedDetections.headset++;
  }

  updateMicrophoneResults(confirmedDetections);
  renderAudioResultsTable();
  runButton.disabled = false;
  selectOne("#auSkip").hidden = false;

  const allPassed = AUDIO_ITEMS.every((item) => item.status === true);
  noteElement.textContent = allPassed
    ? ""
    : "Some items weren’t confirmed against the measured background. You can run the test again or continue. Headset speakers are checked with the jingle button.";

  if (allPassed) {
    completeSection("audio", true, "camera");
  }
}

selectOne("#btnRun").onclick = runAudioTest;

selectOne("#btnHs").onclick = async (evt) => {
  const triggerBtn = evt.currentTarget;
  const headsetOutputId = audioSelectors.speakerHeadset.value;

  triggerBtn.disabled = true;
  await playHeadsetJingle(-1, headsetOutputId);
  await sleep(200);
  await playHeadsetJingle(1, headsetOutputId);
  triggerBtn.disabled = false;
};

selectOne("#auSkip").onclick = () => continueToNext("audio", "camera");

setTimeout(() => {
  selectOne("#auSkip").hidden = false;
}, 20000);

renderAudioResultsTable();

// --- Camera Logic ---
let isCameraActive = false;

new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !isCameraActive) {
      isCameraActive = true;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          selectOne("#camera-video").srcObject = stream;
          selectOne("#camNote").textContent = "";
        })
        .catch((err) => {
          selectOne("#camNote").textContent = "Couldn’t open the camera: " + err.message;
        });
    }
  },
  { threshold: 0.5 }
).observe(selectOne("#camera"));

selectOne("#camOk").onclick = () => completeSection("camera", true, "drivers", true);
selectOne("#camBad").onclick = () => completeSection("camera", false, "drivers", true);

// --- Driver Links & Final Summary ---
const linksClickedTracker = {};
const driverLinks = [
  ["lsb", "serviceBridgeDownloaded"],
  ["sup", "supportPageVisited"]
];

for (const [elementId, linkKey] of driverLinks) {
  selectOne("#" + elementId).addEventListener("click", () => {
    linksClickedTracker[linkKey] = true;
    if (linksClickedTracker.serviceBridgeDownloaded && linksClickedTracker.supportPageVisited) {
      testState.drivers = true;
      selectOne('.chip[data-s="drivers"]').classList.add("ok");
      updateGlobalStatusBar();
    }
  });
}

renderSummary();