// Fetch time, run clock, run countdown

import { storage } from "./storage.mjs";
import { updateCountdown } from "./ui.mjs";

const RAPIDAPI_KEY = "e6cf1c37aamsh23befa31ac98258p1b7505jsn9fabadfc4a02";

export async function fetchCurrentTime() {
  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const url = `https://world-time-api3.p.rapidapi.com/timezone/${userZone}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "world-time-api3.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("RapidAPI time error");

    const data = await response.json();
    return data.datetime;
  } catch (err) {
    console.error("RapidAPI time fetch failed:", err);
    return null;
  }
}

export function startClock(initialDatTime, updateCallback) {
  let current = new Date(initialDatTime);

  updateCallback(current);

  setInterval(() => {
    current = new Date(current.getTime() + 1000);
    updateCallback(current);
  }, 1000);
}

export function startCountdown(targetDateTime, updateCallback, finishCallback) {
  const target = new Date(targetDateTime);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(interval);
      finishCallback();
      return;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    updateCallback({ days, hours, minutes, seconds });
  }, 1000);
}

export async function initTime(updateClockUI) {
  let datetime = await fetchCurrentTime();

  if (!datetime) {
    console.warn("Falling back to system time.");
    datetime = new Date().toISOString();
  }

  startClock(datetime, updateClockUI);
}

export function initCountdown() {
  const saved = storage.load("deadline");

  if (saved) {
    startCountdown(saved, updateCountdown, () => {
      document.querySelector("#countdown").textContent = "Time's up!";
    });
  }
}

export function setupDeadLineControls() {
  const input = document.querySelector("#deadline-input");
  const button = document.querySelector("#set-deadline");

  if (!input || !button) return;

  button.addEventListener("click", () => {
    const value = input.value;
    if (!value) return;

    storage.save("deadline", value);

    startCountdown(value, updateCountdown, () => {
      document.querySelector("#countdown").textContent = "Time's up!";
    });
  });
}