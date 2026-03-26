import { storage } from "./storage.mjs";

const QUOTE_KEY = "dailyQuote";
const QUOTE_DATE_KEY = "dailyQuoteDate";

const quoteTextEl = document.querySelector(".quote-text");
const quoteAuthorEl = document.querySelector(".quote-author");

async function fetchQuote() {
  const localUrl = "./data/quotes.json";
  const remoteUrl =
    "https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json";
  // webpage: https://github.com/JamesFT/Database-Quotes-JSON/blob/master/quotes.json

  try {
    console.log("Attempting remote quote fetch...");
    const remoteResponse = await fetch(remoteUrl, { cache: "no-store" });
    if (remoteResponse.ok) {
      console.log("✔ Remote quotes loaded successfully.");
      const remoteData = await remoteResponse.json();
      const random = remoteData[Math.floor(Math.random() * remoteData.length)];

      return {
        text: random.quoteText || random.text,
        author: random.quoteAuthor || "Unknown",
      };
    }
  } catch (err) {
    console.warn("Remote quotes unavailable, using local file.");
  }

  try {
    const localResponse = await fetch(localUrl);
    const localData = await localResponse.json();
    const random = localData[Math.floor(Math.random() * localData.length)];
    console.log("✔ Using local quotes.json fallback.");

    return {
      text: random.quoteText,
      author: random.quoteAuthor || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}

function isToday(dateString) {
  const today = new Date().toDateString();
  return dateString === today;
}

function renderQuote(quote) {
  quoteTextEl.textContent = quote.text;
  quoteAuthorEl.textContent = `- ${quote.author}`;
}

export async function initQuotes() {
  const cachedQuote = storage.load(QUOTE_KEY);
  const cachedDate = storage.load(QUOTE_DATE_KEY);

  if (cachedQuote && isToday(cachedDate)) {
    renderQuote(cachedQuote);
    return;
  }

  const newQuote = await fetchQuote();

  if (newQuote) {
    renderQuote(newQuote);
    storage.save(QUOTE_KEY, newQuote);
    storage.save(QUOTE_DATE_KEY, new Date().toDateString());
  } else {
    renderQuote({
      text: "Stay positive, work hard, make it happen.",
      author: "Unknown",
    });
  }
}
