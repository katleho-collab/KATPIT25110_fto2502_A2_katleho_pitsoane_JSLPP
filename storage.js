/**
 * @module Storage
 * @description Handles local storage operations and API fetching for tasks in the Kanban app.
 */

/** @type {Array<Object>} */
let tasks = [];

/**
 * Saves the tasks array to local storage.
 * @function
 */
export function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Loads tasks from local storage.
 * @function
 * @returns {Array<Object>} The array of tasks from local storage.
 */
export function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
}

/**
 * Updates the tasks array and saves to local storage.
 * @function
 * @param {Array<Object>} newTasks - The updated tasks array.
 */
export function updateTasks(newTasks) {
  tasks = newTasks;
  saveTasks();
}

/**
 * Fetches tasks from the API and updates local storage.
 * @function
 * @async
 * @param {HTMLElement} loadingMessage - The element to show loading state.
 * @param {HTMLElement} errorMessage - The element to show error state.
 * @returns {Promise<void>}
 */
export async function fetchTasksFromAPI(loadingMessage, errorMessage) {
  loadingMessage.style.display = 'block';
  errorMessage.style.display = 'none';
  try {
    const response = await fetch('https://jsl-kanban-api.vercel.app/');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    tasks = await response.json();
    tasks = tasks.map(task => ({
      ...task,
      priority: task.priority || 'Medium'
    }));
    saveTasks();
  } catch (error) {
    errorMessage.style.display = 'block';
    if (tasks.length === 0) {
      tasks = [];
      saveTasks();
    }
  } finally {
    loadingMessage.style.display = 'none';
  }
}

/**
 * Gets the current tasks array.
 * @function
 * @returns {Array<Object>} The current tasks array.
 */
export function getTasks() {
  return tasks;
}