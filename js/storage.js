/*
 ╔══════════════════════════════════════════════════════════╗
 ║  storage.js  –  LOCAL STORAGE MODULE                    ║
 ║                                                          ║
 ║  What this file does:                                    ║
 ║  Provides two simple functions that read and write      ║
 ║  the task list to localStorage.                         ║
 ║                                                          ║
 ║  localStorage is a key-value store built into every     ║
 ║  browser. Data survives page refreshes.                 ║
 ║                                                          ║
 ║  We always store tasks as JSON text because             ║
 ║  localStorage only understands strings.                 ║
 ╚══════════════════════════════════════════════════════════╝
*/


/* ── CONSTANT: storage key name ──────────────────────────────────
   We use a constant so we never mis-type the key string.
   ─────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'taskflow_tasks';


/**
 * getTasks()
 * ──────────
 * Reads the saved task array from localStorage.
 *
 * How it works:
 *  1. localStorage.getItem(key) → returns a JSON string  OR  null
 *  2. If null (nothing saved yet), return empty array []
 *  3. JSON.parse() converts the JSON string back to a JS array
 *
 * Returns: Array of task objects  e.g.
 *   [ { id: 1234, text: "Buy milk", done: false }, ... ]
 */
function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];              // first visit – no data yet
  return JSON.parse(raw);           // convert JSON string → array
}


/**
 * saveTasks(tasks)
 * ────────────────
 * Writes the task array into localStorage.
 *
 * How it works:
 *  1. JSON.stringify() converts the JS array to a JSON string
 *  2. localStorage.setItem() saves that string under our key
 *
 * @param {Array} tasks  –  the full task array to save
 */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
