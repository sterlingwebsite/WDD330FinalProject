// Theme, layout, and preferences logic

import { storage } from "./storage.mjs";
import { initBackground } from "./background.mjs";

const SETTINGS_KEY = "userSettings";

const defaultSettings = {
  theme: "light",
  color: "blue",
  backgroundCategory: "nature",
};

export function loadSettings() {
  return storage.load(SETTINGS_KEY, defaultSettings);
}

export function saveSettings(settings) {
  storage.save(SETTINGS_KEY, settings);
}

export function applySettings(settings) {
  document.documentElement.setAttribute("data-theme", settings.theme);

  document.documentElement.style.setProperty("--accent-color", settings.color);

  storage.save("backgroundCategory", settings.backgroundCategory);
}

export function initSettings() {
  const settings = loadSettings();
  applySettings(settings);

  const themeToggle = document.querySelector("#theme-toggle");
  const colorOptions = document.querySelector("#color-options");
  const bgCategoryEl = document.querySelector("#background-category");

  if (!themeToggle || !colorOptions) return;

  themeToggle.innerHTML = `
    <label>
      <input type="checkbox" id="theme-checkbox" ${settings.theme === "dark" ? "checked" : ""}>
      Dark Mode
    </label>
  `;

  document.querySelector("#theme-checkbox").addEventListener("change", (e) => {
    settings.theme = e.target.checked ? "dark" : "light";
    saveSettings(settings);
    applySettings(settings);
  });

  const colors = ["blue", "green", "purple", "orange", "red"];

  colorOptions.innerHTML = `
    <h3>Accent Color</h3>
    <div class="color-palette">
      ${colors
      .map(
        (c) => `
        <button class="color-swatch"
                data-color="${c}"
                style="background:${c}; border:${settings.color === c ? "3px solid black" : "none"}">
        </button>
      `
        )
        .join("")}
    </div>
  `;

  document.querySelectorAll(".color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.color = btn.dataset.color;
      saveSettings(settings);
      applySettings(settings);
      initSettings();
    });
  });

  if (bgCategoryEl) {
    bgCategoryEl.innerHTML = `
      <h3>Background Category</h3>
      <select id="bg-select">
        <option value="nature">Nature</option>
        <option value="city">City</option>
        <option value="space">Space</option>
        <option value="abstract">Abstract</option>
      </select>
    `;

    const select = document.querySelector("#bg-select");
    select.value = settings.backgroundCategory;

    select.addEventListener("change", (e) => {
      settings.backgroundCategory = e.target.value;
      saveSettings(settings);
      applySettings(settings);
      initBackground();
    });
  }
}
