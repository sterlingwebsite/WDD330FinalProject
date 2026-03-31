// Habit logic

import { storage } from "./storage.mjs";
import { renderHabits } from "./ui.mjs";

const HABIT_KEY = "habits";
const HABIT_RESET_KEY = "habitsLastReset";

function shouldResetToday() {
  const today = new Date().toISOString().slice(0, 10);
  const lastReset = storage.load(HABIT_RESET_KEY, null);

  return lastReset !== today;
}

function markResetDone() {
  const today = new Date().toISOString().slice(0, 10);
  storage.save(HABIT_RESET_KEY, today);
}

export function createHabit(name) {
  return {
    id: crypto.randomUUID(),
    name,
    completedToday: false,
    streak: 0,
    lastCompletedDate: null,
    createdAt: new Date().toISOString(),
    archived: false,
    color: null,
  };
}

export function loadHabits() {
  return storage.load(HABIT_KEY, []);
}

export function saveHabits(habits) {
  storage.save(HABIT_KEY, habits);
}

export function updateStreak(habit) {
  const today = new Date().toISOString().slice(0, 10);
  const last = habit.lastCompletedDate;

  if (last === today) return habit;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (last === yesterday) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.completedToday = true;
  habit.lastCompletedDate = today;

  return habit;
}

export function resetDaily(habits) {
  const today = new Date().toISOString().slice(0, 10);

  habits.forEach((habit) => {
    if (habit.lastCompletedDate !== today) {
      habit.completedToday = false;
    }
  });

  return habits;
}

export function initHabits() {
  let habits = loadHabits();

  if (shouldResetToday()) {
    habits = resetDaily(habits);
    saveHabits(habits);
    markResetDone();
  }

  const list = document.getElementById("habit-list");
  const addBtn = document.getElementById("add-habit-btn");

  if (!list || !addBtn) return;

  renderHabits(habits, list);

  addBtn.addEventListener("click", () => {
    const name = prompt("Enter a new habit:");
    if (!name) return;

    habits.push(createHabit(name));
    saveHabits(habits);
    renderHabits(habits, list);
  });

  list.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox']")) {
      const id = e.target.dataset.id;
      const habit = habits.find((h) => h.id === id);

      updateStreak(habit);
      saveHabits(habits);
      renderHabits(habits, list);
    }
  });

  list.addEventListener("click", (e) => {
    if (e.target.matches(".delete-habit")) {
      const id = e.target.dataset.id;
      habits = habits.filter((h) => h.id !== id);

      saveHabits(habits);
      renderHabits(habits, list);
    }
  });
}
