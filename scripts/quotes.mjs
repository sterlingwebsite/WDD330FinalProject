// Fetch and store quotes

import { storage } from "./storage.mjs";

const QUOTE_KEY = "dailyQuote";
const QUOTE_DATE_KEY = "dailyQuoteDate";

const quoteTextEl = document.querySelector(".quote-text");
const quoteAuthorEl = document.querySelector(".quote-author");

function isToday(dateString) {
  const today = new Date().toDateString();
  return dateString === today;
}

async function fetchLocalQuote() {
  // I wish I could use this because the author may update it with additional or more correct quotes, 
  // but I can't because it goes over my assignment 500 kB network transferred limit.
  // Maybe I'll refresh my quotes.json every once in a while.
  // const remoteUrl =
  //   "https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json";
  // webpage: https://github.com/JamesFT/Database-Quotes-JSON/blob/master/quotes.json
  // try {
  //   console.log("Attempting remote quote fetch...");
  //   const remoteResponse = await fetch(remoteUrl, { cache: "no-store" });
  //   if (remoteResponse.ok) {
  //     console.log("✔ Remote quotes loaded successfully.");
  //     const remoteData = await remoteResponse.json();
  //     const random = remoteData[Math.floor(Math.random() * remoteData.length)];

  //     return {
  //       text: random.quoteText || random.text,
  //       author: random.quoteAuthor || "Unknown",
  //     };
  //   }
  // } catch (err) {
  //   console.warn("Remote quotes unavailable, using local file.");
  // }

  try {
    const response = await fetch("./data/quotes.json");
    const quotes = await response.json();

    const random = quotes[Math.floor(Math.random() * quotes.length)];

    return {
      text: random.quoteText || random.text,
      author: random.quoteAuthor || "Unknown",
    };
  } catch (err) {
    console.error("Error loading local quotes.json:", err);
    return null;
  }
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

  const newQuote = await fetchLocalQuote();

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
