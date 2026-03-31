// Checklist logic

import { storage } from "./storage.mjs";
import { renderChecklist } from "./ui.mjs";

let checklist = [];
let listEl = null;

export function initChecklist() {
  listEl = document.querySelector("#checklist-items");
  const addBtn = document.querySelector("#add-task-btn");

  if (!listEl || !addBtn) {
    console.warn("Checklist UI not found in DOM yet.");
    return;
  }

  checklist = storage.load("checklist", []);

  renderChecklist(checklist, listEl);

  addBtn.addEventListener("click", handleAddTask);

  listEl.addEventListener("click", handleListClick);
}

function handleAddTask() {
  const text = prompt("Enter a task:");

  if (!text || text.trim() === "") return;

  const newTask = {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };

  checklist.push(newTask);
  saveAndRender();
}

function handleListClick(e) {
  const id = Number(e.target.dataset.id);

  if (e.target.matches("input[type='checkbox']")) {
    const task = checklist.find(t => t.id === id);
    if (task) task.completed = e.target.checked;
    saveAndRender();
  }

  if (e.target.matches(".delete-task")) {
    checklist = checklist.filter(t => t.id !== id);
    saveAndRender();
  }
}

function saveAndRender() {
  storage.save("checklist", checklist);
  renderChecklist(checklist, listEl);
}
