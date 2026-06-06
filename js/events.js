/*
 ╔══════════════════════════════════════════════════════════╗
 ║  events.js  –  USER INTERACTION MODULE                  ║
 ║                                                          ║
 ║  What this file does:                                    ║
 ║  Listens for every user action (clicks, keyboard)       ║
 ║  and decides what to do:                                ║
 ║    • Add a task                                          ║
 ║    • Toggle a task done/undone                           ║
 ║    • Delete a task                                       ║
 ║    • Switch the filter tab                               ║
 ║    • Clear all completed tasks                           ║
 ║                                                          ║
 ║  After any change, it saves to storage and re-renders.  ║
 ╚══════════════════════════════════════════════════════════╝
*/


/* ── DOM REFERENCES ───────────────────────────────────────────────
   Elements we need to attach listeners to.
   ─────────────────────────────────────────────────────────────── */
const addBtnEl      = document.getElementById('addBtn');
const taskInputEl   = document.getElementById('taskInput');
const inputErrorEl  = document.getElementById('inputError');
const clearDoneBtnEl = document.getElementById('clearDoneBtn');
const filterBtns    = document.querySelectorAll('.filter-btn');

/* Current active filter – starts as 'all' */
let activeFilter = 'all';


/* ══════════════════════════════════════════════════════════
   EVENT: Add task – button click
   ══════════════════════════════════════════════════════════ */
addBtnEl.addEventListener('click', handleAddTask);


/* ══════════════════════════════════════════════════════════
   EVENT: Add task – pressing Enter inside the input
   ══════════════════════════════════════════════════════════ */
taskInputEl.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') handleAddTask();
});


/**
 * handleAddTask()
 * ───────────────
 * Reads the input field, validates it, creates a task object,
 * adds it to the saved array, then re-renders.
 */
function handleAddTask() {
  /* .trim() removes whitespace from both ends of the string */
  const text = taskInputEl.value.trim();

  /* Validation: don't allow empty tasks */
  if (!text) {
    showError();
    return;   // stop here – don't add
  }

  hideError();

  /*
   * Task object shape:
   *   id   – Date.now() gives a unique-enough number (ms since 1970)
   *   text – what the user typed
   *   done – starts as false
   */
  const newTask = {
    id:   Date.now(),
    text: text,
    done: false,
  };

  /* Read current tasks → add new one → save → re-render */
  const tasks = getTasks();
  tasks.unshift(newTask);        // unshift adds to the FRONT of the array
  saveTasks(tasks);
  renderTasks(tasks, activeFilter);

  /* Clear the input so the user can type the next task */
  taskInputEl.value = '';
  taskInputEl.focus();
}


/* ══════════════════════════════════════════════════════════
   EVENT: Toggle / Delete  –  clicks inside the task list
   ══════════════════════════════════════════════════════════

   "Event delegation" technique:
   Instead of attaching a listener to every card
   (which would be slow), we attach ONE listener to the
   parent list, and check what was clicked.
   ══════════════════════════════════════════════════════════ */
document.getElementById('taskList').addEventListener('click', function (event) {
  const target = event.target;

  /* Find the card that contains the clicked element */
  const card = target.closest('.task-item');
  if (!card) return;

  /* Read the task id stored in the card's data-id attribute */
  const id = Number(card.dataset.id);

  /* Was it the checkbox? → toggle done */
  if (target.classList.contains('task-checkbox')) {
    toggleTask(id);
  }

  /* Was it the delete button? → remove task */
  if (target.classList.contains('btn-delete')) {
    deleteTask(id);
  }
});


/**
 * toggleTask(id)
 * ──────────────
 * Flips the done/undone state of a task.
 * Array.map() creates a NEW array – we don't mutate the old one.
 */
function toggleTask(id) {
  const tasks = getTasks().map(task =>
    task.id === id ? { ...task, done: !task.done } : task
    //               ↑ spread operator copies all properties,
    //                 then overrides just `done`
  );
  saveTasks(tasks);
  renderTasks(tasks, activeFilter);
}


/**
 * deleteTask(id)
 * ──────────────
 * Removes a task from the array by filtering it out.
 * Array.filter() returns a new array without the matched item.
 */
function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks);
  renderTasks(tasks, activeFilter);
}


/* ══════════════════════════════════════════════════════════
   EVENT: Filter tabs – All / Active / Completed
   ══════════════════════════════════════════════════════════ */
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    /* Remove .active from all buttons, add to clicked one */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Update the current filter and re-render */
    activeFilter = btn.dataset.filter;
    renderTasks(getTasks(), activeFilter);
  });
});


/* ══════════════════════════════════════════════════════════
   EVENT: Clear completed button
   ══════════════════════════════════════════════════════════ */
clearDoneBtnEl.addEventListener('click', function () {
  /* Keep only tasks that are NOT done */
  const tasks = getTasks().filter(task => !task.done);
  saveTasks(tasks);
  renderTasks(tasks, activeFilter);
});


/* ══════════════════════════════════════════════════════════
   HELPER: Error message show / hide
   ══════════════════════════════════════════════════════════ */

function showError() {
  inputErrorEl.classList.remove('hidden');
  /* Force re-trigger the shake animation: remove, reflow, add */
  inputErrorEl.style.animation = 'none';
  void inputErrorEl.offsetHeight;   // trigger reflow
  inputErrorEl.style.animation = '';
}

function hideError() {
  inputErrorEl.classList.add('hidden');
}

/* Hide error as soon as the user starts typing */
taskInputEl.addEventListener('input', hideError);
