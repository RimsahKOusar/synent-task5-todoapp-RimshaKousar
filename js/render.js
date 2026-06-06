/*
 ╔══════════════════════════════════════════════════════════╗
 ║  render.js  –  DOM RENDERING MODULE                     ║
 ║                                                          ║
 ║  What this file does:                                    ║
 ║  Takes the array of task objects and builds the         ║
 ║  visible HTML cards on screen.                          ║
 ║                                                          ║
 ║  IMPORTANT concept – "separation of concerns":          ║
 ║  This file ONLY builds HTML. It never touches           ║
 ║  localStorage, and never listens to clicks.             ║
 ║  Those jobs belong to storage.js and events.js.         ║
 ╚══════════════════════════════════════════════════════════╝
*/


/* ── DOM ELEMENT REFERENCES ───────────────────────────────────────
   We grab these once here so every function below can use them
   without querying the DOM repeatedly (which would be slower).
   ─────────────────────────────────────────────────────────────── */
const taskListEl   = document.getElementById('taskList');
const emptyStateEl = document.getElementById('emptyState');
const counterEl    = document.getElementById('taskCounter');


/**
 * renderTasks(tasks, filter)
 * ──────────────────────────
 * Clears the task list and re-draws every visible task card.
 *
 * Why re-draw everything instead of patching?
 * For a small to-do app, re-drawing is simpler and fast enough.
 * Large apps (React, Vue) use a virtual DOM for efficiency,
 * but that's overkill here.
 *
 * @param {Array}  tasks   – full task array from storage
 * @param {string} filter  – 'all' | 'active' | 'completed'
 */
function renderTasks(tasks, filter = 'all') {

  /* ── Step 1: filter the array based on current tab ── */
  const visible = tasks.filter(task => {
    if (filter === 'active')    return !task.done;
    if (filter === 'completed') return  task.done;
    return true;   // 'all' – show everything
  });

  /* ── Step 2: clear previous cards ── */
  taskListEl.innerHTML = '';

  /* ── Step 3: show/hide empty-state message ── */
  if (visible.length === 0) {
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
  }

  /* ── Step 4: build one card per task ── */
  visible.forEach(task => {
    const card = buildCard(task);
    taskListEl.appendChild(card);
  });

  /* ── Step 5: update the counter badge ── */
  updateCounter(tasks);
}


/**
 * buildCard(task)
 * ───────────────
 * Creates one task card <div> in memory (not yet on screen).
 * We use createElement + setting properties rather than
 * innerHTML to avoid XSS (Cross-Site Scripting) attacks –
 * user-typed text is treated as plain text, not HTML.
 *
 * Card structure:
 *   <div class="task-item">
 *     <input type="checkbox" …/>
 *     <span class="task-text">Buy milk</span>
 *     <button class="btn-delete">🗑</button>
 *   </div>
 *
 * @param  {Object} task  –  { id, text, done }
 * @returns {HTMLElement}  the built card element
 */
function buildCard(task) {

  /* Outer container */
  const card = document.createElement('div');
  card.className = 'task-item';
  card.dataset.id = task.id;   // store id so event handlers can find it

  /* ── Checkbox ── */
  const checkbox = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked   = task.done;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as complete`);

  /* ── Task text ── */
  const textSpan = document.createElement('span');
  textSpan.className = task.done ? 'task-text done' : 'task-text';
  textSpan.textContent = task.text;   // .textContent is XSS-safe

  /* ── Delete button ── */
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', `Delete "${task.text}"`);

  /* Assemble: put children into parent */
  card.appendChild(checkbox);
  card.appendChild(textSpan);
  card.appendChild(deleteBtn);

  return card;
}


/**
 * updateCounter(tasks)
 * ────────────────────
 * Updates the "X tasks remaining" badge in the header.
 * "Remaining" means tasks that are NOT yet done.
 *
 * @param {Array} tasks – full task array
 */
function updateCounter(tasks) {
  const remaining = tasks.filter(t => !t.done).length;
  counterEl.textContent =
    remaining === 1 ? '1 task remaining' : `${remaining} tasks remaining`;
}
