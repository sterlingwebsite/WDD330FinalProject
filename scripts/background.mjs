// Fetch and apply background images

import { storage } from "./storage.mjs";

const backgroundEl = document.querySelector(".background-image");

function isToday(dateString) {
  return dateString === new Date().toDateString();
}

function BG_KEY(category) {
  return `bg_${category}_url`;
}

function BG_DATE_KEY(category) {
  return `bg_${category}_date`;
}

async function fetchBackground(category) {
  console.log(`Fetching Unsplash image for category: ${category}`);

  const url = `https://api.unsplash.com/photos/random?query=${category}&client_id=vkul2LB10bpKEeuM8I_NnzLQIuA7XxsLig3VexClEAA`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unsplash API error");

    const data = await response.json();
    return data.urls.regular + "&w=900&q=60&fm=webp";
    // return data.urls.regular + "&q=60&auto=format"; // optional for quality instead of width
  } catch (err) {
    console.error("Background fetch failed:", err);
    return null;
  }
}

function renderBackground(imageUrl) {
  backgroundEl.style.backgroundImage = `url('${imageUrl}')`;
}

async function getBackgroundForCategory(category) {
  const urlKey = BG_KEY(category);
  const dateKey = BG_DATE_KEY(category);

  const cachedUrl = storage.load(urlKey);
  const cachedDate = storage.load(dateKey);

  if (cachedUrl && isToday(cachedDate)) {
    return cachedUrl;
  }

  const newUrl = await fetchBackground(category);

  if (newUrl) {
    storage.save(urlKey, newUrl);
    storage.save(dateKey, new Date().toDateString());
    return newUrl;
  }

  return "./images/fallback-bg.jpg";
}

export async function initBackground() {
  const category = storage.load("backgroundCategory", "nature");

  const url = await getBackgroundForCategory(category);
  renderBackground(url);
}
