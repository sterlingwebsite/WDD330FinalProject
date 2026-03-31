// Updates the DOM

export function renderUI() {
  // will handle UI updates later
}

export function updateClock(dateObj) {
  const timeEl = document.querySelector(".time-display");
  const dateEl = document.querySelector(".date-display");

  if (!timeEl || !dateEl) return;

  timeEl.textContent = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  dateEl.textContent = dateObj.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

export function updateCountdown({ days, hours, minutes, seconds }) {
  const el = document.querySelector("#countdown");
  if (!el) return;

  el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}