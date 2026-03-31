// Fetch and apply background images

import { storage } from "./storage.mjs";

const BG_KEY = "dailyBackground";
const BG_DATE_KEY = "dailyBackgroundDate";

const backgroundEl = document.querySelector(".background-image");

function isToday(dateString) {
  return dateString === new Date().toDateString();
}

async function fetchBackground() {
  console.log("Attempting Unsplash API fetch...");

  const url = `https://api.unsplash.com/photos/random?query=nature&client_id=vkul2LB10bpKEeuM8I_NnzLQIuA7XxsLig3VexClEAA`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unsplash API error");

    const data = await response.json();
    return data.urls.regular + "&w=900&q=60&fm=webp";
    // return data.urls.regular + "&q=60&auto=format";
  } catch (err) {
    console.error("Background fetch failed:", err);
    return null;
  }
}

function renderBackground(imageUrl) {
  backgroundEl.style.backgroundImage = `url('${imageUrl}')`;
}

export async function initBackground() {
  const cachedUrl = storage.load(BG_KEY);
  const cachedDate = storage.load(BG_DATE_KEY);

  if (cachedUrl && isToday(cachedDate)) {
    renderBackground(cachedUrl);
    return;
  }

  const newUrl = await fetchBackground();

  if (newUrl) {
    renderBackground(newUrl);
    storage.save(BG_KEY, newUrl);
    storage.save(BG_DATE_KEY, new Date().toDateString());
  } else {
    renderBackground("./images/fallback-bg.jpg");
  }
}
