/*
 ╔══════════════════════════════════════════════════════════╗
 ║  app.js  –  APPLICATION ENTRY POINT                     ║
 ║                                                          ║
 ║  What this file does:                                    ║
 ║  This is the last script to load (see index.html).      ║
 ║  Its only job is to BOOT the app once the page loads:   ║
 ║    1. Read any saved tasks from localStorage            ║
 ║    2. Render them on screen immediately                  ║
 ║                                                          ║
 ║  All other logic lives in storage.js, render.js,        ║
 ║  and events.js. Keeping app.js tiny makes it easy       ║
 ║  to see "where does the app start?"                     ║
 ╚══════════════════════════════════════════════════════════╝
*/


/**
 * init()
 * ──────
 * Called once when the page finishes loading.
 * Loads saved tasks and draws them.
 */
function init() {
  const savedTasks = getTasks();       // from storage.js
  renderTasks(savedTasks, 'all');      // from render.js
}


/* Run init when the entire page DOM is ready */
document.addEventListener('DOMContentLoaded', init);
