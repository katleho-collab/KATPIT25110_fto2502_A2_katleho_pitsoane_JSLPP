// Load tasks from localStorage or initialize empty
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTask = null;
let isEditing = false;

// DOM elements for the modal, messages, and sidebar
const modal = document.getElementById('task-modal');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const statusSelect = document.getElementById('task-status');
const closeModalBtn = document.getElementById('close-modal');
const saveChangesBtn = document.getElementById('save-changes');
const deleteTaskBtn = document.getElementById('delete-task');
const newTaskBtn = document.getElementById('new-task-btn');
const themeToggle = document.getElementById('theme-toggle');
const logo = document.getElementById('logo');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const sidebar = document.getElementById('side-bar-div');
const hideSidebarBtn = document.querySelector('.hide-sidebar');

/**
 * Saves the tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Renders all tasks into their respective columns based on status.
 */
function renderTasks() {
  const columns = {
    'todo': document.querySelector('.column-div[data-status="todo"] .tasks-container'),
    'doing': document.querySelector('.column-div[data-status="doing"] .tasks-container'),
    'done': document.querySelector('.column-div[data-status="done"] .tasks-container')
  };

  // Clear existing tasks in all columns
  Object.values(columns).forEach(column => column.innerHTML = '');

  // Calculate task counts
  const todoCount = tasks.filter(task => task.status === 'todo').length;
  const doingCount = tasks.filter(task => task.status === 'doing').length;
  const doneCount = tasks.filter(task => task.status === 'done').length;

  // Update the headers with counts
  document.getElementById('toDoText').textContent = `TODO (${todoCount})`;
  document.getElementById('doingText').textContent = `DOING (${doingCount})`;
  document.getElementById('doneText').textContent = `DONE (${doneCount})`;

  // Add each task to the right column
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    taskDiv.textContent = task.title;
    taskDiv.addEventListener('click', () => openModal(task, true));
    columns[task.status].appendChild(taskDiv);
  });
}

/**
 * Fetches tasks from the API and updates localStorage on every load.
 */
async function fetchTasks() {
  loadingMessage.style.display = 'block';
  errorMessage.style.display = 'none';
  try {
    const response = await fetch('https://jsl-kanban-api.vercel.app/');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    tasks = await response.json();
    saveTasks(); // Save API data to localStorage
    renderTasks();
  } catch (error) {
    errorMessage.style.display = 'block';
    // No fallback to hard-coded tasks; rely on localStorage or empty state
    if (tasks.length === 0) {
      tasks = [];
      saveTasks();
    }
    renderTasks();
  } finally {
    loadingMessage.style.display = 'none';
  }
}

/**
 * Opens the modal for creating or editing a task.
 * @param {Object} task - The task to edit (null for new task).
 * @param {boolean} editing - True if editing, false if creating.
 */
function openModal(task = null, editing = false) {
  isEditing = editing;
  currentTask = task;

  if (isEditing && task) {
    // Edit mode: fill in the task details
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    statusSelect.value = task.status;
    deleteTaskBtn.style.display = 'block';
    saveChangesBtn.textContent = 'Save Changes';
  } else {
    // Create mode: clear the form
    titleInput.value = '';
    descriptionInput.value = '';
    statusSelect.value = 'todo';
    deleteTaskBtn.style.display = 'none';
    saveChangesBtn.textContent = 'Create Task';
  }

  modal.style.display = 'block';
}

/**
 * Closes the modal and resets variables.
 */
function closeModal() {
  modal.style.display = 'none';
  currentTask = null;
  isEditing = false;
}

/**
 * Saves a new task or updates an existing one.
 */
function saveChanges() {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusSelect.value;

  if (!title) {
    alert('Please enter a title!');
    return;
  }

  if (isEditing && currentTask) {
    // Update existing task
    currentTask.title = title;
    currentTask.description = description;
    currentTask.status = status;
  } else {
    // Add new task with a unique ID
    const newTask = {
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title,
      description,
      status
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  closeModal();
}

/**
 * Deletes the current task from the tasks array.
 */
function deleteTask() {
  if (!currentTask || !isEditing) return;
  tasks = tasks.filter(t => t.id !== currentTask.id);
  saveTasks();
  renderTasks();
  closeModal();
}

/**
 * Updates the logo based on the current theme.
 */
function updateLogo() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const newSrc = isDarkMode ? './assets/logo-dark.svg' : './assets/logo-light.svg';
  logo.src = newSrc;
  console.log(`Setting logo src to: ${newSrc}`); // Debug log to verify path
}

/**
 * Toggles between light and dark mode.
 */
function toggleTheme(e) {
  if (e.target.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
  updateLogo();
}

/**
 * Toggles the sidebar visibility.
 */
function toggleSidebar() {
  sidebar.classList.toggle('hide-sidebar-active');
  document.getElementById('layout').classList.toggle('hide-sidebar-active');
}

// Event listeners for buttons
closeModalBtn.addEventListener('click', closeModal);
saveChangesBtn.addEventListener('click', saveChanges);
deleteTaskBtn.addEventListener('click', deleteTask);
newTaskBtn.addEventListener('click', () => openModal(null, false));
themeToggle.addEventListener('change', toggleTheme);
hideSidebarBtn.addEventListener('click', toggleSidebar);

// Load theme from localStorage and fetch tasks on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.checked = false;
  }
  updateLogo();
  fetchTasks(); // Fetch tasks from API on every load
});