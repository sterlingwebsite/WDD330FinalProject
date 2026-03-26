import { initQuotes } from "./quotes.mjs";
import { initBackground } from "./background.mjs";
import { initTime } from "./time.mjs";
import { initHabits } from "./habits.mjs";
import { initChecklist } from "./checklist.mjs";
import { initSettings } from "./settings.mjs";
import { storage } from "./storage.mjs";
import { renderUI } from "./ui.mjs";

export function initApp() {
  initQuotes();
  initBackground();
  initTime();
  initHabits();
  initChecklist();
  initSettings();
  renderUI();
}

initApp();
