// Orchestrates everything

import { initQuotes } from "./quotes.mjs";
import { initBackground } from "./background.mjs";
import { initTime, initCountdown, setupDeadLineControls } from "./time.mjs";
import { initHabits } from "./habits.mjs";
import { initChecklist } from "./checklist.mjs";
import { initSettings } from "./settings.mjs";
import { storage } from "./storage.mjs";
import { renderUI, updateClock } from "./ui.mjs";

export function initApp() {
  initQuotes();
  initBackground();
  initTime(updateClock);
  initCountdown();
  setupDeadLineControls();
  initHabits();
  initChecklist();
  initSettings();
  renderUI();
}

initApp();
