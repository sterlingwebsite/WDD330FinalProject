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
    second: "2-digit",
  });

  dateEl.textContent = dateObj.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function updateCountdown({ days, hours, minutes, seconds }) {
  const el = document.querySelector("#countdown");
  if (!el) return;

  el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function renderHabits(habits, container) {
  container.innerHTML = "";

  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.classList.add("habit-item");

    li.innerHTML = `
    <label>
      <input type="checkbox" data-id="${habit.id}" ${habit.completedToday ? "checked" : ""}>
      <span>${habit.name}</span>
    </label>
    <span class="streak">🔥 ${habit.streak}</span>
    <button class="delete-habit" data-id="${habit.id}">✖</button>
    `;

    container.appendChild(li);
  });
}

export function renderChecklist(items, container) {
  if (!container) return;

  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("checklist-item");

    li.innerHTML = `
      <label>
        <input type="checkbox" data-id="${item.id}" ${item.completed ? "checked" : ""}>
        <span>${item.text}</span>
      </label>
      <button class="delete-task" data-id="${item.id}">✖</button>
    `;

    container.appendChild(li);
  });
}
