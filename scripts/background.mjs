import { storage } from "./storage.mjs";

const BG_KEY = "dailyBackground";
const BG_DATE_KEY = "dailyBackgroundDate";

const backgroundEl = document.querySelector(".background-image");

function isToday(dateString) {
  return dateString === new Date().toDateString();
}

async function fetchBackground() {
  const url = "https://source.unsplash.com/1600x900/?nature";

  try {
    const response = await fetch(url, { method: "HEAD" });

    return response.url;
  } catch (error) {
    console.error("Background fetch failed:", error);
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
